import styles from "./guia.module.css";

export const metadata = { title: "Guía" };

const TIPS = [
  ["Una prenda, una foto", "Pide una sola pieza por imagen. Si quieres un conjunto, dilo: «chaqueta y pantalón a juego, uno al lado del otro»."],
  ["Color + tejido + corte + detalles", "«Sudadera negra lavada, felpa gruesa, corta y ancha (boxy), capucha alta, calavera con rosas bordada en hilo crudo en la espalda». Cuanto más concreto, mejor."],
  ["El texto, entre comillas", "Las IA se equivocan con las letras. Si una prenda o un logo lleva texto, escríbelo exacto entre comillas y revisa el resultado letra a letra."],
  ["Nada de marcas reales", "Ni logos, ni rayas de zapatillas, ni nombres de grupos. Pide «zapatillas sin logos» si salen."],
  ["Referencias: pocas y claras", "1–3 imágenes que enseñen lo que importa (forma, gráfico, color). Para fotos con modelo, la imagen 1 es la prenda y la 2 el casting."],
  ["Mejorar prompt", "En «Prenda concreta» escribe como hablas y pulsa «Mejorar prompt»: Claude lo pasa a un prompt preciso en inglés que puedes retocar."],
  ["Primero flat lay, luego modelo", "El flat lay (foto cenital sobre blanco) fija la prenda. Después se viste al casting con esa misma prenda: así sale idéntica en las dos fotos."],
  ["Repite con lo bueno", "Si una imagen casi está, úsala como referencia («Usar como referencia») y pide solo el cambio: «igual pero en burdeos lavado»."],
];

const EXAMPLES = [
  { tool: "Nombres de marca", text: "Marca de chándal Y2K para chicas y chicos de barrio en Madrid, con paneles tribales, strass y colores lavados. Que suene a calle pero con humor." },
  { tool: "Logos", text: "Nombre «Mala Fama» · estilo Script + Minimal · «firma caligráfica fina, como un tatuaje, con una pequeña estrella al final» · negro." },
  { tool: "Ideas de ropa", text: "Colección de verano inspirada en las fiestas de pueblo: camisas de cuadros vichy recortadas, bordados de flores, pantalones anchos de lino, collares de cuentas." },
  { tool: "Prenda concreta", text: "Vaquero súper ancho negro lavado, que tape la zapatilla, con dos cruces con alas bordadas en blanco en los bolsillos de atrás y pespunte grueso crudo. Foto por detrás." },
];

export default function Guia() {
  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">08 · Cómo pedir</p>
        <h1 className="h1">Guía</h1>
        <p className="lede">Cómo pedir buenas imágenes, ejemplos para cada herramienta y cómo funcionan los créditos.</p>
      </header>
      <section className="stack">
        <h2 className="h2">Cómo pedir buenas imágenes</h2>
        <ol className={styles.tips}>
          {TIPS.map(([t, d], i) => (
            <li key={t}>
              <span className={styles.n}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className={styles.t}>{t}</h3>
                <p className={styles.d}>{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="stack" style={{ marginTop: 40 }}>
        <h2 className="h2">Ejemplos</h2>
        <div className={styles.examples}>
          {EXAMPLES.map((e) => (
            <figure key={e.tool} className={styles.ex}>
              <figcaption className="eyebrow">{e.tool}</figcaption>
              <blockquote>{e.text}</blockquote>
            </figure>
          ))}
        </div>
      </section>
      <section className="stack" style={{ marginTop: 40 }}>
        <h2 className="h2">Créditos y límite diario</h2>
        <div className={styles.cols}>
          <p>Las imágenes se hacen con la cuenta de Higgsfield del propietario y gastan <strong>créditos de su plan</strong>. Antes de generar ves el coste exacto (Higgsfield lo calcula sin generar nada).</p>
          <p>Como referencia: una foto de producto 2K ≈ 1 crédito; un logo 1K ≈ 0,5; un logo vectorial (Recraft) ≈ 10. Hasta 4 imágenes por petición.</p>
          <p>Hay un <strong>límite diario</strong> (normalmente 500 créditos) que se reinicia a medianoche, hora de Madrid. El contador está arriba («Hoy: X / 500») y el detalle en «Uso y límite».</p>
          <p>Si una imagen falla o la rechaza la moderación, <strong>los créditos se devuelven</strong> solos. Los nombres, las ideas y «Mejorar prompt» son texto (Claude) y no gastan créditos.</p>
        </div>
      </section>
    </div>
  );
}
