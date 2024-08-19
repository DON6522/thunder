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
app.use(express.static(path.join(__dirname, 'data.json')));

// Route to get the data
app.get('/data', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err); // Debugging line
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

  console.log('Received text:', text); // Debugging line

  fs.writeFile(dataFilePath, JSON.stringify({ text }), 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err); // Debugging line
      return res.status(500).json({ error: 'Unable to write data file' });
    }
    console.log('Data saved to file successfully'); // Debugging line
    res.status(200).json({ message: 'Data saved successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
