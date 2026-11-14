import { GUIDES } from "@/lib/sizeGuides";
import styles from "./SizeTables.module.css";

export default function SizeTables({ ids, highlight }) {
  return (
    <div className={styles.wrap}>
      {ids.map((id) => {
        const g = GUIDES[id];
        if (!g) return null;
        return (
          <section key={id} className={styles.guide}>
            <h3 className={styles.title}>{g.title}</h3>
            <div className={styles.scroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {g.head.map((h) => (
                      <th key={h} scope="col">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {g.rows.map((r) => (
                    <tr key={r[0]} data-active={highlight === r[0] || undefined}>
                      {r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.note}>{g.note}</p>
          </section>
        );
      })}
    </div>
  );
}
