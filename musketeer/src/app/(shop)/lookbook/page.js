import Link from "next/link";
import PageIntro from "@/components/shop/PageIntro";
import SmartImage from "@/components/shop/SmartImage";
import Marquee from "@/components/shop/Marquee";
import { slimProducts } from "@/lib/shop-server";
import { formatPrice, productHref } from "@/lib/shop";
import campaign from "@/data/campaign.json";
import styles from "./lookbook.module.css";

export const metadata = {
  title: "Lookbook",
  description: "Lookbook MUSKETEER. Cuatro mosqueteros, un uniforme: el catálogo permanente en la ciudad.",
  alternates: { canonical: "/lookbook" },
};

/** Pieces worn in each campaign look (in campaign.json order). */
const LOOKS = [
  { title: "Escalinata", pieces: ["musket-check-overshirt", "double-knee-canvas-pant", "hilt-pendant"] },
  { title: "Tejados", pieces: ["garrison-puffer", "parachute-cargo"] },
  { title: "Luz de taller", pieces: ["lace-up-poet-shirt", "baggy-carpenter-denim"] },
  { title: "Sala de armas", pieces: ["cavalier-leather-bomber", "baggy-carpenter-denim", "emblem-signet-ring"] },
  { title: "Hombro con hombro", pieces: ["tous-pour-un-hoodie", "duel-denim-jacket", "parachute-cargo", "fleur-link-chain"] },
  { title: "El río", pieces: ["siege-gilet", "acid-siege-longsleeve", "fleur-chain-belt"] },
  { title: "Regimiento", pieces: ["regiment-jersey", "rapier-zip-hoodie", "regiment-mesh-shorts", "baggy-carpenter-denim"] },
  { title: "Túnel", pieces: ["ruin-knit-polo", "bastion-jorts", "bandolier-bag", "crest-crewneck", "garrison-sweatpants", "plume-cap"] },
];

const QUOTES = { 2: "Un pour tous", 6: "En garde" };

export default function LookbookPage() {
  const looks = campaign.lookbook.map((l, i) => ({ ...l, ...LOOKS[i], n: String(i + 1).padStart(2, "0"), products: slimProducts(LOOKS[i]?.pieces || []) }));

  return (
    <>
      <PageIntro
        crumbs={[{ label: "Inicio", href: "/" }, { label: "Lookbook" }]}
        title="Lookbook"
        aside="Cuatro mosqueteros, un uniforme. El catálogo permanente, fotografiado en la ciudad, entre piedra y lluvia."
      />

      <div className={styles.book}>
        {looks.map((l, i) => (
          <div key={l.image} className={styles.unit}>
            {QUOTES[i] && <p className={styles.quote}>{QUOTES[i]}</p>}
            <figure id={`look-${l.n}`} className={styles.look} data-pos={i % 4}>
              <SmartImage src={l.image} alt={`${l.caption} — ${l.title}`} sizes="(min-width: 1024px) 50vw, 100vw" className={styles.img} tone="bone" priority={i < 2} />
              <figcaption className={styles.caption}>
                <div className={styles.capHead}>
                  <span className={styles.num}>{l.n}</span>
                  <span className={styles.title}>{l.title}</span>
                </div>
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
              </figcaption>
            </figure>
          </div>
        ))}
      </div>

      <div className={styles.marquee}>
        <Marquee items={["Tous pour un", "Un pour tous"]} size="md" />
      </div>
      <div className={styles.cta}>
        <Link href="/tienda" className="mk-btn">
          Ver catálogo
        </Link>
        <Link href="/la-maison" className="mk-btn mk-btn--ghost">
          La Maison
        </Link>
      </div>
    </>
  );
}
