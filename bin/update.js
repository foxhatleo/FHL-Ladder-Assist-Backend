const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const { finished } = require("stream/promises");
const ApkParser = require("app-info-parser/src/apk");

const cachePath = path.join(__dirname, "cache");
const apkPath = path.join(__dirname, "apk");
const dataPath = path.join(__dirname, "data.json");
const expressVpnApkPath = path.join(cachePath, "expressvpn_newest.apk");

fs.rmSync(cachePath, { recursive: true, force: true });
fs.mkdirSync(cachePath);

(async () => {
    console.log("Downloading ExpressVPN...");
    const expressVpnApkRes = await fetch("https://www.expressvpn.com/latest/android");
    const expressVpnApkFs = fs.createWriteStream(expressVpnApkPath, { flags: "wx" });
    await finished(Readable.fromWeb(expressVpnApkRes.body).pipe(expressVpnApkFs));
    console.log("Downloaded ExpressVPN.");

    console.log("Parsing ExpressVPN apk...");
    const expressVpnParser = new ApkParser(expressVpnApkPath);
    const expressVpnApkInfo = await expressVpnParser.parse();
    console.log("Parsed ExpressVPN apk.");

    const expressVpnVersion = expressVpnApkInfo.versionCode;
    const expressVpnPackageName = expressVpnApkInfo.package;
    console.log(`ExpressVPN Version: ${expressVpnVersion}`);
    console.log(`ExpressVPN Package name: ${expressVpnPackageName}`);
    const expressVpnDestApkFilename = `expressvpn_${expressVpnVersion}.apk`;
    const expressVpnDestApkPath = path.join(apkPath, expressVpnDestApkFilename);
    fs.copyFileSync(expressVpnApkPath, expressVpnDestApkPath);
    console.log("Copied ExpressVPN.");

    fs.rmSync(dataPath, { recursive: true, force: true });
    const finalJson = [
        {
            package: expressVpnPackageName,
            version: expressVpnVersion,
            filename: expressVpnDestApkFilename,
        },
    ];
    await fs.writeFileSync(dataPath, JSON.stringify(finalJson), "utf8");
    console.log("Finished writing data JSON.");
    fs.rmSync(cachePath, { recursive: true, force: true });
    console.log("Removed cache.");
})();
