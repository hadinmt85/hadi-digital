import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const targets = [
  ["kub-mini-speaker", "File:UE Boom 2.jpg"],
  ["cinema-21-soundbar", "File:Samsung TV UE55F9000 with Sonos wireless speakers PLAY 5 and Sonos soundbar.jpg"],
  ["fit-band-pro", "File:Fitbit Alta HR.jpg"],
  ["zenith-lite-phone", "File:Google Pixel and Pixel XL smartphones (30155272575).jpg"],
  ["nova-pad-air", "File:Samsung Galaxy Tab GT-P1000-7430.jpg"],
  ["ultrabook-16", "File:DELL XPS 13 and 15 (37080596413).jpg"],
  ["pixa-32-monitor", "File:EIZO Foris FG2421 VGA computer monitor displaying test pattern.png"],
  ["velocity-pro-mouse", "File:Logitech(G703) mouse.jpg"],
  ["procontrol-2-gamepad", "File:PSX-Original-Controller.jpg"],
  ["aero-drone-pro", "File:2024 Dron DJI Mini 4 Pro (01).jpg"],
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const results = [];

for (const [slug, title] of targets) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&titles=" +
    encodeURIComponent(title) +
    "&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=1400&format=json";
  try {
    const response = await fetch(url, {
      headers: { "user-agent": "HadiStoreDemo/1.0 (portfolio project)" },
    });
    if (!response.ok) throw new Error(`meta ${response.status}`);
    const data = await response.json();
    const page = Object.values(data.query?.pages ?? {})[0];
    const info = page?.imageinfo?.[0];
    if (!info?.thumburl) throw new Error("no thumb");
    const imageResponse = await fetch(info.thumburl, {
      headers: { "user-agent": "HadiStoreDemo/1.0 (portfolio project)" },
    });
    if (!imageResponse.ok) throw new Error(`img ${imageResponse.status}`);
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    await sharp(buffer)
      .rotate()
      .resize(1200, 960, { fit: "cover", position: "attention" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join("public/products", `${slug}.jpg`));
    results.push({
      slug,
      title,
      artist: info.extmetadata?.Artist?.value?.replace(/<[^>]+>/g, "").trim() || "",
      license: info.extmetadata?.LicenseShortName?.value || "",
      descriptionurl: info.descriptionurl,
    });
    console.log(`ok ${slug}`);
  } catch (error) {
    console.log(`failed ${slug}: ${error.message}`);
  }
  await sleep(1200);
}

fs.writeFileSync("scripts/variant-specific-sources.json", JSON.stringify(results, null, 2));
