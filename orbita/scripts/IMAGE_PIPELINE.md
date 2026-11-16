# ÓRBITA — product photo protocol (Higgsfield)

Budget brand: 64 products × 2 shots, no colour variants, no logos generated. Hard total cap for the whole brand: 250 credits.

## Tools
ToolSearch: `select:mcp__Higgsfield__generate_image_batch,mcp__Higgsfield__jobs_wait`. ≤12 requests per batch; poll with `jobs_wait` (timeout ≤15) until terminal. Never pass folder_id / use_unlim / count. Never resubmit a job with unknown outcome.

## Fixed params
```json
{ "model": "gpt_image_2_6", "quality": "medium", "resolution": "2k", "aspect_ratio": "4:5" }
```
≈ 1 credit per image. References: `medias: [{ "role": "image_references", "value": "<job_id>" }]`.

## Data
`src/data/catalog.json` → `products[]` with `batch` A–D. Use `prompt.garment`, `prompt.pose` (a COMPLETE styled look), `model` (key into top-level `models` → casting `job_id`), `kind` and `colors[0].images` (exactly 2 output paths: `-1` flat, `-2` on model).

## Shot 1 — flat lay (no refs)
> Professional luxury e-commerce flat lay product photo shot from directly above. {garment}, laid perfectly flat and centered on a seamless pure white surface, neatly arranged with natural soft folds. Blank woven neck label with no text; no text, numbers or logos anywhere except the design described. Soft natural contact shadow, even diffused high-key studio light, ultra detailed fabric and material texture, contemporary 2026 streetwear catalog, nothing else in frame.

(Accessories, shoes and jewellery: "…{garment}, placed on a seamless pure white surface, shot from directly above / slightly above…". Jewellery: sharp macro of polished sterling silver.)
Garments must keep the modern 2026 boxy fit: square structured shape, tops cropped at the waist; trousers wide/straight/barrel/flared with a clean break — never long oversized or puddling.

## Shot 2 — on model (refs: [shot-1 job, models[model].job_id])
Garments:
> Full-body fashion e-commerce studio photo: the exact person from image 2 (same face, hair and skin tone) wearing the exact item from image 1 (identical colour, cut, fabric, construction details and print) as the hero piece of a considered, fashion-forward 2026 look inspired by 1960s space-age style: {pose}. The hero piece stays fully visible and unobstructed; tops cropped at the waist. Seamless pure white background, soft high-key studio light, subtle floor shadow, head to toe in frame, luxury streetwear lookbook, editorial attitude. No logos or brand marks on any garment or shoe.

Accessories / jewellery:
> Close-up e-commerce studio photo: the exact person from image 2 (same skin tone, and same face/hair if visible) wearing the exact item from image 1 (identical colour, material, shape and details). Framing: {pose}. Seamless pure white background, soft high-key studio light, sharp focus on the item, luxury lookbook. No logos.

STYLING IS THE KEY QUALITY CRITERION: reproduce every element of `{pose}` (other garments, footwear, jewellery, attitude). Reject generic outfits (plain cream chinos + white sneakers unless asked), third-party logos (e.g. stripes on trainers), hidden hero pieces.

## Download & convert
```bash
OUT=/home/user/lacestadelasuerte/orbita/public/products/<slug>; mkdir -p "$OUT"
curl -sSf -o <scratch>/raw.png "<result_url>"
convert raw.png -resize 1200x1500^ -gravity center -extent 1200x1500 -strip -interlace JPEG -quality 82 "$OUT/<colour>-<n>.jpg"
```

## QA
Look at contact sheets (montage → Read). Regenerate once if: non-white background, shot 1 not top-down, item differs between shots, garbled text/numbers, extra fingers/warped faces, casting identity drift, wrong fit, generic or wrong styling, third-party logos.

## Manifest
`scripts/manifests/batch-<X>.json`: `{ "<public path>": { "job_id", "result_url" } }`, updated after each phase.
