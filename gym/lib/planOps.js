// Operaciones sobre el plan personalizado (state.custom y state.profile).
// Las usa el servidor del asesor (para validar y simular lo que cambia) y el móvil (para aplicarlo).
//
// { op: 'meal', keys: ['0.cena', '2026-11-06.cena'], scope: 'semana' | 'dia', recipeId: string | null }   null = volver al plan
// { op: 'recipe', recipe }                         receta nueva (o la reemplaza si ya existe ese id)
// { op: 'workout', key, items: [...] | null }      null = volver a la rutina original
// { op: 'profile', patch: { goalKg, gymTime, wakeTime, heightCm, age, doubleSession } }
// { op: 'note', id, text: string | null }          null = borrar la nota
// { op: 'reset', what: 'menu' | 'entrenos' | 'recetas' | 'notas' | 'todo' }

const clone = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)));
const PROFILE_KEYS = new Set(['goalKg', 'gymTime', 'wakeTime', 'heightCm', 'age', 'doubleSession']);
const MAX_DAY_MENU_AGE_DAYS = 45;

function pruneDayMenu(dayMenu, todayIso) {
  if (!todayIso) return dayMenu;
  const limit = new Date(`${todayIso}T12:00:00`);
  limit.setDate(limit.getDate() - MAX_DAY_MENU_AGE_DAYS);
  const lim = limit.toISOString().slice(0, 10);
  for (const k of Object.keys(dayMenu)) if (k.slice(0, 10) < lim) delete dayMenu[k];
  return dayMenu;
}

// Devuelve { custom, profile } nuevos (no modifica los de entrada)
export function applyOps(custom, profile, ops, todayIso = null) {
  const c = clone(custom) || {};
  const p = clone(profile) || {};
  for (const o of ops || []) {
    if (!o || typeof o !== 'object') continue;
    if (o.op === 'meal') {
      const bucket = o.scope === 'dia' ? 'dayMenu' : 'menu';
      c[bucket] = c[bucket] || {};
      for (const k of o.keys || []) {
        if (o.recipeId) c[bucket][k] = o.recipeId;
        else delete c[bucket][k];
      }
    } else if (o.op === 'recipe' && o.recipe?.id) {
      c.recipes = c.recipes || {};
      c.recipes[o.recipe.id] = o.recipe;
    } else if (o.op === 'workout' && o.key) {
      c.workouts = c.workouts || {};
      if (Array.isArray(o.items) && o.items.length) c.workouts[o.key] = o.items;
      else delete c.workouts[o.key];
    } else if (o.op === 'profile' && o.patch) {
      for (const [k, v] of Object.entries(o.patch)) if (PROFILE_KEYS.has(k) && v !== undefined && v !== null) p[k] = v;
    } else if (o.op === 'note' && o.id) {
      c.notes = c.notes || {};
      if (o.text) c.notes[o.id] = o.text;
      else delete c.notes[o.id];
    } else if (o.op === 'reset') {
      const w = o.what;
      if (w === 'menu' || w === 'todo') {
        c.menu = {};
        c.dayMenu = {};
      }
      if (w === 'entrenos' || w === 'todo') c.workouts = {};
      if (w === 'recetas' || w === 'todo') c.recipes = {};
      if (w === 'notas' || w === 'todo') c.notes = {};
    }
  }
  if (c.dayMenu) pruneDayMenu(c.dayMenu, todayIso);
  return { custom: c, profile: p };
}

export const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
