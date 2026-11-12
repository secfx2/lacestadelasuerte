// Lista de la compra semanal (7 días del menú) + recomendaciones de supermercado.

import { FOODS } from './foods.js';
import { SLOTS, WEEK_MENU, getRecipe } from './recipes.js';
import { mealFor, foodFor, weekDates } from './plan.js';

export const CATEGORY_ORDER = ['Carne y pescado', 'Huevos y lácteos', 'Fruta y verdura', 'Congelados', 'Refrigerados', 'Panadería', 'Despensa', 'Suplementos', 'Otros'];

export const CATEGORY_EMOJI = {
  'Carne y pescado': '🥩',
  'Huevos y lácteos': '🥚',
  'Fruta y verdura': '🍌',
  Congelados: '🧊',
  Refrigerados: '🥣',
  Panadería: '🍞',
  Despensa: '🥫',
  Suplementos: '💊',
  Otros: '🛒',
};

// Dónde comprarlo. La idea: TODO en Mercadona en un solo viaje; la proteína en polvo, online.
export const STORE_PLAN = {
  main: 'Mercadona',
  why: 'Tiene todo el menú en un solo viaje: yogures +Proteínas, queso fresco batido 0%, claras en brick, pavo 90%, gazpacho y salmorejo de nevera, legumbre cocida en bote, cacao puro y chocolate 85%.',
  alternatives: [
    { name: 'Lidl', text: 'Vale casi para todo (gama High Protein de Milbona, claras, pavo). El queso batido 0% y las cremas de verdura van por temporadas.' },
    { name: 'Carrefour', text: 'Lo tiene todo, algo más caro de media. Útil si te pilla al lado.' },
    { name: 'Online (HSN, MyProtein, Prozis)', text: 'Para la whey y la creatina: sale bastante más barato por kilo que en el súper. Compra creatina monohidrato normal (sin "HCL" ni mezclas).' },
  ],
  tips: [
    'Haz una compra grande el domingo y una pequeña el miércoles (pan, huevos y pescado fresco).',
    'Pechuga y carne picada en bandejas grandes: divide en raciones y congela lo del jueves en adelante.',
    'El pescado (merluza, salmón) congelado sale más barato y vale igual.',
  ],
};

// Tiendas (etiqueta de color en cada producto)
export const STORES = {
  mercadona: { name: 'Mercadona', icon: '🛒', bg: 'rgba(0, 166, 81, 0.16)', fg: '#4ade80' },
  online: { name: 'Online', icon: '📦', bg: 'rgba(167, 139, 250, 0.16)', fg: '#c4b5fd' },
};
// Dónde comprar cada producto (por defecto, todo en Mercadona)
export const STORE_FOR = { whey: 'online' };
export const storeFor = (k) => STORES[STORE_FOR[k] || 'mercadona'];

// Pistas por producto (si no hay, vale cualquier marca)
export const STORE_HINTS = {
  batido0: 'Queso fresco batido 0% Hacendado (tarrina 500 g)',
  yogurPro: 'Yogur +Proteínas natural Hacendado (pack de 6)',
  claras: 'Claras de huevo pasteurizadas (brick, en la nevera de huevos)',
  pavo: 'Pechuga de pavo de 90% o más de carne (lonchas finas)',
  salmorejo: 'Nevera: salmorejo Hacendado o Alvalle',
  gazpacho: 'Nevera: gazpacho Hacendado o Alvalle',
  cremaCalabaza: 'Nevera: crema de calabaza Hacendado (o haz la tuya y congela)',
  cacao: 'Cacao puro en polvo desgrasado 0% azúcar (Hacendado, junto al Cola Cao)',
  chocolate85: 'Chocolate negro 85% (tableta; 1-2 onzas por toma)',
  tortitaArroz: 'Tortitas de maíz o arroz (las de maíz con sal tienen más sabor)',
  wrap: 'Tortillas de trigo integral (paquete de 8)',
  lentejas: 'Bote de cristal de lentejas cocidas',
  frijoles: 'Bote de alubias negras cocidas (o rojas)',
  espinacaCong: 'Congelados: espinacas en porciones (bolitas)',
  whey: 'Online (HSN Evowhey, MyProtein Impact Whey…): sabor chocolate o vainilla',
  leCoco: 'Lata de leche de coco (si no la hay light, pon la mitad)',
  merluza: 'Lomos de merluza (congelados valen y salen más baratos)',
  salmon: 'Lomos de salmón (congelados valen)',
  gambas: 'Gambas peladas congeladas',
  ternera5: 'Carne picada de vacuno 5% grasa (o "burger meat" magra)',
  quesoLight: 'Lonchas de queso light / havarti light',
  mozzaLight: 'Mozzarella rallada light',
};

export function niceQty(key, grams) {
  const f = FOODS[key];
  const unit = f?.unit || 'g';
  if (f?.per && f.perLabel && ['huevo', 'platano', 'manzana', 'kiwi', 'naranja', 'yogurPro', 'yogurNat', 'panBurger', 'wrap', 'quesito', 'quesoLight', 'tortitaArroz'].includes(key)) {
    const n = Math.ceil(grams / f.per);
    const forms = { ud: ['ud', 'ud'], loncha: ['loncha', 'lonchas'], tortita: ['tortita', 'tortitas'], porción: ['porción', 'porciones'] }[f.perLabel] || [f.perLabel, f.perLabel];
    return `${n} ${n === 1 ? forms[0] : forms[1]}`;
  }
  const rounded = Math.ceil(grams / 50) * 50;
  if (rounded >= 1000) return `${(rounded / 1000).toFixed(1).replace('.', ',')} ${unit === 'ml' ? 'L' : 'kg'}`;
  return `${rounded} ${unit}`;
}

// [{ cat, items: [{ k, g, name, qty, hint }] }]
// Con `state` y el lunes de la semana usa tu menú real (con los cambios del asesor); sin ellos, el menú base.
export function buildShoppingList(state = null, mondayIso = null) {
  const tot = {};
  const info = {};
  const add = (recipe) => {
    for (const [k, g] of recipe?.ingredients || []) {
      if (k === 'especias') continue;
      const f = foodFor(recipe, k);
      // Los alimentos propios de una receta nueva se agrupan por nombre
      const key = FOODS[k] ? k : `x:${(f?.name || k).toLowerCase()}`;
      tot[key] = (tot[key] || 0) + g;
      if (!info[key]) info[key] = { name: f?.name || k, cat: f?.cat || 'Otros' };
    }
  };
  if (state && mondayIso) {
    for (const iso of weekDates(mondayIso)) for (const sl of SLOTS) add(mealFor(state, iso, sl.key));
  } else {
    for (const day of WEEK_MENU) for (const sl of SLOTS) add(getRecipe(day[sl.key]));
  }
  const by = {};
  for (const [k, g] of Object.entries(tot)) {
    const cat = info[k].cat;
    (by[cat] = by[cat] || []).push({ k, g, name: info[k].name, qty: niceQty(k, g), hint: STORE_HINTS[k] || null, store: storeFor(k) });
  }
  return CATEGORY_ORDER.filter((c) => by[c]).map((c) => ({ cat: c, items: by[c].sort((a, b) => b.g - a.g) }));
}

export const PANTRY_NOTE =
  'Despensa básica: sal, pimienta, ajo en polvo, pimentón dulce, curry, cúrcuma, comino, orégano, canela, levadura química, laurel, azafrán/colorante, jengibre en polvo, lima/limón, mostaza.';

// Texto plano para copiar/compartir (WhatsApp, notas…)
export function shoppingText(groups, checked = {}, { onlyPending = true } = {}) {
  const lines = [`🛒 Compra de la semana (${STORE_PLAN.main})`];
  for (const g of groups) {
    const items = g.items.filter((it) => !onlyPending || !checked[it.k]);
    if (!items.length) continue;
    lines.push('', `${CATEGORY_EMOJI[g.cat] || '•'} ${g.cat}`);
    for (const it of items) lines.push(`- ${it.name}: ${it.qty}${it.store?.name && it.store.name !== STORE_PLAN.main ? ` (${it.store.name})` : ''}`);
  }
  return lines.join('\n');
}
