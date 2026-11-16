/* ==========================================================================
   Fuentes de la marca ÓRBITA (Google Fonts vía next/font).
   next/font exige argumentos literales, así que este archivo se edita a mano
   cuando cambian las fuentes. Variables CSS:
     --font-brand-display → var(--font-display) en globals.css  (Syncopate: titulares)
     --font-brand-sans    → var(--font-sans)    en globals.css  (Space Grotesk: UI y cuerpo)
     --font-brand-serif   → var(--font-serif)   en globals.css  (Space Mono: acento / telemetría)
   El nombre «serif» se conserva de la plantilla: en ÓRBITA es la mono de acento.
   Describe las fuentes elegidas en brand.fonts (src/config/brand.js) para que
   el Brand Book las muestre bien.
   ========================================================================== */
import { Space_Grotesk, Space_Mono, Syncopate } from "next/font/google";

export const display = Syncopate({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-brand-display",
  display: "swap",
});

export const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-brand-sans",
  display: "swap",
});

export const serif = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-brand-serif",
  display: "swap",
});
