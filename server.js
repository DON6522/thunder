const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');  // Import CORS

const app = express();

// Enable CORS
app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle form submissions
app.post('/submit', (req, res) => {
    const inputText = req.body.inputText;
    console.log('Received inputText:', inputText); // Log input for debugging

    if (inputText) {
        // Use a relative or absolute path to ensure the correct file is accessed
        const filePath = 'submissions.json';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error('Failed to read file:', err);
                return res.status(500).send('Failed to read file');
            }

            let submissions = [];

            if (data.length > 0) {
                try {
                    submissions = JSON.parse(data);
                } catch (parseErr) {
                    console.error('Failed to parse JSON:', parseErr);
                    return res.status(500).send('Failed to parse data');
                }
            }

            submissions.push(inputText);

            fs.writeFile(filePath, JSON.stringify(submissions, null, 2), (err) => {
                if (err) {
                    console.error('Failed to save data:', err);
                    return res.status(500).send('Failed to save data');
                }
                console.log('Data saved successfully');
                res.send('Data saved successfully');
            });
        });
    } else {
        res.status(400).send('No input text provided');
    }
});

// Serve static files (your frontend HTML, CSS, and JS)
app.use(express.static('public'));

// Start the server
const port = process.env.PORT || 3000;  // Use environment variable for port
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
