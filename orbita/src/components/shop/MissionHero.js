import Link from "next/link";
import Logo from "@/components/brand/Logo";
import SmartImage from "./SmartImage";
import Countdown from "./Countdown";
import { formatPrice, productHref } from "@/lib/shop";
import brand from "@/config/brand";
import styles from "./MissionHero.module.css";

const H = brand.home.hero;

/** Faint orbit drawn behind the wordmark, with a satellite (accent) riding it. */
function OrbitLines() {
  const cx = 720;
  const cy = 360;
  const rx = 900;
  const ry = 250;
  const path = `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${2 * rx} 0 a ${rx} ${ry} 0 1 0 ${-2 * rx} 0`;
  const stars = [
    [96, 150], [312, 92], [540, 196], [1010, 120], [1230, 210], [1376, 96], [180, 520], [1300, 560], [860, 64], [640, 610],
  ];
  return (
    <svg className={styles.orbit} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {stars.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" className={styles.star} />
      ))}
      <g transform={`rotate(-6 ${cx} ${cy})`}>
        <ellipse cx={cx} cy={cy} rx={rx + 170} ry={ry + 110} className={styles.ringFaint} />
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} className={styles.ring} />
        <circle r="5" className={styles.sat}>
          <animateMotion dur="48s" repeatCount="indefinite" path={path} />
        </circle>
      </g>
    </svg>
  );
}

/**
 * Typographic home hero for a brand without campaign photography:
 * midnight field, telemetry row, the wordmark in safety orange, a launch countdown,
 * and a strip of "crew monitors" built from the on-model product shots (image 2).
 * Missing photos degrade to the night placeholder with the orbit emblem.
 */
export default function MissionHero({ products = [] }) {
  return (
    <section className={styles.hero} data-hero aria-label="Campaña">
      <OrbitLines />
      <div className={styles.inner}>
        <div className={styles.telemetry}>
          <span>{H.eyebrow}</span>
          <span className={styles.telemetryRight}>{H.caption}</span>
        </div>

        <h1 className="sr-only">{H.srTitle}</h1>
        <div className={styles.mark}>
          <Logo variant="wordmark" title={brand.name} className={styles.wordmark} />
        </div>

        <div className={styles.row}>
          <Countdown from={10} intro={H.countdown} liftoff={H.liftoff} />
          <div className={styles.ctas}>
            <Link href={H.ctaHref || "/tienda"} className={styles.btn}>
              {H.cta}
            </Link>
            {H.secondary && (
              <Link href={H.secondaryHref || "/lookbook"} className={`${styles.textLink} mk-link mk-link--on`}>
                {H.secondary}
              </Link>
            )}
          </div>
        </div>

        {products.length > 0 && (
          <div className={styles.monitors}>
            <p className={styles.stripLabel}>
              <span className={styles.rec} aria-hidden="true" />
              {H.stripLabel}
              <span className={styles.stripCount}>{String(products.length).padStart(2, "0")} cámaras</span>
            </p>
            <ol className={styles.strip}>
              {products.map((p, i) => (
                <li key={p.slug} className={styles.cell}>
                  <Link href={productHref(p)} className={styles.tile}>
                    <span className={styles.tileHead}>
                      <span>CAM {String(i + 1).padStart(2, "0")}</span>
                      <span>{p.colors[0].name}</span>
                    </span>
                    <SmartImage
                      src={p.colors[0].images[1] || p.colors[0].images[0]}
                      alt={`${p.name} — con modelo`}
                      sizes="(min-width: 1024px) 19vw, 46vw"
                      className={styles.tileImg}
                      tone="night"
                      priority={i < 3}
                    />
                    <span className={styles.tileFoot}>
                      <span className={styles.tileName}>{p.name}</span>
                      <span>{formatPrice(p.price)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
