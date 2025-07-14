const { Client, GatewayIntentBits } = require("discord.js");

console.log("Starte Discord-Bot...");
console.log("Eingelesenes TOKEN (gekürzt):", process.env.TOKEN?.substring(0, 10) || 'Kein Token gefunden');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.login(process.env.TOKEN)
  .then(() => {
    console.log("✅ Login erfolgreich.");
  })
  .catch(err => {
    console.error("❌ Login fehlgeschlagen:", err);
  });

client.once("ready", () => {
  console.log(`✅ Bot online als ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const cmd = message.content.toLowerCase();
  console.log(`Eingehende Nachricht erkannt: ${cmd}`);

  if (cmd === "!ping") {
    message.reply("Pong!");
  }
// Dummy-Server nur für Render (verhindert Port-Timeout)
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot läuft.');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Dummy-Server lauscht auf Port ${port} (nur für Render).`);
});
});
