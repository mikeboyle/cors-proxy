const PORT = process.env['PORT'] || 8000;
const express = require('express');
const cors = require('cors');
const mime = require('mime');
const fetch = require('node-fetch-native');

const app = express();
app.use(cors());

app.get('/health', (req, res) => {
  res.status(200).send('proxy server healthy');
});

app.get('*', async (req, res) => {
  // get the url we want to proxy
  const url = req.path.slice(1);

  // make the proxy request and return it to client
  try {
    const response = await fetch(url);

    if (!response.ok) {
      res.status(response.status).json(response.statusText);
    }
    let contentType = response.headers.get('content-type');
    type = mime.getType(contentType);

    switch (type) {
      case 'json':
        const data = await response.json();
        res.type(type).status(200).json(data);
        break;
      case 'html':
        const text = await response.text();
        res.type('html').status(200).send(text);
      default:
        // Binary files such as images
        const blob = await response.blob();
        const buf = await blob.arrayBuffer();
        res.type(blob.type).status(200).send(Buffer.from(buf));
        break;
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
