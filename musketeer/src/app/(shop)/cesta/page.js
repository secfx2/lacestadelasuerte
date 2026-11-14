import PageIntro from "@/components/shop/PageIntro";
import CartPage from "@/components/shop/CartPage";

export const metadata = {
  title: "Cesta",
  description: "Tu cesta MUSKETEER.",
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
