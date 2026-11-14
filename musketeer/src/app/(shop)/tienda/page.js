import PageIntro from "@/components/shop/PageIntro";
import ShopCatalog from "@/components/shop/ShopCatalog";

export const metadata = {
  title: "Tienda",
  description: "Todo el catálogo MUSKETEER: chaquetas, punto, sudaderas, camisetas, camisas, pantalones, accesorios y joyería de plata 925. Siempre disponible.",
  alternates: { canonical: "/tienda" },
};

export default function TiendaPage() {
  return (
    <>
      <PageIntro
        crumbs={[{ label: "Inicio", href: "/" }, { label: "Tienda" }]}
        title="Tienda"
        aside="Catálogo permanente. Sin drops, sin cuentas atrás: cada pieza está siempre disponible."
      />
      <ShopCatalog />
    </>
  );
}
