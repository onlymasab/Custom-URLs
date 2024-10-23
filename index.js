const express = require('express');
const { connectTomongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const shortid = require('shortid');
const URL =require('./model/url')
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

app.get('/:shortId' ,async (req,res)=>{

    const shortid = req.params.shortId;

 const entry =    await URL.findOneAndUpdate({
    shortid
    },
            {$push:{
                    visitHistory: {
                    timestamps:Date.now()
                        }
                    }
             }
)

 res.redirect(entry.redirectUrl)

})

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});