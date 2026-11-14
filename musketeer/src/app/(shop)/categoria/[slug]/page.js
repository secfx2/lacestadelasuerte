import { notFound } from "next/navigation";
import PageIntro from "@/components/shop/PageIntro";
import ShopCatalog from "@/components/shop/ShopCatalog";
import { categories, getCategory } from "@/lib/catalog";
import { CATEGORY_COPY } from "@/lib/shop";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: `${cat.name} MUSKETEER. ${CATEGORY_COPY[slug] || ""}`.trim(),
    alternates: { canonical: `/categoria/${slug}` },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  return (
    <>
      <PageIntro
        crumbs={[{ label: "Inicio", href: "/" }, { label: "Tienda", href: "/tienda" }, { label: cat.name }]}
        title={cat.name}
        aside={CATEGORY_COPY[slug]}
      />
      <ShopCatalog category={slug} />
    </>
  );
}
