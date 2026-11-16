/* ==========================================================================
   Selección de proveedor de imágenes (un único punto de entrada):
     1. MOCK_MODE=1 → simulado (requiere "conectar" la cuenta simulada)
     2. Cuenta Higgsfield conectada por MCP (créditos del plan) — por defecto
     3. API pública con HF_API_KEY/HF_API_SECRET (pago por uso, USD) — alternativa
   ========================================================================== */
import "server-only";
import { isMock, hasApiKeys } from "../env";
import { UserError } from "../errors";
import { connectionStatus } from "./oauth";

export const notConnected = () =>
  new UserError("Higgsfield no está conectado. El propietario tiene que conectar su cuenta en Ajustes → «Conectar Higgsfield».", { status: 409, code: "hf_not_connected" });

export async function providerFor(kind, settings) {
  if (kind === "mock") return (await import("./mock")).mockProvider;
  if (kind === "mcp") return (await import("./mcp")).mcpProvider;
  if (kind === "api") return (await import("./api")).apiProvider(settings);
  throw new Error("Proveedor desconocido: " + kind);
}

/** Proveedor activo para nuevos envíos. */
export async function getProvider(settings) {
  const status = await connectionStatus();
  if (isMock()) {
    if (!status.connected) throw notConnected();
    return providerFor("mock", settings);
  }
  if (status.connected && !status.mock) return providerFor("mcp", settings);
  if (hasApiKeys()) return providerFor("api", settings);
  throw notConnected();
}

export async function providerSummary() {
  const status = await connectionStatus();
  // Fuera de MOCK_MODE, una conexión simulada guardada no cuenta.
  const connection = !isMock() && status.mock ? { ...status, connected: false } : status;
  const active = isMock() ? (status.connected ? "mock" : null) : connection.connected ? "mcp" : hasApiKeys() ? "api" : null;
  return { active, connection, apiKeys: hasApiKeys(), mock: isMock() };
}
