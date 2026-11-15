// Renders the hub portal (dist/index.html + dist/404.html) from hub/portal/* and hub/brands.json.
// Usage: node scripts/render-portal.mjs <distDir> <slug> [<slug> ...]   (only the brands actually built)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HUB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [distArg, ...slugs] = process.argv.slice(2);
if (!distArg || !slugs.length) {
  console.error("usage: render-portal.mjs <distDir> <slug> [<slug> ...]");
  process.exit(1);
}
const DIST = path.resolve(distArg);

const listed = JSON.parse(fs.readFileSync(path.join(HUB, "brands.json"), "utf8"));
const bySlug = new Map(listed.map((b) => [b.slug, b]));
// brands.json order first, then any built brand that is not listed (with neutral defaults)
const order = [...listed.map((b) => b.slug).filter((s) => slugs.includes(s)), ...slugs.filter((s) => !bySlug.has(s))];
const brands = order.map((slug) => {
  const b = bySlug.get(slug);
  if (!b) console.warn(`  ! ${slug} is not in hub/brands.json: using defaults on the portal`);
  return { slug, name: slug.toUpperCase(), tagline: "", concept: "", hero: [], accent: "#3a3a3a", ...b };
});

/* ---------- helpers ------------------------------------------------------- */
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function luminance(hex) {
  const n = String(hex).replace("#", "");
  const full = n.length === 3 ? n.split("").map((c) => c + c).join("") : n.padEnd(6, "0");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** First hero candidate that exists in the brand's exported folder, as a URL under /<slug>/ (or null). */
function heroUrl(b) {
  const candidates = (Array.isArray(b.hero) ? b.hero : [b.hero]).filter(Boolean).map((h) => String(h).replace(/^\/+/, ""));
  const found = candidates.find((h) => fs.existsSync(path.join(DIST, b.slug, h)));
  if (!found) console.warn(`  ! ${b.slug}: hero image not found (${candidates.join(", ") || "none"}), typographic card instead`);
  return found ? `/${b.slug}/${found.split("/").map(encodeURIComponent).join("/")}` : null;
}

const NUMBER_WORDS = ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"];
const n = brands.length;
const word = NUMBER_WORDS[n] || String(n);
const Word = word.charAt(0).toUpperCase() + word.slice(1);
const pad = (i) => String(i).padStart(2, "0");

const ARROW =
  '<svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true"><path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" stroke-width="1.4"/></svg>';

/* ---------- blocks -------------------------------------------------------- */
const cards = brands
  .map((b, i) => {
    const accent = /^#[0-9a-f]{3,8}$/i.test(b.accent) ? b.accent : "#3a3a3a";
    const L = luminance(accent);
    const vars = [
      `--accent:${accent}`,
      `--on-accent:${L > 0.4 ? "#0b0b0b" : "#f1ede6"}`,
      `--accent-ring:${L > 0.06 ? accent : "#f1ede6"}`,
    ].join(";");
    const hero = heroUrl(b);
    const img = hero
      ? `<img src="${esc(hero)}" alt="${esc(`${b.name}${b.tagline ? ` — ${b.tagline}` : ""}`)}" ${i < 2 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${
          b.heroPosition ? ` style="object-position:${esc(b.heroPosition)}"` : ""
        } onerror="this.closest('.card').classList.add('no-media')">`
      : "";
    return `  <article class="card${hero ? "" : " no-media"}" id="${esc(b.slug)}" style="${vars}">
    <figure class="media">
      ${img}
      <div class="fallback" aria-hidden="true"><span>${esc(b.name)}</span></div>
    </figure>
    <div class="meta"><span class="num">${pad(i + 1)}</span><span>Tienda · Brand book</span></div>
    <h2 class="name">${esc(b.name)}</h2>
    ${b.tagline ? `<p class="tagline">${esc(b.tagline)}</p>` : ""}
    ${b.concept ? `<p class="concept">${esc(b.concept)}</p>` : ""}
    <a class="cta" href="/${esc(b.slug)}/">Entrar<span class="sr"> en ${esc(b.name)}</span> ${ARROW}</a>
  </article>`;
  })
  .join("\n");

const index = brands
  .map((b) => `      <li><a href="#${esc(b.slug)}" style="--accent:${esc(b.accent)}">${esc(b.name)}</a></li>`)
  .join("\n");

const lede =
  n === 1 ? "Una marca, una tienda completa. Entra para recorrerla." : `${Word} marcas, ${word} tiendas completas. Elige una propuesta para entrar.`;

/* ---------- render -------------------------------------------------------- */
const css = fs.readFileSync(path.join(HUB, "portal", "portal.css"), "utf8").trim();
const fill = (tpl, vars) => tpl.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (k in vars ? vars[k] : m));

const indexHtml = fill(fs.readFileSync(path.join(HUB, "portal", "index.html"), "utf8"), {
  CSS: css,
  DESCRIPTION: esc(`Propuestas de marca: ${brands.map((b) => b.name).join(", ")}.`),
  COUNT_LABEL: `${pad(n)} ${n === 1 ? "marca" : "marcas"}`,
  LEDE: esc(lede),
  INDEX: index,
  GRID_CLASS: n > 1 ? " multi" : "",
  CARDS: cards,
  FOOT_RIGHT: esc(brands.map((b) => b.name).join(" · ")),
});

const notFoundHtml = fill(fs.readFileSync(path.join(HUB, "portal", "404.html"), "utf8"), {
  CSS: css,
  BRANDS_JSON: JSON.stringify(Object.fromEntries(brands.map((b) => [b.slug, b.name]))).replace(/</g, "\\u003c"),
});

fs.writeFileSync(path.join(DIST, "index.html"), indexHtml);
fs.writeFileSync(path.join(DIST, "404.html"), notFoundHtml);
console.log(`  portal: ${brands.map((b) => b.slug).join(", ")}`);
