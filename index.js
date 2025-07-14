const https = require("https");

const TOKEN = process.env.TOKEN;
const options = {
  hostname: "discord.com",
  path: "/api/v10/users/@me",
  method: "GET",
  headers: {
    Authorization: `Bot ${TOKEN}`,
  },
};

const req = https.request(options, (res) => {
  console.log(`✅ Statuscode: ${res.statusCode}`);

  if (res.statusCode === 200) {
    console.log("✅ Token ist gültig.");
  } else if (res.statusCode === 401) {
    console.error("❌ Ungültiges Token (401 Unauthorized).");
  } else {
    console.error(`⚠️ Unerwartete Antwort: ${res.statusCode}`);
  }
});

req.on("error", (error) => {
  console.error("❌ Verbindungsfehler:", error);
});

req.end();
