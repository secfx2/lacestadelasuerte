import PageIntro from "@/components/shop/PageIntro";
import Favorites from "@/components/shop/Favorites";

export const metadata = {
  title: "Favoritos",
  description: "Tus piezas guardadas en MUSKETEER.",
  robots: { index: false },
};

export default function FavoritosPage() {
  return (
    <>
      <PageIntro crumbs={[{ label: "Inicio", href: "/" }, { label: "Favoritos" }]} title="Favoritos" compact />
      <Favorites />
    </>
  );
}
