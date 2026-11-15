#!/usr/bin/env node
/* ==========================================================================
   Which catalog / campaign images exist in /public and which are still missing.

     node scripts/images-status.mjs            summary per product
     node scripts/images-status.mjs --missing  only the missing paths (one per line)

   Use it after each generation phase (see TEMPLATE.md · Fotos de producto).
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), "utf8"));
const exists = (p) => fs.existsSync(path.join(ROOT, "public", p));
const onlyMissing = process.argv.includes("--missing");

const catalog = read("src/data/catalog.json");
const campaign = read("src/data/campaign.json");

let total = 0;
let have = 0;
const missing = [];
for (const p of catalog.products) {
  const files = p.colors.flatMap((c) => c.images);
  const ok = files.filter(exists);
  total += files.length;
  have += ok.length;
  files.filter((f) => !ok.includes(f)).forEach((f) => missing.push(f));
  if (!onlyMissing) console.log(`${ok.length === files.length ? "✓" : ok.length ? "·" : "✗"} ${p.slug.padEnd(28)} ${ok.length}/${files.length}`);
}

const campaignFiles = [
  campaign.hero?.desktop,
  campaign.hero?.mobile,
  ...(campaign.banners || []).map((b) => b.image),
  ...(campaign.lookbook || []).map((l) => l.image),
  campaign.maison?.image,
].filter(Boolean);
const campOk = campaignFiles.filter(exists);
campaignFiles.filter((f) => !campOk.includes(f)).forEach((f) => missing.push(f));

const mockups = ["storefront", "woven-label", "hang-tag", "shopping-bag", "embroidered-patch", "garment-box", "jewellery-box", "sticker-sheet"].map(
  (m) => `/brand/mockups/${m}.jpg`
);
const mockOk = mockups.filter(exists);
mockups.filter((f) => !mockOk.includes(f)).forEach((f) => missing.push(f));

if (onlyMissing) {
  console.log(missing.join("\n"));
} else {
  console.log(`\nProducto: ${have}/${total} · Campaña: ${campOk.length}/${campaignFiles.length} · Mockups brand book: ${mockOk.length}/${mockups.length}`);
  const models = Object.entries(catalog.models || {});
  const noJob = models.filter(([, m]) => !m.job_id).map(([k]) => k);
  console.log(`Casting: ${models.length - noJob.length}/${models.length} modelos con job_id${noJob.length ? ` (faltan: ${noJob.join(", ")})` : ""}`);
}
