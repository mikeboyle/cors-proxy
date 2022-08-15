const PORT = process.env['PORT'] || 8000;
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch-native');

const app = express();
app.use(cors());

app.get('/health', (req, res) => {
  res.status(200).send('proxy server healthy');
});

app.get('*', (req, res) => {
  // get the url we want to proxy
  const url = req.path.slice(1);

  // make the proxy request and return it to client
  fetch(url)
    .then((response) => response.json())
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
