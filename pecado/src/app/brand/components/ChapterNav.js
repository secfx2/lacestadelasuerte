"use client";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/brand/Logo";
import brand from "@/config/brand";
import s from "../brand.module.css";

/** Sticky chapter index for the online Brand Book (hidden in print). */
export default function ChapterNav({ chapters, pdfHref }) {
  const [active, setActive] = useState(chapters[0]?.id);
  const barRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const p = max > 0 ? h.scrollTop / max : 0;
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [chapters]);

  // Keep the active chapter visible when the index scrolls horizontally (narrow screens).
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const item = list.querySelector(`[data-id="${active}"]`);
    if (item) list.scrollTo({ left: item.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  return (
    <nav className={s.nav} aria-label="Índice del Brand Book">
      <a href="#portada" className={s.navBrand} aria-label={`${brand.name} — volver a la portada`}>
        <Logo variant="wordmark" className={s.navLogo} title={brand.name} />
        <span className={s.navBook}>Brand Book</span>
      </a>
      <ol className={s.navList} ref={listRef}>
        {chapters.map((c) => (
          <li key={c.id} data-id={c.id}>
            <a
              href={`#${c.id}`}
              className={`${s.navItem} ${active === c.id ? s.navItemActive : ""}`}
              aria-current={active === c.id ? "true" : undefined}
            >
              <span className={s.navNum}>{c.num}</span>
              <span className={s.navLabel}>{c.short}</span>
            </a>
          </li>
        ))}
      </ol>
      {pdfHref && (
        <a href={pdfHref} className={s.navPdf} download>
          PDF
        </a>
      )}
      <span className={s.navProgress} ref={barRef} aria-hidden="true" />
    </nav>
  );
}
