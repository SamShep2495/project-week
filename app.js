const express = require("express");
const {getTopics, getApi} = require("./controllers")
const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
    if (err.status && err.message) {
        res.status(err.status).send({ message: err.message})
    }
});

app.use((err, req, res, next) => {
    res.status(500).send( {message: "internal server error"})
});

module.exports = app;