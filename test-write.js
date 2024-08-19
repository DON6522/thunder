
const fs = require('fs');

const testFilePath = 'submissions.json';
const testData = ['Test data'];

fs.writeFile(testFilePath, JSON.stringify(testData, null, 2), (err) => {
    if (err) {
        console.error('Failed to write test data:', err);
    } else {
        console.log('Test data written successfully');
    }
});
