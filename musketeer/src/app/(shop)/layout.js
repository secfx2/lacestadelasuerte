import ShopShell from "@/components/shop/ShopShell";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3100"),
  openGraph: { siteName: "MUSKETEER", locale: "es_ES", type: "website" },
};

export default function ShopLayout({ children }) {
  return <ShopShell>{children}</ShopShell>;
}
