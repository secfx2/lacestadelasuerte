import Link from "next/link";
import Logo from "@/components/brand/Logo";
import PageIntro from "@/components/shop/PageIntro";
import SmartImage from "@/components/shop/SmartImage";
import { IconArrow } from "@/components/shop/Icons";
import campaign from "@/data/campaign.json";
import styles from "./maison.module.css";

export const metadata = {
  title: "La Maison",
  description: "MUSKETEER: hermandad, oficio y permanencia. El código de los mosqueteros traducido a ropa de calle y plata 925.",
  alternates: { canonical: "/la-maison" },
};

const VALUES = [
  { n: "I", title: "Hermandad", text: "Ropa unisex pensada para compartirse. Los mismos cortes, las mismas tallas, el mismo uniforme para todos." },
  { n: "II", title: "Oficio", text: "Lona de 14 oz, felpa pesada, punto denso y piel curtida. Bordados a cadeneta, herrajes en plata envejecida." },
  { n: "III", title: "Permanencia", text: "Un catálogo, no una carrera. Sin drops ni cuentas atrás: cada pieza está siempre disponible y se repone." },
  { n: "IV", title: "Plata 925", text: "Joyería maciza, grabada a mano con el emblema de las tres espadas. Sin baños. Hecha para heredarse." },
];

export default function MaisonPage() {
  return (
    <>
      <PageIntro crumbs={[{ label: "Inicio", href: "/" }, { label: "La Maison" }]} title="La Maison" aside="Tous pour un. Un pour tous." />

      <div className={styles.hero}>
        <SmartImage src={campaign.maison.image} alt={campaign.maison.alt} sizes="100vw" className={styles.heroImg} tone="bone" priority />
      </div>

      <section className={styles.manifesto} aria-labelledby="h-manifesto">
        <p id="h-manifesto" className={styles.eyebrow}>
          Manifiesto
        </p>
        <div className={styles.manifestoText}>
          <p className={styles.lead}>
            Los mosqueteros no eran un ejército. Eran una hermandad: cuatro personas, un código y una promesa dicha en voz alta.
          </p>
          <p>
            MUSKETEER traduce ese código a la ropa de calle de hoy. El tabardo azul con la cruz se convierte en una chaqueta de trabajo
            boxy; la cota de malla, en punto pesado; el florete, en un colgante de plata. Cortes amplios, tejidos que envejecen bien y
            lavados que cuentan una historia.
          </p>
          <p>
            No hacemos drops. Hacemos un catálogo permanente, organizado por categorías y siempre disponible, porque creemos que una
            buena prenda no caduca con la temporada. Lo que te pones hoy debería seguir contigo dentro de diez años.
          </p>
          <p className={styles.sign}>
            <em>Tous pour un.</em>
          </p>
        </div>
      </section>

      <section className={styles.values} aria-label="Valores">
        {VALUES.map((v) => (
          <article key={v.n} className={styles.value}>
            <span className={styles.valueN}>{v.n}</span>
            <h2 className={styles.valueTitle}>{v.title}</h2>
            <p className={styles.valueText}>{v.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.seal} aria-label="Sello">
        <Logo variant="seal" title="Sello Tous pour un" className={styles.sealLogo} />
        <p className={styles.sealText}>Cada pieza de plata llega con su certificado lacrado con el sello de la casa.</p>
      </section>

      <section className={styles.links} aria-label="Más">
        <Link href="/brand" className={styles.linkCard}>
          <span className={styles.linkEyebrow}>Brand Book</span>
          <span className={styles.linkTitle}>Identidad de marca</span>
          <span className={styles.linkText}>Logotipos, paleta, tipografía y reglas fotográficas de MUSKETEER.</span>
          <span className={styles.linkCta}>
            Abrir Brand Book <IconArrow size={12} />
          </span>
        </Link>
        <Link href="/lookbook" className={styles.linkCard}>
          <span className={styles.linkEyebrow}>Campaña</span>
          <span className={styles.linkTitle}>Lookbook</span>
          <span className={styles.linkText}>Cuatro mosqueteros, un uniforme. El catálogo en la ciudad.</span>
          <span className={styles.linkCta}>
            Ver lookbook <IconArrow size={12} />
          </span>
        </Link>
        <Link href="/tienda" className={styles.linkCard}>
          <span className={styles.linkEyebrow}>Tienda</span>
          <span className={styles.linkTitle}>Catálogo</span>
          <span className={styles.linkText}>Chaquetas, punto, sudaderas, pantalones, accesorios y plata 925.</span>
          <span className={styles.linkCta}>
            Ver catálogo <IconArrow size={12} />
          </span>
        </Link>
      </section>
    </>
  );
}
