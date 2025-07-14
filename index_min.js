const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

console.log("Starte Discord-Bot...");
console.log("Eingelesenes TOKEN (gekürzt):", process.env.TOKEN?.substring(0, 10) || 'Kein Token gefunden');

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
});

client.login(process.env.TOKEN)
  .then(() => console.log("✅ Login erfolgreich."))
  .catch(err => console.error("❌ Login fehlgeschlagen:", err));
