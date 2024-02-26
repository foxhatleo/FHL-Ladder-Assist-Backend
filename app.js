const express = require("express");
const path = require("path");
const logger = require("morgan");

const app = express();

app.use(logger("dev"));

app.get("/", (req, res) => {
    res.redirect("/latest.apk?" + Math.random().toString().substring(2));
});
app.use("/", express.static(path.join(__dirname, "data")));

module.exports = app;
