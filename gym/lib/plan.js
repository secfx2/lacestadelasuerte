// Plan personalizado = plan base (program.js, recipes.js) + tus cambios (state.custom).
// Los cambios los hace el asesor IA (o tú) y se sincronizan como el resto de datos.
//
// state.custom = {
//   menu:     { '0.desayuno': 'recipeId' }            cambio fijo del menú semanal (0 = lunes … 6 = domingo)
//   dayMenu:  { '2026-11-06.cena': 'recipeId' }       cambio solo para un día concreto
//   recipes:  { 'c-xxxx': { id, name, slot, … } }      recetas nuevas (sus alimentos propios van en recipe.foods)
//   workouts: { empuje: [[id, series, min, max, descanso, nota], …] }   rutina de un día cambiada
//   notes:    { 'n-xxxx': 'texto' }                    cosas que el asesor debe recordar
// }

import { WEEK_MENU, SLOTS, getRecipe } from './recipes.js';
import { FOODS, sumMacros, roundMacros } from './foods.js';
import { WORKOUTS } from './program.js';
import { addDays, weekdayIdx } from './dates.js';

export const SLOT_KEYS = SLOTS.map((s) => s.key);
const ZERO = { kcal: 0, p: 0, c: 0, f: 0, fib: 0 };

export const customOf = (s) => (s && s.custom && typeof s.custom === 'object' ? s.custom : {});

// ───────── Recetas ─────────

export function recipeFor(s, id) {
  if (!id) return null;
  const c = customOf(s).recipes?.[id];
  return c && Array.isArray(c.ingredients) ? c : getRecipe(id) || null;
}

// Alimento de una receta: los de la base o los propios de una receta nueva
export function foodFor(recipe, key) {
  return recipe?.foods?.[key] || FOODS[key] || null;
}

export function ingredientMacros(recipe, key, grams) {
  const f = foodFor(recipe, key);
  if (!f) return ZERO;
  const k = (Number(grams) || 0) / 100;
  return { kcal: f.kcal * k, p: f.p * k, c: f.c * k, f: f.f * k, fib: (f.fib || 0) * k };
}

export function recipeMacrosFor(recipe) {
  if (!recipe) return { ...ZERO };
  return roundMacros(sumMacros(recipe.ingredients.map(([k, g]) => ingredientMacros(recipe, k, g))));
}

// ───────── Menú ─────────

// Id de la receta de un hueco: cambio de ese día > cambio semanal > plan base
export function mealIdFor(s, iso, slot) {
  const c = customOf(s);
  const idx = weekdayIdx(iso);
  for (const id of [c.dayMenu?.[`${iso}.${slot}`], c.menu?.[`${idx}.${slot}`]]) {
    if (id && recipeFor(s, id)) return id;
  }
  return WEEK_MENU[idx][slot];
}

export function mealFor(s, iso, slot) {
  return recipeFor(s, mealIdFor(s, iso, slot));
}

export function menuFor(s, iso) {
  return Object.fromEntries(SLOT_KEYS.map((k) => [k, mealIdFor(s, iso, k)]));
}

// ¿Ese hueco está cambiado respecto al plan base? → 'dia' | 'semana' | null
export function mealChange(s, iso, slot) {
  const c = customOf(s);
  if (c.dayMenu?.[`${iso}.${slot}`] && recipeFor(s, c.dayMenu[`${iso}.${slot}`])) return 'dia';
  if (c.menu?.[`${weekdayIdx(iso)}.${slot}`] && recipeFor(s, c.menu[`${weekdayIdx(iso)}.${slot}`])) return 'semana';
  return null;
}

export function dayMacrosFor(s, iso) {
  return roundMacros(sumMacros(SLOT_KEYS.map((k) => recipeMacrosFor(mealFor(s, iso, k)))));
}

// Días de una semana (lunes → domingo)
export const weekDates = (mondayIso) => Array.from({ length: 7 }, (_, i) => addDays(mondayIso, i));

// ───────── Entreno ─────────

export function workoutWithCustom(s, w) {
  if (!w || w.rest) return w;
  const items = customOf(s).workouts?.[w.key];
  return Array.isArray(items) && items.length ? { ...w, items, customized: true } : w;
}

export const workoutsFor = (s) => WORKOUTS.map((w) => workoutWithCustom(s, w));

// ───────── Notas ─────────

export function notesOf(s) {
  return Object.entries(customOf(s).notes || {})
    .filter(([, t]) => typeof t === 'string' && t.trim())
    .map(([id, text]) => ({ id, text }));
}

export function hasCustomizations(s) {
  const c = customOf(s);
  return ['menu', 'dayMenu', 'recipes', 'workouts', 'notes'].some((k) => c[k] && Object.keys(c[k]).length);
}
