import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import WebSocket from "ws";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9337;
const BASE = "https://gadgetland-zeta.vercel.app";
const OUT = path.resolve("branding/screens");
const PROFILE = path.join(process.env.TEMP || ".", `hadi-demo-chrome-${Date.now()}`);

fs.mkdirSync(OUT, { recursive: true });

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    "--window-size=1280,950",
    "about:blank",
  ],
  { stdio: "ignore" },
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getTarget() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      if (response.ok) {
        const targets = await response.json();
        const page = targets.find((target) => target.type === "page");
        if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
      }
    } catch {
      // Chrome هنوز آماده نیست
    }
    await sleep(250);
  }
  throw new Error("Chrome DevTools did not start");
}

const wsUrl = await getTarget();
const socket = new WebSocket(wsUrl);
await new Promise((resolve, reject) => {
  socket.once("open", resolve);
  socket.once("error", reject);
});

let sequence = 0;
const pending = new Map();
socket.on("message", (raw) => {
  const message = JSON.parse(raw.toString());
  if (!message.id || !pending.has(message.id)) return;
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function send(method, params = {}) {
  sequence += 1;
  return new Promise((resolve, reject) => {
    pending.set(sequence, { resolve, reject });
    socket.send(JSON.stringify({ id: sequence, method, params }));
  });
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text ?? "evaluate failed");
  }
  return result.result?.value;
}

async function viewport(width, height) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 500,
  });
}

async function navigate(url, wait = 2600) {
  await send("Page.navigate", { url });
  await sleep(wait);
}

async function shot(name) {
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  const file = path.join(OUT, `${name}.png`);
  fs.writeFileSync(file, Buffer.from(data, "base64"));
  console.log("saved", file);
}

await send("Page.enable");
await send("Runtime.enable");
await viewport(1280, 950);

// 1) صفحه اصلی + جستجوی زنده
await navigate(BASE + "/");
await evaluate(`(() => {
  localStorage.setItem('hadi-recent-v1', '[1,17,13]');
  localStorage.setItem('hadi-purchased-v1', '[13]');
  return 1;
})()`);
await navigate(BASE + "/", 3000);
await shot("01-home");

await evaluate(`(async () => {
  const input = [...document.querySelectorAll('input[name="q"]')].find(i => i.getBoundingClientRect().height > 0);
  if (!input) return 0;
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  setter.call(input, 'هوشمند');
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.focus();
  await new Promise(r => setTimeout(r, 2400));
  return 1;
})()`);
await shot("02-live-search");

// 2) لیست محصولات با فیلتر
const expensive =
  BASE + "/products?min=3000000&max=15000000&rating=4&instock=1&sort=cheap";
await navigate(expensive, 3000);
await shot("03-products-filters");

// 3) صفحه محصول + گالری
await navigate(BASE + "/products/iris-pro-headphones", 2800);
await shot("04-product-gallery");

// 4) مقایسه: انتخاب دو محصول و رفتن به صفحه مقایسه
await navigate(BASE + "/products", 3000);
await evaluate(`(async () => {
  const buttons = [...document.querySelectorAll('button[aria-label*="مقایسه"]')].filter(b => b.getBoundingClientRect().height > 0);
  let count = 0;
  for (const button of buttons) {
    if (count >= 2) break;
    if (button.getAttribute('aria-pressed') !== 'true') {
      button.click();
      count += 1;
      await new Promise(r => setTimeout(r, 250));
    }
  }
  return count;
})()`);
await navigate(BASE + "/compare", 2800);
await shot("05-compare");
await evaluate(`localStorage.removeItem('hadi-compare-v1'); 1`);

// 5) سبد خرید + نوار ارسال رایگان
await navigate(BASE + "/", 2400);
await evaluate(`(() => {
  const line = {
    id: 13, slug: 'nano-tws-earbuds', name: 'هندزفری TWS نانو', brand: 'نانو',
    price: 1790000, emoji: '🎵', image: '/products/nano-tws-earbuds.jpg',
    gradientFrom: '#34D399', gradientTo: '#047857', stock: 38, qty: 1
  };
  localStorage.setItem('gadgetland-cart-v1', JSON.stringify([line]));
  return 1;
})()`);
await navigate(BASE + "/cart", 2600);
await shot("06-cart");

// 6) پیگیری سفارش
await navigate(BASE + "/track", 2200);
await shot("07-track");

// 7) برندها
await navigate(BASE + "/brands", 2400);
await shot("08-brands");

// 8) موبایل
await viewport(390, 844);
await navigate(BASE + "/", 3000);
await shot("09-mobile-home");
await navigate(BASE + "/products?sort=cheap", 2800);
await shot("10-mobile-products");

socket.close();
chrome.kill();
console.log("done");
