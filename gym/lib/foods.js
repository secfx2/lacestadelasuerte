// Base de alimentos: valores por 100 g (o 100 ml). Aproximados a productos de súper español
// (Mercadona/Lidl/Carrefour). kcal, p = proteína, c = hidratos, f = grasa, fib = fibra.
// unit: cómo mostrar la cantidad (g por defecto). cat: pasillo para la lista de la compra.

export const FOODS = {
  // Proteínas
  pollo: { name: 'Pechuga de pollo', kcal: 113, p: 23, c: 0, f: 2, fib: 0, cat: 'Carne y pescado' },
  pavo: { name: 'Pechuga de pavo (fiambre +90%)', kcal: 98, p: 19, c: 1.5, f: 1.5, fib: 0, cat: 'Carne y pescado' },
  ternera5: { name: 'Carne picada de ternera 5% grasa', kcal: 125, p: 21, c: 0, f: 5, fib: 0, cat: 'Carne y pescado' },
  ternera: { name: 'Filete de ternera magra (tapa/babilla)', kcal: 120, p: 22, c: 0, f: 3.5, fib: 0, cat: 'Carne y pescado' },
  merluza: { name: 'Merluza (lomos)', kcal: 86, p: 17, c: 0, f: 1.8, fib: 0, cat: 'Carne y pescado' },
  salmon: { name: 'Salmón (lomo)', kcal: 200, p: 20, c: 0, f: 13, fib: 0, cat: 'Carne y pescado' },
  gambas: { name: 'Gambas peladas', kcal: 85, p: 19, c: 0, f: 1, fib: 0, cat: 'Carne y pescado' },
  atun: { name: 'Atún al natural (escurrido)', kcal: 110, p: 25, c: 0, f: 1, fib: 0, cat: 'Despensa' },
  huevo: { name: 'Huevo (≈60 g)', kcal: 143, p: 12.6, c: 0.7, f: 9.5, fib: 0, cat: 'Huevos y lácteos', per: 60, perLabel: 'ud' },
  claras: { name: 'Claras de huevo (brick)', kcal: 52, p: 10.9, c: 0.7, f: 0.2, fib: 0, cat: 'Huevos y lácteos', unit: 'ml' },
  whey: { name: 'Proteína whey (sabor a elegir)', kcal: 390, p: 78, c: 7, f: 6, fib: 0, cat: 'Suplementos', per: 30, perLabel: 'scoop' },

  // Lácteos
  batido0: { name: 'Queso fresco batido 0%', kcal: 46, p: 8, c: 3.5, f: 0.1, fib: 0, cat: 'Huevos y lácteos' },
  yogurPro: { name: 'Yogur +proteínas natural', kcal: 56, p: 10, c: 3.5, f: 0.2, fib: 0, cat: 'Huevos y lácteos', per: 120, perLabel: 'ud' },
  yogurNat: { name: 'Yogur natural desnatado', kcal: 40, p: 4.5, c: 5.5, f: 0.1, fib: 0, cat: 'Huevos y lácteos', per: 125, perLabel: 'ud' },
  leche: { name: 'Leche semidesnatada (o sin lactosa)', kcal: 46, p: 3.2, c: 4.7, f: 1.6, fib: 0, cat: 'Huevos y lácteos', unit: 'ml' },
  mozzaLight: { name: 'Mozzarella light rallada', kcal: 165, p: 20, c: 1, f: 9, fib: 0, cat: 'Huevos y lácteos' },
  quesoLight: { name: 'Queso en lonchas light', kcal: 270, p: 28, c: 1, f: 17, fib: 0, cat: 'Huevos y lácteos', per: 20, perLabel: 'loncha' },
  quesoRallado: { name: 'Queso rallado light', kcal: 165, p: 20, c: 1, f: 9, fib: 0, cat: 'Huevos y lácteos' },
  parmesano: { name: 'Parmesano', kcal: 390, p: 33, c: 0, f: 28, fib: 0, cat: 'Huevos y lácteos' },
  quesito: { name: 'Quesito light (porción)', kcal: 180, p: 12, c: 6, f: 12, fib: 0, cat: 'Huevos y lácteos', per: 16, perLabel: 'porción' },

  // Hidratos
  avena: { name: 'Copos o harina de avena', kcal: 372, p: 13.5, c: 59, f: 7, fib: 10, cat: 'Despensa' },
  arroz: { name: 'Arroz basmati (en crudo)', kcal: 350, p: 8, c: 77, f: 0.6, fib: 1.3, cat: 'Despensa' },
  pasta: { name: 'Pasta (en crudo)', kcal: 355, p: 12.5, c: 72, f: 1.5, fib: 3, cat: 'Despensa' },
  patata: { name: 'Patata', kcal: 77, p: 2, c: 17, f: 0.1, fib: 2, cat: 'Fruta y verdura' },
  pan: { name: 'Pan integral (molde o barra)', kcal: 247, p: 13, c: 41, f: 3.4, fib: 7, cat: 'Panadería' },
  panBurger: { name: 'Pan de hamburguesa', kcal: 280, p: 9, c: 48, f: 5, fib: 2.5, cat: 'Panadería', per: 70, perLabel: 'ud' },
  wrap: { name: 'Tortilla de trigo integral (wrap)', kcal: 300, p: 9, c: 48, f: 7, fib: 6, cat: 'Panadería', per: 40, perLabel: 'ud' },
  tortitaArroz: { name: 'Tortitas de arroz/maíz', kcal: 387, p: 8, c: 81, f: 3, fib: 3, cat: 'Despensa', per: 8, perLabel: 'tortita' },
  lentejas: { name: 'Lentejas cocidas (bote, escurridas)', kcal: 100, p: 8, c: 14, f: 0.5, fib: 5, cat: 'Despensa' },
  frijoles: { name: 'Alubias negras cocidas (bote)', kcal: 110, p: 7, c: 16, f: 0.5, fib: 6, cat: 'Despensa' },
  maicena: { name: 'Maicena', kcal: 350, p: 0, c: 87, f: 0, fib: 0, cat: 'Despensa' },

  // Fruta
  platano: { name: 'Plátano', kcal: 89, p: 1.1, c: 22.8, f: 0.3, fib: 2.6, cat: 'Fruta y verdura', per: 120, perLabel: 'ud' },
  frutosRojos: { name: 'Frutos rojos (congelados)', kcal: 50, p: 0.8, c: 10, f: 0.3, fib: 4, cat: 'Congelados' },
  manzana: { name: 'Manzana', kcal: 52, p: 0.3, c: 14, f: 0.2, fib: 2.4, cat: 'Fruta y verdura', per: 170, perLabel: 'ud' },
  kiwi: { name: 'Kiwi', kcal: 61, p: 1.1, c: 14.7, f: 0.5, fib: 3, cat: 'Fruta y verdura', per: 75, perLabel: 'ud' },
  naranja: { name: 'Naranja', kcal: 47, p: 0.9, c: 11.8, f: 0.1, fib: 2.4, cat: 'Fruta y verdura', per: 180, perLabel: 'ud' },
  pina: { name: 'Piña (natural o en su jugo)', kcal: 50, p: 0.5, c: 12, f: 0.1, fib: 1.4, cat: 'Fruta y verdura' },
  aguacate: { name: 'Aguacate', kcal: 160, p: 2, c: 8.5, f: 14.7, fib: 6.7, cat: 'Fruta y verdura' },

  // Verdura (siempre triturada, rallada fina o en crema)
  tomate: { name: 'Tomate (para rallar)', kcal: 18, p: 0.9, c: 3.9, f: 0.2, fib: 1.2, cat: 'Fruta y verdura' },
  tomateTriturado: { name: 'Tomate triturado (bote)', kcal: 30, p: 1.3, c: 5, f: 0.2, fib: 1.5, cat: 'Despensa' },
  cebolla: { name: 'Cebolla', kcal: 40, p: 1.1, c: 9.3, f: 0.1, fib: 1.7, cat: 'Fruta y verdura' },
  zanahoria: { name: 'Zanahoria', kcal: 41, p: 0.9, c: 9.6, f: 0.2, fib: 2.8, cat: 'Fruta y verdura' },
  calabacin: { name: 'Calabacín', kcal: 17, p: 1.2, c: 3.1, f: 0.3, fib: 1, cat: 'Fruta y verdura' },
  pimientoRojo: { name: 'Pimiento rojo', kcal: 31, p: 1, c: 6, f: 0.3, fib: 2.1, cat: 'Fruta y verdura' },
  espinacaCong: { name: 'Espinaca congelada (en porciones)', kcal: 23, p: 2.9, c: 1.4, f: 0.4, fib: 2.2, cat: 'Congelados' },
  salmorejo: { name: 'Salmorejo (envasado, refrigerado)', kcal: 105, p: 1.6, c: 8, f: 7.5, fib: 1, cat: 'Refrigerados', unit: 'ml' },
  gazpacho: { name: 'Gazpacho (envasado, refrigerado)', kcal: 55, p: 0.9, c: 4.2, f: 3.6, fib: 0.8, cat: 'Refrigerados', unit: 'ml' },
  cremaCalabaza: { name: 'Crema de calabaza (envasada)', kcal: 45, p: 0.8, c: 6, f: 2, fib: 1, cat: 'Refrigerados', unit: 'ml' },

  // Grasas y extras
  aove: { name: 'Aceite de oliva virgen extra', kcal: 884, p: 0, c: 0, f: 100, fib: 0, cat: 'Despensa', unit: 'ml' },
  crCacahuete: { name: 'Crema de cacahuete 100%', kcal: 600, p: 25, c: 14, f: 50, fib: 6, cat: 'Despensa' },
  leCoco: { name: 'Leche de coco light (lata)', kcal: 75, p: 0.7, c: 1.5, f: 7, fib: 0, cat: 'Despensa', unit: 'ml' },
  miel: { name: 'Miel', kcal: 304, p: 0.3, c: 82, f: 0, fib: 0, cat: 'Despensa' },
  soja: { name: 'Salsa de soja baja en sal', kcal: 60, p: 8, c: 6, f: 0, fib: 0, cat: 'Despensa', unit: 'ml' },
  sesamo: { name: 'Sésamo tostado', kcal: 570, p: 18, c: 12, f: 50, fib: 12, cat: 'Despensa' },
  ketchup: { name: 'Ketchup (o sin azúcar)', kcal: 100, p: 1.2, c: 24, f: 0.2, fib: 0.3, cat: 'Despensa' },
  caldo: { name: 'Caldo de pollo (brick)', kcal: 5, p: 0.5, c: 0.5, f: 0.1, fib: 0, cat: 'Despensa', unit: 'ml' },
  especias: { name: 'Especias (curry, pimentón, comino, orégano, canela, ajo en polvo)', kcal: 0, p: 0, c: 0, f: 0, fib: 0, cat: 'Despensa', noShop: false },
};

// Macros de una cantidad de un alimento
export function foodMacros(key, grams) {
  const f = FOODS[key];
  if (!f) return { kcal: 0, p: 0, c: 0, f: 0, fib: 0 };
  const k = grams / 100;
  return { kcal: f.kcal * k, p: f.p * k, c: f.c * k, f: f.f * k, fib: f.fib * k };
}

export function sumMacros(list) {
  return list.reduce(
    (a, m) => ({ kcal: a.kcal + m.kcal, p: a.p + m.p, c: a.c + m.c, f: a.f + m.f, fib: a.fib + m.fib }),
    { kcal: 0, p: 0, c: 0, f: 0, fib: 0 }
  );
}

export function roundMacros(m) {
  return { kcal: Math.round(m.kcal), p: Math.round(m.p), c: Math.round(m.c), f: Math.round(m.f), fib: Math.round(m.fib) };
}

// Texto bonito de cantidad: "2 ud (120 g)", "300 ml", "15 g"
export function qtyLabel(key, grams) {
  const f = FOODS[key];
  if (!f) return `${grams} g`;
  if (key === 'especias') return 'al gusto';
  const unit = f.unit || 'g';
  if (f.per && f.perLabel) {
    const n = grams / f.per;
    const nice = Math.abs(n - Math.round(n)) < 0.01 ? String(Math.round(n)) : (Math.round(n * 2) / 2).toString().replace('.', ',');
    const plural = { ud: 'ud', 'porción': 'porciones', scoop: 'scoops', loncha: 'lonchas', tortita: 'tortitas' }[f.perLabel] || f.perLabel;
    return `${nice} ${n > 1 ? plural : f.perLabel} (${grams} ${unit})`;
  }
  return `${grams} ${unit}`;
}
