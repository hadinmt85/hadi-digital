import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const outDir = path.join(process.cwd(), "public", "products");
const targets = [
  ["rudy-mirrorless-x", "File:Olympus PEN E-P7 14 Jul 2021c.jpg"],
  ["lumen-home-camera", "File:Security camera, September 2018.jpg"],
  ["lumen-smart-plug", "File:Smart-plug.jpg"],
  ["nova-5g-phone", "File:Back of the Samsung Galaxy S23.jpg"],
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const results = [];

for (const [slug, title] of targets) {
  const url =
    "https://commons.wikimedia.org/w/api.php?action=query&titles=" +
    encodeURIComponent(title) +
    "&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=1400&format=json";
  const response = await fetch(url, {
    headers: { "user-agent": "HadiStoreDemo/1.0 (portfolio project)" },
  });
  if (!response.ok) {
    console.log(`${slug}: metadata failed ${response.status}`);
    continue;
  }
  const data = await response.json();
  const page = Object.values(data.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.thumburl) {
    console.log(`${slug}: no thumb`);
    continue;
  }
  const imageResponse = await fetch(info.thumburl, {
    headers: { "user-agent": "HadiStoreDemo/1.0 (portfolio project)" },
  });
  if (!imageResponse.ok) {
    console.log(`${slug}: download failed ${imageResponse.status}`);
    continue;
  }
  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  await sharp(buffer)
    .rotate()
    .resize(1200, 960, { fit: "cover", position: "attention" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(outDir, `${slug}.jpg`));
  results.push({
    slug,
    title,
    artist: info.extmetadata?.Artist?.value?.replace(/<[^>]+>/g, "").trim() || "",
    license: info.extmetadata?.LicenseShortName?.value || "",
    descriptionurl: info.descriptionurl,
  });
  console.log(`ok ${slug}`);
  await sleep(800);
}

fs.writeFileSync(
  path.join(process.cwd(), "scripts", "new-product-specific-sources.json"),
  JSON.stringify(results, null, 2),
);
