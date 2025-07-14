const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Bot läuft.');
});

function keepAlive() {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`✅ Dummy-Webserver läuft auf Port ${port} (für Render).`);
  });
}

module.exports = keepAlive;
