require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {NODE_ENV} = require("./config");
const logger = require("./logger");
const bookmarksRouter = require("./bookmark/bookmark-router");


const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req,res,next) {
    // automatically set Bearer in token with you inserting it in env
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get("Authorization")

    if(!authToken || authToken.split(" ")[1] !== apiToken) {
        logger.error(`Unauthorized request to path: ${req.path}`)
        return res.status(401).json({error: "Unauthorized request"})
    }
    next()
});

app.use('/api/bookmarks/', bookmarksRouter);

app.get("/", (req,res) => {
    res.send("Hello, world!")
});

app.use(function errorHandler(error, req, res, next) { // middleware -- if an object is an error, it follows the path below. hence why it's below the ones above. They get to go first and will supply error object if it is an error object. 
    let response
    if(NODE_ENV === "production") {
        response = {error: {message: "server error"}}
    } else {
        console.error(error)
        response = {message: error.message, error }
    }
    res.status(500).json(response)
});

module.exports = app