// KeepAlive-Server starten (für Render)
const keepAlive = require("./keepalive");
keepAlive();

// Discord.js einbinden
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Login-Start
console.log("Starte Discord-Bot...");
console.log("TOKEN (gekürzt):", process.env.TOKEN?.substring(0, 10) || 'Kein Token gefunden');

client.login(process.env.TOKEN)
  .then(() => console.log("✅ Login erfolgreich."))
  .catch(err => console.error("❌ Login fehlgeschlagen:", err));

// Wenn Bot online ist
client.once("ready", () => {
  console.log(`✅ Bot online als ${client.user.tag}`);
});

// Auf Nachrichten hören
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const cmd = message.content.toLowerCase();
  console.log(`Eingehende Nachricht erkannt: ${cmd}`);

  // !bid – 70/30-Entscheidung
  if (cmd === "!bid") {
    const chance = Math.random();
    const antwort =
      chance < 0.7 ? "Hier, ich biete mit" : "Nein, da bin ich raus";
    message.reply(antwort);
  }

  // !pricenpchorse – gewichtete Preisvergabe
  else if (cmd === "!pricenpchorse") {
    const roll = Math.random() * 100;
    let price = 0;
    let antwort = "";

    if (roll < 0.5) {
      price = 1000;
      antwort = "Ich bin reich, reich, reich …. Wie du kannst nicht zahlen 😭";
    } else if (roll < 2.5) {
      const lowPrices = [20, 25, 30, 35, 40, 45];
      price = lowPrices[Math.floor(Math.random() * lowPrices.length)];
      antwort = `${price}$ – Oh nein, der Schlachter nimmt das Tier.`;
    } else if (roll < 4.5) {
      const highPrices = [85, 90, 95, 100];
      price = highPrices[Math.floor(Math.random() * highPrices.length)];
      if (price === 100) {
        antwort = "100$ – YYYYYEEEEEEEEEEEHHHHHHHHHHAAAAAAAAWWWWW";
      } else {
        antwort = `${price}$ – Starkes Tier, dafür zahlt man gern.`;
      }
    } else {
      const midPrices = [50, 55, 60, 65, 70, 75, 80];
      price = midPrices[Math.floor(Math.random() * midPrices.length)];
      const texte = [
        `${price}$ – Solides Gebot, gutes Pferd.`,
        `${price}$ – Nicht schlecht, aber da geht noch was.`,
        `${price}$ – Nimm's oder lass es, Cowboy.`,
        `${price}$ – Klingt fair für den Zustand.`,
        `${price}$ – Mehr gebe ich nicht dafür.`,
      ];
      antwort = texte[Math.floor(Math.random() * texte.length)];
    }

    message.reply(antwort);
  }

  // !gender – 50/50-Entscheidung
  else if (cmd === "!gender") {
    const chance = Math.random();
    const antwort = chance < 0.5 ? "Weiblich" : "Männlich";
    message.reply(antwort);
  }

  // !horse
  else if (cmd === "!horse") {
    const zahl = Math.random() * 100;
    let antwort = "Dein Pferd ist gesund, guten Ritt Cowboy";

    if (zahl >= 80 && zahl < 85)
      antwort = "Dein Pferd hat ein lockeres Eisen. Reite höchsten im Trabtempo zum Schmied.";
    else if (zahl >= 85 && zahl < 90)
      antwort = "Dein Pferd hat ein Eisen verloren. Führ es zum Schmied.";
    else if (zahl >= 90 && zahl < 95)
      antwort = "Dein Pferd lahmt etwas. 2 Tage Ruhe.";
    else if (zahl >= 95)
      antwort = "Dein Pferd läuft auf drei Beinen. Diese Woche nicht reitbar.";

    message.reply(antwort);
  }

  // Weitere Befehle hier einfügen...
});
