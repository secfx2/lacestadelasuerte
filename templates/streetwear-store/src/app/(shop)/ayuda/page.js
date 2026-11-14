import Link from "next/link";
import PageIntro from "@/components/shop/PageIntro";
import Accordion, { AccordionItem } from "@/components/shop/Accordion";
import SizeTables from "@/components/shop/SizeTables";
import ContactForm from "@/components/shop/ContactForm";
import { ALL_GUIDES_ORDER } from "@/lib/sizeGuides";
import brand from "@/config/brand";
import styles from "./ayuda.module.css";

export const metadata = {
  title: "Ayuda",
  description: brand.seo.help,
  alternates: { canonical: "/ayuda" },
};

const SECTIONS = brand.faq;

export default function AyudaPage() {
  return (
    <>
      <PageIntro crumbs={[{ label: "Inicio", href: "/" }, { label: "Ayuda" }]} title="Ayuda" aside={brand.helpPage.aside} />
      <div className={styles.layout}>
        <nav className={styles.nav} aria-label="Secciones de ayuda">
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="mk-link">{s.title}</a>
              </li>
            ))}
            <li>
              <a href="#contacto" className="mk-link">Contacto</a>
            </li>
          </ul>
        </nav>
        <div className={styles.content}>
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} className={styles.section} aria-labelledby={`h-${s.id}`}>
              <h2 id={`h-${s.id}`} className={styles.title}>{s.title}</h2>
              <Accordion>
                {s.faqs.map(([q, a]) => (
                  <AccordionItem key={q} title={q}>
                    <p>{a}</p>
                  </AccordionItem>
                ))}
                {s.tables && (
                  <AccordionItem title="Tablas de medidas">
                    <SizeTables ids={ALL_GUIDES_ORDER} />
                  </AccordionItem>
                )}
              </Accordion>
            </section>
          ))}
          <section id="contacto" className={styles.section} aria-labelledby="h-contacto">
            <h2 id="h-contacto" className={styles.title}>Contacto</h2>
            <p className={styles.contactText}>
              {brand.contact.hours} También puedes consultar el estado de tu pedido desde tu{" "}
              <Link href="/cuenta" className="mk-link mk-link--on">cuenta</Link>.
            </p>
            <ContactForm />
          </section>
        </div>
      </div>
    </>
  );
}
