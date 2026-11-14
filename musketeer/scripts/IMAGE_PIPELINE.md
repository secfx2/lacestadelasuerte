# MUSKETEER — Product image pipeline (Higgsfield)

All product photography is generated with Higgsfield MCP tools. This file is the protocol every image worker follows.

## Tools
Load with ToolSearch: `select:mcp__Higgsfield__generate_image_batch,mcp__Higgsfield__jobs_wait`.
- `generate_image_batch` — up to 12 independent requests per call (`{index, params}`), returns `job_id`s.
- `jobs_wait` — poll up to 12 job ids (timeout_seconds ≤ 15); returns `result_url` when completed. Call repeatedly until `all_terminal`.
- Never pass `folder_id`, `use_unlim`, `use_free_gens` or `count`. Never resubmit a job whose outcome is unknown.

## Fixed params (every request)
```json
{ "model": "gpt_image_2_6", "quality": "high", "resolution": "2k", "aspect_ratio": "4:5" }
```
Cost ≈ 2.75 credits per image. References go in `medias: [{ "role": "image_references", "value": "<job_id>" }]` (a completed job_id is a valid reference value).

## Data
`src/data/catalog.json` → `products[]`. For each product: `prompt.garment`, `prompt.back`, `prompt.detail`, `prompt.pose`, `model` (casting key → `models[key].job_id`), `kind` (`garment` | `accessory` | `jewellery`), and `colors[]` (first = primary; later colours have `variant` text). Each colour lists the exact output files in `images` (primary: 4 files, other colours: 2 files).

## Shot list and prompt templates
Replace `{…}` with catalog values. Keep wording; it was validated.

**n=1 — Flat lay front (primary colour), no references**
> Professional luxury e-commerce flat lay product photo shot from directly above. {garment}, laid perfectly flat and centered on a seamless pure white surface, neatly arranged with natural soft folds. Soft natural contact shadow, even diffused high-key studio light, ultra detailed fabric and material texture, high-end streetwear catalog, nothing else in frame.

(For `jewellery`: "...{garment}, placed on a seamless pure white surface... ultra detailed polished sterling silver, macro product photography..." still top-down.)

**n=2 — On model**, refs: `[flat n=1 job, models[model].job_id]`
- garment:
> Full-body e-commerce studio photo: the exact person from image 2 (same face, hair and skin tone) now wearing the exact item from image 1 (identical colour, cut, fabric, wash, prints, text and hardware), {pose}. Oversized boxy/baggy fit as in the reference. Seamless pure white background, soft high-key studio light, subtle floor shadow, head to toe in frame, luxury streetwear lookbook.
- accessory / jewellery:
> Close-up e-commerce studio photo: the exact person from image 2 (same skin tone, and same face if visible) wearing the exact item from image 1 (identical colour, material, shape, engraving and hardware). Framing: {pose}. Seamless pure white background, soft high-key studio light, sharp focus on the item, luxury streetwear lookbook.

**n=3 — Alternate view of the item alone**, refs: `[flat n=1 job]`
> Professional luxury e-commerce product photo on a seamless pure white surface, shot from directly above: {back}. It is the exact same item as the reference image (identical colour, fabric, cut, wash, prints and hardware). Soft natural contact shadow, even diffused studio light, nothing else in frame.

**n=4 — Detail / macro**, refs: `[flat n=1 job]`
> {detail}, of the exact same item as the reference image. Soft diffused studio light, clean white background where visible, shallow depth of field, luxury catalog detail shot.

**Other colourways n=1**, refs: `[primary flat n=1 job]`
> Professional luxury e-commerce flat lay product photo shot from directly above: {variant}. Identical design, cut, proportions, prints, text placement and hardware to the reference image — only the colourway changes. Laid perfectly flat and centered on a seamless pure white surface, soft natural contact shadow, even diffused high-key studio light, nothing else in frame.

**Other colourways n=2**: on-model template with refs `[that colour's flat n=1 job, models[model].job_id]`.

## Order (maximise parallelism, ≤12 per batch)
1. Phase A — all primary flats (n=1).
2. QA the flats (see below). Regenerate any failure once before continuing.
3. Phase B — every n=2, n=3, n=4 and every other-colour n=1 (they only need the primary flat).
4. Phase C — other-colour n=2.
5. Final QA, retries (max 1 retry per image).

## Download & convert
```bash
OUT=/home/user/lacestadelasuerte/musketeer/public/products/<slug>
mkdir -p "$OUT"
curl -sSf -o /tmp/.../raw.png "<result_url>"
convert raw.png -resize 1200x1500^ -gravity center -extent 1200x1500 -strip -interlace JPEG -quality 82 "$OUT/<colour>-<n>.jpg"
```
Use your own scratch dir for raw PNGs (never inside the repo).

## QA (look at the images — use `montage` contact sheets + the Read tool)
Reject and regenerate if: background not white/near-white · n=1 not a top-down flat lay · item does not match the catalog description · garment differs between shots (colour, print, cut) · garbled or wrong text (e.g. TOUS POUR UN, MUSKETEER, 01) · extra limbs/hands, warped faces · model identity drifts from the casting · cropped item in flat lay.

## Manifest
Keep `scripts/manifests/<worker>.json` updated after every phase: `{ "<public path>": { "job_id": "...", "result_url": "..." } }`. Other workers (campaign, brand book) read these to reuse product references.
