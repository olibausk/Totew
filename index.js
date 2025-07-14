econst keepAlive = require("./keepalive");
keepAlive();

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`✅ Bot online als ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  const cmd = message.content.toLowerCase();
  console.log(`Eingehende Nachricht erkannt: ${cmd}`);

  // !bid – 70/30-Entscheidung
  else if (cmd === "!bid") {
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
  // !sex – 50/50-Entscheidung
  if (cmd === "!sex") {
    const chance = Math.random();
    const antwort =
      chance < 0.5 ? "Weiblich" : "Männlich";
    message.reply(antwort);
  }
  // !horse – gewichtete Pferdegesundheit
  else if (cmd === "!horse") {
    const zahl = Math.random() * 100;
    let antwort = "Dein Pferd ist gesund, guten Ritt Cowboy";

    if (zahl >= 80 && zahl < 85)
      antwort =
        "Dein Pferd hat ein lockeres Eisen. Reite höchsten im Trabtempo zum Schmied um das richten zu lassen.";
    else if (zahl >= 85 && zahl < 90)
      antwort =
        "Dein Pferd hat ein Eisen verloren. Du musst es zum Schmied führen um das beheben zu lassen. Setzt du dich drauf könnte das schwerwiegende Folgen für dein Pferd haben.";
    else if (zahl >= 90 && zahl < 95)
      antwort =
        "Dein Pferd lahmt ein wenig. Du solltest ihm für 2 Tage absolute Ruhe gönnen, danach ist es bestimmt wieder gesund.";
    else if (zahl >= 95)
      antwort =
        "Dein Pferd läuft auf drei Beinen, holy Shit. Diese (RP)Woche kannst du es beim besten Willen nicht reiten.";

    message.reply(antwort);
  }
  // !cattle – gewichtete Rindergesundheit
  else if (cmd === "!cattle") {
    const zahl = Math.random() * 100;
    let antwort = "Alle Rinder sind gesund, gute Arbeit Rancher";

    if (zahl >= 80 && zahl < 85)
      antwort =
        "Eines deiner Kälber wurde von Wölfen gerissen. Tragisch aber kein großer Verlust";
    else if (zahl >= 85 && zahl < 90)
      antwort =
        "Unwetter haben einen Teil deines Futters zerstört. Du verlierst 100kg Futter";
    else if (zahl >= 90 && zahl < 95)
      antwort =
        "Eine Stampede wurde ausgelöst. Du musst die Rinder wiederfinden und zurück treiben. Eine tragende Kuh hat ihr Kalb verloren.";
    else if (zahl >= 99)
      antwort =
        "Maul und Klauenseuche hat sich in deiner Farm ausgebreitet. Du verlierst 50% deiner Rinder.";

    message.reply(antwort);
  }
  // !sheep – gewichtete Schafgesundheit
  else if (cmd === "!sheep") {
    const zahl = Math.random() * 100;
    let antwort = "Alle Schafe sind gesund, gute Arbeit Rancher";

    if (zahl >= 80 && zahl < 85)
      antwort =
        "Eines deiner Lämmer wurde von Wölfen gerissen. Tragisch aber kein großer Verlust";
    else if (zahl >= 85 && zahl < 90)
      antwort =
        "Unwetter haben einen Teil deines Futters zerstört. Du verlierst 100kg Futter";
    else if (zahl >= 90 && zahl < 95)
      antwort =
        "Zwei deiner Schafe sind im Unwetter im Schlamm versunken. Du musst sie wieder rausholen. Leider ist die Wolle dieser Schafe ruiniert.";
    else if (zahl >= 99)
      antwort =
        "Maul und Klauenseuche hat sich in deiner Farm ausgebreitet. Du verlierst 50% deiner Schafe.";

    message.reply(antwort);
  }
  // !chicken – gewichtete Hühnergesundheit
  else if (cmd === "!chicken") {
    const zahl = Math.random() * 100;
    let antwort = "Alle Hühner sind gesund, gute Arbeit Rancher";

    if (zahl >= 80 && zahl < 85)
      antwort =
        "Eines deiner Lämmer wurde von Wölfen gerissen. Tragisch aber kein großer Verlust";
    else if (zahl >= 85 && zahl < 90)
      antwort =
        "Unwetter haben einen Teil deines Futters zerstört. Du verlierst 100kg Futter";
    else if (zahl >= 90 && zahl < 95)
      antwort =
        "Zwei deiner Schafe sind im Unwetter im Schlamm versunken. Du musst sie wieder rausholen. Leider ist die Wolle dieser Schafe ruiniert.";
    else if (zahl >= 99)
      antwort =
        "Maul und Klauenseuche hat sich in deiner Farm ausgebreitet. Du verlierst 50% deiner Schafe.";

    message.reply(antwort);
  }
});

client.login(process.env.TOKEN);
