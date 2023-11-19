const express = require("express");
const path = require("path");
const logger = require("morgan");

const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("apk", express.static(path.join(__dirname, "data", "apk")));

app.use("/", indexRouter);

module.exports = app;
