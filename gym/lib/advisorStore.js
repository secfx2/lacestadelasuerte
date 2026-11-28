'use client';

// API key y conversación del asesor: solo en este dispositivo (no van en la exportación de datos).
const KEY_K = 'aesthetic-coach-anthropic-key';
const CHAT_K = 'aesthetic-coach-chat-v1';
const MODEL_K = 'aesthetic-coach-advisor-model';

const safe = (fn, fb) => {
  try {
    return fn();
  } catch {
    return fb;
  }
};

export const getLocalKey = () => safe(() => localStorage.getItem(KEY_K) || '', '');
export const setLocalKey = (v) => safe(() => (v ? localStorage.setItem(KEY_K, v.trim()) : localStorage.removeItem(KEY_K)));
export const getChat = () => safe(() => JSON.parse(localStorage.getItem(CHAT_K) || '[]'), []);
// Fotos del chat: solo se guardan (en tamaño reducido) las de los últimos mensajes; si no cabe, se guardan sin fotos
const KEEP_IMAGE_MSGS = 8;
function forStorage(msgs, keepImages) {
  let kept = 0;
  const out = [];
  for (let i = msgs.length - 1; i >= 0; i--) {
    const m = msgs[i];
    if (!m.images?.length) {
      out.push(m);
      continue;
    }
    const keep = kept < keepImages;
    if (keep) kept += 1;
    out.push({
      ...m,
      images: keep ? m.images.map(({ full, ...img }) => img) : [],
      imagesDropped: keep ? m.imagesDropped || 0 : (m.imagesDropped || 0) + m.images.length,
    });
  }
  return out.reverse();
}
export const saveChat = (msgs) => {
  const last = msgs.slice(-60);
  for (const keep of [KEEP_IMAGE_MSGS, 3, 0]) {
    try {
      localStorage.setItem(CHAT_K, JSON.stringify(forStorage(last, keep)));
      return;
    } catch {
      /* no cabe: probamos con menos fotos */
    }
  }
};
export const getModelPref = () => safe(() => localStorage.getItem(MODEL_K) || 'opus', 'opus');
export const setModelPref = (m) => safe(() => localStorage.setItem(MODEL_K, m));
