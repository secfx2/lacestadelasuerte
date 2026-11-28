#!/usr/bin/env python3
"""PreToolUse guard for the Aesthetic Coach app's Supabase and Vercel tools.

Routine work runs without a permission prompt: reading or updating the app's own
data (schema aesthetic_coach) and deploying the aesthetic-coach Vercel project.
Anything else asks first, for example DDL (drop, alter, create, grant...),
DELETE, tables outside aesthetic_coach, or a deploy of another project.
If this script cannot decide, it asks.
"""
import json
import re
import sys

ASK_DDL = re.compile(
    r"\b(drop|truncate|alter|create|grant|revoke|delete|copy|reindex|vacuum|cluster|"
    r"comment\s+on|security\s+label|do\s+\$|lo_import|pg_read_file|pg_ls_dir|dblink)\b"
)
TARGET = re.compile(r"\b(from|join|into|update|table)\s+(only\s+)?([a-z_][a-z0-9_$]*(?:\.[a-z_][a-z0-9_$]*)?)\s*(\()?")
QUALIFIED_CALL = re.compile(r"\b([a-z_][a-z0-9_$]*)\.([a-z_][a-z0-9_$]*)\s*\(")
QUALIFIED = re.compile(r"\b([a-z_][a-z0-9_$]*)\.([a-z_][a-z0-9_$]*)\b(\s*\()?")
# Schemas of this Supabase project that are not the app's (public also holds another project's data)
OTHER_SCHEMAS = {
    "public", "auth", "extensions", "graphql", "graphql_public", "information_schema", "pgbouncer",
    "realtime", "storage", "supabase_migrations", "vault", "pg_catalog", "cron", "net", "supabase_functions",
}
CTE = re.compile(r"\b([a-z_][a-z0-9_$]*)\s+as\s+(?:not\s+)?(?:materialized\s+)?\(")


def strip_sql(q: str) -> str:
    q = re.sub(r"--[^\n]*", " ", q)
    q = re.sub(r"/\*.*?\*/", " ", q, flags=re.S)
    q = re.sub(r"\$([a-z_]*)\$.*?\$\1\$", " '' ", q, flags=re.S | re.I)  # dollar-quoted bodies
    q = re.sub(r"'(?:[^']|'')*'", " '' ", q)  # string literals
    q = re.sub(r'"([^"]*)"', r"\1", q)  # quoted identifiers
    return q.lower()


def sql_reason(query: str):
    q = strip_sql(query)
    m = ASK_DDL.search(q)
    if m:
        return f"la consulta usa '{m.group(1)}'"
    ctes = set(CTE.findall(q))
    for kw, _only, name, paren in TARGET.findall(q):
        if paren:  # function call in FROM (now(), jsonb_each(...)), or a subquery
            continue
        if name.startswith("aesthetic_coach.") or name in ctes:
            continue
        if kw == "from" and name in {"select", "lateral"}:
            continue
        return f"toca '{name}', que no es del esquema aesthetic_coach"
    for schema, fn in QUALIFIED_CALL.findall(q):
        if schema == "aesthetic_coach" or (schema == "public" and fn.startswith("ac_")):
            continue
        if schema in {"pg_catalog"}:
            continue
        return f"llama a '{schema}.{fn}()'"
    # Any other mention of a non-app schema (e.g. a second table after a comma in FROM)
    for schema, name, paren in QUALIFIED.findall(q):
        if schema in OTHER_SCHEMAS and not (schema == "public" and name.startswith("ac_") and paren):
            return f"menciona '{schema}.{name}'"
    return None


def decide(payload: dict):
    tool = payload.get("tool_name", "")
    inp = payload.get("tool_input") or {}
    if tool.endswith("__execute_sql"):
        query = inp.get("query")
        if not isinstance(query, str) or not query.strip():
            return "ask", "consulta vacía o ilegible"
        reason = sql_reason(query)
        return ("ask", f"SQL fuera de lo rutinario: {reason}") if reason else ("allow", "lectura/escritura rutinaria de aesthetic_coach")
    if tool.endswith("__create_deployment"):
        body = inp.get("requestBody") or {}
        project = body.get("project") or body.get("name")
        if project == "aesthetic-coach":
            return "allow", "despliegue de aesthetic-coach"
        return "ask", f"despliegue de otro proyecto ({project!r})"
    return None, None


def main():
    try:
        payload = json.load(sys.stdin)
        decision, reason = decide(payload)
    except Exception as e:  # never fail open
        decision, reason = "ask", f"el guard no pudo analizar la llamada ({e.__class__.__name__})"
    if decision is None:
        return
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": decision,
            "permissionDecisionReason": reason,
        }
    }))


if __name__ == "__main__":
    main()
