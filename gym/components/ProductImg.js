'use client';

import Image from 'next/image';
import { useState } from 'react';
import { productImage } from '../lib/productImages.js';
import { CATEGORY_EMOJI } from '../lib/shopping.js';

// Foto de referencia de un producto de la compra (con fallback de emoji)
export default function ProductImg({ k, cat, size = 52, rounded = 14, sizes, style, className }) {
  const [err, setErr] = useState(false);
  const src = productImage(k);
  const box = { position: 'relative', width: size, height: size, flex: 'none', borderRadius: rounded, overflow: 'hidden', background: '#e9e9ee', ...style };
  return (
    <div className={className} style={box}>
      {src && !err ? (
        <Image src={src} alt="" fill sizes={sizes || `${size * 2}px`} style={{ objectFit: 'cover' }} onError={() => setErr(true)} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: typeof size === 'number' ? size * 0.45 : 56, background: 'var(--card-3)' }}>{CATEGORY_EMOJI[cat] || '🛒'}</div>
      )}
    </div>
  );
}

export function StoreChip({ store }) {
  if (!store) return null;
  return (
    <span className="pill" style={{ background: store.bg, color: store.fg, padding: '2px 8px', fontSize: 11 }}>
      {store.icon} {store.name}
    </span>
  );
}
