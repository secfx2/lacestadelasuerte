import Link from "next/link";
import PageIntro from "@/components/shop/PageIntro";
import Accordion, { AccordionItem } from "@/components/shop/Accordion";
import SizeTables from "@/components/shop/SizeTables";
import ContactForm from "@/components/shop/ContactForm";
import { ALL_GUIDES_ORDER } from "@/lib/sizeGuides";
import styles from "./ayuda.module.css";

export const metadata = {
  title: "Ayuda",
  description: "Envíos, devoluciones, guía de tallas, cuidado de la plata 925 y métodos de pago en MUSKETEER.",
  alternates: { canonical: "/ayuda" },
};

const SECTIONS = [
  {
    id: "envios",
    title: "Envíos",
    faqs: [
      ["¿Cuánto cuesta el envío?", "El envío estándar cuesta 4,95 € y es gratuito en pedidos desde 150 €. El envío express cuesta 9,95 €."],
      ["¿Cuánto tarda mi pedido?", "Estándar: 2–4 días laborables. Express: 24–48 h laborables. Los pedidos realizados antes de las 13:00 salen el mismo día."],
      ["¿A dónde enviáis?", "A toda España peninsular, Baleares, Portugal y Andorra. Para Canarias, Ceuta y Melilla, consúltanos antes de realizar el pedido."],
      ["¿Puedo seguir mi pedido?", "Sí. Recibirás un correo con el número de seguimiento en cuanto tu pedido salga del taller."],
    ],
  },
  {
    id: "devoluciones",
    title: "Devoluciones",
    faqs: [
      ["¿Cuánto tiempo tengo para devolver?", "Dispones de 30 días desde la entrega. Las piezas deben estar sin usar, sin lavar y con sus etiquetas."],
      ["¿La devolución es gratuita?", "Sí, las devoluciones dentro de España son gratuitas. Te enviaremos una etiqueta prepagada."],
      ["¿Puedo cambiar de talla?", "Claro. Solicita un cambio y te enviamos la nueva talla en cuanto recibamos la pieza original, sin coste."],
      ["¿Cuándo recibiré el reembolso?", "En un plazo de 5–7 días laborables desde que recibimos la devolución, en el mismo método de pago."],
    ],
  },
  {
    id: "tallas",
    title: "Tallas",
    faqs: [
      ["¿Cómo tallan las prendas?", "Casi todo es unisex y de corte boxy o baggy: hombro caído y volumen amplio. Recomendamos tu talla habitual; elige una más si buscas un efecto aún más holgado."],
      ["¿Cómo sé mi talla de anillo?", "Usamos tallaje español. Rodea la base del dedo con un hilo, mide la longitud en milímetros y réstale 40: ese número es tu talla. Si dudas entre dos, elige la mayor."],
      ["¿Qué largo de cadena elijo?", "45 cm queda en la base del cuello, 50 cm sobre la clavícula, 55 cm por debajo y 60 cm en la parte alta del pecho."],
    ],
    tables: true,
  },
  {
    id: "plata",
    title: "Cuidado de la plata 925",
    faqs: [
      ["¿Qué es la plata 925?", "Plata de ley: 92,5 % de plata pura aleada con cobre para darle dureza. Todas nuestras piezas son macizas y llevan el contraste 925."],
      ["¿Por qué se oscurece?", "La plata reacciona con el aire y la humedad. La pátina oscura en los relieves es intencionada y resalta el grabado."],
      ["¿Cómo la limpio?", "Con un paño de plata, en seco. Evita productos abrasivos y no la sumerjas en limpiadores químicos si tiene partes oxidadas a propósito."],
      ["¿Puedo ducharme o nadar con ella?", "Mejor no. El cloro, el agua salada y los perfumes aceleran la oxidación. Quítatela para dormir y hacer deporte."],
    ],
  },
  {
    id: "pagos",
    title: "Pagos",
    faqs: [
      ["¿Qué métodos de pago aceptáis?", "Tarjeta (Visa, Mastercard, American Express), Apple Pay, PayPal y Bizum."],
      ["¿Es seguro pagar en la web?", "Todos los pagos se procesan cifrados y nunca almacenamos los datos de tu tarjeta."],
      ["¿Tenéis códigos de descuento?", "Ocasionalmente, para la hermandad: suscríbete a la carta del regimiento para recibirlos. Los códigos se aplican en el checkout."],
      ["¿Los precios incluyen IVA?", "Sí, todos los precios incluyen el IVA (21 %)."],
    ],
  },
];

export default function AyudaPage() {
  return (
    <>
      <PageIntro crumbs={[{ label: "Inicio", href: "/" }, { label: "Ayuda" }]} title="Ayuda" aside="Respuestas claras, sin letra pequeña. Si no encuentras lo que buscas, escríbenos." />
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
              Atención al cliente de lunes a viernes, de 10:00 a 18:00 (hora peninsular). Respondemos en 24–48 h laborables. También puedes
              consultar el estado de tu pedido desde tu <Link href="/cuenta" className="mk-link mk-link--on">cuenta</Link>.
            </p>
            <ContactForm />
          </section>
        </div>
      </div>
    </>
  );
}
