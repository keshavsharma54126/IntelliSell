const { Client, LocalAuth } = require("whatsapp-web.js");
const { Client: PGClient } = require("pg");
const qrCode = require("qrcode-terminal");
const { ClaudeLLM } = require("./llm_layer/llm_client");

const introMessage = "Hi! I am Vidhi, your personal AI assistant. Ask away!";

// Initialize WhatsApp client
const whatsappClient = new Client({
  authStrategy: new LocalAuth({
    dataPath: "local_auth",
  }),
});

const pgClient = new PGClient({
  user: "your_pg_user",
  host: "localhost",
  database: "your_database",
  password: "your_password",
  port: 5432,
});

// Event handler for QR code generation
whatsappClient.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("QR code received, scan it with your phone.");
});

// Event handler for when WhatsApp client is ready
whatsappClient.on("ready", async () => {
  console.log("WhatsApp client is ready!");

  try {
    await pgClient.connect();
    const res = await pgClient.query("SELECT phone_number, name FROM users");

    // Iterate through each user and send custom messages
    for (const row of res.rows) {
      const chatId = `${row.phone_number}@c.us`;
      const customMessage = `Hello ${row.name}, this is a custom message from your AI assistant. How can I assist you today?`;
      await whatsappClient.sendMessage(chatId, customMessage);
      console.log(`Custom message sent to: ${row.phone_number}`);

      // Start checking for user replies
      startReplyCheck(chatId, row.name);
    }

    await pgClient.end();
  } catch (error) {
    console.error("Error fetching user data or sending messages:", error);
  }
});

// Start checking for replies and sending reminders
async function startReplyCheck(chatId, userName) {
  let reminderCount = 0;

  // Set a timeout to check for replies after 3 hours
  const responseTimeout = setInterval(async () => {
    console.log(`Checking for response from ${userName}...`);
    const message = await getLastMessageFromChat(chatId);

    // If the last message is not from the user
    if (!message || message.from !== chatId) {
      reminderCount++;

      if (reminderCount <= 3) {
        const reminderMessage = `Hello ${userName}, it looks like you haven't replied yet. Feel free to reach out when you're ready!`;
        await whatsappClient.sendMessage(chatId, reminderMessage);
        console.log(`Reminder ${reminderCount} sent to: ${userName}`);
      } else {
        // After 3 reminders, store in the database
        await pgClient.query(
          "UPDATE users SET replied = $1 WHERE phone_number = $2",
          [false, chatId.split("@")[0]] // Extract phone number from chatId
        );
        console.log(`User ${userName} marked as not replied.`);
        clearInterval(responseTimeout); // Stop checking for this user
      }
    } else {
      // User replied, handle the response and stop the reminders
      clearInterval(responseTimeout);
      const botResponse = await handleUserMessage(message.body);
      await whatsappClient.sendMessage(chatId, botResponse);
      console.log(`Bot response sent to: ${userName}`);
    }
  }, 10800000); // 3 hours in milliseconds
}

// Bot logic for handling user messages
async function handleUserMessage(userMessage) {
  try {
    const llmClient = new ClaudeLLM();
    const botResponse = await llmClient.generate_conversational_response(
      userMessage
    );
    return botResponse;
  } catch (error) {
    console.error("Error processing user message:", error);
    return "Sorry, something went wrong while processing your request.";
  }
}

// Function to get the last message from a chat, Contextual Awareness
async function getLastMessageFromChat(chatId) {
  const res = await pgClient.query(
    "SELECT * FROM messages WHERE chat_id = $1 ORDER BY timestamp DESC LIMIT 1",
    [chatId]
  );

  if (res.rows.length > 0) {
    return res.rows[0]; // Return the last message object
  }
  return null; // No messages found
}

// Listen for incoming messages and handle them immediately,  context-aware responses, messages in real time
whatsappClient.on("message", async (msg) => {
  const chatId = msg.from; // The chat ID of the sender
  const userMessage = msg.body; // The content of the message

  console.log(`Received message from ${chatId}: ${userMessage}`);

  // Handle the user message immediately
  const botResponse = await handleUserMessage(userMessage);
  await whatsappClient.sendMessage(chatId, botResponse);
  console.log(`Bot response sent to: ${chatId}`);
});

// Start the WhatsApp client
whatsappClient.initialize();
