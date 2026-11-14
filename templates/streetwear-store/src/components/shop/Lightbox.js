"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDialog, useLockBody, usePresence } from "./hooks";
import { IconArrow, IconClose } from "./Icons";
import { ImagePlaceholder } from "./SmartImage";
import styles from "./Lightbox.module.css";

/** Fullscreen gallery: arrows / keys / swipe, click to zoom (follows the pointer). */
export default function Lightbox({ images, index, onIndex, open, onClose, label }) {
  const ref = useRef(null);
  const { mounted, visible } = usePresence(open, 400);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [failed, setFailed] = useState({});
  const touch = useRef(null);
  useLockBody(open);
  useDialog(ref, open, onClose);

  useEffect(() => setZoom(false), [index, open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") onIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, images.length, onIndex]);

  if (!mounted) return null;
  const src = images[index];

  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div ref={ref} className={styles.root} data-visible={visible || undefined} role="dialog" aria-modal="true" aria-label={`${label} — galería`}>
      <div className={styles.bar}>
        <span className={styles.counter}>
          {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
        <span className={styles.hint}>{zoom ? "Clic para alejar" : "Clic para ampliar"}</span>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar galería">
          <IconClose size={18} />
        </button>
      </div>

      <div
        className={styles.stage}
        data-zoom={zoom || undefined}
        onClick={(e) => {
          move(e);
          setZoom((z) => !z);
        }}
        onMouseMove={zoom ? move : undefined}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current == null || zoom) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 50) onIndex((index + (dx < 0 ? 1 : -1) + images.length) % images.length);
          touch.current = null;
        }}
      >
        {failed[src] ? (
          <ImagePlaceholder />
        ) : (
          <Image
            key={src}
            src={src}
            alt={`${label} — imagen ${index + 1}`}
            fill
            sizes="100vw"
            quality={90}
            className={styles.img}
            style={{ transformOrigin: origin }}
            onError={() => setFailed((f) => ({ ...f, [src]: true }))}
          />
        )}
      </div>

      {images.length > 1 && (
        <>
          <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => onIndex((index - 1 + images.length) % images.length)} aria-label="Imagen anterior">
            <IconArrow dir="left" size={18} />
          </button>
          <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => onIndex((index + 1) % images.length)} aria-label="Imagen siguiente">
            <IconArrow size={18} />
          </button>
          <div className={styles.thumbs}>
            {images.map((im, i) => (
              <button key={im} type="button" className={styles.thumb} aria-current={i === index || undefined} onClick={() => onIndex(i)} aria-label={`Ver imagen ${i + 1}`}>
                {!failed[im] && <Image src={im} alt="" fill sizes="64px" className={styles.thumbImg} onError={() => setFailed((f) => ({ ...f, [im]: true }))} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
