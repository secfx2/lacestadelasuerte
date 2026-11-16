import ShopShell from "@/components/shop/ShopShell";
import brand from "@/config/brand";
import { BASE_PATH } from "@/lib/asset";

export const metadata = {
  // Base path included so relative canonical / OG image URLs resolve under /<slug> in the hub export
  metadataBase: new URL(`${brand.siteUrl.replace(/\/+$/, "")}${BASE_PATH}`),
  openGraph: { siteName: brand.name, locale: brand.locale.ogLocale, type: "website" },
};

export default function ShopLayout({ children }) {
  return <ShopShell>{children}</ShopShell>;
}
