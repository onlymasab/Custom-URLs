const URL = require('../model/url');
const shortid = require('shortid');

async function handleGenerateNewShortUrl(req, res) {
    console.log("checking");

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ err: "URL is required" });
    }

    // Generate unique short ID
    const shortId = shortid.generate();

    // Check if shortId is valid
    if (!shortId) {
        console.error('Failed to generate shortId');
        return res.status(500).json({ err: "Failed to generate shortId" });
    }

    console.log("Generated Short ID:", shortId);
    console.log("Original URL:", url);

    

    try {
        // Insert new document into MongoDB
        await URL.create({
            shortId: shortId, // Use the generated shortId
            redirectUrl: url, // Use the url from request body
            visitHistory: [], // Initialize visit history as an empty array
        });

        console.log('Short URL created successfully');

        return res.status(201).json({ id: shortId });

    } catch (error) {
        // Enhanced logging for better debugging
        console.error('Error creating short URL:', error.message);
        console.error('Error details:', error);

        return res.status(500).json({ err: "Internal Server Error", details: error.message });
    }
}

module.exports = {
    handleGenerateNewShortUrl,
};