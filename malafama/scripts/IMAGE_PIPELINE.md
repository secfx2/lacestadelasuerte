# MALA FAMA — product photo protocol (Higgsfield)

Budget brand: 64 products × 2 shots, one colour each, no logos generated in Higgsfield (wordmark/monogram are typographic). Hard total cap for the whole brand: 160 credits (4 castings already spent).

## Tools
ToolSearch: `select:mcp__Higgsfield__generate_image_batch,mcp__Higgsfield__jobs_wait`. ≤12 requests per batch; poll with `jobs_wait` (timeout ≤15) until terminal. Never pass folder_id / use_unlim / count. Never resubmit a job with unknown outcome.

## Fixed params
```json
{ "model": "gpt_image_2_6", "quality": "medium", "resolution": "2k", "aspect_ratio": "4:5" }
```
≈ 1 credit per image. References: `medias: [{ "role": "image_references", "value": "<job_id>" }]`.

## Data
`src/data/catalog.json` → `products[]` with `batch` A–D. Use `prompt.garment`, `prompt.pose` (a COMPLETE styled look), `model` (key into top-level `models` → casting `job_id` + `desc`), `kind` (garment | accessory | jewellery) and `colors[0].images` (exactly 2 output paths: `-1` flat, `-2` on model).

Aesthetic: Y2K streetwear tracksuit-set brand — vintage-washed heavyweight fleece, cropped boxy hoodies with tall hoods and gathered hems, extra-wide sweatpants, tribal/flame appliqué panels, airbrush, rhinestones, puff print, racing colour blocking, jacquard knit polos.

## Shot 1 — flat lay (no refs)
Garments:
> Professional streetwear e-commerce flat lay product photo shot from directly above. {garment}, laid perfectly flat and centered on a seamless pure white surface, neatly arranged with natural soft folds, hoods neatly shaped. Blank woven neck label with no text. No text, numbers or logos anywhere except exactly what is described above. Soft natural contact shadow, even diffused high-key studio light, ultra detailed fabric texture (fleece pile, wash, embroidery, rhinestones), contemporary 2026 streetwear catalog, nothing else in frame.

Sets ("conjuntos"): both pieces side by side (or jacket above trousers) filling the frame, like a tracksuit set listing. If the garment says "shown from the BACK", show that side.
Accessories / jewellery: "…{garment}, on a seamless pure white surface, shot from directly above / slightly above…"; jewellery: sharp macro of sterling silver.
Fit: tops cropped boxy (end at the waist), trousers extra wide with a clean, slightly stacked hem.

## Shot 2 — on model (refs: [shot-1 job, models[model].job_id])
Garments:
> Full-body streetwear e-commerce studio photo: the exact person from image 2 ({desc}; same face, hair and skin tone) wearing the exact item from image 1 (identical colour, wash, cut, panels, prints, embroidery, rhinestones and hardware) as the hero piece of a styled Y2K street look: {pose}. Do not copy the grey t-shirt, black trousers or white sneakers from image 2 unless the look asks for them. The hero piece stays fully visible; cropped boxy tops end at the waist; wide trousers stack slightly on the shoes. Seamless pure white background, soft high-key studio light, subtle floor shadow, head to toe in frame, streetwear lookbook energy. No logos or brand marks other than those on the hero piece.

Sets: the model wears BOTH pieces of the set.
Accessories / jewellery:
> Close-up e-commerce studio photo: the exact person from image 2 ({desc}; same skin tone, and same face/hair if visible) wearing the exact item from image 1 (identical colour, material, shape and details). Framing: {pose}. Seamless pure white background, soft high-key studio light, sharp focus on the item. No other logos.

STYLING IS A KEY QUALITY CRITERION: reproduce every element of `{pose}` (other garments, footwear, jewellery, attitude). Reject generic outfits, third-party logos (e.g. stripes or swooshes on sneakers), hidden hero pieces.

TEXT CHECK: products that carry text (`Mala Fama` copperplate script, blackletter `MF`, number `09`) must be spelled exactly right in BOTH shots — regenerate once if garbled. Everything else must have no readable text.

Special case: `mask-zip-hoodie` covers the face — identity is judged on eyes/skin/build only.

## Download & convert
```bash
OUT=/home/user/lacestadelasuerte/malafama/public/products/<slug>; mkdir -p "$OUT"
curl -sSf -o <scratch>/raw.png "<result_url>"
convert raw.png -resize 1200x1500^ -gravity center -extent 1200x1500 -strip -interlace JPEG -quality 82 "$OUT/<colour>-<n>.jpg"
```

## QA
Look at contact sheets (montage → Read) and zoomed crops. Regenerate once (max 4 retries per batch) if: non-white background, shot 1 not top-down, item differs between shots, garbled text, extra fingers/warped faces, casting identity drift, wrong fit (long oversized tops, skinny trousers), generic or wrong styling, third-party logos, set missing a piece.

## Manifest
`scripts/manifests/batch-<X>.json`: `{ "<public path>": { "job_id", "result_url" } }`, updated after each phase.
