// server.js
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

// Increase timeout to prevent 504 Gateway Timeout
app.use((req, res, next) => {
  req.setTimeout(60000); // 60 seconds for requests
  res.setTimeout(60000); // 60 seconds for responses
  next();
});

// Serve static files from dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath, {
  maxAge: '1y', // Cache static assets for 1 year
  etag: true,
}));

// Proxy for OSM tiles to bypass CSP and 504 issues
app.get('/tiles/osm/:z/:x/:y', async (req, res) => {
  const { z, x, y } = req.params;
  const tileUrl = `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
  try {
    const response = await fetch(tileUrl);
    if (!response.ok) {
      throw new Error(`Tile fetch failed: ${response.status} ${response.statusText}`);
    }
    const buffer = await response.buffer();
    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400', // Cache tiles for 1 day
    });
    res.send(buffer);
  } catch (error) {
    console.error(`Tile proxy error: ${error.message}, URL: ${tileUrl}`);
    res.status(500).send('Tile fetch failed');
  }
});

// Fallback for SPA routing (serve index.html for unmatched routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      console.error(`Error serving index.html: ${err.message}`);
      res.status(500).send('Server error');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`Server error: ${err.message}`);
  res.status(500).send('Internal server error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});