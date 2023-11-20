const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("/static/latest.apk");
});

router.get("/api", (req, res, next) => {
    try {
        const dataJson = fs.readFileSync(path.join(__dirname, "..", "data", "data.json")).toString();
        const data = JSON.parse(dataJson);
        res.json({
            version: 1,
            random: data.random,
            apps: data.apps,
        });
    } catch (e) {
        res.json({
            version: 1,
            error: "Could not load data JSON.",
        });
    }
});

module.exports = router;
