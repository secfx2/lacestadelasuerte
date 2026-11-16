import PageIntro from "@/components/shop/PageIntro";
import ShopCatalog from "@/components/shop/ShopCatalog";
import brand from "@/config/brand";

export const metadata = {
  title: brand.shopPage.title,
  description: brand.seo.shop,
  alternates: { canonical: "/tienda" },
};

export default function TiendaPage() {
  return (
    <>
      <PageIntro crumbs={[{ label: "Inicio", href: "/" }, { label: brand.shopPage.title }]} title={brand.shopPage.title} aside={brand.shopPage.aside} />
      <ShopCatalog />
    </>
  );
}
