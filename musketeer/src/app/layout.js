import { Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata = {
  title: { default: "MUSKETEER — Tous pour un", template: "%s — MUSKETEER" },
  description:
    "MUSKETEER. Ropa unisex de corte boxy, color, punto, chaquetas, accesorios y joyería de plata 925. Catálogo permanente, sin drops.",
  icons: { icon: "/brand/emblem-black.svg" },
};

export const viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${archivo.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}
