/* Fuentes de las 4 marcas para la vista previa (next/font exige literales).
   Archivo e Instrument Serif ya se cargan en el layout raíz. */
import { Grenze_Gotisch, Pinyon_Script, Space_Grotesk, Space_Mono, Syncopate, UnifrakturMaguntia } from "next/font/google";

const syncopate = Syncopate({ subsets: ["latin"], weight: ["400", "700"], variable: "--bf-syncopate", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--bf-space-grotesk", display: "swap" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--bf-space-mono", display: "swap" });
const unifraktur = UnifrakturMaguntia({ subsets: ["latin"], weight: "400", variable: "--bf-unifraktur", display: "swap" });
const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", variable: "--bf-pinyon", display: "swap" });
const grenze = Grenze_Gotisch({ subsets: ["latin"], variable: "--bf-grenze", display: "swap" });

export const brandFontClasses = [syncopate, spaceGrotesk, spaceMono, unifraktur, pinyon, grenze].map((f) => f.variable).join(" ");

export const FONT_STACK = {
  archivo: 'var(--font-archivo), "Helvetica Neue", Arial, sans-serif',
  instrument: 'var(--font-instrument), "Times New Roman", serif',
  syncopate: 'var(--bf-syncopate), var(--bf-space-grotesk), Arial, sans-serif',
  spaceGrotesk: 'var(--bf-space-grotesk), "Helvetica Neue", Arial, sans-serif',
  spaceMono: 'var(--bf-space-mono), "Courier New", monospace',
  unifraktur: 'var(--bf-unifraktur), "Old English Text MT", serif',
  pinyon: 'var(--bf-pinyon), "Snell Roundhand", cursive',
  grenze: 'var(--bf-grenze), "Times New Roman", serif',
};
