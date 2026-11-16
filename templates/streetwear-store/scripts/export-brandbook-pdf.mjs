#!/usr/bin/env node
/* ==========================================================================
   Exports the online Brand Book (/brand) to an A4-landscape PDF, one sheet per page.

     # 1) serve the site on a spare port (a separate distDir avoids clashing with `next dev`)
     NEXT_DIST_DIR=.next-pdf npx next build && NEXT_DIST_DIR=.next-pdf npx next start -p 3200
     # 2) in another terminal
     node scripts/export-brandbook-pdf.mjs [url] [out.pdf]
        url  default http://localhost:3200/brand
        out  default public/brand/brandbook.pdf (= brand.brandBook.pdfHref)

   Requires Playwright with Chromium:  npm i -D playwright && npx playwright install chromium
   (or a global install). Rebuild after exporting so the footer/nav PDF links appear.
   ========================================================================== */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const url = process.argv[2] || "http://localhost:3200/brand";
const out = path.resolve(process.argv[3] || path.join(ROOT, "public", "brand", "brandbook.pdf"));

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  try {
    ({ chromium } = createRequire(import.meta.url)("playwright"));
  } catch {
    console.error("Playwright not found: npm i -D playwright && npx playwright install chromium");
    process.exit(1);
  }
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1123, height: 794 } });
await page.goto(url, { waitUntil: "networkidle", timeout: 180000 });
// The dev overlay must never reach the PDF.
await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
await page.evaluate(() => document.fonts.ready);
// Wait until every image has loaded or failed (failed ones fall back to placeholders).
await page.evaluate(async () => {
  await Promise.all(
    Array.from(document.images).map((img) =>
      img.complete
        ? img.naturalWidth
          ? img.decode().catch(() => {})
          : null
        : new Promise((r) => {
            img.onload = img.onerror = r;
          })
    )
  );
});
await page.emulateMedia({ media: "print" });
await page.waitForTimeout(1200);
const stats = await page.evaluate(() => {
  const imgs = Array.from(document.images);
  return { images: imgs.length, loaded: imgs.filter((i) => i.naturalWidth > 0).length, sheets: document.querySelectorAll("main > section > div").length };
});
console.log(stats);
await page.pdf({ path: out, format: "A4", landscape: true, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, preferCSSPageSize: true });
console.log("written", path.relative(ROOT, out));
await browser.close();
