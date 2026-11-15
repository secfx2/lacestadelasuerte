import Link from "next/link";
import PageIntro from "@/components/shop/PageIntro";
import SmartImage from "@/components/shop/SmartImage";
import Marquee from "@/components/shop/Marquee";
import { slimProducts } from "@/lib/shop-server";
import { formatPrice, productHref } from "@/lib/shop";
import brand from "@/config/brand";
import campaign from "@/data/campaign.json";
import styles from "./lookbook.module.css";

/* Looks come from campaign.json → lookbook[]: { image, ratio, caption, title, pieces: [product slugs] }.
   Quotes between looks and the closing marquee: brand.lookbook (src/config/brand.js). */
const LB = brand.lookbook;

export const metadata = {
  title: LB.title,
  description: brand.seo.lookbook,
  alternates: { canonical: "/lookbook" },
};

export default function LookbookPage() {
  const looks = campaign.lookbook.map((l, i) => ({
    ...l,
    title: l.title || l.caption,
    n: String(i + 1).padStart(2, "0"),
    products: slimProducts(l.pieces || []),
  }));

  return (
    <>
      <PageIntro crumbs={[{ label: "Inicio", href: "/" }, { label: LB.title }]} title={LB.title} aside={LB.aside} />

      <div className={styles.book}>
        {looks.map((l, i) => (
          <div key={l.image} className={styles.unit}>
            {LB.quotes?.[i] && <p className={styles.quote}>{LB.quotes[i]}</p>}
            <figure id={`look-${l.n}`} className={styles.look} data-pos={i % 4}>
              <SmartImage src={l.image} alt={`${l.caption} — ${l.title}`} sizes="(min-width: 1024px) 50vw, 100vw" className={styles.img} tone="bone" priority={i < 2} />
              <figcaption className={styles.caption}>
                <div className={styles.capHead}>
                  <span className={styles.num}>{l.n}</span>
                  <span className={styles.title}>{l.title}</span>
                </div>
                {l.products.length > 0 && (
                  <>
                    <p className={styles.inLook}>En el look</p>
                    <ul className={styles.pieces}>
                      {l.products.map((p) => (
                        <li key={p.slug}>
                          <Link href={productHref(p)} className={styles.piece}>
                            <span className="mk-link">{p.name}</span>
                            <span className={styles.piecePrice}>{formatPrice(p.price)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </figcaption>
            </figure>
          </div>
        ))}
      </div>

      <div className={styles.marquee}>
        <Marquee items={LB.marquee} size="md" />
      </div>
      <div className={styles.cta}>
        <Link href="/tienda" className="mk-btn">
          Ver catálogo
        </Link>
        <Link href={brand.routes.about} className="mk-btn mk-btn--ghost">
          {brand.nav.about}
        </Link>
      </div>
    </>
  );
}
