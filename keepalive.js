const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Bot ist aktiv');
});

function keepAlive() {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`✅ Keepalive-Server läuft auf Port ${port}`);
  });
}

module.exports = keepAlive;
