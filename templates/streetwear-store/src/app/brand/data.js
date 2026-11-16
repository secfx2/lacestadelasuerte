/* ==========================================================================
   Brand Book content — derived from src/config/brand.js (brand.brandBook,
   brand.palette, brand.fonts…). Do not write brand copy here: edit the config.
   Logos are always drawn with <Logo variant=…/> (src/components/brand/Logo.js
   ← public/brand/*.svg via scripts/build-logo-data.mjs); a variant listed in
   the config that no longer exists in logoData is skipped automatically.
   ========================================================================== */
import brand from "@/config/brand";

const B = brand.brandBook;
const P = brand.palette;

export const EDITION = B.edition;
export const CHAPTERS = B.chapters;

/* 02 · Logotipo principal */
export const WORDMARK = { name: brand.name, ...B.wordmark };

/* 03 · Sistema de símbolos */
export const SYMBOLS = B.symbols;
export const USAGE_COLUMNS = B.usageColumns;
export const USAGE = B.usage;
export const SYMBOL_RULES = B.symbolRules;

/* 04 · Color */
const hexRgb = (hex) => [0, 2, 4].map((i) => parseInt(hex.replace("#", "").slice(i, i + 2), 16)).join(" · ");
export const COLORS = Object.entries(P).map(([token, c]) => ({
  name: c.name,
  token: `--${token}`,
  hex: c.hex.toUpperCase(),
  rgb: hexRgb(c.hex),
  cmyk: c.cmyk || "—",
  pms: c.pms || "—",
  role: c.role || "",
}));
export const PROPORTIONS = Object.entries(brand.paletteProportions || {})
  .filter(([token]) => P[token])
  .map(([token, pct]) => ({ name: P[token].name, token: `--${token}`, pct }));
export const PAIRS = (brand.palettePairs || [])
  .filter((p) => P[p.fg] && P[p.bg])
  .map((p) => ({ fg: P[p.fg].hex.toUpperCase(), bg: P[p.bg].hex.toUpperCase(), fgN: P[p.fg].name, bgN: P[p.bg].name, note: p.note }));
export const PRODUCT_PALETTE = brand.productPalette || [];

/* 05 · Tipografía */
export const FONTS = brand.fonts;
export const TYPE = B.type;
export const TYPE_SCALE = B.type.scale;
export const TYPE_RULES = B.type.rules;
export const UI_TYPE = B.type.uiType;

/* 06 · Fotografía */
export const PHOTO = B.photo;
export const PHOTO_SEQUENCE = B.photo.sequence;
export const PHOTO_RULES = B.photo.rules;
export const PHOTO_DONTS = B.photo.donts;
export const LINE = { line: brand.currentLine, ...B.photo.line };

/* 07 · Tono de voz */
export const VOICE = B.voice;
export const VOICE_PRINCIPLES = B.voice.principles;
export const VOICE_YES_NO = B.voice.yesNo;
export const VOCAB = B.voice.vocab;
export const MICROCOPY = B.voice.microcopy;

/* 08 · Aplicaciones — mockups in /public/brand/mockups/<file>.jpg */
export const APPLICATIONS = B.applications;
export const MOCKUPS = B.applications.mockups;

/* 09 · Web / UI · 10 · Contacto */
export const WEB = B.web;
export const CONTACT = B.contact;

export const MANIFESTO = B.manifesto;
export const CONCEPT = B.concept;
export const COVER = B.cover;
