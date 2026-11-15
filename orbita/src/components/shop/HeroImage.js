"use client";
import { getImageProps } from "next/image";
import { useState } from "react";
import { ImagePlaceholder } from "./SmartImage";
import { asset } from "@/lib/asset";
import styles from "./HeroImage.module.css";

/** Art-directed full-bleed image (desktop / mobile sources) with graceful fallback. */
export default function HeroImage({ desktop, mobile, alt, priority = true, tone = "dark", breakpoint = 767 }) {
  const [state, setState] = useState("loading");
  const common = { alt, fill: true, sizes: "100vw", priority };
  const {
    props: { srcSet: mobileSet, src: mobileSrc },
  } = getImageProps({ ...common, src: asset(mobile || desktop) });
  const {
    props: { srcSet: desktopSet, ...rest },
  } = getImageProps({ ...common, src: asset(desktop) });

  return (
    <div className={styles.frame} data-tone={tone}>
      {state !== "error" && (
        <picture>
          {/* Unoptimized images (static export) have no srcSet: fall back to the plain file */}
          <source media={`(max-width: ${breakpoint}px)`} srcSet={mobileSet || mobileSrc} />
          <source media={`(min-width: ${breakpoint + 1}px)`} srcSet={desktopSet || rest.src} />
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <img
            {...rest}
            className={`${styles.img} ${state === "loaded" ? styles.loaded : ""}`}
            onLoad={() => setState("loaded")}
            onError={() => setState("error")}
            ref={(img) => {
              // Catch loads/errors that happened before hydration
              if (img && img.complete && state === "loading") {
                if (img.naturalWidth > 0) setState("loaded");
                else if (img.currentSrc) setState("error");
              }
            }}
          />
        </picture>
      )}
      {state === "error" && <ImagePlaceholder tone={tone} />}
    </div>
  );
}
