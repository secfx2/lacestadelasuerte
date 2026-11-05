'use client';

import Image from 'next/image';
import { useState } from 'react';
import { foodImage } from '../lib/foodImages.js';

const FALLBACK = {
  desayuno: ['#3a2a12', '#1a140b', '🍳'],
  media: ['#13283a', '#0b141c', '🥪'],
  comida: ['#3a1f12', '#1c100b', '🍛'],
  merienda: ['#2a3a12', '#141c0b', '⚡'],
  cena: ['#1e1a3a', '#0e0c1c', '🌙'],
};

// Foto de una receta con fallback (degradado + emoji) si no carga
export default function FoodImg({ recipe, sizes = '(max-width: 760px) 100vw, 50vw', priority = false, className, style, rounded }) {
  const [err, setErr] = useState(false);
  const src = recipe ? foodImage(recipe.id) : null;
  const fb = FALLBACK[recipe?.slot] || FALLBACK.comida;
  const wrap = { position: 'relative', overflow: 'hidden', borderRadius: rounded, background: `linear-gradient(140deg, ${fb[0]}, ${fb[1]})`, ...style };
  return (
    <div className={className} style={wrap}>
      {src && !err ? (
        <Image src={src} alt={recipe.name} fill sizes={sizes} priority={priority} style={{ objectFit: 'cover' }} onError={() => setErr(true)} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 'min(42px, 40%)' }}>{fb[2]}</div>
      )}
    </div>
  );
}
