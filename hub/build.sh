#!/usr/bin/env bash
# Builds every brand as a static Next.js export under /<slug> and assembles one static site in hub/dist:
#   dist/index.html            portal (from portal/ + brands.json, only the brands actually built)
#   dist/404.html              hub-wide 404 (offers "Volver a <MARCA>" when the path starts with a brand)
#   dist/<slug>/...            the brand's `next build` export (NEXT_OUTPUT=export, basePath /<slug>)
#   dist/<slug>.txt            RSC payload of the brand home (client navigation to /<slug> fetches it)
#   dist/_hub/...              portal assets (fonts, favicon)
#
# Env:
#   BRANDS="musketeer orbita"   brands to build (default: all four), each one a folder next to hub/
#   HUB_SKIP_INSTALL=1          reuse an existing node_modules instead of `npm ci` (local iterations)
#   HUB_CONTINUE_ON_ERROR=1     skip a brand whose install/build fails instead of failing the whole build
#   NEXT_PUBLIC_SITE_URL        absolute site URL for canonical/OG tags (defaults to the Vercel production URL)
set -euo pipefail

HUB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$HUB_DIR/.." && pwd)"
DIST="$HUB_DIR/dist"
BRANDS="${BRANDS:-musketeer orbita malafama pecado}"

export NEXT_TELEMETRY_DISABLED=1
if [[ -z "${NEXT_PUBLIC_SITE_URL:-}" && -n "${VERCEL_PROJECT_PRODUCTION_URL:-}" ]]; then
  export NEXT_PUBLIC_SITE_URL="https://${VERCEL_PROJECT_PRODUCTION_URL}"
fi

log() { printf '\n\033[1m==> %s\033[0m\n' "$*"; }
warn() { printf '\033[33m  ! %s\033[0m\n' "$*" >&2; }

# Explicit `|| return 1`: errexit is suspended inside `if ! (...)`, where this runs.
build_brand() {
  local slug="$1" dir="$2"
  cd "$dir" || return 1
  if [[ "${HUB_SKIP_INSTALL:-0}" == "1" && -d node_modules ]]; then
    echo "  install: skipped (HUB_SKIP_INSTALL=1)"
  elif [[ -f package-lock.json ]]; then
    npm ci --no-audit --no-fund || return 1
  else
    npm install --no-audit --no-fund || return 1
  fi
  rm -rf out
  # With `output: "export"` Next 15 always compiles into .next (a custom distDir would only rename
  # the export folder), so keep a normal-build .next aside and put it back afterwards.
  local keep=".next-hub-keep" status=0
  if [[ -d "$keep" ]]; then rm -rf .next && mv "$keep" .next; fi # leftover of an interrupted run
  if [[ -d .next ]]; then mv .next "$keep"; fi
  NEXT_OUTPUT=export NEXT_PUBLIC_BASE_PATH="/$slug" NEXT_DIST_DIR= npx --no-install next build || status=$?
  rm -rf .next
  if [[ -d "$keep" ]]; then mv "$keep" .next; fi
  [[ $status -eq 0 ]] || return 1
  [[ -f out/index.html ]] || { echo "  no out/index.html after the build" >&2; return 1; }
}

rm -rf "$DIST"
mkdir -p "$DIST"
built=()

for slug in $BRANDS; do
  if [[ ! "$slug" =~ ^[a-z0-9][a-z0-9-]*$ || "$slug" == "hub" ]]; then
    warn "invalid brand slug '$slug': skipped"
    continue
  fi
  dir="$REPO_DIR/$slug"
  if [[ ! -f "$dir/package.json" ]]; then
    warn "$slug: no $dir/package.json, skipped"
    continue
  fi

  log "$slug  →  /$slug"
  start=$SECONDS
  if ! (build_brand "$slug" "$dir"); then
    if [[ "${HUB_CONTINUE_ON_ERROR:-0}" == "1" ]]; then
      warn "$slug: build failed, skipped (HUB_CONTINUE_ON_ERROR=1)"
      rm -rf "$dir/out"
      continue
    fi
    echo "ERROR: $slug failed to build (set HUB_CONTINUE_ON_ERROR=1 to skip failing brands)" >&2
    exit 1
  fi

  cp -R "$dir/out" "$DIST/$slug"
  rm -rf "$dir/out"
  # Next's client router fetches "<path>.txt" in export mode; the brand home is "/<slug>" → "/<slug>.txt"
  if [[ -f "$DIST/$slug/index.txt" ]]; then cp "$DIST/$slug/index.txt" "$DIST/$slug.txt"; fi
  built+=("$slug")
  echo "  $slug built in $((SECONDS - start))s"
done

if [[ ${#built[@]} -eq 0 ]]; then
  echo "ERROR: no brand was built (BRANDS='$BRANDS')" >&2
  exit 1
fi

log "portal"
mkdir -p "$DIST/_hub"
cp -R "$HUB_DIR/portal/fonts" "$DIST/_hub/fonts"
cp "$HUB_DIR/portal/favicon.svg" "$DIST/_hub/favicon.svg"
node "$HUB_DIR/scripts/render-portal.mjs" "$DIST" "${built[@]}"

log "done: ${built[*]}  →  $DIST ($(du -sh "$DIST" | cut -f1))"
