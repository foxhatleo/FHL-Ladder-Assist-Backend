const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res, next) => {
    const dataJson = fs.readFileSync(path.join(__dirname, "..", "data", "data.json")).toString();
    res.json({
        version: 1,
        apps: JSON.parse(dataJson),
    });
});

module.exports = router;
