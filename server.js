const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'data.json');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Route to get the data
app.get('/data', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read data file' });
    }
    res.json(JSON.parse(data));
  });
});

// Route to save data
app.post('/data', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  fs.writeFile(dataFilePath, JSON.stringify({ text }), 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to write data file' });
    }
    res.status(200).json({ message: 'Data saved successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
