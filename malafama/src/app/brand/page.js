import fs from "node:fs";
import path from "node:path";
import Logo from "@/components/brand/Logo";
import LOGOS from "@/components/brand/logoData";
import { formatPrice } from "@/lib/shop";
import brand from "@/config/brand";
import catalog from "@/data/catalog.json";
import ChapterNav from "./components/ChapterNav";
import SafeImage from "./components/SafeImage";
import Sheet, { ChapterHead } from "./components/Sheet";
import s from "./brand.module.css";
import {
  CHAPTERS, EDITION, WORDMARK, SYMBOLS, USAGE, USAGE_COLUMNS, SYMBOL_RULES,
  COLORS, PROPORTIONS, PAIRS, TYPE_SCALE, TYPE_RULES, PHOTO, PHOTO_SEQUENCE, PHOTO_RULES,
  PHOTO_DONTS, VOICE, VOICE_PRINCIPLES, VOICE_YES_NO, VOCAB, MICROCOPY, MOCKUPS, UI_TYPE,
  PRODUCT_PALETTE, LINE, FONTS, TYPE, APPLICATIONS, WEB, CONTACT, MANIFESTO, CONCEPT, COVER,
} from "./data";

export const metadata = {
  title: "Brand Book",
  description: brand.seo.brandBook,
};

/* ---------- helpers ------------------------------------------------------- */
const C = Object.fromEntries(CHAPTERS.map((c) => [c.id, c]));
const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

function aspectOf(variant) {
  const vb = (LOGOS[variant] || LOGOS.wordmark).viewBox.split(/\s+/).map(Number);
  return vb[2] / vb[3];
}
const fmt = (n, d = 2) => n.toFixed(d).replace(".", ",");

function publicFileExists(p) {
  if (!p) return false;
  try {
    return fs.existsSync(path.join(process.cwd(), "public", p));
  } catch {
    return false;
  }
}

function luminance(hex) {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const f = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
const hexRgb = (hex) => [0, 2, 4].map((i) => parseInt(hex.replace("#", "").slice(i, i + 2), 16)).join(" · ");
const isLight = (hex) => luminance(hex) > 0.55;
const grade = (r) => (r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA grande" : "Decorativo");

/* ---------- data from the catalog ----------------------------------------- */
const PRODUCTS = catalog.products || [];
const HERO =
  PRODUCTS.find((p) => p.slug === PHOTO.heroSlug) ||
  PRODUCTS.find((p) => p.kind === "garment" && (p.colors?.[0]?.images || []).length >= 4) ||
  PRODUCTS[0];
const HERO_IMAGES = HERO?.colors?.[0]?.images || [];
/** Short sequences (2 shots: flat lay + on model): show the sequence of several products side by side. */
const SEQ_SHOTS =
  PHOTO.sequence.length >= 4
    ? PHOTO.sequence.map((p, i) => ({ ...p, product: HERO, src: HERO_IMAGES[i] }))
    : (PHOTO.pairSlugs || [HERO?.slug])
        .map((slug) => PRODUCTS.find((p) => p.slug === slug))
        .filter(Boolean)
        .flatMap((prod) => PHOTO.sequence.map((p, i) => ({ ...p, product: prod, src: prod.colors?.[0]?.images?.[i] })))
        .slice(0, 4);
/** With no photographic mockups, chapter 08 draws typographic applications with the logo SVGs. */
const TYPO_APPS = APPLICATIONS.typographic || [];
const capitalize = (k) => k.charAt(0).toUpperCase() + k.slice(1);
/** Fixed casting = the `models` map of catalog.json (key → name shown in the book). */
const CASTING = Object.entries(catalog.models || {}).map(([key, m]) => ({ key, name: m.name || capitalize(key) }));
const PDF_HREF = publicFileExists(brand.brandBook.pdfHref) ? brand.brandBook.pdfHref : null;

function castingShots() {
  return CASTING.map((m) => {
    const theirs = PRODUCTS.filter((p) => p.model === m.key);
    const ready = theirs.find((p) => publicFileExists(p.colors?.[0]?.images?.[1]));
    const p = ready || theirs[0];
    return { ...m, product: p, src: p?.colors?.[0]?.images?.[1] };
  });
}

function gridProducts(category, n = 4) {
  const inCat = PRODUCTS.filter((p) => p.category === category && p.slug !== HERO?.slug);
  const pool = inCat.length >= n ? inCat : PRODUCTS.filter((p) => p.slug !== HERO?.slug);
  const ready = pool.filter((p) => publicFileExists(p.colors?.[0]?.images?.[0]));
  const picks = [...ready, ...pool.filter((p) => !ready.includes(p))].slice(0, n);
  return picks;
}

/* ---------- small pieces --------------------------------------------------- */
function Chapter({ c, children }) {
  return (
    <section id={c.id} className={s.chapter} aria-label={`${c.num} ${c.title}`}>
      {children}
    </section>
  );
}

function MockFigure({ m, ratio, className = "" }) {
  return (
    <figure className={`${s.mock} ${className}`}>
      <div className={s.mockFrame} style={{ aspectRatio: ratio || m.ratio }}>
        <SafeImage src={`/brand/mockups/${m.file}.jpg`} alt={m.t} label={`Mockup · ${m.t}`} />
      </div>
      <figcaption className={s.caption}>
        <strong>{m.t}</strong>
        <span>{m.v}</span>
      </figcaption>
    </figure>
  );
}

/** Typographic application drawn with the logo SVGs (used while there are no photographic mockups). */
function TypoApp({ a, ratio, className = "" }) {
  if (!a) return null;
  const art = {
    box: (
      <div className={s.taBox}>
        <div className={s.taBoxLid}>
          <div className={s.taBoxLogo}><Logo variant="wordmark" className={s.fit} title={brand.name} /></div>
          <span className={s.taBoxMeta}>{brand.tagline} · {brand.city}</span>
          <span className={s.taBoxTape} />
          <div className={s.taBoxSeal}><Logo variant="seal" className={s.fit} title="Sello" /></div>
        </div>
      </div>
    ),
    woven: (
      <div className={s.taWoven}>
        <div className={s.taWovenLabel}>
          <div className={s.taWovenMark}><Logo variant="monogram" className={s.fit} title={brand.shortName} /></div>
        </div>
        <div className={s.taSize}>M</div>
      </div>
    ),
    hangtag: (
      <div className={s.taTagWrap}>
        <span className={s.taString} />
        <div className={s.taTag}>
          <span className={s.taHole} />
          <div className={s.taTagLogo}><Logo variant="wordmark" className={s.fit} title={brand.name} /></div>
          <dl className={s.taTagData}>
            <div><dt>Pieza</dt><dd>{HERO?.name}</dd></div>
            <div><dt>Ref.</dt><dd>{brand.skuPrefix}-001</dd></div>
            <div><dt>Color</dt><dd>{HERO?.colors?.[0]?.name}</dd></div>
            <div><dt>Talla</dt><dd>M</dd></div>
          </dl>
          <span className={s.taTagPrice}>{formatPrice(HERO?.price || 0)}</span>
          <div className={s.taTagEmblem}><Logo variant="emblem" className={s.fit} title="" /></div>
        </div>
      </div>
    ),
    patch: (
      <div className={s.taPatchWrap}>
        <div className={s.taPatch}>
          <div className={s.taPatchSeal}><Logo variant="seal" className={s.fit} title="Parche" /></div>
        </div>
      </div>
    ),
    graphic: (
      <div className={s.taGraphic}>
        <span className={s.taGraphicMeta}>Espalda · serigrafía a una tinta</span>
        <div className={s.taGraphicMark}><Logo variant="graphic" className={s.fit} title="Marca en arco" /></div>
        <span className={s.taGraphicMeta}>{brand.city} · {brand.year}</span>
      </div>
    ),
    tape: (
      <div className={s.taTapeWrap}>
        {[0, 1, 2].map((r) => (
          <div key={r} className={s.taTape}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} className={s.taTapeItem}>
                <span className={s.taTapeLogo}><Logo variant="wordmark" className={s.fit} title="" /></span>
                <span className={s.taTapeEmblem}><Logo variant="emblem" className={s.fit} title="" /></span>
              </span>
            ))}
          </div>
        ))}
      </div>
    ),
    jewel: (
      <div className={s.taJewelWrap}>
        <div className={s.taJewel}>
          <div className={s.taJewelMark}><Logo variant="monogram" className={s.fit} title={brand.shortName} /></div>
          <span className={s.taJewelMeta}>Plata 925</span>
        </div>
      </div>
    ),
    stickers: (
      <div className={s.taStickers}>
        <div className={`${s.taSticker} ${s.taStickerSeal}`}><Logo variant="seal" className={s.fit} title="" /></div>
        <div className={`${s.taSticker} ${s.taStickerEmblem}`}><Logo variant="emblem" className={s.fit} title="" /></div>
        <div className={`${s.taSticker} ${s.taStickerMono}`}><Logo variant="monogram" className={s.fit} title="" /></div>
        <div className={`${s.taSticker} ${s.taStickerWord}`}><Logo variant="wordmark" className={s.fit} title="" /></div>
      </div>
    ),
  };
  return (
    <figure className={`${s.mock} ${className}`}>
      <div className={`${s.mockFrame} ${s.taFrame}`} style={{ aspectRatio: ratio || a.ratio }}>
        {art[a.kind] || null}
      </div>
      <figcaption className={s.caption}>
        <strong>{a.t}</strong>
        <span>{a.v}</span>
      </figcaption>
    </figure>
  );
}

function Misuse({ m }) {
  return (
    <figure className={s.misuse}>
      <div className={`${s.misuseTile} ${s[`fx_${m.fx}`] || ""}`}>
        {m.fx === "retype" ? (
          <span className={s.retype}>{brand.name}</span>
        ) : (
          <div className={s.misuseLogo}>
            <Logo variant={WORDMARK.variant} className={s.fit} title="Uso incorrecto del logotipo" />
          </div>
        )}
      </div>
      <figcaption className={s.misuseCap}>
        <span className={s.cross} aria-hidden="true">×</span>
        {m.k}
      </figcaption>
    </figure>
  );
}

/* ========================================================================== */
export default function BrandBook() {
  const symbols = SYMBOLS.filter((x) => LOGOS[x.variant]);
  const usageRows = [WORDMARK, ...symbols].filter((x) => USAGE[x.variant]);
  const ar = aspectOf(WORDMARK.variant);
  const k = WORDMARK.clearRatio;
  const wide = ar > 4; // very wide wordmarks get a stacked construction sheet
  const gridDiv = WORDMARK.gridDiv || 8;
  const clearH = Math.min(8.5, (wide ? 52 : 40) / (ar + 2 * k)); // cqw — fits its stage whatever the logo's proportions
  const constrW = Math.min(wide ? 54 : 44, 17 * ar); // cqw
  const LINE_PRODUCTS = PRODUCTS.filter((p) => p.line && p.line === LINE.line);
  const productPalette = PRODUCT_PALETTE.map((c) => ({
    ...c,
    rgb: hexRgb(c.hex),
    products: PRODUCTS.filter((p) => (p.colors || []).some((x) => (x.hex || "").toLowerCase() === c.hex.toLowerCase()))
      .map((p) => p.name)
      .slice(0, 3),
  }));
  const lineSlugs = LINE.slugs || [];
  const lineShots = [
    ...lineSlugs.map((slug) => PRODUCTS.find((p) => p.slug === slug)).filter(Boolean),
    ...LINE_PRODUCTS.filter((p) => !lineSlugs.includes(p.slug)),
    ...PRODUCTS.filter((p) => p.kind === "garment" && !LINE_PRODUCTS.includes(p) && !lineSlugs.includes(p.slug)),
  ].slice(0, 4);
  const casting = castingShots();
  const grid = [...LINE_PRODUCTS, ...gridProducts(null, 8), HERO].filter(Boolean)
    .filter((p, i, a) => a.findIndex((q) => q.slug === p.slug) === i)
    .slice(0, 8);
  const gridTitle = WEB.browser.gridTitle;
  const sansWidths = FONTS.sans.widths || [];

  return (
    <div className={s.book}>
      <ChapterNav chapters={CHAPTERS} pdfHref={PDF_HREF} />

      <main className={s.main}>
        {/* 00 ─ PORTADA ───────────────────────────────────────────────── */}
        <Chapter c={C.portada}>
          <Sheet chapter={C.portada} bare tone="ink" className={s.cover}>
            <div className={s.coverTop}>
              <span>Brand Book</span>
              <span>Manual de identidad</span>
              <span>
                {EDITION.name} — {EDITION.year}
              </span>
            </div>
            <div className={s.coverLogo}>
              <Logo variant="wordmark" className={s.fit} title={brand.name} />
            </div>
            <div className={s.coverBottom}>
              <p className={s.coverMotto}>{COVER.motto}</p>
              <p className={s.coverMeta}>
                {COVER.meta.map((line, i) => (
                  <span key={line}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </Sheet>

          <Sheet chapter={C.portada} label="Índice" className={s.indexSheet}>
            <div className={s.indexLeft}>
              <span className={s.label}>Contenido</span>
              <h2 className={s.indexTitle}>Índice</h2>
              <p className={s.indexNote}>{brand.brandBook.indexNote}</p>
            </div>
            <ol className={s.indexList}>
              {CHAPTERS.slice(1).map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className={s.indexRow}>
                    <span className={s.indexNum}>{c.num}</span>
                    <span className={s.indexName}>{c.title}</span>
                    <span className={s.indexDesc}>{c.desc}</span>
                  </a>
                </li>
              ))}
            </ol>
          </Sheet>
        </Chapter>

        {/* 01 ─ MANIFIESTO ────────────────────────────────────────────── */}
        <Chapter c={C.manifiesto}>
          <Sheet chapter={C.manifiesto} className={s.manifesto}>
            <div className={s.manLeft}>
              <span className={s.chNum}>{C.manifiesto.num}</span>
              <h2 className={s.manQuote}>{MANIFESTO.quote}</h2>
              <p className={s.manSub}>{MANIFESTO.sub}</p>
            </div>
            <div className={s.manText}>
              <p className={s.manLead}>{MANIFESTO.lead}</p>
              <div className={s.manCols}>
                {MANIFESTO.paragraphs.map((t) => (
                  <p key={t}>{t}</p>
                ))}
                <p className={s.manSign}>{MANIFESTO.sign}</p>
              </div>
            </div>
          </Sheet>

          <Sheet chapter={C.manifiesto} label="Concepto" className={s.concept}>
            <div className={s.conceptHead}>
              <h3 className={s.h2}>{CONCEPT.title}</h3>
              <p className={s.lead}>{CONCEPT.lead}</p>
            </div>
            <p className={s.conceptStatement}>
              {CONCEPT.statement.map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
            <div className={s.pillars}>
              {CONCEPT.pillars.map((p, i) => (
                <div key={p.k} className={s.pillar}>
                  <span className={s.roman}>{ROMAN[i]}</span>
                  <h4 className={s.pillarTitle}>{p.k}</h4>
                  <p className={s.body}>{p.v}</p>
                </div>
              ))}
            </div>
            <ul className={s.attrs}>
              {CONCEPT.attributes.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </Sheet>
        </Chapter>

        {/* 02 ─ LOGOTIPO ──────────────────────────────────────────────── */}
        <Chapter c={C.logotipo}>
          <Sheet chapter={C.logotipo} label="Logotipo principal" className={s.logoHero}>
            <ChapterHead chapter={C.logotipo} title="Logotipo" lead={WORDMARK.intro} />
            <div className={s.logoHeroMark}>
              <Logo variant={WORDMARK.variant} className={s.fit} title={`${brand.name} — wordmark`} />
            </div>
            <dl className={s.notes3}>
              {WORDMARK.notes.map((n) => (
                <div key={n.k}>
                  <dt>{n.k}</dt>
                  <dd>{n.v}</dd>
                </div>
              ))}
            </dl>
          </Sheet>

          <Sheet chapter={C.logotipo} label="Construcción y área de respeto" className={wide ? s.stackCol : s.twoCol}>
            <div className={s.col}>
              <h3 className={s.h3}>Construcción</h3>
              <div className={s.constrStage}>
                <div className={s.constr} style={{ "--arn": ar, "--div": gridDiv, width: `${constrW}cqw` }}>
                  <Logo variant={WORDMARK.variant} className={s.fit} title="Construcción del logotipo" />
                  <span className={s.constrW}>{fmt(ar)} H</span>
                  <span className={s.constrH}>H</span>
                </div>
              </div>
              <p className={s.body}>{WORDMARK.construction}</p>
              <p className={s.micro}>
                Proporción {fmt(ar)} : 1 · módulo = H / {gridDiv}
              </p>
            </div>
            <div className={s.col}>
              <h3 className={s.h3}>Área de respeto</h3>
              <div className={s.clearStage}>
                <div className={s.clearZone} style={{ "--k": k, "--H": `${clearH}cqw` }}>
                  <div className={s.clearLogo}>
                    <Logo variant={WORDMARK.variant} className={s.clearSvg} title="Área de respeto" />
                  </div>
                  <span className={`${s.xMark} ${s.xTop}`}>x</span>
                  <span className={`${s.xMark} ${s.xBottom}`}>x</span>
                  <span className={`${s.xMark} ${s.xLeft}`}>x</span>
                  <span className={`${s.xMark} ${s.xRight}`}>x</span>
                </div>
              </div>
              <p className={s.body}>{WORDMARK.clearText}</p>
              <p className={s.micro}>
                {WORDMARK.clearLabel || "x"} ≈ {fmt(k, 2)} H
              </p>
            </div>
          </Sheet>

          <Sheet chapter={C.logotipo} label="Versiones y tamaños mínimos" className={s.versionsSheet}>
            <div>
              <h3 className={s.h3}>Versiones</h3>
              <div className={s.versions}>
                {WORDMARK.versions.map((v) => (
                  <figure key={v.k} className={s.version}>
                    <div
                      className={`${s.versionTile} ${v.border ? s.versionBorder : ""}`}
                      style={{ background: v.bg, color: v.fg }}
                    >
                      <div className={s.versionLogo}>
                        <Logo variant={WORDMARK.variant} className={s.fit} title={`Versión ${v.k}`} />
                      </div>
                    </div>
                    <figcaption className={s.caption}>
                      <strong>{v.k}</strong>
                      <span>{v.v}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <div className={s.minBlock}>
              <div>
                <h3 className={s.h3}>Tamaños mínimos</h3>
                <p className={s.small}>
                  {WORDMARK.minNote} Muestras a tamaño real: en pantalla al 100 % y en el PDF impreso sin escalar.
                </p>
              </div>
              <div className={s.minRow}>
                {WORDMARK.minSizes.map((m) => (
                  <div key={m.k} className={s.minItem}>
                    <div className={s.minSample}>
                      <Logo variant={WORDMARK.variant} style={{ width: m.css, height: "auto" }} title={`Mínimo ${m.k}`} />
                    </div>
                    <span className={s.minK}>{m.k}</span>
                    <span className={s.minV}>{m.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </Sheet>

          <Sheet chapter={C.logotipo} label="Usos incorrectos" className={s.misuseSheet}>
            <div className={s.misuseHead}>
              <h3 className={s.h3}>Usos incorrectos</h3>
              <p className={s.small}>
                El logotipo se usa siempre desde el archivo maestro. Estas son las alteraciones más frecuentes; ninguna
                está permitida, tampoco en piezas internas.
              </p>
            </div>
            <div className={s.misuseGrid}>
              {WORDMARK.misuse.map((m) => (
                <Misuse key={m.fx} m={m} />
              ))}
            </div>
          </Sheet>
        </Chapter>

        {/* 03 ─ SÍMBOLOS ──────────────────────────────────────────────── */}
        <Chapter c={C.simbolos}>
          <Sheet chapter={C.simbolos} className={s.symbolsSheet}>
            <ChapterHead chapter={C.simbolos} lead={brand.brandBook.symbolsLead} />
            <div className={s.symbolGrid} style={{ "--n": Math.max(symbols.length, 1) }}>
              {symbols.map((sym) => (
                <article key={sym.variant} className={s.symbol}>
                  <div className={s.symbolTile}>
                    <div className={s.symbolLogo}>
                      <Logo variant={sym.variant} className={s.fit} title={sym.name} />
                    </div>
                  </div>
                  <h3 className={s.symbolName}>{sym.name}</h3>
                  <p className={s.symbolAlias}>{sym.alias}</p>
                  <p className={s.small}>
                    <span className={s.inlineLabel}>Cuándo</span>
                    {sym.when}
                  </p>
                  <p className={s.small}>
                    <span className={s.inlineLabel}>Nunca</span>
                    {sym.never}
                  </p>
                  <p className={s.micro}>
                    Mínimo {sym.min} · {sym.variant}.svg
                  </p>
                </article>
              ))}
            </div>
          </Sheet>

          <Sheet chapter={C.simbolos} label="Jerarquía y uso" className={s.matrixSheet}>
            <div className={s.matrixMain}>
              <h3 className={s.h3}>Matriz de uso</h3>
              <table className={s.matrix}>
                <thead>
                  <tr>
                    <th scope="col">Pieza</th>
                    {USAGE_COLUMNS.map((c) => (
                      <th key={c} scope="col">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usageRows.map((r) => (
                    <tr key={r.variant}>
                      <th scope="row">
                        <span className={s.matrixLogo}>
                          <Logo variant={r.variant} className={s.fit} title={r.name} />
                        </span>
                        <span>{r.name}</span>
                      </th>
                      {USAGE[r.variant].map((v, i) => (
                        <td key={i} className={v === 2 ? s.cellMain : v === 1 ? s.cellOk : s.cellNo}>
                          {v === 2 ? "●" : v === 1 ? "○" : "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className={s.legend}>
                <span>● Soporte principal</span>
                <span>○ Permitido</span>
                <span>— No se usa</span>
              </p>
            </div>
            <aside className={s.rulesAside}>
              <h3 className={s.h3}>Reglas</h3>
              <ol className={s.numList}>
                {SYMBOL_RULES.map((r, i) => (
                  <li key={i}>
                    <span className={s.numListN}>{String(i + 1).padStart(2, "0")}</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ol>
            </aside>
          </Sheet>
        </Chapter>

        {/* 04 ─ COLOR ─────────────────────────────────────────────────── */}
        <Chapter c={C.color}>
          <Sheet chapter={C.color} className={s.colorSheet}>
            <ChapterHead chapter={C.color} lead={brand.brandBook.colorLead} />
            <div className={s.swatches}>
              {COLORS.map((c) => (
                <div key={c.name} className={s.swatch}>
                  <div
                    className={`${s.swatchChip} ${isLight(c.hex) ? s.swatchChipLight : ""}`}
                    style={{ background: `var(${c.token})` }}
                  />
                  <h3 className={s.swatchName}>{c.name}</h3>
                  <p className={s.swatchRole}>{c.role}</p>
                  <dl className={s.specs}>
                    <div>
                      <dt>HEX</dt>
                      <dd>{c.hex}</dd>
                    </div>
                    <div>
                      <dt>RGB</dt>
                      <dd>{c.rgb}</dd>
                    </div>
                    <div>
                      <dt>CMYK</dt>
                      <dd>{c.cmyk}</dd>
                    </div>
                    <div>
                      <dt>PMS</dt>
                      <dd>{c.pms}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </Sheet>

          <Sheet chapter={C.color} label="Proporciones y combinaciones" className={s.propSheet}>
            <div>
              <div className={s.propHead}>
                <h3 className={s.h3}>Proporción de uso</h3>
                <p className={s.small}>{brand.brandBook.proportionsText}</p>
              </div>
              <div className={s.propBar} role="img" aria-label="Proporción de color">
                {PROPORTIONS.map((p) => (
                  <span key={p.name} style={{ flexGrow: p.pct, background: `var(${p.token})` }} />
                ))}
              </div>
              <ul className={s.propLegend}>
                {PROPORTIONS.map((p) => (
                  <li key={p.name}>
                    <span className={s.propDot} style={{ background: `var(${p.token})` }} />
                    <span>{p.name}</span>
                    <b>{fmt(p.pct, p.pct % 1 ? 1 : 0)} %</b>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={s.h3}>Combinaciones aprobadas</h3>
              <div className={s.pairs}>
                {PAIRS.map((p) => {
                  const r = contrast(p.fg, p.bg);
                  return (
                    <div
                      key={p.fgN + p.bgN}
                      className={`${s.pair} ${isLight(p.bg) ? s.pairBorder : ""}`}
                      style={{ background: p.bg, color: p.fg }}
                    >
                      <span className={s.pairAa}>Aa</span>
                      <span className={s.pairNames}>
                        {p.fgN} sobre {p.bgN}
                      </span>
                      <span className={s.pairMeta}>
                        {fmt(r, 1)} : 1 · {grade(r)}
                      </span>
                      <span className={s.pairMeta}>{p.note}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Sheet>

          <Sheet chapter={C.color} label={`Paleta de producto — línea ${LINE.line}`} className={s.prodSheet}>
            <div className={s.prodHead}>
              <h3 className={s.h3}>Paleta de producto — línea {LINE.line}</h3>
              <p className={s.small}>{brand.brandBook.productPaletteText}</p>
            </div>
            <div className={s.prodGrid}>
              {productPalette.map((c) => (
                <div key={c.hex} className={s.prodSwatch}>
                  <div
                    className={`${s.prodChip} ${isLight(c.hex) ? s.swatchChipLight : ""}`}
                    style={{ background: c.hex }}
                  />
                  <h4 className={s.prodName}>{c.name}</h4>
                  <dl className={s.specs}>
                    <div>
                      <dt>HEX</dt>
                      <dd>{c.hex}</dd>
                    </div>
                    <div>
                      <dt>RGB</dt>
                      <dd>{c.rgb}</dd>
                    </div>
                  </dl>
                  <p className={s.prodUse}>{c.products.length ? c.products.join(" · ") : "—"}</p>
                </div>
              ))}
            </div>
          </Sheet>
        </Chapter>

        {/* 05 ─ TIPOGRAFÍA ────────────────────────────────────────────── */}
        <Chapter c={C.tipografia}>
          {FONTS.display && (
            <Sheet chapter={C.tipografia} label={FONTS.display.family} className={s.displaySheet}>
              <div className={s.typeLeft}>
                <ChapterHead chapter={C.tipografia} />
                <p className={s.bigAaDisplay} aria-hidden="true">
                  Aa
                </p>
              </div>
              <div className={s.typeRight}>
                <div>
                  <h3 className={s.fontNameDisplay}>{FONTS.display.family}</h3>
                  <p className={s.small}>
                    {FONTS.display.source} · {FONTS.display.axes}. {FONTS.display.role}
                  </p>
                </div>
                <p className={s.displaySample}>
                  {(TYPE.displaySample || [brand.tagline]).map((l, i) => (
                    <span key={l}>
                      {i > 0 && <br />}
                      {l}
                    </span>
                  ))}
                </p>
                <p className={s.glyphsDisplay}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnñopqrstuvwxyz
                  <br />
                  0123456789 &amp;
                </p>
              </div>
            </Sheet>
          )}

          <Sheet chapter={C.tipografia} label={FONTS.sans.family} className={s.typeSheet}>
            <div className={s.typeLeft}>
              {FONTS.display ? <span className={s.label}>Interfaz y cuerpo</span> : <ChapterHead chapter={C.tipografia} />}
              <p className={s.bigAa} aria-hidden="true">
                Aa
              </p>
            </div>
            <div className={s.typeRight}>
              <div>
                <h3 className={s.fontName}>{FONTS.sans.family}</h3>
                <p className={s.small}>
                  {FONTS.sans.source} · {FONTS.sans.axes}. {FONTS.sans.role}
                </p>
              </div>
              <div className={s.ramp}>
                {(sansWidths.length ? sansWidths : [100]).map((w) => {
                  const use = FONTS.sans.widthUse?.[w] ?? (w === 100 ? "Normal" : w === 125 ? "Expanded" : null);
                  return (
                    <div key={w} className={`${s.rampRow} ${use ? s.rampUse : ""}`}>
                      <span className={s.rampLabel}>wdth {String(w).replace(".", ",")}</span>
                      <span className={s.rampSample} style={{ fontStretch: `${w}%` }}>
                        {TYPE.rampSample}
                      </span>
                      <span className={s.rampTag}>{use || ""}</span>
                    </div>
                  );
                })}
              </div>
              <div className={s.weights}>
                {(FONTS.sans.weights || [300, 400, 500, 600, 700]).map((wt) => (
                  <span key={wt} style={{ fontWeight: wt }}>
                    <b>{wt}</b> {TYPE.weightSample}
                  </span>
                ))}
              </div>
              <p className={s.glyphs}>
                ABCDEFGHIJKLMNÑOPQRSTUVWXYZ
                <br />
                abcdefghijklmnñopqrstuvwxyz
                <br />
                0123456789 € &amp; @ ( ) « » — ·
              </p>
            </div>
          </Sheet>

          <Sheet chapter={C.tipografia} label={FONTS.serif.family} className={s.serifSheet}>
            <p className={s.serifBig}>
              <em>{TYPE.serifBig[0]}</em>
              <br />
              {TYPE.serifBig[1]}
            </p>
            <div className={s.serifSpec}>
              <div>
                <h3 className={s.fontNameSerif}>{FONTS.serif.family}</h3>
                <p className={s.small}>
                  {FONTS.serif.source} · {FONTS.serif.axes}. {FONTS.serif.role}
                </p>
              </div>
              <p className={s.glyphsSerif}>
                ABCDEFGHIJKLMNÑOPQRSTUVWXYZ
                <br />
                <em>abcdefghijklmnñopqrstuvwxyz</em>
                <br />
                0123456789 &amp;
              </p>
              <div className={s.pairing}>
                <p className={s.pairingQuote}>{TYPE.pairingQuote}</p>
                <p className={s.capsSmall}>{TYPE.pairingCaption}</p>
              </div>
            </div>
          </Sheet>

          <Sheet chapter={C.tipografia} label="Escala y reglas" className={s.scaleSheet}>
            <div className={s.scale}>
              <h3 className={s.h3}>Escala</h3>
              {TYPE_SCALE.map((t) => (
                <div key={t.k} className={s.scaleRow}>
                  <span className={s.scaleKey}>
                    {t.k}
                    <span>{t.web}</span>
                  </span>
                  <span className={`${s.scaleSample} ${s[t.cls] || ""}`}>{t.sample}</span>
                  <span className={s.scaleSpec}>{t.spec}</span>
                </div>
              ))}
            </div>
            <aside className={s.rulesAside}>
              <h3 className={s.h3}>Reglas</h3>
              <dl className={s.defList}>
                {TYPE_RULES.map((r) => (
                  <div key={r.k}>
                    <dt>{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </Sheet>
        </Chapter>

        {/* 06 ─ FOTOGRAFÍA ────────────────────────────────────────────── */}
        <Chapter c={C.fotografia}>
          <Sheet chapter={C.fotografia} label="La secuencia" className={s.photoSheet}>
            <div className={s.photoHead}>
              <ChapterHead chapter={C.fotografia} lead={PHOTO.lead} />
              <p className={s.photoCredit}>
                {[...new Set(SEQ_SHOTS.map((x) => x.product?.name))].join(" · ")}
              </p>
            </div>
            <div className={s.seq}>
              {SEQ_SHOTS.map((p, i) => (
                <figure key={`${p.product?.slug}-${p.k}`} className={s.seqItem}>
                  <div className={s.frame45}>
                    <SafeImage src={p.src} alt={`${p.product?.name} — ${p.t}`} label={`${p.k} · ${p.t}`} />
                  </div>
                  <figcaption className={s.caption}>
                    <span className={s.seqNum}>{p.k}</span>
                    <strong>{p.t}</strong>
                    <span>{PHOTO_SEQUENCE.length >= 4 || i < PHOTO_SEQUENCE.length ? p.v : p.product?.name}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Sheet>

          <Sheet chapter={C.fotografia} label="Casting y reglas" className={s.castSheet}>
            <div className={s.castMain}>
              <div className={s.castHead}>
                <h3 className={s.h3}>Casting fijo</h3>
                <p className={s.small}>{PHOTO.castingText}</p>
              </div>
              <div className={s.castGrid}>
                {casting.map((c) => (
                  <figure key={c.key} className={s.castItem}>
                    <div className={s.frame45}>
                      <SafeImage src={c.src} alt={`${c.name} — ${c.product?.name || ""}`} label={c.name} />
                    </div>
                    <figcaption className={s.caption}>
                      <strong>{c.name}</strong>
                      <span>{c.product?.name}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <aside className={s.rulesAside}>
              <h3 className={s.h3}>Reglas</h3>
              <dl className={s.defList}>
                {PHOTO_RULES.map((r) => (
                  <div key={r.k}>
                    <dt>{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
              <span className={s.label}>Nunca</span>
              <ul className={s.donts}>
                {PHOTO_DONTS.map((d) => (
                  <li key={d}>
                    <span className={s.cross} aria-hidden="true">×</span>
                    {d}
                  </li>
                ))}
              </ul>
            </aside>
          </Sheet>

          <Sheet chapter={C.fotografia} label={LINE.title} className={s.lineSheet}>
            <div className={s.lineText}>
              <h3 className={s.h3}>{LINE.title}</h3>
              <p className={s.lead}>{LINE.lead}</p>
              <dl className={s.defList}>
                {LINE.rules.map((r) => (
                  <div key={r.k}>
                    <dt>{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className={s.lineGrid}>
              {lineShots.map((p) => (
                <figure key={p.slug} className={s.castItem}>
                  <div className={s.frame45}>
                    <SafeImage src={p.colors?.[0]?.images?.[1]} alt={`${p.name} — con modelo`} label={p.name} />
                  </div>
                  <figcaption className={s.caption}>
                    <strong>{p.name}</strong>
                    <span>
                      {p.colors?.[0]?.name}
                      {p.fit ? ` · ${p.fit}` : ""}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Sheet>
        </Chapter>

        {/* 07 ─ TONO DE VOZ ───────────────────────────────────────────── */}
        <Chapter c={C.voz}>
          <Sheet chapter={C.voz} label="Principios" className={s.voiceSheet}>
            <ChapterHead chapter={C.voz} lead={VOICE.lead} />
            <div className={s.principles}>
              {VOICE_PRINCIPLES.map((p, i) => (
                <div key={p.k} className={s.principle}>
                  <span className={s.roman}>{ROMAN[i]}</span>
                  <h3 className={s.pillarTitle}>{p.k}</h3>
                  <p className={s.small}>{p.v}</p>
                </div>
              ))}
            </div>
            <div className={s.yesno}>
              <div className={s.yesnoHead}>
                <span className={s.yesTag}>Sí</span>
                <span className={s.noTag}>No</span>
              </div>
              {VOICE_YES_NO.map((r) => (
                <div key={r.yes} className={s.yesnoRow}>
                  <p className={s.yesText}>{r.yes}</p>
                  <p className={s.noText}>{r.no}</p>
                </div>
              ))}
            </div>
          </Sheet>

          <Sheet chapter={C.voz} label="Vocabulario y microcopy" className={s.vocabSheet}>
            <div className={s.vocab}>
              <h3 className={s.h3}>Vocabulario</h3>
              <div className={s.vocabCols}>
                <div>
                  <span className={s.label}>Decimos</span>
                  <ul className={s.vocabYes}>
                    {VOCAB.yes.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className={s.label}>No decimos</span>
                  <ul className={s.vocabNo}>
                    {VOCAB.no.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={s.french}>
                <p className={s.frenchWords}>{VOICE.expressions.join(" · ")}</p>
                <p className={s.small}>{VOICE.expressionsNote}</p>
              </div>
            </div>
            <div className={s.microcopy}>
              <h3 className={s.h3}>Microcopy</h3>
              <dl className={s.microList}>
                {MICROCOPY.map((m) => (
                  <div key={m.k}>
                    <dt>{m.k}</dt>
                    <dd>{m.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Sheet>
        </Chapter>

        {/* 08 ─ APLICACIONES ──────────────────────────────────────────── */}
        <Chapter c={C.aplicaciones}>
          <Sheet chapter={C.aplicaciones} label="Tienda" className={s.appHero}>
            <div className={s.appHeroText}>
              <ChapterHead chapter={C.aplicaciones} lead={APPLICATIONS.lead} />
              <dl className={s.defList}>
                {APPLICATIONS.specs.map((r) => (
                  <div key={r.k}>
                    <dt>{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            {MOCKUPS.length ? <MockFigure m={MOCKUPS[0]} className={s.appHeroImg} /> : <TypoApp a={TYPO_APPS[0]} className={s.appHeroImg} />}
          </Sheet>

          <Sheet chapter={C.aplicaciones} label="Etiquetado" className={s.appRow4}>
            <div className={s.appIntro}>
              <h3 className={s.h3}>{APPLICATIONS.labelling.title}</h3>
              <p className={s.small}>{APPLICATIONS.labelling.text}</p>
            </div>
            {MOCKUPS.length
              ? MOCKUPS.slice(1, 5).map((m) => <MockFigure key={m.file} m={m} />)
              : TYPO_APPS.slice(1, 5).map((a) => <TypoApp key={a.kind} a={a} />)}
          </Sheet>

          <Sheet chapter={C.aplicaciones} label="Packaging" className={s.appRow3}>
            <div className={s.appIntro}>
              <h3 className={s.h3}>{APPLICATIONS.packaging.title}</h3>
              <p className={s.small}>{APPLICATIONS.packaging.text}</p>
            </div>
            {MOCKUPS.length
              ? MOCKUPS.slice(5, 8).map((m, i) => (
                  <MockFigure key={m.file} m={m} ratio={i === 0 ? "8 / 5" : undefined} className={i === 0 ? s.appWide : ""} />
                ))
              : TYPO_APPS.slice(5, 8).map((a, i) => <TypoApp key={a.kind} a={a} ratio={i === 0 ? "8 / 5" : undefined} className={i === 0 ? s.appWide : ""} />)}
          </Sheet>
        </Chapter>

        {/* 09 ─ WEB / UI ──────────────────────────────────────────────── */}
        <Chapter c={C.web}>
          <Sheet chapter={C.web} label="Componentes" className={s.uiSheet}>
            <div className={s.uiLeft}>
              <ChapterHead chapter={C.web} lead={WEB.lead} />
              <div className={s.uiBlocks}>
                <div className={s.uiBlock}>
                  <span className={s.label}>Botones</span>
                  <div className={s.btnRow}>
                    <span className={s.btnPrimary}>{WEB.buttons.primary}</span>
                    <span className={s.btnSecondary}>{WEB.buttons.secondary}</span>
                    <span className={s.btnText}>{WEB.buttons.text}</span>
                    <span className={s.btnDisabled}>{WEB.buttons.disabled}</span>
                  </div>
                </div>
                <div className={s.uiBlock}>
                  <span className={s.label}>Talla</span>
                  <div className={s.sizeRow}>
                    {(HERO?.sizes || ["XS", "S", "M", "L", "XL", "XXL"]).map((z) => (
                      <span key={z} className={z === "M" ? s.sizeOn : s.size}>
                        {z}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={s.uiBlock}>
                  <span className={s.label}>Campo</span>
                  <div className={s.field}>
                    <span className={s.fieldInput}>{WEB.field.placeholder}</span>
                    <span className={s.btnPrimary}>{WEB.field.button}</span>
                  </div>
                  <p className={s.fieldHelp}>{WEB.field.help}</p>
                </div>
                <div className={s.uiBlock}>
                  <span className={s.label}>Reglas</span>
                  <ul className={s.uiRules}>
                    {WEB.rules.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className={s.uiCardCol}>
              <span className={s.label}>Ficha en la rejilla</span>
              <article className={s.card}>
                <div className={s.frame45}>
                  <SafeImage src={HERO_IMAGES[0]} alt={HERO?.name} label="Flat lay" />
                  {HERO?.badge ? <span className={s.badge}>{HERO.badge}</span> : null}
                </div>
                <div className={s.cardRow}>
                  <span>{HERO?.name}</span>
                  <span>{formatPrice(HERO?.price || 0)}</span>
                </div>
                <div className={s.cardSwatches}>
                  {(HERO?.colors || []).map((c) => (
                    <span key={c.slug} className={s.cardSwatch} style={{ background: c.hex }} title={c.name} />
                  ))}
                  <span className={s.cardColors}>{HERO?.colors?.length} colores</span>
                </div>
              </article>
              <p className={s.small}>{WEB.cardNote}</p>
            </div>
          </Sheet>

          <Sheet chapter={C.web} label="Retícula y tipo en pantalla" className={s.gridSheet}>
            <div className={s.browser}>
              <div className={s.browserBar}>
                <span />
                <span />
                <span />
              </div>
              <div className={s.announce}>{WEB.browser.announce}</div>
              <div className={s.hdr}>
                <span className={s.hdrNav}>{WEB.browser.nav}</span>
                <Logo variant="wordmark" className={s.hdrLogo} title={brand.name} />
                <span className={`${s.hdrNav} ${s.hdrRight}`}>{WEB.browser.navRight}</span>
              </div>
              <div className={s.pgWrap}>
                <h4 className={s.pgTitle}>{gridTitle}</h4>
                <div className={s.pg}>
                  {grid.map((p) => (
                    <div key={p.slug} className={s.pgItem}>
                      <div className={s.frame45}>
                        <SafeImage src={p.colors?.[0]?.images?.[0]} alt={p.name} label="Flat lay" />
                      </div>
                      <div className={s.pgRow}>
                        <span>{p.name}</span>
                        <span>{formatPrice(p.price)}</span>
                      </div>
                    </div>
                  ))}
                  <div className={s.colsOverlay} aria-hidden="true">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <span key={i} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={s.gridAside}>
              <h3 className={s.h3}>Retícula</h3>
              <dl className={s.defList}>
                {WEB.grid.map((r) => (
                  <div key={r.k}>
                    <dt>{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
              <h3 className={s.h3}>Tipo en pantalla</h3>
              <table className={s.uiType}>
                <tbody>
                  {UI_TYPE.map((r) => (
                    <tr key={r.k}>
                      <th scope="row">{r.k}</th>
                      <td>{r.v}</td>
                      <td>{r.s}</td>
                      <td>{r.t}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Sheet>
        </Chapter>

        {/* 10 ─ CONTACTO ──────────────────────────────────────────────── */}
        <Chapter c={C.contacto}>
          <Sheet chapter={C.contacto} tone="ink" label="Cierre" className={s.closing}>
            <ChapterHead chapter={C.contacto} />
            <div className={s.closeCenter}>
              <div className={s.closeEmblem}>
                <Logo variant="emblem" className={s.fit} title={`${brand.name} — emblema`} />
              </div>
              <p className={s.closeMotto}>
                <em>{CONTACT.motto[0]}.</em>
                <br />
                {CONTACT.motto[1]}.
              </p>
            </div>
            <dl className={s.closeCols}>
              {CONTACT.cols.map((c) => (
                <div key={c.k}>
                  <dt>{c.k}</dt>
                  <dd>{c.v}</dd>
                </div>
              ))}
              <div>
                <dt>Este documento</dt>
                <dd>
                  Brand Book · versión {EDITION.version} · {EDITION.date}. Versión viva en /brand
                  {PDF_HREF ? `; PDF en ${PDF_HREF}` : ""}.
                </dd>
              </div>
            </dl>
          </Sheet>
        </Chapter>
      </main>
    </div>
  );
}
