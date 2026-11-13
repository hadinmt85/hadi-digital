import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const targets = [
  ["magsafe-powerbank-10k", "File:Anker power bank and cable.jpg"],
  ["gun-100w-charger", "File:Plug-in power adapter USB for Apple, Model A1300, by Flextronics-0812.jpg"],
  ["body-scale-2", "File:Withings-bodyscale.jpg"],
  ["data-portable-ssd-2tb", "File:SAMSUNG PROTABLE SSD T7 SHIELD 4TB FRONT SIDE.jpg"],
  ["gadget-backpack-pro", "File:Backpack small.jpg"],
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
  await sleep(1500);
}

fs.writeFileSync("scripts/variant-rest-sources.json", JSON.stringify(results, null, 2));
