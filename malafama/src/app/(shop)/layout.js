import ShopShell from "@/components/shop/ShopShell";
import brand from "@/config/brand";

export const metadata = {
  metadataBase: new URL(brand.siteUrl),
  openGraph: { siteName: brand.name, locale: brand.locale.ogLocale, type: "website" },
};

export default function ShopLayout({ children }) {
  return <ShopShell>{children}</ShopShell>;
}
