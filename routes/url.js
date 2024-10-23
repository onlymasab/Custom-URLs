const express = require('express');
const { handleGenerateNewShortUrl } = require('../controllers/url');

const router = express.Router();

// Route to handle POST request for generating a new short URL
router.post('/', handleGenerateNewShortUrl); 

module.exports = router;