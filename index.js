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

// Redirect to original URL using shortId
app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;

    try {
        // Find and update visit history for the given shortId
        const entry = await URL.findOneAndUpdate(
            { shortid: shortId },
            { 
                $push: { 
                    visitHistory: { 
                        timestamp: Date.now() 
                    } 
                } 
            },
            { new: true } // Return the updated document
        );

        // If no entry is found, send a 404 response
        if (!entry) {
            return res.status(404).send('Short URL not found');
        }

        // Redirect to the original URL if entry is found
        res.redirect(entry.redirectUrl);

    } catch (error) {
        console.error("Error fetching the URL entry:", error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});