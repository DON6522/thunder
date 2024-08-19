const express = require('express');
const fs = require('fs').promises;
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
app.get('/data', async (req, res) => {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).json({ error: 'Unable to read data file' });
  }
});

// Route to save data
app.post('/data', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    let entries = [];
    try {
      const data = await fs.readFile(dataFilePath, 'utf8');
      entries = JSON.parse(data);
    } catch (err) {
      console.error('Error parsing file data or file not found, initializing empty array:', err);
    }

    // Append new entry
    entries.push({ text, timestamp: new Date().toISOString() });

    await fs.writeFile(dataFilePath, JSON.stringify(entries, null, 2), 'utf8');
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (err) {
    console.error('Error writing file:', err);
    res.status(500).json({ error: 'Unable to write data file' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
