/* ==========================================================================
   Fuentes de la marca PECADO (Google Fonts vía next/font).
   next/font exige argumentos literales, así que este archivo se edita a mano
   cuando cambian las fuentes. Variables CSS:
     --font-brand-display → var(--font-display) en globals.css  (Grenze Gotisch: titulares)
     --font-brand-sans    → var(--font-sans)    en globals.css  (Archivo: UI y cuerpo)
     --font-brand-serif   → var(--font-serif)   en globals.css  (UnifrakturMaguntia: lemas)
   El nombre «serif» se conserva de la plantilla: en PECADO es la fraktur del
   logotipo. Describe las fuentes en brand.fonts (src/config/brand.js) para que
   el Brand Book las muestre bien.
   ========================================================================== */
import { Archivo, Grenze_Gotisch, UnifrakturMaguntia } from "next/font/google";

export const display = Grenze_Gotisch({
  subsets: ["latin"],
  variable: "--font-brand-display",
  display: "swap",
});

export const sans = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-brand-sans",
  display: "swap",
});

export const serif = UnifrakturMaguntia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-brand-serif",
  display: "swap",
});
