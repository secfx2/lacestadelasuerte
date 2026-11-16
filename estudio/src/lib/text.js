/* Punto de entrada de texto: Claude real o simulado (MOCK_MODE). */
import "server-only";
import { isMock } from "./env";

export async function textApi() {
  return isMock() ? import("./mockText") : import("./claude");
}
