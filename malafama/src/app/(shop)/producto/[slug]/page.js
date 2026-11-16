import { notFound } from "next/navigation";
import ProductDetail from "@/components/shop/ProductDetail";
import ProductCard from "@/components/shop/ProductCard";
import SectionHead from "@/components/shop/SectionHead";
import { products } from "@/lib/catalog";
import { getSlimProduct, relatedProducts } from "@/lib/shop-server";
import { categoryName } from "@/lib/shop";
import brand from "@/config/brand";
import { asset } from "@/lib/asset";
import styles from "./page.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getSlimProduct(slug);
  if (!p) return {};
  const description = p.description.length > 155 ? `${p.description.slice(0, 152).replace(/\s+\S*$/, "")}…` : p.description;
  return {
    title: `${p.name} — ${categoryName(p.category)}`,
    description,
    alternates: { canonical: `/producto/${slug}` },
    openGraph: { title: `${p.name} — ${brand.name}`, description, images: [{ url: p.colors[0].images[0], width: 1200, height: 1500 }] },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getSlimProduct(slug);
  if (!product) notFound();
  const related = relatedProducts(slug, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.colors[0].images.map(asset),
    brand: { "@type": "Brand", name: brand.name },
    category: categoryName(product.category),
    offers: { "@type": "Offer", price: product.price, priceCurrency: brand.locale.currency, availability: "https://schema.org/InStock" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} />
      <section className={styles.related} aria-labelledby="h-related">
        <div className="mk-container">
          <SectionHead id="h-related" title={brand.product.relatedTitle} kicker={brand.product.relatedKicker} href={`/categoria/${product.category}`} linkLabel={`Más ${categoryName(product.category).toLowerCase()}`} />
        </div>
        <div className={styles.grid}>
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} sizes="(min-width: 1024px) 25vw, 50vw" />
          ))}
        </div>
      </section>
    </>
  );
}
