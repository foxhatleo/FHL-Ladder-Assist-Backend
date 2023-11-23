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

async function downloadApk(codename, friendlyName, url, localPath = undefined) {
    const apkPath = localPath || path.join(cachePath, `${codename}_newest.apk`);
    if (typeof url === "object" || url.length > 0) {
        console.log(`Downloading ${codename}...`);
        const arm64URL = typeof url === "string" ? url : url["arm64-v8a"];
        const apkRes = await fetch(arm64URL);
        const apkPath = path.join(cachePath, `${codename}_newest.apk`);
        const apkFs = fs.createWriteStream(apkPath, { flags: "w" });
        await finished(Readable.fromWeb(apkRes.body).pipe(apkFs));
        console.log(`Downloaded ${codename}.`);
    }

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

    let finalFilename = destApkFilename;

    if (typeof url === "object") {
        finalFilename = { "arm64-v8a": finalFilename };
        for (const arch of Object.keys(url)) {
            if (arch === "arm64-v8a") continue;
            console.log(`Downloading ${codename} for arch ${arch}...`);
            const archURL = url[arch];
            // eslint-disable-next-line no-await-in-loop
            const apkRes = await fetch(archURL);
            const destApkFilename = `${codename}_${apkVersion}_${arch}.apk`;
            const destApkPath = path.join(destApkFolderPath, destApkFilename);
            const apkFs = fs.createWriteStream(destApkPath, { flags: "w" });
            // eslint-disable-next-line no-await-in-loop
            await finished(Readable.fromWeb(apkRes.body).pipe(apkFs));
            finalFilename[arch] = destApkFilename;
            console.log(`Downloaded ${codename} for arch ${arch}.`);
        }
    }

    return {
        version: apkVersion,
        package: apkPackage,
        filename: finalFilename,
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
        {
            "arm64-v8a": "https://github.com/2dust/v2rayNG/releases/download/1.8.5/v2rayNG_1.8.5_arm64-v8a.apk",
            "armeabi-v7a": "https://github.com/2dust/v2rayNG/releases/download/1.8.5/v2rayNG_1.8.5_armeabi-v7a.apk",
            "x86": "https://github.com/2dust/v2rayNG/releases/download/1.8.5/v2rayNG_1.8.5_x86.apk",
            "x86_64": "https://github.com/2dust/v2rayNG/releases/download/1.8.5/v2rayNG_1.8.5_x86_64.apk",
        },
    );
    const ladderAssist = await downloadApk(
        "ladder-assist",
        "梯子辅助",
        "",
        path.join(__dirname, "..", "static", "latest.apk"),
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
            {
                name: ladderAssist.friendlyName,
                package: ladderAssist.package,
                version: ladderAssist.version,
                filename: ladderAssist.filename,
            },
        ],
        deleteApps: [
            "com.getsurfboard",
            "com.github.kr328.clash",
            "com.github.shadowsocks",
        ],
    };
    await fs.writeFileSync(dataPath, JSON.stringify(finalJson), "utf8");
    console.log("Finished writing data JSON.");
    fs.rmSync(cachePath, { recursive: true, force: true });
    console.log("Removed cache.");
})();
