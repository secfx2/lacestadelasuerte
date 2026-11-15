import brand from "@/config/brand";
import { display, sans, serif } from "@/config/fonts";
import "./globals.css";

export const metadata = {
  title: { default: brand.seo.title, template: brand.seo.titleTemplate },
  description: brand.seo.description,
  icons: { icon: "/brand/emblem-black.svg" },
};

export const viewport = { themeColor: brand.themeColor };

/** Palette tokens from src/config/brand.js → CSS custom properties on <html> (override globals.css defaults). */
const paletteVars = {
  ...Object.fromEntries(Object.entries(brand.palette).map(([token, c]) => [`--${token}`, c.hex])),
  "--tile": brand.tile,
};

export default function RootLayout({ children }) {
  return (
    <html lang={brand.locale.lang} className={`${display.variable} ${sans.variable} ${serif.variable}`} style={paletteVars}>
      <body>{children}</body>
    </html>
  );
}
