import Anthropic from '@anthropic-ai/sdk';
import { ADVISOR_SYSTEM } from '../../../lib/advisorPrompt.js';
import { TOOLS, TOOLS_LOOSE, runTool } from '../../../lib/advisorTools.js';

// Asesor IA: chat en streaming con Claude, con herramientas para cambiar el plan (menú, recetas, rutina, perfil, notas).
// Protegido por el middleware (cookie de sesión). Los cambios se devuelven al final de la respuesta y los aplica el móvil.
// API key: ANTHROPIC_API_KEY en Vercel (recomendado) o la que el usuario guarda en su móvil (cabecera x-anthropic-key).

export const runtime = 'nodejs';
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

const MODELS = {
  opus: 'claude-opus-5-5', // máxima calidad
  sonnet: 'claude-sonnet-5-5', // más rápido y barato
};

export async function GET() {
  return Response.json({ serverKey: !!process.env.ANTHROPIC_API_KEY, models: MODELS });
}

// Fotos que manda el usuario (JPEG/PNG/WebP/GIF en base64). Límites por foto y por petición (Vercel admite ~4,5 MB)
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_IMAGES_PER_MSG = 4;
const MAX_IMAGE_B64 = 1_500_000;
const MAX_TOTAL_IMAGE_B64 = 3_600_000;
const B64_RE = /^[A-Za-z0-9+/]+={0,2}$/;

function cleanImages(raw, budget) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const img of raw.slice(0, MAX_IMAGES_PER_MSG)) {
    const type = img?.media_type;
    const data = img?.data;
    if (!IMAGE_TYPES.has(type) || typeof data !== 'string' || data.length > MAX_IMAGE_B64 || data.length > budget.left || !B64_RE.test(data)) continue;
    budget.left -= data.length;
    out.push({ type: 'image', source: { type: 'base64', media_type: type, data } });
  }
  return out;
}

function cleanMessages(raw) {
  if (!Array.isArray(raw)) return [];
  const budget = { left: MAX_TOTAL_IMAGE_B64 };
  // Recorremos desde el final para que las fotos más recientes tengan prioridad en el presupuesto
  const msgs = [];
  for (const m of raw.slice(-30).reverse()) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant')) continue;
    const text = typeof m.content === 'string' ? m.content.slice(0, 12000).trim() : '';
    const images = m.role === 'user' ? cleanImages(m.images, budget) : [];
    if (!text && !images.length) continue;
    if (!images.length) {
      msgs.push({ role: m.role, content: text });
      continue;
    }
    // Fotos primero y luego el texto
    msgs.push({ role: 'user', content: [...images, { type: 'text', text: text || (images.length > 1 ? 'Te mando estas fotos.' : 'Te mando esta foto.') }] });
  }
  msgs.reverse();
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  return msgs;
}

function errorResponse(err) {
  let status = 500;
  let message = 'Error inesperado hablando con la IA. Inténtalo otra vez.';
  if (err instanceof Anthropic.AuthenticationError) {
    status = 401;
    message = 'La API key no es válida. Revísala en Ajustes → Asesor IA.';
  } else if (err instanceof Anthropic.PermissionDeniedError) {
    status = 403;
    message = 'Tu API key no tiene permiso para usar este modelo.';
  } else if (err instanceof Anthropic.NotFoundError) {
    status = 404;
    message = 'Ese modelo no está disponible para tu cuenta. Prueba con el otro.';
  } else if (err instanceof Anthropic.RateLimitError) {
    status = 429;
    message = 'Has llegado al límite de uso de la API. Espera un minuto y vuelve a probar.';
  } else if (err instanceof Anthropic.BadRequestError) {
    status = 400;
    message = `La API ha rechazado la petición: ${err.message}`;
  } else if (err instanceof Anthropic.APIConnectionError) {
    status = 502;
    message = 'No se pudo conectar con la API de Anthropic.';
  } else if (err instanceof Anthropic.APIError) {
    status = err.status || 500;
    message = `Error de la API (${err.status}): ${err.message}`;
  }
  return Response.json({ error: message }, { status });
}

// Señal que separa la respuesta del resumen de cambios (el móvil la quita al mostrar el texto)
const TRAILER = '\u001e';
const MAX_TOOL_ROUNDS = 6;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Petición no válida' }, { status: 400 });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY || req.headers.get('x-anthropic-key') || '';
  if (!apiKey) return Response.json({ error: 'NO_KEY' }, { status: 400 });

  const history = cleanMessages(body.messages);
  if (!history.length || history[history.length - 1].role !== 'user') {
    return Response.json({ error: 'Falta tu pregunta' }, { status: 400 });
  }
  const model = MODELS[body.model] || MODELS.opus;
  const context = typeof body.context === 'string' ? body.context.slice(0, 80000) : '';
  const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
  // Copia de trabajo: las herramientas simulan los cambios aquí y el móvil los aplica al final
  const work = {
    custom: isObj(body.custom) ? body.custom : {},
    profile: isObj(body.profile) ? body.profile : {},
    today: typeof body.today === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.today) ? body.today : null,
    ops: [],
    changes: [],
  };

  const client = new Anthropic({ apiKey, maxRetries: 1 });
  const system = [
    // Bloque fijo (plan completo) cacheado; los datos del usuario van detrás y cambian en cada mensaje
    { type: 'text', text: ADVISOR_SYSTEM, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: `DATOS ACTUALES DEL USUARIO (generados por la app ahora mismo):\n${context || 'No disponibles.'}` },
  ];
  const messages = history.map((m) => ({ role: m.role, content: m.content }));

  // Si la cuenta no admite el fallback de servidor o las herramientas estrictas, se repite sin ellos
  let useFallback = true;
  let useStrict = true;
  const open = () => {
    const params = {
      model,
      max_tokens: 32000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'medium' },
      system,
      tools: useStrict ? TOOLS : TOOLS_LOOSE,
      tool_choice: { type: 'auto' },
      messages,
    };
    return useFallback
      ? client.beta.messages.stream({ ...params, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }, { signal: req.signal })
      : client.beta.messages.stream(params, { signal: req.signal });
  };
  const downgrade = (err) => {
    if (!(err instanceof Anthropic.BadRequestError)) return false;
    const msg = err.message || '';
    if (useFallback && /fallback/i.test(msg)) return !(useFallback = false);
    if (useStrict && /strict|schema|eager_input_streaming/i.test(msg)) return !(useStrict = false);
    return false;
  };

  // Esperamos al primer evento para poder devolver errores (key inválida, sin saldo…) con su código HTTP
  let stream;
  let iter;
  let first;
  for (;;) {
    try {
      stream = open();
      iter = stream[Symbol.asyncIterator]();
      first = await iter.next();
      break;
    } catch (err) {
      if (downgrade(err)) continue;
      return errorResponse(err);
    }
  }

  const encoder = new TextEncoder();
  const body$ = new ReadableStream({
    async start(controller) {
      let lastChar = '\n';
      const write = (t) => {
        if (!t) return;
        controller.enqueue(encoder.encode(t));
        lastChar = t[t.length - 1];
      };
      const push = (ev) => {
        if (ev?.type === 'content_block_delta' && ev.delta?.type === 'text_delta') write(ev.delta.text);
      };
      try {
        for (let round = 0; ; round++) {
          if (round > 0) {
            stream = open();
            iter = stream[Symbol.asyncIterator]();
            first = await iter.next();
          }
          if (!first.done) push(first.value);
          for (;;) {
            const { value, done } = await iter.next();
            if (done) break;
            push(value);
          }
          const final = await stream.finalMessage();
          const toolUses = final.content.filter((b) => b.type === 'tool_use');

          if (final.stop_reason === 'refusal') {
            write('\n\n_No puedo ayudarte con eso tal y como está planteado. Prueba a reformular la pregunta._');
            break;
          }
          if (final.stop_reason === 'max_tokens') {
            write(toolUses.length ? '\n\n_(Me he quedado sin espacio antes de aplicar el cambio. Pídemelo otra vez.)_' : '\n\n_(Respuesta cortada por longitud. Pídeme que continúe.)_');
            break;
          }
          if (final.stop_reason !== 'tool_use' || !toolUses.length) break;
          if (round >= MAX_TOOL_ROUNDS) {
            write('\n\n_(He parado: demasiados cambios seguidos. Revisa lo aplicado.)_');
            break;
          }

          // Todas las respuestas a herramientas van juntas en un único mensaje
          const results = toolUses.map((tu) => {
            const r = runTool(tu.name, tu.input, work);
            return { type: 'tool_result', tool_use_id: tu.id, content: r.content, ...(r.isError ? { is_error: true } : {}) };
          });
          // El historial solo crece por el final: el turno del asistente tal cual (con su razonamiento) y los resultados
          messages.push({ role: 'assistant', content: final.content });
          messages.push({ role: 'user', content: results });
          if (lastChar !== '\n') write('\n\n');
        }
      } catch (err) {
        if (!req.signal?.aborted) write('\n\n⚠️ Se cortó la respuesta. Vuelve a intentarlo.');
      } finally {
        if (work.ops.length) write(TRAILER + JSON.stringify({ ops: work.ops, changes: work.changes }));
        controller.close();
      }
    },
    cancel() {
      stream?.abort();
    },
  });

  return new Response(body$, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      'X-Accel-Buffering': 'no',
      'X-Model': model,
    },
  });
}
