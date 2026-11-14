import fs from "node:fs";
import path from "node:path";
import Logo from "@/components/brand/Logo";
import LOGOS from "@/components/brand/logoData";
import catalog from "@/data/catalog.json";
import ChapterNav from "./components/ChapterNav";
import SafeImage from "./components/SafeImage";
import Sheet, { ChapterHead } from "./components/Sheet";
import s from "./brand.module.css";
import {
  CHAPTERS, EDITION, WORDMARK, SYMBOLS, USAGE, USAGE_COLUMNS, SYMBOL_RULES,
  COLORS, PROPORTIONS, PAIRS, TYPE_SCALE, TYPE_RULES, PHOTO_SEQUENCE, PHOTO_RULES,
  PHOTO_DONTS, CASTING, VOICE_PRINCIPLES, VOICE_YES_NO, VOCAB, MICROCOPY, MOCKUPS, UI_TYPE,
} from "./data";

export const metadata = {
  title: "Brand Book",
  description:
    "Manual de identidad de MUSKETEER: logotipo, sistema de símbolos, color, tipografía, fotografía, tono de voz, aplicaciones y web.",
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
const grade = (r) => (r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA grande" : "Decorativo");

/* ---------- data from the catalog ----------------------------------------- */
const PRODUCTS = catalog.products || [];
const HERO = PRODUCTS.find((p) => p.slug === "tous-pour-un-hoodie") || PRODUCTS[0];
const HERO_IMAGES = HERO?.colors?.[0]?.images || [];

function castingShots() {
  return CASTING.map((m) => {
    const theirs = PRODUCTS.filter((p) => p.model === m.key);
    const ready = theirs.find((p) => publicFileExists(p.colors?.[0]?.images?.[1]));
    const p = ready || theirs[0];
    return { ...m, product: p, src: p?.colors?.[0]?.images?.[1] };
  });
}

function gridProducts(n = 4) {
  const pool = PRODUCTS.filter((p) => p.slug !== HERO?.slug);
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

function Misuse({ m }) {
  return (
    <figure className={s.misuse}>
      <div className={`${s.misuseTile} ${s[`fx_${m.fx}`] || ""}`}>
        {m.fx === "retype" ? (
          <span className={s.retype}>Musketeer</span>
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
  const clearH = Math.min(6.5, 34 / (ar + 2 * k)); // cqw — fits half a sheet whatever the logo's proportions
  const constrW = Math.min(44, 17 * ar); // cqw
  const casting = castingShots();
  const grid = gridProducts(4);

  return (
    <div className={s.book}>
      <ChapterNav chapters={CHAPTERS} pdfHref="/brand/musketeer-brandbook.pdf" />

      <main className={s.main}>
        {/* 00 ─ PORTADA ───────────────────────────────────────────────── */}
        <Chapter c={C.portada}>
          <Sheet chapter={C.portada} bare className={s.cover}>
            <div className={s.coverTop}>
              <span>Brand Book</span>
              <span>Manual de identidad</span>
              <span>
                {EDITION.name} — {EDITION.year}
              </span>
            </div>
            <div className={s.coverLogo}>
              <Logo variant="wordmark" className={s.fit} title="Musketeer" />
            </div>
            <div className={s.coverBottom}>
              <p className={s.coverMotto}>Tous pour un.</p>
              <p className={s.coverMeta}>
                Ropa unisex de lujo callejero.
                <br />
                Catálogo permanente, sin drops.
                <br />
                Plata 925.
              </p>
            </div>
          </Sheet>

          <Sheet chapter={C.portada} label="Índice" className={s.indexSheet}>
            <div className={s.indexLeft}>
              <span className={s.label}>Contenido</span>
              <h2 className={s.indexTitle}>Índice</h2>
              <p className={s.indexNote}>
                Este manual fija las reglas de la identidad de MUSKETEER. Es la referencia para quien diseñe,
                fotografíe, escriba o produzca en nombre de la casa. Ante la duda, menos.
              </p>
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
              <h2 className={s.manQuote}>Tous pour un.</h2>
              <p className={s.manSub}>Un pour tous.</p>
            </div>
            <div className={s.manText}>
              <p className={s.manLead}>
                Hubo un tiempo en que bastaba con un juramento. Cuatro espadas, una capa azul con su cruz y una
                palabra dada. No necesitaban anunciarse: se les reconocía por cómo estaban de pie.
              </p>
              <div className={s.manCols}>
                <p>
                  MUSKETEER nace de ese código —hermandad, lealtad, oficio— y lo traduce a la ropa de calle de hoy:
                  cortes amplios, tejidos pesados, lavados que parecen vividos y plata que se hereda.
                </p>
                <p>
                  No hacemos drops. No fabricamos urgencia. Construimos un catálogo que permanece: prendas que podrás
                  volver a comprar dentro de diez años, porque seguirán aquí.
                </p>
                <p>Unisex, porque la hermandad no pregunta. Silenciosa, porque no hace falta gritar.</p>
                <p className={s.manSign}>— En garde.</p>
              </div>
            </div>
          </Sheet>

          <Sheet chapter={C.manifiesto} label="Concepto" className={s.concept}>
            <div className={s.conceptHead}>
              <h3 className={s.h2}>Cuatro principios</h3>
              <p className={s.lead}>
                Todo lo que hace MUSKETEER —una sudadera, una etiqueta, una frase— debe poder explicarse con uno de
                ellos.
              </p>
            </div>
            <div className={s.pillars}>
              {[
                { k: "Hermandad", v: "Unisex en casi todo. Un casting fijo, una misma familia. La marca es un nosotros." },
                { k: "Oficio", v: "Felpas de 500 g/m², denim pesado, plata 925. El valor está en el material y en el acabado." },
                { k: "Permanencia", v: "Catálogo, no drops. Cada pieza sigue disponible, organizada por categorías, temporada tras temporada." },
                { k: "Silencio", v: "Fondo blanco, mucho aire, ninguna estridencia. La seguridad no levanta la voz." },
              ].map((p, i) => (
                <div key={p.k} className={s.pillar}>
                  <span className={s.roman}>{ROMAN[i]}</span>
                  <h4 className={s.pillarTitle}>{p.k}</h4>
                  <p className={s.body}>{p.v}</p>
                </div>
              ))}
            </div>
            <ul className={s.attrs}>
              {["Unisex", "Boxy", "Baggy", "Oversize", "Gramajes pesados", "Lavados vintage", "Plata 925"].map((a) => (
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
              <Logo variant={WORDMARK.variant} className={s.fit} title="Musketeer — wordmark" />
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

          <Sheet chapter={C.logotipo} label="Construcción y área de respeto" className={s.twoCol}>
            <div className={s.col}>
              <h3 className={s.h3}>Construcción</h3>
              <div className={s.constrStage}>
                <div className={s.constr} style={{ "--arn": ar, width: `${constrW}cqw` }}>
                  <Logo variant={WORDMARK.variant} className={s.fit} title="Construcción del logotipo" />
                  <span className={s.constrW}>{fmt(ar)} H</span>
                  <span className={s.constrH}>H</span>
                </div>
              </div>
              <p className={s.body}>{WORDMARK.construction}</p>
              <p className={s.micro}>
                Proporción {fmt(ar)} : 1 · módulo = H / 8
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
              <p className={s.micro}>x = {fmt(k, 2)} H</p>
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
                  Por debajo de estas medidas el dibujo pierde detalle. Muestras a tamaño real: en pantalla al 100 % y
                  en el PDF impreso sin escalar.
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
            <ChapterHead
              chapter={C.simbolos}
              lead="Junto al wordmark viven otras piezas. Cada una tiene su territorio y no lo abandona."
            />
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
            <ChapterHead
              chapter={C.color}
              lead="Una paleta corta y casi monocroma. El blanco y el negro sostienen la marca; el Azul Tabardo la firma; el Lacre aparece solo cuando hay algo que avisar."
            />
            <div className={s.swatches}>
              {COLORS.map((c) => (
                <div key={c.name} className={s.swatch}>
                  <div
                    className={`${s.swatchChip} ${c.hex === "#FFFFFF" ? s.swatchChipLight : ""}`}
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
                <p className={s.small}>
                  Papel y Tinta dominan cualquier pieza. El Tabardo es un acento: un detalle, nunca un fondo general. El
                  Lacre es raro: rebajas, avisos y errores.
                </p>
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
                      className={`${s.pair} ${p.bg === "#FFFFFF" ? s.pairBorder : ""}`}
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
        </Chapter>

        {/* 05 ─ TIPOGRAFÍA ────────────────────────────────────────────── */}
        <Chapter c={C.tipografia}>
          <Sheet chapter={C.tipografia} label="Archivo" className={s.typeSheet}>
            <div className={s.typeLeft}>
              <ChapterHead chapter={C.tipografia} />
              <p className={s.bigAa} aria-hidden="true">
                Aa
              </p>
            </div>
            <div className={s.typeRight}>
              <div>
                <h3 className={s.fontName}>Archivo</h3>
                <p className={s.small}>
                  Omnibus-Type · Google Fonts · variable: peso 100–900, anchura 62–125. La voz funcional: interfaz,
                  navegación, precios y cuerpo de texto. Dos anchuras en uso: normal y expanded.
                </p>
              </div>
              <div className={s.ramp}>
                {[62.5, 75, 87.5, 100, 112.5, 125].map((w) => {
                  const use = w === 100 ? "Normal" : w === 125 ? "Expanded" : null;
                  return (
                    <div key={w} className={`${s.rampRow} ${use ? s.rampUse : ""}`}>
                      <span className={s.rampLabel}>wdth {String(w).replace(".", ",")}</span>
                      <span className={s.rampSample} style={{ fontStretch: `${w}%` }}>
                        Tous pour un
                      </span>
                      <span className={s.rampTag}>{use || ""}</span>
                    </div>
                  );
                })}
              </div>
              <div className={s.weights}>
                {[300, 400, 500, 600, 700].map((wt) => (
                  <span key={wt} style={{ fontWeight: wt }}>
                    <b>{wt}</b> Estoque
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

          <Sheet chapter={C.tipografia} label="Instrument Serif" className={s.serifSheet}>
            <p className={s.serifBig}>
              <em>Tous pour un,</em>
              <br />
              un pour tous.
            </p>
            <div className={s.serifSpec}>
              <div>
                <h3 className={s.fontNameSerif}>Instrument Serif</h3>
                <p className={s.small}>
                  Instrument · Google Fonts · regular e itálica. La voz literaria: el lema, las citas y los acentos
                  editoriales. Siempre en tamaños generosos; nunca en interfaz funcional ni en cuerpo largo.
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
                <p className={s.pairingQuote}>«Se les reconocía por cómo estaban de pie.»</p>
                <p className={s.capsSmall}>Manifiesto · 01</p>
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
              <ChapterHead
                chapter={C.fotografia}
                lead="La fotografía de producto es la tienda. Cuatro imágenes por prenda, siempre en el mismo orden, siempre sobre blanco."
              />
              <p className={s.photoCredit}>
                {HERO?.name} · {HERO?.colors?.[0]?.name}
              </p>
            </div>
            <div className={s.seq}>
              {PHOTO_SEQUENCE.map((p, i) => (
                <figure key={p.k} className={s.seqItem}>
                  <div className={s.frame45}>
                    <SafeImage
                      src={HERO_IMAGES[i]}
                      alt={`${HERO?.name} — ${p.t}`}
                      label={`${p.k} · ${p.t}`}
                    />
                  </div>
                  <figcaption className={s.caption}>
                    <span className={s.seqNum}>{p.k}</span>
                    <strong>{p.t}</strong>
                    <span>{p.v}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Sheet>

          <Sheet chapter={C.fotografia} label="Casting y reglas" className={s.castSheet}>
            <div className={s.castMain}>
              <div className={s.castHead}>
                <h3 className={s.h3}>Casting fijo</h3>
                <p className={s.small}>
                  Cuatro modelos para todo el catálogo. La repetición construye familia: el cliente reconoce las caras
                  como reconoce el logotipo.
                </p>
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
        </Chapter>

        {/* 07 ─ TONO DE VOZ ───────────────────────────────────────────── */}
        <Chapter c={C.voz}>
          <Sheet chapter={C.voz} label="Principios" className={s.voiceSheet}>
            <ChapterHead
              chapter={C.voz}
              lead="Escribimos como vestimos: pocas piezas, bien elegidas. Español sobrio, ligeramente literario, con algún guiño en francés."
            />
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
                <p className={s.frenchWords}>Tous pour un · Un pour tous · En garde · Touché</p>
                <p className={s.small}>El francés es un guiño: una expresión por pieza, nunca una frase entera.</p>
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
              <ChapterHead
                chapter={C.aplicaciones}
                lead="El sistema en el mundo físico. Materiales nobles, acabados mate, ningún brillo innecesario: la marca se toca antes de leerse."
              />
              <dl className={s.defList}>
                <div>
                  <dt>Materiales</dt>
                  <dd>Papel de algodón, cartón rígido soft-touch, damasco tejido, ante.</dd>
                </div>
                <div>
                  <dt>Acabados</dt>
                  <dd>Impresión mate, stamping en plata o blanco. Nunca oro, nunca brillo.</dd>
                </div>
                <div>
                  <dt>Color</dt>
                  <dd>Negro y blanco. Azul Tabardo solo en piezas especiales.</dd>
                </div>
              </dl>
            </div>
            <MockFigure m={MOCKUPS[0]} className={s.appHeroImg} />
          </Sheet>

          <Sheet chapter={C.aplicaciones} label="Etiquetado" className={s.appRow4}>
            <div className={s.appIntro}>
              <h3 className={s.h3}>Etiquetado y bolsa</h3>
              <p className={s.small}>
                Lo primero que se toca. El wordmark firma la etiqueta tejida, la colgante y la bolsa; el emblema se
                reserva para el bordado. Siempre en una sola tinta.
              </p>
            </div>
            {MOCKUPS.slice(1, 5).map((m) => (
              <MockFigure key={m.file} m={m} />
            ))}
          </Sheet>

          <Sheet chapter={C.aplicaciones} label="Packaging" className={s.appRow3}>
            <div className={s.appIntro}>
              <h3 className={s.h3}>Packaging y joyería</h3>
              <p className={s.small}>
                Caja rígida negra, papel de seda blanco y el sello como cierre. La joyería viaja en estuche negro y en
                bolsa de ante Azul Tabardo: el único lugar donde el acento ocupa toda la superficie.
              </p>
            </div>
            {MOCKUPS.slice(5, 8).map((m, i) => (
              <MockFigure key={m.file} m={m} ratio={i === 0 ? "45.8 / 27.6" : undefined} className={i === 0 ? s.appWide : ""} />
            ))}
          </Sheet>
        </Chapter>

        {/* 09 ─ WEB / UI ──────────────────────────────────────────────── */}
        <Chapter c={C.web}>
          <Sheet chapter={C.web} label="Componentes" className={s.uiSheet}>
            <div className={s.uiLeft}>
              <ChapterHead
                chapter={C.web}
                lead="La web es un catálogo: fondo blanco, retícula estricta, esquinas rectas. La interfaz se retira para que hable la prenda."
              />
              <div className={s.uiBlocks}>
                <div className={s.uiBlock}>
                  <span className={s.label}>Botones</span>
                  <div className={s.btnRow}>
                    <span className={s.btnPrimary}>Añadir a la cesta</span>
                    <span className={s.btnSecondary}>Guía de tallas</span>
                    <span className={s.btnText}>Ver el catálogo</span>
                    <span className={s.btnDisabled}>Agotado</span>
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
                    <span className={s.fieldInput}>Correo electrónico</span>
                    <span className={s.btnPrimary}>Unirme</span>
                  </div>
                  <p className={s.fieldHelp}>Únete a las filas. Una carta al mes, nunca más.</p>
                </div>
                <div className={s.uiBlock}>
                  <span className={s.label}>Reglas</span>
                  <ul className={s.uiRules}>
                    <li>Radio 0. Sin sombras. Líneas de 1 px.</li>
                    <li>Hover: subrayado o inversión Tinta / Papel. Sin animación decorativa.</li>
                    <li>Foco siempre visible: contorno de 1 px en Tinta.</li>
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
                  <span>{HERO?.price} €</span>
                </div>
                <div className={s.cardSwatches}>
                  {(HERO?.colors || []).map((c) => (
                    <span key={c.slug} className={s.cardSwatch} style={{ background: c.hex }} title={c.name} />
                  ))}
                  <span className={s.cardColors}>{HERO?.colors?.length} colores</span>
                </div>
              </article>
              <p className={s.small}>Hover: la imagen pasa del flat lay a la foto con modelo.</p>
            </div>
          </Sheet>

          <Sheet chapter={C.web} label="Retícula y tipo en pantalla" className={s.gridSheet}>
            <div className={s.browser}>
              <div className={s.browserBar}>
                <span />
                <span />
                <span />
              </div>
              <div className={s.announce}>Catálogo permanente · Sin drops · Tous pour un</div>
              <div className={s.hdr}>
                <span className={s.hdrNav}>Catálogo · Sudaderas · Chaquetas · Joyería</span>
                <Logo variant="wordmark" className={s.hdrLogo} title="Musketeer" />
                <span className={`${s.hdrNav} ${s.hdrRight}`}>Buscar · Cuenta · Cesta (0)</span>
              </div>
              <div className={s.pgWrap}>
                <h4 className={s.pgTitle}>Sudaderas</h4>
                <div className={s.pg}>
                  {grid.map((p) => (
                    <div key={p.slug} className={s.pgItem}>
                      <div className={s.frame45}>
                        <SafeImage src={p.colors?.[0]?.images?.[0]} alt={p.name} label="Flat lay" />
                      </div>
                      <div className={s.pgRow}>
                        <span>{p.name}</span>
                        <span>{p.price} €</span>
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
                <div>
                  <dt>Escritorio</dt>
                  <dd>12 columnas · medianil y margen 24 px</dd>
                </div>
                <div>
                  <dt>Móvil</dt>
                  <dd>4 columnas · medianil y margen 12 px</dd>
                </div>
                <div>
                  <dt>Producto</dt>
                  <dd>4 por fila en escritorio, 2 en móvil · imagen 4:5</dd>
                </div>
                <div>
                  <dt>Cabecera</dt>
                  <dd>56 px, más barra de aviso de 30 px</dd>
                </div>
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
                <Logo variant="emblem" className={s.fit} title="Musketeer — emblema" />
              </div>
              <p className={s.closeMotto}>
                <em>Tous pour un.</em>
                <br />
                Un pour tous.
              </p>
            </div>
            <dl className={s.closeCols}>
              <div>
                <dt>Equipo de marca</dt>
                <dd>
                  Cualquier uso no previsto en este manual se consulta antes de producir. Ninguna pieza se imprime sin
                  prueba de color aprobada.
                </dd>
              </div>
              <div>
                <dt>Archivos maestros</dt>
                <dd>/public/brand — wordmark, emblem, monogram, gothic y seal, en negro, blanco y currentColor.</dd>
              </div>
              <div>
                <dt>Este documento</dt>
                <dd>
                  Brand Book · versión {EDITION.version} · {EDITION.date}. Versión viva en /brand; PDF en
                  /brand/musketeer-brandbook.pdf.
                </dd>
              </div>
            </dl>
          </Sheet>
        </Chapter>
      </main>
    </div>
  );
}
