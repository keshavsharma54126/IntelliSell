import { Client, LocalAuth, MessageId, NoAuth } from "whatsapp-web.js";
import qrcode from "qrcode";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { createClient, RedisClientType } from "redis";


const app = express();
const PORT = process.env.PORT || 4000;
const redisClient: RedisClientType = createClient();
redisClient.connect();

app.use(express.json());
app.use(cors({ origin: "*" }));
const prisma = new PrismaClient();

let clients = new Map<String, Client>();

async function fetchAllowedNumbers(projectId: string): Promise<string[]> {
  try {
    const result = await prisma.data.findMany({
      where: {
        projectId,
      },
      select: { phoneno: true },
    });
    return result.map((user) => user.phoneno);
  } catch (error) {
    console.error("Error fetching allowed numbers:", error);
    return [];
  }
}

async function initializeWhatsApp(projectId: string, allowedNumbers: string[]) {
  try {
    const client = new Client({
      authStrategy: new NoAuth(),
      puppeteer: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    client.on("qr", async (qr: string) => {
      const qrCodeUrl = await qrcode.toDataURL(qr);
      await prisma.project.update({
        where: {
          id: projectId,
        },
        data: {
          qrCode: qrCodeUrl,
        },
      });
      console.log("QR Code generated, scan it with your phone.");
    });

    client.on("ready", async () => {
      console.log("WhatsApp client is ready for project:", projectId);
      if (!clients.has(projectId)) {
        clients.set(projectId, client);
      }

      const results = await Promise.all(
        allowedNumbers.map(async (phoneNumber: string) => {
          const formattedPhoneNumber = phoneNumber.replace(/\s+/g, "");
          const chatId = `${formattedPhoneNumber}@c.us`;

          try {
            await client.sendMessage(
              chatId,
              "Hello, this is a test message from IntelliSell"
            );
            return { success: true, phone: formattedPhoneNumber };
          } catch (error) {
            console.error(
              `Error sending message to ${formattedPhoneNumber}:`,
              error
            );
            return {
              success: false,
              phone: formattedPhoneNumber,
              error: error instanceof Error ? error.message : String(error),
            };
          }
        })
      );

      console.log("Messages sent:", results);
    });

    client.on("message", async (message: any) => {
      try {
        const phoneNumber = message.from.split('@')[0];
        if (!message.fromMe && allowedNumbers.includes(phoneNumber)) {
          redisClient.lPush("messagesqueue", JSON.stringify({
            messageId: message.id._serialized,
            from: message.from,
            body: message.body,
            timestamp: message.timestamp,
            clientId: projectId,
            fromMe: message.fromMe,
            remote: message.remote,
            id: message.id.id
          }));
        }
        console.log("message pushed to redis");
      } catch (error) {
        console.error("Error handling incoming message:", error);
        await message.reply("Sorry, I encountered an error processing your message. Please try again later.");
      }
    });

    client.on("disconnected", (reason: string) => {
      console.log("WhatsApp client disconnected:", reason);
      clients.delete(projectId);
    });

    await client.initialize();
  } catch (error) {
    console.error("Error initializing WhatsApp client:", error);
  }
}

const processMessages = async () => {
  // Create a separate Redis client for the worker
  const workerRedisClient: RedisClientType = createClient();
  await workerRedisClient.connect().catch(console.error);

  console.log("Worker Redis client connected and started processing messages.");

  while (true) {
    try {
      // BRPOP returns a tuple [key, value]. Timeout is 0 for blocking indefinitely
      const result = await workerRedisClient.brPop("messagesqueue", 0);
      if (result) {
        
        const { messageId, from, body, timestamp, clientId, fromMe, remote, id } = JSON.parse(result.element);

        // Retrieve the appropriate client using clientId
        const client = clients.get(clientId);
        if (client) {
          try {
            // Obtain the MessageId object required for quoting
            const messageIdObj: MessageId = {
              _serialized: messageId,
              fromMe,
              remote,
              id
            };

            // Send a reply to the original message using the 'quoted' option
            console.log("sending response to user");
            const response = await axios.post(
              "http://localhost:8000/user/get-query-response",
              { message: body },
              {
                headers: {
                  accept: "application/json",
                  "Content-Type": "application/json",
                },
              }
            );

            console.log("response sent to user");

            if (response.data) {
              console.log("sending response to user");
              await client.sendMessage(from, response.data, { quotedMessageId: messageIdObj._serialized });
            } else {
              await client.sendMessage(
                from,
                "I apologize, but I'm unable to process your request at the moment. We are currently under maintenance and will reach out to you as soon as possible.",
                { quotedMessageId: messageIdObj._serialized }
              );
            }
          } catch (error) {
            console.error("Error processing and responding to message:", error);
            if (client) {
              await client.sendMessage(
                from,
                "Sorry, I encountered an error processing your message. Please try again later.",
                { quotedMessageId: messageId._serialized }
              );
            }
          }
        } else {
          console.warn(`Client with ID ${clientId} not found.`);
          // Optionally, enqueue the message again or log for manual processing
        }
      }
    } catch (error) {
      console.error("Error in processMessages loop:", error);
      // Optional: Add a delay before retrying in case of persistent errors
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};
processMessages();

app.post("/initializeClient", async (req: any, res: any) => {
  try {
    const { projectId } = req.body;
    if (clients.has(projectId)) {
      return res.status(200).json({
        message: "Client already initialized",
      });
    }

    const allowedNumbers = await fetchAllowedNumbers(projectId);
    await initializeWhatsApp(projectId, allowedNumbers);

    res.status(200).json({
      message:
        "Client initialized successfully. Messages will be sent after QR code is scanned and client is ready.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
