// 🔹 .env einlesen
require('dotenv').config();

// 🔹 Dummy-Webserver (für Render / Healthcheck)
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("Bot ist online (Render-Dummy).");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Dummy-Webserver läuft auf Port ${PORT} (für Render).`);
});

// 🔹 Discord-Bot
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 🔹 Channel-Konfiguration
const TEST_OUTPUT_CHANNEL_ID = "1385187552339689513";
const TEST_SOURCE_CHANNEL_ID = "953568411357691916";

const RP_SOURCE_CHANNEL_ID = "1342631720423526511";
const RP_OUTPUT_CHANNEL_ID = "1472654200788877322";

// 🔹 Ausschluss für !horse und !health
const EXCLUDED_USER_IDS = new Set([
  "1352579445629915189",
]);

// 🔹 Rollen
const CITIZEN_ROLE_ID = "1342787380352127078";

// 🔹 Krankheiten / leichte Verletzungen für !health und !testtotew
const healthEvents = [
  "Erkältung",
  "Husten",
  "Bronchitis",
  "Heiserkeit",
  "Halsschmerzen",
  "Schnupfen",
  "Schüttelfrost",
  "Abgeschlagenheit",
  "Kreislaufschwäche",
  "Schwindel",
  "Müdigkeit",
  "Erschöpfung",
  "Magenverstimmung",
  "Durchfall",
  "Verstopfung",
  "Übelkeit",
  "Lebensmittelvergiftung",
  "Bauchkrämpfe",
  "Kopfschmerzen",
  "Migräne",
  "Konzentrationsprobleme",
  "Nervosität",
  "Zittern",
  "Sonnenstich",
  "Dehydration",
  "Unterkühlung",
  "Entzündete Insektenstiche",
  "Verstauchter Knöchel",
  "Verstauchtes Handgelenk",
  "Zerrung im Bein",
  "Zerrung im Rücken",
  "Starker Muskelkater",
  "Geprelltes Knie",
  "Prellung an der Schulter",
  "Geprellte Rippe",
  "Prellung am Rücken",
  "Starker Bluterguss",
  "Schnittwunde an der Hand",
  "Schnitt am Unterarm",
  "Kleinere Stichverletzung",
  "Eingerissene Haut",
  "Tiefer Splitter in der Hand",
];

// 🔹 Pferdegesundheit für !horse
const horseEvents = [
  "Pferd ist gesund, guten Ritt Cowboy.",
  "hat ein lockeres Eisen. Reite höchstens im Trabtempo zum Schmied.",
  "hat ein Eisen verloren. Führe es zum Schmied. Reiten wäre riskant.",
  "dessen Pferd lahmt leicht. Zwei Tage Ruhe und es sollte wieder fit sein.",
  "dessen Pferd auf drei Beinen läuft. Diese (RP)Woche sollte es nicht geritten werden.",
];

// 🔹 Party-Texte
const partyTexts = [
  `🎉 <@&${CITIZEN_ROLE_ID}> Die Party ist eröffnet!`,
  `🥃 <@&${CITIZEN_ROLE_ID}> Auf gehts, die Party hat begonnen!`,
  `🎶 <@&${CITIZEN_ROLE_ID}> Die Party ist eröffnet – kommt zusammen!`,
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 🔹 Für den Test: letzte 100 Nachrichten, Bots NICHT ignorieren
async function getUniqueParticipants(channel) {
  const uniqueUsers = new Map();
  const messages = await channel.messages.fetch({ limit: 100 });

  for (const msg of messages.values()) {
    if (!uniqueUsers.has(msg.author.id)) {
      uniqueUsers.set(msg.author.id, msg.author);
    }
  }

  return Array.from(uniqueUsers.values());
}

// 🔹 Für !horse und !health: letzte 100 Nachrichten, Bots und bestimmte User ausgeschlossen
async function getEligibleParticipants(channel) {
  const uniqueUsers = new Map();
  const messages = await channel.messages.fetch({ limit: 100 });

  for (const msg of messages.values()) {
    if (msg.author.bot) continue;
    if (EXCLUDED_USER_IDS.has(msg.author.id)) continue;

    if (!uniqueUsers.has(msg.author.id)) {
      uniqueUsers.set(msg.author.id, msg.author);
    }
  }

  return Array.from(uniqueUsers.values());
}

// Debug-Ausgaben
console.log("Starte Discord-Bot...");
console.log("TOKEN (gekürzt):", process.env.TOKEN?.substring(0, 10) || "Kein Token gefunden");

client.once("ready", () => {
  console.log(`✅ Bot online als ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const cmd = message.content.toLowerCase();
  console.log(`📥 Eingehende Nachricht: ${cmd}`);

  // !bid
  if (cmd === "!bid") {
    const antwort = Math.random() < 0.7 ? "Hier, ich biete mit" : "Nein, da bin ich raus";
    return message.reply(antwort);
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
    const abweichung = Math.floor(Math.random() * 31) - 15;
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

    return message.reply(antwort);
  }

  // !gender
  else if (cmd === "!gender") {
    const antwort = Math.random() < 0.5 ? "Weiblich" : "Männlich";
    return message.reply(antwort);
  }

  // !horse
  else if (cmd === "!horse") {
    try {
      console.log("✅ !horse erkannt");

      const sourceChannel = await client.channels.fetch(RP_SOURCE_CHANNEL_ID);
      if (!sourceChannel || !sourceChannel.isTextBased()) {
        return message.reply("Der Such-Channel für !horse konnte nicht gefunden werden.");
      }

      const outputChannel = await client.channels.fetch(RP_OUTPUT_CHANNEL_ID);
      if (!outputChannel || !outputChannel.isTextBased()) {
        return message.reply("Der Ausgabe-Channel für !horse konnte nicht gefunden werden.");
      }

      const participants = await getEligibleParticipants(sourceChannel);
      console.log("🐎 !horse Teilnehmer gefunden:", participants.length);

      if (!participants.length) {
        return message.reply("Es wurden keine gültigen Teilnehmer für !horse gefunden.");
      }

      const selectedUser = pickRandom(participants);
      const selectedEvent = pickRandom(horseEvents);

      let antwort = "";
      if (selectedEvent.startsWith("Pferd ist gesund")) {
        antwort = `🐎 <@${selectedUser.id}> – Dein ${selectedEvent}`;
      } else if (selectedEvent.startsWith("hat")) {
        antwort = `🐎 <@${selectedUser.id}> ${selectedEvent}`;
      } else {
        antwort = `🐎 <@${selectedUser.id}> ${selectedEvent}`;
      }

      await outputChannel.send(antwort);
      console.log("✅ !horse Nachricht gesendet");
    } catch (error) {
      console.error("Fehler bei !horse:", error);
      await message.reply("Beim Ausführen von !horse ist ein Fehler aufgetreten.");
    }
  }

  // !health
  else if (cmd === "!health") {
    try {
      console.log("✅ !health erkannt");

      const sourceChannel = await client.channels.fetch(RP_SOURCE_CHANNEL_ID);
      if (!sourceChannel || !sourceChannel.isTextBased()) {
        return message.reply("Der Such-Channel für !health konnte nicht gefunden werden.");
      }

      const outputChannel = await client.channels.fetch(RP_OUTPUT_CHANNEL_ID);
      if (!outputChannel || !outputChannel.isTextBased()) {
        return message.reply("Der Ausgabe-Channel für !health konnte nicht gefunden werden.");
      }

      const participants = await getEligibleParticipants(sourceChannel);
      console.log("⚕️ !health Teilnehmer gefunden:", participants.length);

      if (!participants.length) {
        return message.reply("Es wurden keine gültigen Teilnehmer für !health gefunden.");
      }

      const selectedUser = pickRandom(participants);
      const selectedEvent = pickRandom(healthEvents);

      await outputChannel.send(
        `⚕️ <@${selectedUser.id}> ist betroffen von: **${selectedEvent}**`
      );

      console.log("✅ !health Nachricht gesendet");
    } catch (error) {
      console.error("Fehler bei !health:", error);
      await message.reply("Beim Ausführen von !health ist ein Fehler aufgetreten.");
    }
  }

  // !cattle
  else if (cmd === "!cattle") {
    const zahl = Math.random() * 100;
    let antwort = "Alle Rinder sind gesund, gute Arbeit Rancher";

    if (zahl >= 80 && zahl < 85) antwort = "Ein Kalb wurde von Wölfen gerissen. Tragisch, aber verkraftbar.";
    else if (zahl >= 85 && zahl < 90) antwort = "Unwetter haben Futtervorräte zerstört. 100 kg Futter verloren.";
    else if (zahl >= 90 && zahl < 95) antwort = "Eine Stampede hat Chaos verursacht. Kühe verloren Kalb, du musst die Herde zusammentreiben.";
    else if (zahl >= 99) antwort = "Maul- und Klauenseuche! 50% deiner Rinder müssen gekeult werden.";

    return message.reply(antwort);
  }

  // !sheep
  else if (cmd === "!sheep") {
    const zahl = Math.random() * 100;
    let antwort = "Alle Schafe sind gesund, gute Arbeit Rancher";

    if (zahl >= 80 && zahl < 85) antwort = "Ein Lamm wurde von Wölfen gerissen. Verlust ist überschaubar.";
    else if (zahl >= 85 && zahl < 90) antwort = "Unwetter haben Futtervorräte zerstört. 100 kg Futter verloren.";
    else if (zahl >= 90 && zahl < 95) antwort = "Zwei Schafe sind im Schlamm versunken. Die Wolle ist ruiniert.";
    else if (zahl >= 99) antwort = "Maul- und Klauenseuche! 50% deiner Schafe sind betroffen.";

    return message.reply(antwort);
  }

  // !start
  else if (cmd === "!start") {
    const authorMention = `<@${message.author.id}>`;
    const antwort = `Lobby ist eröffnet <@&${CITIZEN_ROLE_ID}> Die Welt liegt euch bei ${authorMention} zu Füßen`;
    return message.channel.send(antwort);
  }

  // !party
  else if (cmd === "!party") {
    const antwort = pickRandom(partyTexts);
    return message.channel.send(antwort);
  }

  // !testtotew
  else if (cmd === "!testtotew") {
    console.log("✅ !testtotew erkannt");
    console.log("Ausgelöst in Channel:", message.channel.id);
    console.log("Such-Channel:", TEST_SOURCE_CHANNEL_ID);
    console.log("Ausgabe-Channel:", TEST_OUTPUT_CHANNEL_ID);

    try {
      const sourceChannel = await client.channels.fetch(TEST_SOURCE_CHANNEL_ID);
      console.log("Source-Channel gefunden:", !!sourceChannel);

      if (!sourceChannel || !sourceChannel.isTextBased()) {
        return message.reply("Der Such-Channel konnte nicht gefunden werden oder ist nicht textbasiert.");
      }

      const participants = await getUniqueParticipants(sourceChannel);
      console.log("Teilnehmer gefunden:", participants.length);

      if (!participants.length) {
        return message.reply("Es wurden keine Teilnehmer im Such-Channel gefunden.");
      }

      const outputChannel = await client.channels.fetch(TEST_OUTPUT_CHANNEL_ID);
      console.log("Ausgabe-Channel gefunden:", !!outputChannel);

      if (!outputChannel || !outputChannel.isTextBased()) {
        return message.reply("Der Ausgabe-Channel konnte nicht gefunden werden oder ist nicht textbasiert.");
      }

      const selectedUser = pickRandom(participants);
      const selectedEvent = pickRandom(healthEvents);

      console.log("🎯 Ausgewählter User:", selectedUser.id);
      console.log("🩺 Ausgewähltes Event:", selectedEvent);

      await outputChannel.send(
        `⚕️ <@${selectedUser.id}> ist betroffen von: **${selectedEvent}**`
      );

      console.log("✅ Testnachricht im Ausgabe-Channel gesendet");
    } catch (error) {
      console.error("Fehler bei !testtotew:", error);
      await message.reply("Beim Ausführen von !testtotew ist ein Fehler aufgetreten.");
    }
  }
});

// Login mit Token
client.login(process.env.TOKEN)
  .then(() => console.log("✅ Login erfolgreich."))
  .catch(err => console.error("❌ Login fehlgeschlagen:", err));
