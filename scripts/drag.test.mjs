import assert from "node:assert/strict";
import puppeteer from "puppeteer-core";

const CHROME =
  process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.CAPTURE_BASE ?? "http://localhost:3117";

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });

const order = () => page.$$eval("[data-block]", (els) => els.map((e) => e.dataset.block));
const centre = async (selector) => {
  const box = await (await page.$(selector)).boundingBox();
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

async function reset() {
  await page.goto(`${BASE}/playground`, { waitUntil: "networkidle0" });
  await new Promise((r) => setTimeout(r, 1200));
}

let failures = 0;
const check = async (name, fn) => {
  try {
    await reset();
    await fn();
    console.log(`  pass  ${name}`);
  } catch (error) {
    failures += 1;
    console.log(`  FAIL  ${name}\n        ${error.message}`);
  }
};

// The reported bug: the pointer crossing selectable text killed the drag.
await check("drag across table text still reorders", async () => {
  const before = await order();
  const handle = await centre('button[aria-label^="Move Data Source"]');
  const rows = await centre("table tbody");
  const target = await centre('[data-block="table-3"]');

  await page.mouse.move(handle.x, handle.y);
  await page.mouse.down();
  await page.mouse.move(handle.x + 20, handle.y + 20, { steps: 6 });
  await page.mouse.move(rows.x, rows.y, { steps: 25 });
  await page.mouse.move(target.x, target.y, { steps: 20 });
  await page.mouse.up();
  await new Promise((r) => setTimeout(r, 400));

  const after = await order();
  assert.notDeepEqual(after, before, "order did not change");
  assert.equal(after.length, before.length, "a block went missing");
});

await check("no lifted card is left stranded after release", async () => {
  const handle = await centre('button[aria-label^="Move Data Source"]');
  const rows = await centre("table tbody");
  await page.mouse.move(handle.x, handle.y);
  await page.mouse.down();
  await page.mouse.move(rows.x, rows.y, { steps: 25 });
  await page.mouse.up();
  await new Promise((r) => setTimeout(r, 500));

  const stranded = await page.$$eval("[data-block] > div", (els) =>
    els.filter((e) => getComputedStyle(e).position === "fixed").length,
  );
  assert.equal(stranded, 0, `${stranded} card(s) still position:fixed`);
});

await check("no text got selected during the drag", async () => {
  const handle = await centre('button[aria-label^="Move Data Source"]');
  const rows = await centre("table tbody");
  await page.mouse.move(handle.x, handle.y);
  await page.mouse.down();
  await page.mouse.move(rows.x, rows.y, { steps: 25 });
  const selected = await page.evaluate(() => window.getSelection()?.toString() ?? "");
  await page.mouse.up();
  assert.equal(selected, "", `selection leaked: ${JSON.stringify(selected.slice(0, 40))}`);
});

await check("releasing outside the canvas removes the block", async () => {
  const before = await order();
  const handle = await centre('button[aria-label^="Move Data Source"]');
  await page.mouse.move(handle.x, handle.y);
  await page.mouse.down();
  await page.mouse.move(handle.x, handle.y + 30, { steps: 5 });
  await page.mouse.move(1380, 940, { steps: 25 });
  await page.mouse.up();
  await new Promise((r) => setTimeout(r, 400));

  const after = await order();
  assert.equal(after.length, before.length - 1, "block was not removed");
});

await check("escape during a drag puts the block back", async () => {
  const before = await order();
  const handle = await centre('button[aria-label^="Move Data Source"]');
  const target = await centre('[data-block="table-3"]');
  await page.mouse.move(handle.x, handle.y);
  await page.mouse.down();
  await page.mouse.move(target.x, target.y, { steps: 25 });
  await page.keyboard.press("Escape");
  await page.mouse.up();
  await new Promise((r) => setTimeout(r, 400));

  assert.deepEqual(await order(), before, "order was not restored");
});


// The reported regression: crossing a large block used to swap on every frame,
// so the layout oscillated under the cursor.
await check("crossing the data table swaps at most once", async () => {
  const handle = await centre('button[aria-label^="Move Filter Card"]');
  const table = await (await page.$('[data-block="table-3"]')).boundingBox();

  await page.evaluate(() => {
    window.__seen = new Set();
    window.__tick = setInterval(() => {
      window.__seen.add(
        [...document.querySelectorAll("[data-block]")].map((e) => e.dataset.block).join(","),
      );
    }, 16);
  });

  await page.mouse.move(handle.x, handle.y);
  await page.mouse.down();
  await page.mouse.move(handle.x, handle.y + 30, { steps: 5 });
  for (let y = table.y + 10; y < table.y + table.height - 10; y += 20) {
    await page.mouse.move(table.x + table.width / 2, y, { steps: 2 });
  }
  await page.mouse.up();
  await new Promise((r) => setTimeout(r, 400));

  const states = await page.evaluate(() => {
    clearInterval(window.__tick);
    return window.__seen.size;
  });
  assert.ok(states <= 2, `layout took ${states} distinct orders during one crossing`);
});

await check("dropping in the empty run below places the block last", async () => {
  const before = await order();
  const handle = await centre('button[aria-label^="Move Filter Card"]');

  await page.mouse.move(handle.x, handle.y);
  await page.mouse.down();
  await page.mouse.move(handle.x, handle.y + 40, { steps: 6 });

  const strip = await page.$$eval("[aria-hidden]", (els) => {
    const hit = els.find((e) => (e.textContent ?? "").includes("place last"));
    if (!hit) return null;
    const r = hit.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, label: hit.textContent.trim() };
  });
  assert.ok(strip, "landing strip did not appear while dragging");

  await page.mouse.move(strip.x, strip.y, { steps: 20 });
  const armed = await page.$$eval("[aria-hidden]", (els) =>
    els.some((e) => (e.textContent ?? "").includes("Release to place last")),
  );
  assert.ok(armed, "strip did not arm when hovered");

  await page.mouse.up();
  await new Promise((r) => setTimeout(r, 400));

  const after = await order();
  assert.equal(after.length, before.length, "a block went missing");
  assert.equal(after[after.length - 1], "filter-2", `landed at ${after.join(",")}`);
});

await browser.close();
console.log(failures === 0 ? "\nall drag tests passed" : `\n${failures} failing`);
process.exit(failures === 0 ? 0 : 1);
