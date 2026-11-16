import PageIntro from "@/components/shop/PageIntro";
import CartPage from "@/components/shop/CartPage";
import brand from "@/config/brand";

export const metadata = {
  title: "Cesta",
  description: brand.seo.cart,
  robots: { index: false },
};

export default function CestaPage() {
  return (
    <>
      <PageIntro crumbs={[{ label: "Inicio", href: "/" }, { label: "Cesta" }]} title="Cesta" compact />
      <CartPage />
    </>
  );
}
