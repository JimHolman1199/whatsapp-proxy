import express from "express";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";

const app = express();
app.use(express.json());

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: "./.wpp-session" }),
});

client.on("qr", qr => {
  console.log("Scan this QR code in your WhatsApp app:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => console.log("✅ WhatsApp client is ready!"));
client.on("disconnected", () => console.log("⚠️ WhatsApp client disconnected."));

client.initialize();

app.get("/", (req, res) => res.send("🟢 WhatsApp proxy running"));
app.post("/send", async (req, res) => {
  const { chatId, message } = req.body;
  try {
    await client.sendMessage(chatId, message);
    res.json({ status: "ok", chatId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
