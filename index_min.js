const { Client, GatewayIntentBits } = require("discord.js");

console.log("Starte Login-Test...");
console.log("Token (gekürzt):", process.env.TOKEN?.substring(0, 10) || 'Token fehlt!');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  console.log(`✅ BOT ONLINE als ${client.user.tag}`);
});

client.login(process.env.TOKEN)
  .then(() => {
    console.log("✅ Login erfolgreich.");
  })
  .catch(err => {
    console.error("❌ Login FEHLGESCHLAGEN:", err);
  });
