const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'data.json');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

// Route to get the data
app.get('/data', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
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

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Unable to read data file' });
    }

    let entries;
    try {
      entries = JSON.parse(data);
    } catch (err) {
      console.error('Error parsing file data:', err);
      entries = [];
    }

    // Append new entry
    entries.push({ text, timestamp: new Date().toISOString() });

    fs.writeFile(dataFilePath, JSON.stringify(entries, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ error: 'Unable to write data file' });
      }
      res.status(200).json({ message: 'Data saved successfully' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
