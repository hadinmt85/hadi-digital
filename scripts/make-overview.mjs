import path from "node:path";
import sharp from "sharp";

const dir = path.resolve("branding/screens");
const files = [
  "01-home.png",
  "02-live-search.png",
  "03-products-filters.png",
  "04-product-gallery.png",
  "05-compare.png",
  "06-cart.png",
  "07-track.png",
  "08-brands.png",
  "09-mobile-home.png",
];

const width = 600;
const height = 420;
const gap = 16;
const columns = 3;
const rows = Math.ceil(files.length / columns);

const composites = [];
for (let index = 0; index < files.length; index += 1) {
  const file = path.join(dir, files[index]);
  const tile = await sharp(file)
    .resize(width, height, { fit: "contain", background: "#f0f0f1" })
    .png()
    .toBuffer();
  composites.push({
    input: tile,
    left: (index % columns) * (width + gap),
    top: Math.floor(index / columns) * (height + gap),
  });
}

await sharp({
  create: {
    width: columns * width + (columns - 1) * gap,
    height: rows * height + (rows - 1) * gap,
    channels: 3,
    background: "#f0f0f1",
  },
})
  .composite(composites)
  .png()
  .toFile(path.join(dir, "00-overview.png"));

console.log("overview created");
