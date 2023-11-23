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
        const localJson = fs.readFileSync(path.join(__dirname, "..", "data", "local.json")).toString();
        const local = JSON.parse(localJson);
        res.json({
            version: 1,
            random: data.random,
            apps: data.apps,
            v2raySub: local.v2raySub,
            deleteApps: data.deleteApps,
        });
    } catch (e) {
        res.json({
            version: 1,
            error: "Could not load data or local JSON.",
        });
    }
});

module.exports = router;
