import Link from "next/link";
import { IconArrow } from "./Icons";
import styles from "./SectionHead.module.css";

export default function SectionHead({ title, kicker, href, linkLabel = "Ver todo", as: Tag = "h2", id }) {
  return (
    <div className={styles.head}>
      <div className={styles.titles}>
        <Tag className={styles.title} id={id}>{title}</Tag>
        {kicker && <p className={styles.kicker}>{kicker}</p>}
      </div>
      {href && (
        <Link href={href} className={styles.link}>
          <span className="mk-link mk-link--on">{linkLabel}</span>
          <IconArrow size={12} />
        </Link>
      )}
    </div>
  );
}
