import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("public/products");

/** برای محصولات هم‌خانواده، از تصویر موجود یک نمای تازه (کراپ/زوم) می‌سازیم. */
const variants = {
  "kub-mini-speaker": "kub-bluetooth-speaker",
  "cinema-21-soundbar": "cinema-51-soundbar",
  "fit-band-pro": "fit-band-lite",
  "zenith-lite-phone": "zenith-5g-phone",
  "nova-pad-air": "nova-pad-11",
  "ultrabook-16": "ultrabook-14",
  "pixa-32-monitor": "pixa-27-4k-monitor",
  "velocity-pro-mouse": "velocity-gaming-mouse",
  "procontrol-2-gamepad": "procontrol-gamepad",
  "aero-drone-pro": "aero-mini-drone",
  "magsafe-powerbank-10k": "prime-20000-powerbank",
  "gun-100w-charger": "gun-65w-charger",
  "body-scale-2": "body-smart-scale",
  "data-portable-ssd-2tb": "portable-ssd-1tb",
  "gadget-backpack-pro": "gadget-backpack",
};

for (const [slug, source] of Object.entries(variants)) {
  await sharp(path.join(dir, `${source}.jpg`))
    .resize(1320, 1056, { fit: "cover", position: "attention" })
    .extract({ left: 60, top: 48, width: 1200, height: 960 })
    .modulate({ brightness: 1.01, saturation: 1.04 })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(dir, `${slug}.jpg`));
  console.log(`variant ${slug} <- ${source}`);
}
