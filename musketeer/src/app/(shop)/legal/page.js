import PageIntro from "@/components/shop/PageIntro";
import styles from "./legal.module.css";

export const metadata = {
  title: "Aviso legal y privacidad",
  description: "Aviso legal, política de privacidad, cookies y condiciones de venta de MUSKETEER.",
  alternates: { canonical: "/legal" },
};

export default function LegalPage() {
  return (
    <>
      <PageIntro crumbs={[{ label: "Inicio", href: "/" }, { label: "Legal" }]} title="Legal" compact aside="Documento provisional. Esta tienda es una demostración y no realiza ventas." />
      <div className={styles.doc}>
        <nav className={styles.toc} aria-label="Índice">
          <a href="#aviso" className="mk-link">Aviso legal</a>
          <a href="#condiciones" className="mk-link">Condiciones de venta</a>
          <a href="#privacidad" className="mk-link">Privacidad</a>
          <a href="#cookies" className="mk-link">Cookies</a>
        </nav>
        <div className={styles.body}>
          <section id="aviso">
            <h2>Aviso legal</h2>
            <p>Este sitio web es una demostración del catálogo de la marca MUSKETEER. Los textos, fotografías, logotipos y diseños mostrados son propiedad de la marca y no pueden reproducirse sin autorización.</p>
            <p>Los datos identificativos del titular (razón social, NIF, domicilio y datos registrales) se publicarán aquí antes de la apertura de la tienda.</p>
          </section>
          <section id="condiciones">
            <h2>Condiciones de venta</h2>
            <p>Los precios se muestran en euros e incluyen el IVA aplicable. Los gastos de envío se indican antes de finalizar la compra. El cliente dispone de 30 días naturales desde la entrega para ejercer su derecho de desistimiento.</p>
            <p>En este modo de demostración los pagos están desactivados: ningún pedido se procesa ni se realiza ningún cargo.</p>
          </section>
          <section id="privacidad">
            <h2>Política de privacidad</h2>
            <p>Tratamos los datos personales conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018. Solo recogemos los datos necesarios para gestionar pedidos, atender consultas y, si lo autorizas, enviarte comunicaciones.</p>
            <p>En esta demostración ningún dato sale de tu navegador: la cesta y los favoritos se guardan localmente en tu dispositivo y los formularios no envían información.</p>
            <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiéndonos desde la página de ayuda.</p>
          </section>
          <section id="cookies">
            <h2>Cookies</h2>
            <p>Este sitio no utiliza cookies de seguimiento ni de publicidad. Solo usa almacenamiento local del navegador para recordar tu cesta, tus favoritos y tus preferencias de visualización.</p>
          </section>
          <p className={styles.updated}>Última actualización: noviembre de 2026.</p>
        </div>
      </div>
    </>
  );
}
