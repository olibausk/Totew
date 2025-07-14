const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

console.log("Versuche, Bot mit Token zu starten...");
console.log("Eingelesenes TOKEN (gekürzt):", process.env.TOKEN?.substring(0, 10) || 'Kein Token gefunden');

client.once("ready", () => {
  console.log(`✅ Bot online als ${client.user.tag}`);
});

client.login(process.env.TOKEN)
  .then(() => console.log("✅ Login erfolgreich."))
  .catch(err => console.error("❌ Login fehlgeschlagen:", err));
