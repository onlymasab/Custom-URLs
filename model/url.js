const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    redirectUrl: {
        type: String,
        required: true,
    },
    visitHistory: [
        {
            timestamp: { type: Number },
        }
    ],
}, { timestamps: true }); // Automatically creates createdAt and updatedAt fields

const URL = mongoose.model('URL', urlSchema);

module.exports = URL;