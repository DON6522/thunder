const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle form submissions
app.post('/submit', (req, res) => {
    const inputText = req.body.inputText;
    if (inputText) {
        const filePath = 'submissions.json';

        fs.readFile(filePath, (err, data) => {
            if (err && err.code !== 'ENOENT') {
                return res.status(500).send('Failed to read file');
            }

            let submissions = [];

            if (data.length > 0) {
                try {
                    submissions = JSON.parse(data);
                } catch (parseErr) {
                    return res.status(500).send('Failed to parse data');
                }
            }

            submissions.push(inputText);

            fs.writeFile(filePath, JSON.stringify(submissions, null, 2), (err) => {
                if (err) {
                    return res.status(500).send('Failed to save data');
                }
                res.send('Data saved successfully');
            });
        });
    } else {
        res.status(400).send('No input text provided');
    }
});

// Serve static files
app.use(express.static('public'));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
