import { mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ??
  (process.platform === "win32"
    ? "C:/Program Files/Google/Chrome/Application/chrome.exe"
    : process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : "/usr/bin/google-chrome");
const BASE = process.env.CAPTURE_BASE ?? "http://localhost:3117";
const OUT = ".impeccable/review";

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--hide-scrollbars", "--force-device-scale-factor=1"],
});

async function open(path, width, height = 900) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle0", timeout: 60_000 });
  await page.evaluate(() => document.fonts.ready);
  // Let the entry animation and the pen stroke settle before the shutter.
  await new Promise((r) => setTimeout(r, 2600));
  return page;
}

async function shoot(page, name, fullPage = true) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage });
  console.log("captured", name);
}

const viewports = [
  ["desktop", "/", 1440],
  ["mobile", "/", 375],
  ["home-768", "/", 768],
  ["playground-desktop", "/playground", 1440],
  ["playground-375", "/playground", 375],
  ["playground-768", "/playground", 768],
  ["case-desktop", "/work/caligrafia", 1440],
  ["case-375", "/work/caligrafia", 375],
  ["work-debt-recovery", "/work/debt-recovery", 1440],
  ["work-incident-dispatch", "/work/incident-dispatch", 1440],
];

for (const [name, path, width] of viewports) {
  const page = await open(path, width);
  await shoot(page, name);
  await page.close();
}

// Authored empty state: the canvas after Clear.
{
  const page = await open("/playground", 1440);
  await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find(
      (b) => b.textContent?.trim() === "Clear",
    );
    button?.click();
  });
  await new Promise((r) => setTimeout(r, 700));
  await shoot(page, "playground-empty");
  await page.close();
}

// Unwired state: remove the only dataset provider and let consumers report it.
{
  const page = await open("/playground", 1440);
  await page.evaluate(() => {
    const button = document.querySelector('button[aria-label="Remove Data Source"]');
    button?.click();
  });
  await new Promise((r) => setTimeout(r, 700));
  await shoot(page, "playground-unwired");
  await page.close();
}

// Keyboard focus on a real control.
{
  const page = await open("/playground", 1440);
  await page.evaluate(() => {
    const handle = document.querySelector('button[aria-label^="Move Data Source"]');
    handle?.focus();
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: `${OUT}/playground-focus.png`, fullPage: false });
  console.log("captured playground-focus");
  await page.close();
}

// Hover on the primary action, plus the disabled paginator control.
{
  const page = await open("/", 1440);
  const pill = await page.$('a[href="/playground"]');
  if (pill) await pill.hover();
  await new Promise((r) => setTimeout(r, 500));
  await page.screenshot({ path: `${OUT}/states-hover.png`, fullPage: false });
  console.log("captured states-hover");
  await page.close();
}

{
  const page = await open("/playground", 1440);
  await page.evaluate(() => {
    const chip = [...document.querySelectorAll("button")].find((b) =>
      b.getAttribute("aria-label")?.startsWith("Add Paginator"),
    );
    chip?.click();
  });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: `${OUT}/states-disabled.png`, fullPage: true });
  console.log("captured states-disabled");
  await page.close();
}

await browser.close();
console.log("done");
