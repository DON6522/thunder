const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');  // Import the CORS middleware
const app = express();

app.use(cors());  // Enable CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Your existing routes and logic here...

app.post('/submit', (req, res) => {
    const inputText = req.body.inputText;
    if (inputText) {
        fs.readFile('submissions.json', (err, data) => {
            let submissions = [];
            if (!err && data.length > 0) {
                submissions = JSON.parse(data);
            }
            submissions.push(inputText);
            fs.writeFile('submissions.json', JSON.stringify(submissions, null, 2), (err) => {
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

// Serve static files (your frontend)
app.use(express.static('public'));

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
