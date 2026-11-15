/* ==========================================================================
   Fuentes de MALA FAMA (Google Fonts vía next/font).
   next/font exige argumentos literales, así que este archivo se edita a mano
   cuando cambian las fuentes. Variables CSS:
     --font-brand-display → var(--font-display) en globals.css  (UnifrakturMaguntia: titulares gótica)
     --font-brand-sans    → var(--font-sans)    en globals.css  (Archivo: UI, cuerpo y titulares condensados)
     --font-brand-serif   → var(--font-serif)   en globals.css  (Pinyon Script: lema y acentos caligráficos)
   El nombre «serif» se conserva de la plantilla: en MALA FAMA es la caligráfica.
   Los logotipos (public/brand) se dibujan con estas mismas familias desde
   brand-source/fonts/ (scripts/placeholder-logos.py), pero en la web son SVG.
   Describe las fuentes en brand.fonts (src/config/brand.js) para el Brand Book.
   ========================================================================== */
import { Archivo, Pinyon_Script, UnifrakturMaguntia } from "next/font/google";

export const display = UnifrakturMaguntia({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-brand-display",
  display: "swap",
});

export const sans = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-brand-sans",
  display: "swap",
});

export const serif = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-brand-serif",
  display: "swap",
});
