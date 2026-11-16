/* Comprobaciones de sesión en rutas (además del middleware). */
import "server-only";
import { ADMIN_COOKIE, readCookie, verifyToken } from "./session";
import { UserError } from "./errors";

export async function isAdmin(request) {
  if (!process.env.ADMIN_PASSWORD) return true;
  return verifyToken(readCookie(request, ADMIN_COOKIE), "a");
}

export async function requireAdmin(request) {
  if (!(await isAdmin(request))) throw new UserError("Esta acción es solo para el propietario: desbloquea Ajustes con la contraseña de administrador.", { status: 403, code: "admin" });
}
