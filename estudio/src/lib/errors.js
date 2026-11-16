/* Errores con mensaje para la usuaria (español) + detalle técnico opcional. */

export class UserError extends Error {
  constructor(message, { status = 400, detail = null, code = null } = {}) {
    super(message);
    this.name = "UserError";
    this.status = status;
    this.detail = detail;
    this.code = code;
  }
}

export class LimitError extends UserError {
  constructor(message, detail) {
    super(message, { status: 429, detail, code: "daily_limit" });
    this.name = "LimitError";
  }
}

export function json(data, init = {}) {
  return Response.json(data, init);
}

/** Convierte cualquier error en una respuesta JSON { error, detail, code }. */
export function errorResponse(err) {
  if (err instanceof UserError) {
    return Response.json({ error: err.message, detail: err.detail ?? null, code: err.code }, { status: err.status });
  }
  console.error("[estudio]", err);
  return Response.json(
    { error: "Algo ha fallado en el servidor. Vuelve a intentarlo en un momento.", detail: String(err?.message || err).slice(0, 2000) },
    { status: 500 }
  );
}

/** Envuelve un handler de ruta para devolver siempre JSON en caso de error. */
export function handler(fn) {
  return async (request, ctx) => {
    try {
      return await fn(request, ctx);
    } catch (err) {
      return errorResponse(err);
    }
  };
}

export async function readBody(request) {
  try {
    return await request.json();
  } catch {
    throw new UserError("La petición no es válida (JSON).");
  }
}
