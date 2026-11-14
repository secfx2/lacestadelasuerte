import s from "../brand.module.css";
import { EDITION } from "../data";
import brand from "@/config/brand";

/**
 * One printed page of the book (A4 landscape ratio on screen, exactly
 * 297 × 210 mm in print). All sizes inside are container-relative (cqw),
 * so the screen sheet and the PDF page share the same layout.
 */
export default function Sheet({ chapter, label, tone = "paper", bare = false, className = "", children }) {
  const toneClass = s[`tone_${tone}`] || "";
  return (
    <div className={`${s.sheet} ${toneClass}`}>
      <div className={`${s.sheetInner} ${bare ? s.sheetBare : ""}`}>
        {!bare && (
          <header className={s.runhead}>
            <span>{brand.displayName} — Brand Book</span>
            <span className={s.runheadCenter}>
              {chapter.num} &nbsp;{chapter.title}
              {label ? <span className={s.runheadLabel}> — {label}</span> : null}
            </span>
            <span className={s.runheadRight}>
              {EDITION.name} · {EDITION.year}
            </span>
          </header>
        )}
        <div className={`${s.sheetBody} ${className}`}>{children}</div>
        {!bare && (
          <footer className={s.runfoot}>
            <span className={s.folio} />
            <span className={s.runfootMotto}>{brand.tagline}</span>
          </footer>
        )}
      </div>
    </div>
  );
}

export function ChapterHead({ chapter, title, lead, className = "" }) {
  return (
    <div className={`${s.chHead} ${className}`}>
      <span className={s.chNum}>{chapter.num}</span>
      <h2 className={s.chTitle}>{title || chapter.title}</h2>
      {lead ? <p className={s.chLead}>{lead}</p> : null}
    </div>
  );
}
