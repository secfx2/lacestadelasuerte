/* ==========================================================================
   Fuentes de la marca (Google Fonts vía next/font).
   next/font exige argumentos literales, así que este archivo se edita a mano
   cuando cambian las fuentes. Mantén los nombres de variable CSS:
     --font-brand-sans  → var(--font-sans)  en globals.css
     --font-brand-serif → var(--font-serif) en globals.css
   Describe las fuentes elegidas en brand.fonts (src/config/brand.js) para que
   el Brand Book las muestre bien.

   Para cambiar: importa otra familia de "next/font/google" (p. ej. Inter,
   Space_Grotesk, Playfair_Display) y sustituye las llamadas. Si la sans nueva
   no tiene eje de anchura, quita `axes: ["wdth"]` y deja brand.fonts.sans.widths = [].
   ========================================================================== */
import { Archivo, Instrument_Serif } from "next/font/google";

export const sans = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-brand-sans",
  display: "swap",
});

export const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-brand-serif",
  display: "swap",
});
