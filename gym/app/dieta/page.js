'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import Icon from '../../components/Icon';
import FoodImg from '../../components/FoodImg';
import { Bar, Check, PageSkeleton, MacroLine } from '../../components/ui';
import { useAppState, useHydrated, update } from '../../lib/store';
import { SLOTS, WEEK_MENU, getRecipe, recipeMacros, dayMacros, NIGHT_SNACK } from '../../lib/recipes';
import { FOODS } from '../../lib/foods';
import { DAY_NAMES, DAY_SHORT, todayISO, weekdayIdx, mondayOf } from '../../lib/dates';
import { DAILY_TARGETS } from '../../lib/program';

export default function DietaPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Dieta />
    </Suspense>
  );
}

function Dieta() {
  const params = useSearchParams();
  const router = useRouter();
  const hydrated = useHydrated();
  const tab = params.get('tab') || 'menu';
  const todayIdx = hydrated ? weekdayIdx(todayISO()) : 0;
  const dayIdx = params.get('dia') != null ? Number(params.get('dia')) : todayIdx;
  const go = (q) => router.replace(`/dieta?${new URLSearchParams(q).toString()}`, { scroll: false });

  if (!hydrated) return <PageSkeleton />;

  return (
    <>
      <header className="page-head">
        <div>
          <div className="eyebrow">~2.300 kcal entreno · ~2.100 descanso · 190-210 g proteína</div>
          <h1>Dieta</h1>
          <p className="sub">Sin verdura slimy ni crujiente: toda va triturada, en crema o escondida.</p>
        </div>
      </header>

      <div className="tabs" style={{ marginBottom: 16 }}>
        {[
          ['menu', 'Menú'],
          ['compra', 'Compra'],
          ['reglas', 'Reglas'],
        ].map(([k, l]) => (
          <button key={k} className={`tab${tab === k ? ' on' : ''}`} onClick={() => go({ tab: k, ...(k === 'menu' ? { dia: dayIdx } : {}) })}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'menu' && <Menu dayIdx={dayIdx} todayIdx={todayIdx} onDay={(i) => go({ tab: 'menu', dia: i })} />}
      {tab === 'compra' && <Shopping />}
      {tab === 'reglas' && <Rules />}
    </>
  );
}

function Menu({ dayIdx, todayIdx, onDay }) {
  const s = useAppState();
  const menu = WEEK_MENU[dayIdx];
  const tot = dayMacros(dayIdx);
  const iso = todayISO();
  const isToday = dayIdx === todayIdx;
  const eaten = isToday ? s.days[iso]?.meals || {} : {};
  return (
    <>
      <div className="chips" style={{ marginBottom: 14 }}>
        {DAY_SHORT.map((d, i) => (
          <button key={d} className={`chip${i === dayIdx ? ' on' : ''}${i === todayIdx ? ' today' : ''}`} onClick={() => onDay(i)}>
            {DAY_NAMES[i]}
            {i === todayIdx ? ' · hoy' : ''}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="spread">
          <div>
            <div className="small muted">Total {DAY_NAMES[dayIdx].toLowerCase()}</div>
            <MacroLine m={tot} />
          </div>
          <span className={`pill ${dayIdx === 6 ? 'cyan' : dayIdx === 5 ? 'amber' : 'lime'}`}>
            {dayIdx === 6 ? 'Descanso' : dayIdx === 5 ? 'Cena libre' : 'Entreno'}
          </span>
        </div>
        <div style={{ marginTop: 10 }}>
          <Bar pct={tot.p / 220} />
          <div className="tiny muted" style={{ marginTop: 5 }}>
            Proteína {tot.p} g · Fibra {tot.fib} g (objetivo 30 g)
          </div>
        </div>
      </div>

      <div className="stack">
        {SLOTS.map((sl) => {
          const r = getRecipe(menu[sl.key]);
          const m = recipeMacros(r);
          return (
            <Link key={sl.key} href={`/receta/${r.id}?slot=${sl.key}${isToday ? `&d=${iso}` : ''}`} className="card flush row" style={{ gap: 0, alignItems: 'stretch' }}>
              <FoodImg recipe={r} style={{ width: 108, minHeight: 108, flex: 'none' }} sizes="120px" />
              <div className="grow" style={{ padding: '12px 14px' }}>
                <div className="spread">
                  <span className="tiny muted" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {sl.emoji} {sl.label} · {sl.time}
                  </span>
                  {eaten[sl.key] && <span className="pill lime">✓</span>}
                </div>
                <div style={{ fontWeight: 650, marginTop: 4, lineHeight: 1.25 }}>{r.name}</div>
                <div style={{ marginTop: 6 }}>
                  <MacroLine m={m} compact />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {dayIdx === 5 && (
        <div className="hint warn" style={{ marginTop: 14 }}>
          <Icon name="info" size={18} />
          <span>
            <b>Cena libre controlada.</b> Si sales a cenar en vez de la hamburguesa: elige 1 plato principal con proteína, sin entrante frito, postre o 2 cervezas (no las dos cosas). Mañana vuelves al plan sin compensar.
          </span>
        </div>
      )}
      {dayIdx === 6 && (
        <div className="hint" style={{ marginTop: 14 }}>
          <Icon name="info" size={18} />
          <span>Día de descanso: misma proteína, menos hidratos (la merienda cambia). ~2.100 kcal.</span>
        </div>
      )}
      <div className="hint" style={{ marginTop: 10 }}>
        <Icon name="moon" size={18} />
        <span>
          <b>{NIGHT_SNACK.name}:</b> {NIGHT_SNACK.text}
        </span>
      </div>
      <p className="tiny faint" style={{ marginTop: 12 }}>
        Agua: {DAILY_TARGETS.waterMl / 1000} L al día. Pesa la comida en crudo las 2 primeras semanas; luego ya lo harás a ojo.
      </p>
    </>
  );
}

function niceQty(key, grams) {
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

function Shopping() {
  const s = useAppState();
  const week = mondayOf(todayISO());
  const checked = s.shopping[week] || {};
  const groups = useMemo(() => {
    const tot = {};
    for (const day of WEEK_MENU) {
      for (const sl of SLOTS) {
        for (const [k, g] of getRecipe(day[sl.key]).ingredients) {
          if (k === 'especias') continue;
          tot[k] = (tot[k] || 0) + g;
        }
      }
    }
    const by = {};
    for (const [k, g] of Object.entries(tot)) {
      const cat = FOODS[k]?.cat || 'Otros';
      (by[cat] = by[cat] || []).push({ k, g });
    }
    const order = ['Carne y pescado', 'Huevos y lácteos', 'Fruta y verdura', 'Congelados', 'Refrigerados', 'Panadería', 'Despensa', 'Suplementos', 'Otros'];
    return order.filter((c) => by[c]).map((c) => ({ cat: c, items: by[c].sort((a, b) => b.g - a.g) }));
  }, []);
  const toggle = (k) =>
    update((d) => {
      d.shopping[week] = { ...(d.shopping[week] || {}), [k]: !d.shopping[week]?.[k] };
    });
  const total = groups.reduce((a, g) => a + g.items.length, 0);
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="spread">
          <div>
            <h3>Compra semanal</h3>
            <p className="small muted">Para los 7 días del menú (1 persona). Redondeado hacia arriba.</p>
          </div>
          <span className="pill lime num">
            {done}/{total}
          </span>
        </div>
        <div style={{ marginTop: 10 }}>
          <Bar pct={done / total} />
        </div>
      </div>
      <div className="stack">
        {groups.map((g) => (
          <div key={g.cat} className="card">
            <div className="section-title" style={{ margin: '0 0 4px' }}>{g.cat}</div>
            <div className="list">
              {g.items.map(({ k, g: grams }) => (
                <div key={k} className="list-item" style={{ padding: '9px 0' }}>
                  <Check on={checked[k]} round onClick={() => toggle(k)} label="Comprado" />
                  <span className="grow" style={{ textDecoration: checked[k] ? 'line-through' : 'none', opacity: checked[k] ? 0.5 : 1 }}>
                    {FOODS[k]?.name || k}
                  </span>
                  <span className="num small muted">{niceQty(k, grams)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="card soft small muted">
          Despensa básica: sal, pimienta, ajo en polvo, pimentón dulce, curry, cúrcuma, comino, orégano, canela, levadura química, laurel, azafrán/colorante, jengibre en polvo, lima/limón, mostaza.
        </div>
      </div>
    </>
  );
}

function Rules() {
  return (
    <div className="stack">
      <div className="card">
        <h3>🥷 Verdura escondida (sin texturas raras)</h3>
        <ul className="ul" style={{ marginTop: 10 }}>
          <li>
            <b>Sofrito triturado:</b> cebolla, zanahoria y pimiento pochados y pasados por la batidora en curry, lentejas y boloñesa. Sabor sí, tropezones no.
          </li>
          <li>
            <b>Cremas lisas tipo velouté:</b> calabaza, calabacín con quesito, zanahoria. Nada de trozos.
          </li>
          <li>
            <b>Gazpacho y salmorejo</b> (los de la nevera del súper): un vaso = 1-2 raciones de verdura.
          </li>
          <li>
            <b>Espinaca congelada en batidos:</b> con plátano y cacahuete (o whey de chocolate) no se nota nada.
          </li>
          <li>
            <b>Tomate rallado</b> en tostadas y bocadillos.
          </li>
          <li>
            <b>Fruta todos los días (2-3 piezas):</b> kiwi, naranja, frutos rojos, plátano, piña, manzana. Es tu fuente principal de vitaminas.
          </li>
          <li>
            <b>Seguro:</b> multivitamínico + psyllium si vas mal al baño (ver Suplementos).
          </li>
        </ul>
      </div>
      <div className="card">
        <h3>🔁 Intercambios (si algo no te apetece)</h3>
        <ul className="ul" style={{ marginTop: 10 }}>
          <li>
            <b>Proteína:</b> 150 g pollo = 150 g pavo o ternera magra = 200 g pescado blanco = 140 g atún al natural = 1 huevo + 250 ml claras.
          </li>
          <li>
            <b>Hidratos:</b> 80 g arroz o pasta (crudo) = 350 g patata = 150 g pan = 100 g avena = 9 tortitas de arroz.
          </li>
          <li>
            <b>Grasa:</b> 10 ml aceite = 15 g crema de cacahuete = 60 g aguacate = 15 g frutos secos.
          </li>
          <li>
            Cambiar recetas de día entre sí está bien. Lo importante es el total del día.
          </li>
        </ul>
      </div>
      <div className="card">
        <h3>🍽️ Comer fuera</h3>
        <ul className="ul" style={{ marginTop: 10 }}>
          <li>Plato a la plancha (pollo, ternera, pescado) + patata/arroz. Salsas aparte.</li>
          <li>Menú del día: primero de crema/gazpacho/legumbre, segundo plancha, postre fruta o café.</li>
          <li>Hamburguesería: burger sencilla sin bacon ni salsas, y patatas compartidas.</li>
          <li>Alcohol: si bebes, cerveza 0,0 o 1-2 copas máximo. El alcohol frena la quema de grasa e hincha la cara.</li>
        </ul>
      </div>
      <div className="card">
        <h3>😤 Si tienes hambre</h3>
        <ul className="ul" style={{ marginTop: 10 }}>
          <li>Agua con gas, café solo o té antes de picar.</li>
          <li>Queso batido 0% con canela: 100 kcal y llena muchísimo.</li>
          <li>Más gazpacho o crema de calabaza: mucho volumen, pocas calorías.</li>
          <li>Duerme más: dormir poco dispara el hambre al día siguiente.</li>
          <li>Hambre leve a media tarde es normal en definición. Hambre brutal todo el día = avisa a la app (pesos) y subimos calorías.</li>
        </ul>
      </div>
    </div>
  );
}
