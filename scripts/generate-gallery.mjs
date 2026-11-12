import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("public/products");
const outDir = path.join(root, "gallery");
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const files = fs
  .readdirSync(root)
  .filter((file) => /\.(jpe?g|png)$/i.test(file))
  .filter((file) => !file.startsWith("."));

let created = 0;

for (const file of files) {
  const slug = file.replace(/\.[a-z0-9]+$/i, "");
  const source = path.join(root, file);

  // مرحلهٔ اول: نرمال‌سازی به مربع ۱۰۰۰×۱۰۰۰، سپس برش‌های نزدیک‌تر
  const normalized = await sharp(source)
    .resize(1000, 1000, { fit: "cover", position: "centre" })
    .jpeg({ quality: 90 })
    .toBuffer();

  await sharp(normalized)
    .extract({ left: 150, top: 150, width: 700, height: 700 })
    .resize(1000, 1000)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(outDir, `${slug}-detail.jpg`));

  await sharp(normalized)
    .extract({ left: 90, top: 180, width: 820, height: 820 })
    .resize(1000, 1000)
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(outDir, `${slug}-angle.jpg`));

  created += 2;
}

console.log(`created ${created} gallery images in ${outDir}`);
