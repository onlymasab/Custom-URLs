const express = require('express');
const { connectTomongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const shortid = require('shortid');
const URL = require('./model/url');
const app = express();

const port = 2000;

// Connect to MongoDB
connectTomongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("MongoDB is connected"))
    .catch((error) => console.error("MongoDB connection failed:", error));

// Middleware to parse JSON requests
app.use(express.json());

// URL route handler
app.use('/url', urlRoute);

app.get('/:shortid', async (req, res) => {
    const shortid = req.params.shortid;
    
    try {
        // Look up the URL entry using the shortid
        const entry = await URL.findOne({ shortId: shortid });
        
        if (entry) {
            res.status(200).json(entry);  // Return the found entry as JSON
        } else {
            res.status(404).json({ message: 'URL not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});

