'use client';

// Reduce una foto del móvil (respetando la orientación EXIF) a JPEG en base64 sin el prefijo "data:".
// → { data, mime, width, height }

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen'));
    };
    img.src = url;
  });
}

async function toSource(file) {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return loadImage(file);
  }
}

function drawScaled(source, maxSide) {
  const w0 = source.width;
  const h0 = source.height;
  const scale = Math.min(1, maxSide / Math.max(w0, h0));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(w0 * scale));
  canvas.height = Math.max(1, Math.round(h0 * scale));
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; // PNG con transparencia → fondo blanco en JPEG
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function canvasToB64(canvas, q) {
  const url = canvas.toDataURL('image/jpeg', q);
  return url.slice(url.indexOf(',') + 1);
}

// Devuelve dos tamaños: `full` (para enviar ahora) y `small` (para guardar en el historial del chat)
export async function prepareImage(file, { fullSide = 1280, smallSide = 640, maxB64 = 1_200_000 } = {}) {
  if (!file || !/^image\//.test(file.type || 'image/')) throw new Error('Eso no es una imagen');
  const source = await toSource(file);
  try {
    const big = drawScaled(source, fullSide);
    let full = null;
    for (const q of [0.82, 0.7, 0.55]) {
      const d = canvasToB64(big, q);
      if (d.length <= maxB64) {
        full = d;
        break;
      }
    }
    if (!full) throw new Error('La foto es demasiado grande');
    const small = canvasToB64(drawScaled(source, smallSide), 0.7);
    return { mime: 'image/jpeg', full, small, width: big.width, height: big.height };
  } finally {
    if (source.close) source.close();
  }
}
