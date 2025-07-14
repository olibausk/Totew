const { Client, GatewayIntentBits } = require("discord.js");

console.log("Starte Login-Debug...");

const TOKEN = process.env.TOKEN;

console.log("TOKEN (gekürzt):", TOKEN?.substring(0, 10) || 'Kein Token gefunden');

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.on("error", (error) => {
  console.error("❌ Discord-Client-Fehler:", error);
});

client.login(TOKEN)
  .then(() => {
    console.log("✅ BOT online als:", client.user.tag);
  })
  .catch(err => {
    console.error("❌ LOGIN fehlgeschlagen:", err);
  });
