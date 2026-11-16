import PageIntro from "@/components/shop/PageIntro";
import Favorites from "@/components/shop/Favorites";
import brand from "@/config/brand";

export const metadata = {
  title: "Favoritos",
  description: brand.seo.favorites,
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
