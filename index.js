require('dotenv').config();
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Bot ist online (Render-Dummy).");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Dummy-Webserver läuft auf Port ${PORT} (für Render).`);
});

// BOT-LOGIK
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

console.log("Starte Discord-Bot...");
console.log("TOKEN (gekürzt):", process.env.TOKEN?.substring(0, 10) || "Kein Token gefunden");

client.once("ready", () => {
  console.log(`✅ Bot online als ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const cmd = message.content.toLowerCase();
  console.log(`📥 Eingehende Nachricht: ${cmd}`);

  // !bid
  if (cmd === "!bid") {
    const antwort = Math.random() < 0.7 ? "Hier, ich biete mit" : "Nein, da bin ich raus";
    message.reply(antwort);
  }
  // !buycattle [Rasse] [Geschlecht] [Alter]
  else if (cmd.startsWith("!buycattle")) {
    const parts = message.content.trim().split(/\s+/);
    if (parts.length !== 4) {
      return message.reply("Verwendung: !buycattle [BlackAngus|FloridaCracker] [Bulle|Kuh] [1|3|5]");
    }

    const rasse = parts[1];
    const geschlecht = parts[2];
    const alter = parts[3];

    const preise = {
      BlackAngus: {
        Bulle: { "1": 50, "3": 80, "5": 70 },
        Kuh: { "1": 40, "3": 70, "5": 60 },
      },
      FloridaCracker: {
        Bulle: { "1": 40, "3": 65, "5": 50 },
        Kuh: { "1": 30, "3": 45, "5": 35 },
      },
    };

    if (!preise[rasse] || !preise[rasse][geschlecht] || !preise[rasse][geschlecht][alter]) {
      return message.reply("Ungültige Auswahl. Bitte überprüfe Rasse, Geschlecht und Alter.");
    }

    const basispreis = preise[rasse][geschlecht][alter];
    const abweichung = Math.floor(Math.random() * 31) - 15; // -15 bis +15
    const finalpreis = basispreis + abweichung;

    return message.reply(
      `📦 Gekauftes Rind: **${rasse}**, **${geschlecht}**, **${alter} Jahre**\n💲 Preis: **${finalpreis}$**`
    );
  }
  // !pricenpchorse
  else if (cmd === "!pricenpchorse") {
    const roll = Math.random() * 100;
    let antwort = "";

    if (roll < 0.5) {
      antwort = "Ich bin reich, reich, reich …. Wie du kannst nicht zahlen 😭";
    } else if (roll < 2.5) {
      const low = [20, 25, 30, 35, 40, 45];
      const preis = low[Math.floor(Math.random() * low.length)];
      antwort = `${preis}$ – Oh nein, der Schlachter nimmt das Tier.`;
    } else if (roll < 4.5) {
      const high = [85, 90, 95, 100];
      const preis = high[Math.floor(Math.random() * high.length)];
      antwort = preis === 100
        ? "100$ – YYYYYEEEEEEEEEEEHHHHHHHHHHAAAAAAAAWWWWW"
        : `${preis}$ – Starkes Tier, dafür zahlt man gern.`;
    } else {
      const mid = [50, 55, 60, 65, 70, 75, 80];
      const preis = mid[Math.floor(Math.random() * mid.length)];
      const varianten = [
        `${preis}$ – Solides Gebot, gutes Pferd.`,
        `${preis}$ – Nicht schlecht, aber da geht noch was.`,
        `${preis}$ – Nimm's oder lass es, Cowboy.`,
        `${preis}$ – Klingt fair für den Zustand.`,
        `${preis}$ – Mehr gebe ich nicht dafür.`,
      ];
      antwort = varianten[Math.floor(Math.random() * varianten.length)];
    }

    message.reply(antwort);
  }

  // !gender
  else if (cmd === "!gender") {
    const antwort = Math.random() < 0.5 ? "Weiblich" : "Männlich";
    message.reply(antwort);
  }

  // !horse
  else if (cmd === "!horse") {
    const zahl = Math.random() * 100;
    let antwort = "Dein Pferd ist gesund, guten Ritt Cowboy";

    if (zahl >= 80 && zahl < 85) antwort = "Dein Pferd hat ein lockeres Eisen. Reite höchstens im Trabtempo zum Schmied.";
    else if (zahl >= 85 && zahl < 90) antwort = "Dein Pferd hat ein Eisen verloren. Führe es zum Schmied. Reiten wäre riskant.";
    else if (zahl >= 90 && zahl < 95) antwort = "Dein Pferd lahmt leicht. Zwei Tage Ruhe und es sollte wieder fit sein.";
    else if (zahl >= 95) antwort = "Dein Pferd läuft auf drei Beinen. Diese (RP)Woche solltest du es nicht reiten.";

    message.reply(antwort);
  }

  // !cattle
  else if (cmd === "!cattle") {
    const zahl = Math.random() * 100;
    let antwort = "Alle Rinder sind gesund, gute Arbeit Rancher";

    if (zahl >= 80 && zahl < 85) antwort = "Ein Kalb wurde von Wölfen gerissen. Tragisch, aber verkraftbar.";
    else if (zahl >= 85 && zahl < 90) antwort = "Unwetter haben Futtervorräte zerstört. 100 kg Futter verloren.";
    else if (zahl >= 90 && zahl < 95) antwort = "Eine Stampede hat Chaos verursacht. Kühe verloren Kalb, du musst die Herde zusammentreiben.";
    else if (zahl >= 99) antwort = "Maul- und Klauenseuche! 50% deiner Rinder müssen gekeult werden.";

    message.reply(antwort);
  }

  // !sheep
  else if (cmd === "!sheep") {
    const zahl = Math.random() * 100;
    let antwort = "Alle Schafe sind gesund, gute Arbeit Rancher";

    if (zahl >= 80 && zahl < 85) antwort = "Ein Lamm wurde von Wölfen gerissen. Verlust ist überschaubar.";
    else if (zahl >= 85 && zahl < 90) antwort = "Unwetter haben Futtervorräte zerstört. 100 kg Futter verloren.";
    else if (zahl >= 90 && zahl < 95) antwort = "Zwei Schafe sind im Schlamm versunken. Die Wolle ist ruiniert.";
    else if (zahl >= 99) antwort = "Maul- und Klauenseuche! 50% deiner Schafe sind betroffen.";

    message.reply(antwort);
  }

    // !start
  else if (cmd === "!start") {
    const authorMention = `<@${message.author.id}>`;
    const antwort = `Lobby ist eröffnet <@&1342787380352127078> Die Welt liegt euch bei ${authorMention} zu Füßen`;
    message.channel.send(antwort);
  }
});

client.login(process.env.TOKEN)
  .then(() => console.log("✅ Login erfolgreich."))
  .catch(err => console.error("❌ Login fehlgeschlagen:", err));
