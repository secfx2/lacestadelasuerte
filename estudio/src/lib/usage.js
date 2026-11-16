/* ==========================================================================
   Libro de uso diario: usage/<YYYY-MM-DD>.json (día de Madrid).
   Cada envío reserva sus créditos ANTES de llamar a Higgsfield; si el trabajo
   falla (failed / nsfw / error de envío) se devuelven (refunded).
   ========================================================================== */
import "server-only";
import { readJSON, updateJSON } from "./storage";
import { madridDay, lastDays, randomId } from "./time";
import { dailyLimits } from "./env";
import { LimitError } from "./errors";

const dayPath = (day) => `usage/${day}.json`;
const round = (n) => Math.round(n * 1000) / 1000;

export function totalsOf(doc) {
  let credits = 0;
  let usd = 0;
  let images = 0;
  for (const e of doc?.entries || []) {
    const net = Math.max(0, (e.credits || 0) - (e.refunded || 0));
    credits += net;
    if (e.usd != null && e.credits) usd += e.usd * (net / e.credits);
    else if (e.usd != null) usd += e.usd;
    if (e.kind === "image") images += Math.max(0, (e.n || 0) - (e.refundedN || 0));
  }
  return { credits: round(credits), usd: round(usd), images };
}

export async function readDay(day = madridDay()) {
  const { data } = await readJSON(dayPath(day));
  return data || { day, entries: [] };
}

export async function todaySummary() {
  const doc = await readDay();
  const t = totalsOf(doc);
  const limits = dailyLimits();
  return { day: doc.day, ...t, limit: limits.credits, usdLimit: limits.usd, remaining: round(Math.max(0, limits.credits - t.credits)) };
}

const fmt = (n) => (Math.round(n * 10) / 10).toLocaleString("es-ES");

/**
 * Reserva créditos para varias entradas de una vez (comprobación atómica del
 * límite). entries: [{ jobId, tool, brand, model, provider, n, credits, usd }]
 */
export async function reserve(entries) {
  const day = madridDay();
  const limits = dailyLimits();
  const want = round(entries.reduce((s, e) => s + (e.credits || 0), 0));
  const wantUsd = entries.reduce((s, e) => s + (e.usd || 0), 0);
  const created = entries.map((e) => ({ id: randomId(10), at: new Date().toISOString(), kind: "image", refunded: 0, refundedN: 0, ...e, credits: round(e.credits || 0) }));
  await updateJSON(dayPath(day), (doc) => {
    doc = doc || { day, entries: [] };
    const t = totalsOf(doc);
    if (t.credits + want > limits.credits + 1e-9) {
      throw new LimitError(
        `Límite diario alcanzado: hoy llevas ${fmt(t.credits)} de ${fmt(limits.credits)} créditos y esto cuesta ${fmt(want)}. ` +
          (t.credits < limits.credits ? `Quedan ${fmt(limits.credits - t.credits)}: prueba con menos imágenes. ` : "") +
          "El contador se reinicia a medianoche (hora de Madrid).",
        { used: t.credits, limit: limits.credits, cost: want }
      );
    }
    if (limits.usd != null && wantUsd > 0 && t.usd + wantUsd > limits.usd + 1e-9) {
      throw new LimitError(
        `Límite diario en dólares alcanzado: hoy llevas ${t.usd.toFixed(2)} $ de ${limits.usd.toFixed(2)} $ y esto cuesta unos ${wantUsd.toFixed(2)} $.`,
        { usedUsd: t.usd, usdLimit: limits.usd, costUsd: wantUsd }
      );
    }
    return { ...doc, entries: [...doc.entries, ...created] };
  });
  return created.map((e) => ({ day, entryId: e.id }));
}

/** Devuelve créditos de una entrada (total o parcial: n imágenes). */
export async function refund(ledger, { credits, n = 0, reason = "" } = {}) {
  if (!ledger?.day || !ledger?.entryId) return;
  await updateJSON(dayPath(ledger.day), (doc) => {
    if (!doc) return undefined;
    let changed = false;
    const entries = doc.entries.map((e) => {
      if (e.id !== ledger.entryId) return e;
      const amount = credits == null ? e.credits : credits;
      const refunded = round(Math.min(e.credits, (e.refunded || 0) + amount));
      if (refunded === e.refunded) return e;
      changed = true;
      return { ...e, refunded, refundedN: Math.min(e.n || 0, (e.refundedN || 0) + n), status: refunded >= e.credits ? "refunded" : "partial", refundReason: reason || e.refundReason };
    });
    return changed ? { ...doc, entries } : undefined;
  });
}

/** Llamadas de texto (Claude): 0 créditos, coste estimado en USD por tokens. */
export async function recordText({ tool, brand, usage }) {
  if (!usage) return;
  const input = (usage.input_tokens || 0) + (usage.cache_creation_input_tokens || 0) * 1.25 + (usage.cache_read_input_tokens || 0) * 0.1;
  const usd = round((input * 4 + (usage.output_tokens || 0) * 20) / 1e6);
  const day = madridDay();
  await updateJSON(dayPath(day), (doc) => {
    doc = doc || { day, entries: [] };
    return {
      ...doc,
      entries: [...doc.entries, { id: randomId(10), at: new Date().toISOString(), kind: "text", tool, brand, model: "claude-opus-5-5", provider: "anthropic", n: 0, credits: 0, usd, tokens: { in: usage.input_tokens || 0, out: usage.output_tokens || 0 } }],
    };
  }).catch((e) => console.error("[usage] recordText", e));
}

export async function history(days = 7) {
  const list = lastDays(days);
  const docs = await Promise.all(list.map((d) => readDay(d)));
  return docs.map((doc, i) => ({ day: list[i], ...totalsOf(doc), count: doc.entries.length }));
}
