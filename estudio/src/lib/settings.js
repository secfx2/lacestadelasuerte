/* Ajustes persistentes (config/settings.json), con los valores del registro
   como respaldo. */
import "server-only";
import { readJSON, updateJSON } from "./storage";
import { ROLES, ROLE_IDS, API_ROLE_CANDIDATES } from "@/config/models";

const PATH = "config/settings.json";

export function defaultSettings() {
  const roles = {};
  for (const id of ROLE_IDS) roles[id] = { ...ROLES[id].mcp, extra: {} };
  const apiActive = {};
  for (const id of ROLE_IDS) apiActive[id] = API_ROLE_CANDIDATES[id][0];
  return { roles, api: { active: apiActive, custom: [] }, checks: { mcp: null, api: null } };
}

export async function getSettings() {
  const { data } = await readJSON(PATH);
  const d = defaultSettings();
  if (!data) return d;
  const roles = {};
  for (const id of ROLE_IDS) roles[id] = { ...d.roles[id], ...(data.roles?.[id] || {}) };
  return {
    roles,
    api: { active: { ...d.api.active, ...(data.api?.active || {}) }, custom: Array.isArray(data.api?.custom) ? data.api.custom : [] },
    checks: { mcp: data.checks?.mcp || null, api: data.checks?.api || null },
  };
}

export async function saveSettings(mutator) {
  const next = await updateJSON(PATH, async (cur) => {
    const base = cur ? await getSettings() : defaultSettings();
    return mutator(base);
  });
  return next;
}
