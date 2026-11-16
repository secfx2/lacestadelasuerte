import { Archivo, Instrument_Serif } from "next/font/google";
import "./globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });

export const metadata = {
  title: { default: "Estudio", template: "%s · Estudio" },
  description: "Taller privado para crear marcas de ropa: nombres, logos, prendas y fotos de producto.",
  robots: { index: false, follow: false },
};

export const viewport = { themeColor: "#0b0b0b", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${archivo.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}
