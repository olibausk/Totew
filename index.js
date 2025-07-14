// Dummy-Webserver (für Render-Webservice)
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Bot läuft (Render).');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Dummy-Webserver läuft auf Port ${port} (für Render).`);
});

// Discord-Bot
const { Client, GatewayIntentBits } = require("discord.js");

console.log("Starte Discord-Bot...");
console.log("TOKEN (gekürzt):", process.env.TOKEN?.substring(0, 10) || 'Kein Token gefunden');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("error", (error) => {
  console.error("❌ Discord-Client-Fehler:", error);
});

client.once("ready", () => {
  console.log(`✅ Bot online als ${client.user.tag}`);
});

console.log("Login-Befehl wird jetzt ausgeführt...");

client.login(process.env.TOKEN)
  .then(() => console.log("✅ Login erfolgreich."))
  .catch(err => console.error("❌ Login fehlgeschlagen:", err));

// Befehle
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const cmd = message.content.toLowerCase();
  console.log(`Eingehende Nachricht erkannt: ${cmd}`);

  if (cmd === "!ping") {
    message.reply("Pong!");
  }

  if (cmd === "!bid") {
    const antwort = Math.random() < 0.7 ? "Hier, ich biete mit" : "Nein, da bin ich raus";
    message.reply(antwort);
  }
});
