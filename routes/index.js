const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res, next) => {
    const dataJson = fs.readFileSync(path.join(__dirname, "..", "data", "data.json")).toString();
    const data = JSON.parse(dataJson);
    res.json({
        version: 1,
        random: data.random,
        apps: data.apps,
    });
});

module.exports = router;
