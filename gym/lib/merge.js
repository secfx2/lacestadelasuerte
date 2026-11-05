// Fusión de estados entre dispositivos (sin perder datos).
// Días, perfil y semanas de la compra guardan `_ts` (última modificación) y `_f` (fecha de modificación de cada
// campo, y de cada subcampo en objetos: p. ej. "sets.press-banca", "meals.cena"). Pesajes y medidas llevan `ts`.
// Regla: gana lo modificado más recientemente, campo a campo. Lo que solo existe en un lado se conserva.
// Borrados: pesajes borrados → `deletedWeights[fecha] = ts`; "borrar todo" → `resetAt`.

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const tsOf = (o) => (isObj(o) ? Number(o._ts) || 0 : 0);
const size = (o) => (o ? JSON.stringify(o).length : 0);
const META = new Set(['_ts', '_f', '_b']);
const keysOf = (...objs) => [...new Set(objs.flatMap((o) => (isObj(o) ? Object.keys(o) : [])))].filter((k) => !META.has(k));
const J = (v) => JSON.stringify(v === undefined ? null : v);

// Momento en que un lado tocó por última vez un campo: su marca propia; si el objeto ya se sigue campo a campo,
// los campos sin marca valen su fecha base (`_b`); en datos antiguos sin seguimiento, la fecha del objeto; si no existe, 0
function fieldTime(obj, path, present) {
  const f = obj?._f?.[path];
  if (f != null) return Number(f) || 0;
  if (!present) return 0;
  return isObj(obj?._f) ? Number(obj._b) || 0 : tsOf(obj);
}

// Combina dos objetos (día, perfil, semana de compra) campo a campo
export function mergeObj(a, b) {
  if (!isObj(a)) return b;
  if (!isObj(b)) return a;
  const ta = tsOf(a);
  const tb = tsOf(b);
  const tieA = ta !== tb ? ta > tb : size(a) >= size(b);
  const out = {};
  const f = {};
  for (const k of keysOf(a, b)) {
    if (isObj(a[k]) || isObj(b[k])) {
      const sub = {};
      for (const sk of keysOf(a[k], b[k])) {
        const path = `${k}.${sk}`;
        const xa = fieldTime(a, path, isObj(a[k]) && sk in a[k]);
        const xb = fieldTime(b, path, isObj(b[k]) && sk in b[k]);
        const v = xa !== xb ? (xa > xb ? a[k]?.[sk] : b[k]?.[sk]) : tieA ? a[k]?.[sk] ?? b[k]?.[sk] : b[k]?.[sk] ?? a[k]?.[sk];
        if (v !== undefined) sub[sk] = v;
        if (Math.max(xa, xb)) f[path] = Math.max(xa, xb);
      }
      out[k] = sub;
    } else {
      const xa = fieldTime(a, k, k in a);
      const xb = fieldTime(b, k, k in b);
      const v = xa !== xb ? (xa > xb ? a[k] : b[k]) : tieA ? a[k] ?? b[k] : b[k] ?? a[k];
      if (v !== undefined) out[k] = v;
      if (Math.max(xa, xb)) f[k] = Math.max(xa, xb);
    }
  }
  if (Object.keys(f).length) out._f = f;
  if (Math.max(ta, tb)) out._ts = Math.max(ta, tb);
  return out;
}

// Marca en `next` qué campos han cambiado respecto a `prev`
function stampObj(prev, next, now) {
  const tracked = isObj(next._f);
  const f = { ...(tracked ? next._f : {}) };
  let changed = false;
  for (const k of keysOf(prev, next)) {
    const a = prev?.[k];
    const b = next[k];
    if (isObj(a) || isObj(b)) {
      for (const sk of keysOf(a, b)) {
        if (J(a?.[sk]) !== J(b?.[sk])) {
          f[`${k}.${sk}`] = now;
          changed = true;
        }
      }
    } else if (J(a) !== J(b)) {
      f[k] = now;
      changed = true;
    }
  }
  if (!changed) return next;
  // primera vez que se sigue campo a campo: lo no tocado conserva la fecha que tenía el objeto
  return tracked ? { ...next, _f: f, _ts: now } : { ...next, _f: f, _ts: now, _b: tsOf(prev) };
}

function mergeDated(localArr = [], remoteArr = [], deleted = {}) {
  const map = new Map();
  for (const it of [...(remoteArr || []), ...(localArr || [])]) {
    if (!it || !it.date) continue;
    const prev = map.get(it.date);
    if (!prev || (Number(it.ts) || 0) >= (Number(prev.ts) || 0)) map.set(it.date, it);
  }
  return [...map.values()]
    .filter((it) => !(deleted[it.date] && (Number(it.ts) || 0) <= deleted[it.date]))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function mergeStates(local, remote) {
  if (!remote) return local;
  if (!local) return remote;
  const resetAt = Math.max(Number(local.resetAt) || 0, Number(remote.resetAt) || 0);
  const alive = (ts) => !resetAt || (Number(ts) || 0) > resetAt;

  const out = { ...remote, ...local };
  if (resetAt) out.resetAt = resetAt;
  else delete out.resetAt;

  // Perfil: si un lado no ha empezado el plan, vale el otro; si no, campo a campo
  const lp = local.profile || {};
  const rp = remote.profile || {};
  let profile = !lp.startDate ? rp : !rp.startDate ? lp : mergeObj(lp, rp);
  if (!alive(profile._ts)) profile = { ...profile, startDate: null };
  out.profile = profile;

  const days = {};
  for (const d of new Set([...Object.keys(local.days || {}), ...Object.keys(remote.days || {})])) {
    const v = mergeObj(local.days?.[d], remote.days?.[d]);
    if (v && alive(v._ts)) days[d] = v;
  }
  out.days = days;

  const deletedWeights = { ...(remote.deletedWeights || {}) };
  for (const [d, t] of Object.entries(local.deletedWeights || {})) deletedWeights[d] = Math.max(deletedWeights[d] || 0, t);
  out.deletedWeights = deletedWeights;
  out.weights = mergeDated(local.weights, remote.weights, deletedWeights).filter((w) => alive(w.ts));
  out.measures = mergeDated(local.measures, remote.measures).filter((m) => alive(m.ts));

  const shopping = {};
  for (const w of new Set([...Object.keys(local.shopping || {}), ...Object.keys(remote.shopping || {})])) {
    const v = mergeObj(local.shopping?.[w], remote.shopping?.[w]);
    if (v && alive(v._ts)) shopping[w] = v;
  }
  out.shopping = shopping;
  return out;
}

// ¿Mismo contenido? (para no subir si no hace falta)
export function sameData(a, b) {
  return stableStringify(a) === stableStringify(b);
}

function stableStringify(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v ?? null);
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(',')}]`;
  return `{${Object.keys(v)
    .filter((k) => v[k] !== undefined)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stableStringify(v[k])}`)
    .join(',')}}`;
}

// Marca qué ha cambiado entre `prev` y `next` (se llama en cada actualización local)
export function stampChanges(prev, next, now = Date.now()) {
  next.profile = stampObj(prev.profile, next.profile || {}, now);
  for (const d of Object.keys(next.days || {})) next.days[d] = stampObj(prev.days?.[d], next.days[d], now);
  for (const w of Object.keys(next.shopping || {})) next.shopping[w] = stampObj(prev.shopping?.[w], next.shopping[w], now);

  const prevW = new Map((prev.weights || []).map((w) => [w.date, w]));
  next.weights = (next.weights || []).map((w) => {
    const p = prevW.get(w.date);
    const same = p && Number(p.kg) === Number(w.kg);
    return same ? (w.ts || !p.ts ? w : { ...w, ts: p.ts }) : { ...w, ts: now };
  });
  const nextDates = new Set(next.weights.map((w) => w.date));
  for (const d of prevW.keys()) {
    if (!nextDates.has(d)) next.deletedWeights = { ...(next.deletedWeights || {}), [d]: now };
  }

  const stripTs = (o) => {
    if (!o) return o;
    const { ts, ...rest } = o;
    return rest;
  };
  const prevM = new Map((prev.measures || []).map((m) => [m.date, m]));
  next.measures = (next.measures || []).map((m) => (J(stripTs(prevM.get(m.date))) !== J(stripTs(m)) ? { ...m, ts: now } : m));
  return next;
}
