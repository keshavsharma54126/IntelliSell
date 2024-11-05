import { Client, LocalAuth, NoAuth } from "whatsapp-web.js";
import qrcode from "qrcode";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 4000;

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
        const foundContact = await message.getContact();
        if (!message.fromMe && allowedNumbers.includes(foundContact.number)) {
          const response = await axios.post(
            "http://localhost:8000/user/get-query-response",
            { message: message.body },
            {
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          await message.reply(response.data);
        }
      } catch (error) {
        console.error("Error handling incoming message:", error);
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
