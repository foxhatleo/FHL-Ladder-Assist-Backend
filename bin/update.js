const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const { finished } = require("stream/promises");
const ApkParser = require("app-info-parser/src/apk");

const cachePath = path.join(__dirname, "..", "data", "cache");
const destApkFolderPath = path.join(__dirname, "..", "data", "apk");
const dataPath = path.join(__dirname, "..", "data", "data.json");

fs.rmSync(cachePath, { recursive: true, force: true });
fs.mkdirSync(cachePath);

async function downloadApk(codename, friendlyName, url) {
    console.log(`Downloading ${codename}...`);
    const apkRes = await fetch(url);
    const apkPath = path.join(cachePath, `${codename}_newest.apk`);
    const apkFs = fs.createWriteStream(apkPath, { flags: "wx" });
    await finished(Readable.fromWeb(apkRes.body).pipe(apkFs));
    console.log(`Downloaded ${codename}.`);

    console.log(`Parsing ${codename} apk...`);
    const apkParser = new ApkParser(apkPath);
    const apkInfo = await apkParser.parse();
    console.log(`Parsed ${codename} apk.`);

    const apkVersion = apkInfo.versionCode;
    const apkPackage = apkInfo.package;
    console.log(`${codename} Package name: ${apkPackage}`);
    console.log(`${codename} Version: ${apkVersion}`);
    const destApkFilename = `${codename}_${apkVersion}.apk`;
    const destApkPath = path.join(destApkFolderPath, destApkFilename);
    fs.copyFileSync(apkPath, destApkPath);
    console.log(`Copied ${codename}.`);

    return {
        version: apkVersion,
        package: apkPackage,
        filename: destApkFilename,
        friendlyName,
    };
}

(async () => {
    const expressVpn = await downloadApk(
        "expressvpn",
        "ExpressVPN",
        "https://www.expressvpn.com/latest/android",
    );
    const v2rayng = await downloadApk(
        "v2rayng",
        "v2rayNG",
        "https://github.com/2dust/v2rayNG/releases/download/1.8.5/v2rayNG_1.8.5.apk",
    );

    fs.rmSync(dataPath, { recursive: true, force: true });
    const finalJson = {
        random: Math.random().toString().substring(2),
        apps: [
            {
                name: expressVpn.friendlyName,
                package: expressVpn.package,
                version: expressVpn.version,
                filename: expressVpn.filename,
            },
            {
                name: v2rayng.friendlyName,
                package: v2rayng.package,
                version: v2rayng.version,
                filename: v2rayng.filename,
            },
        ],
    };
    await fs.writeFileSync(dataPath, JSON.stringify(finalJson), "utf8");
    console.log("Finished writing data JSON.");
    fs.rmSync(cachePath, { recursive: true, force: true });
    console.log("Removed cache.");
})();
