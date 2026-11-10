/**
 * ØªØµØ§ÙˆÛŒØ± Ù…Ø­ØµÙˆÙ„Ø§Øª Ø±Ø§ Ø¯Ø± public/products/<slug>.jpg Ù…ÛŒâ€ŒØ³Ø§Ø²Ø¯.
 * Ø§Ø¬Ø±Ø§: node scripts/build-product-images.mjs
 *
 * Ù…Ù†Ø§Ø¨Ø¹: Unsplash (Ù…Ø¬ÙˆØ² Ø¢Ø²Ø§Ø¯) Ùˆ Wikimedia Commons (CC BY-SAØ› Ø¬Ø²Ø¦ÛŒØ§Øª Ø¯Ø± CREDITS.md).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const outDir = path.join(process.cwd(), "public", "products");
fs.mkdirSync(outDir, { recursive: true });

const unsplash = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=max&w=1600&q=85`;

const sources = {
  "iris-pro-headphones": { remote: unsplash("1505740420928-5e560c06d30e") },
  "niva-watch-s2": { remote: unsplash("1523275335684-37898b6baf30") },
  "kub-bluetooth-speaker": { remote: unsplash("1608043152269-423dbba4e7e1") },
  "hyper-k87-keyboard": { remote: unsplash("1595044426077-d36d9236d54a") },
  "velocity-gaming-mouse": { remote: unsplash("1615663245857-ac93bb7c39e7") },
  "pixa-27-4k-monitor": { remote: unsplash("1547082299-de196ea013d6") },
  "prime-20000-powerbank": { remote: unsplash("1609091839311-d5365f9ff1c5") },
  "zenith-5g-phone": { remote: unsplash("1512499617640-c74ae3a79d37") },
  "rudy-4k-action-cam": { local: "camera-c.jpg" },
  "aero-mini-drone": { remote: unsplash("1473968512647-3e447244af8f") },
  "lumen-smart-bulb": { remote: unsplash("1565814329452-e1efa11c5b89") },
  "ultrabook-14": { remote: unsplash("1496181133206-80ce9b88a853") },
  "nano-tws-earbuds": { remote: unsplash("1606220945770-b5b6c2c55bf1") },
  "gun-65w-charger": { remote: unsplash("1583863788434-e58a36330cf0") },
  "cinema-51-soundbar": { local: "soundbar-c.jpg", contain: true },
  "procontrol-gamepad": { remote: unsplash("1600080972464-8e5f35f63d08") },
  "nova-pad-11": { remote: unsplash("1561154464-82e9adf32764") },
  "paper-e-reader": { local: "ereader-c.jpg" },
  "stylus-pro-pen": { remote: unsplash("1585790050230-5dd28404ccb9") },
  "magsafe-charger": { remote: unsplash("1615526675159-e248c3021d3f") },
  "body-smart-scale": { local: "scale-c.jpg" },
  "fit-band-lite": { remote: unsplash("1434494878577-86c23bcb06b9") },
  "netl-wifi6-router": { local: "router-a.jpg" },
  "portable-ssd-1tb": { local: "ssd-c.jpg" },
  "studio-mic-one": { remote: unsplash("1590602847861-f357a9332bbc") },
  "vision-4k-webcam": { local: "webcam-c.jpg" },
  "vr-headset-quest": { remote: unsplash("1617802690992-15d93263d3a9") },
  "gadget-backpack": { remote: unsplash("1581605405669-fcdf81165afa") },
};

const previewDir = path.join(process.cwd(), "assets", "product-sources");

async function load(source) {
  if (source.remote) {
    const response = await fetch(source.remote, { signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw new Error(`download failed: ${response.status}`);
    return Buffer.from(await response.arrayBuffer());
  }
  return fs.readFileSync(path.join(previewDir, source.local));
}

let done = 0;
const failures = [];

for (const [slug, source] of Object.entries(sources)) {
  try {
    const buffer = await load(source);
    const pipeline = sharp(buffer).rotate();
    const resized = source.contain
      ? pipeline.resize(1200, 960, { fit: "contain", background: "#121016" })
      : pipeline.resize(1200, 960, { fit: "cover", position: "attention" });
    await resized.jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(outDir, `${slug}.jpg`));
    done += 1;
    console.log(`âœ“ ${slug}.jpg`);
  } catch (error) {
    failures.push(`${slug}: ${error.message}`);
    console.error(`âœ— ${slug}: ${error.message}`);
  }
}

console.log(`\n${done}/${Object.keys(sources).length} images written to public/products`);
if (failures.length) console.log(failures.join("\n"));



