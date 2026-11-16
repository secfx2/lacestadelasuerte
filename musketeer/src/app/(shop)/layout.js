import ShopShell from "@/components/shop/ShopShell";
import { BASE_PATH } from "@/lib/asset";

export const metadata = {
  // Base path included so relative canonical / OG image URLs resolve under /<slug> in the hub export
  metadataBase: new URL(`${(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3100").replace(/\/+$/, "")}${BASE_PATH}`),
  openGraph: { siteName: "MUSKETEER", locale: "es_ES", type: "website" },
};

export default function ShopLayout({ children }) {
  return <ShopShell>{children}</ShopShell>;
}
