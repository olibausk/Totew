// Dummy-Webserver starten (für Render)
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Bot läuft (Render).');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Dummy-Webserver läuft auf Port ${port} (für Render).`);
});

// Discord-Bot starten
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

console.log("Starte Discord-Bot...");
console.log("TOKEN (gekürzt):", process.env.TOKEN?.substring(0, 10) || 'Kein Token gefunden');

client.on("error", (error) => {
  console.error("❌ Discord-Client-Fehler:", error);
});

client.once("ready", () => {
  console.log(`✅ Bot online als ${client.user.tag}`);
});

client.login(process.env.TOKEN)
  .then(() => console.log("✅ Login erfolgreich."))
  .catch(err => console.error("❌ Login fehlgeschlagen:", err));

// Nachrichten abfangen
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  const cmd = message.content.toLowerCase();
  console.log(`Eingehende Nachricht erkannt: ${cmd}`);
  if (cmd === "!ping") {
    message.reply("Pong!");
  }
});
