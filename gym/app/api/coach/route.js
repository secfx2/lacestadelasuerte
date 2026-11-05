import Anthropic from '@anthropic-ai/sdk';
import { ADVISOR_SYSTEM } from '../../../lib/advisorPrompt.js';

// Asesor IA: chat en streaming con Claude. Protegido por el middleware (cookie de sesión).
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

function cleanMessages(raw) {
  if (!Array.isArray(raw)) return [];
  const msgs = raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, 12000) }))
    .slice(-30);
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

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Petición no válida' }, { status: 400 });
  }
  const apiKey = process.env.ANTHROPIC_API_KEY || req.headers.get('x-anthropic-key') || '';
  if (!apiKey) return Response.json({ error: 'NO_KEY' }, { status: 400 });

  const messages = cleanMessages(body.messages);
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return Response.json({ error: 'Falta tu pregunta' }, { status: 400 });
  }
  const model = MODELS[body.model] || MODELS.opus;
  const context = typeof body.context === 'string' ? body.context.slice(0, 60000) : '';

  const client = new Anthropic({ apiKey, maxRetries: 1 });
  const params = {
    model,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium' },
    system: [
      // Bloque fijo (plan completo) cacheado; los datos del usuario van detrás y cambian en cada mensaje
      { type: 'text', text: ADVISOR_SYSTEM, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: `DATOS ACTUALES DEL USUARIO (generados por la app ahora mismo):\n${context || 'No disponibles.'}` },
    ],
    messages,
  };
  // Con fallback de servidor: si el modelo rechaza una petición legítima, la API la reintenta sola con el modelo recomendado
  const open = (withFallback) =>
    withFallback
      ? client.beta.messages.stream({ ...params, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' }, { signal: req.signal })
      : client.beta.messages.stream(params, { signal: req.signal });

  // Esperamos al primer evento para poder devolver errores (key inválida, sin saldo…) con su código HTTP
  let stream = open(true);
  let iter = stream[Symbol.asyncIterator]();
  let first;
  try {
    first = await iter.next();
  } catch (err) {
    // Si la cuenta no admite el parámetro de fallback, repetimos sin él
    if (err instanceof Anthropic.BadRequestError && /fallback/i.test(err.message || '')) {
      try {
        stream = open(false);
        iter = stream[Symbol.asyncIterator]();
        first = await iter.next();
      } catch (err2) {
        return errorResponse(err2);
      }
    } else {
      return errorResponse(err);
    }
  }

  const encoder = new TextEncoder();
  const body$ = new ReadableStream({
    async start(controller) {
      const push = (ev) => {
        if (ev?.type === 'content_block_delta' && ev.delta?.type === 'text_delta') controller.enqueue(encoder.encode(ev.delta.text));
      };
      try {
        if (!first.done) push(first.value);
        for (;;) {
          const { value, done } = await iter.next();
          if (done) break;
          push(value);
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === 'refusal') {
          controller.enqueue(encoder.encode('\n\n_No puedo ayudarte con eso tal y como está planteado. Prueba a reformular la pregunta._'));
        } else if (final.stop_reason === 'max_tokens') {
          controller.enqueue(encoder.encode('\n\n_(Respuesta cortada por longitud. Pídeme que continúe.)_'));
        }
      } catch (err) {
        if (!req.signal?.aborted) controller.enqueue(encoder.encode('\n\n⚠️ Se cortó la respuesta. Vuelve a intentarlo.'));
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
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
