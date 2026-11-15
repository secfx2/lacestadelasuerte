# PECADO — product photo protocol (Higgsfield)

Budget brand: 72 products × 2 shots, one colour each, no logos generated in Higgsfield (blackletter wordmark is typographic). Hard total cap for the whole brand: 175 credits (4 castings already spent) → per batch of 18 products: 36 base images + max 4 retries = 40.

## Tools
ToolSearch: `select:mcp__Higgsfield__generate_image_batch,mcp__Higgsfield__jobs_wait`. ≤12 requests per batch; poll with `jobs_wait` (timeout ≤15) until terminal. Never pass folder_id / use_unlim / count. Never resubmit a job with unknown outcome.

## Fixed params
```json
{ "model": "gpt_image_2_6", "quality": "medium", "resolution": "2k", "aspect_ratio": "4:5" }
```
≈ 1 credit per image. References: `medias: [{ "role": "image_references", "value": "<job_id>" }]`.

## Data
`src/data/catalog.json` → `products[]` with `batch` A–D. Use `prompt.garment`, `prompt.pose` (a COMPLETE styled look), `model` (key into top-level `models` → casting `job_id` + `desc`), `kind` and `colors[0].images` (exactly 2 output paths: `-1` flat, `-2` on model / close-up).

Aesthetic: Y2K grunge / mall-goth street — ULTRA-WIDE baggy jeans (leg opening ~34 cm that swallows the shoe, thick contrast topstitching, oversized back pockets) with big embroidered/printed gothic art (winged crosses, thorns, filigree, flames, skulls with roses), distressed foil/rhinestone graphic tees layered over long-sleeves, graphic polos, zip hoodies, studded belts and backpacks, keychain charms, beanies, puffy skate shoes, silver jewellery. Heavy washed boxy hoodies often have RAW FRAYED DISTRESSED hems and cuffs (shredded hanging threads) and all-over grunge prints (skeleton spines, x-ray ribcages, lightning, flames, thorny illegible death-metal style logo shapes) — render the fraying and the wash texture clearly. Original designs only: no real brand, band or logo, no legible text unless the garment description gives it explicitly.

## Shot 1 — flat lay on white (no refs)
Garments:
> Professional streetwear e-commerce flat lay product photo shot from directly above. {garment}, laid perfectly flat and centered on a seamless pure white surface, neatly arranged with natural soft folds. Blank woven neck label with no text. No legible text, numbers or logos anywhere; ornamental script elements must be illegible flourishes. Soft natural contact shadow, even diffused high-key studio light, ultra detailed fabric texture (denim weave, contrast stitching, embroidery thread, foil, rhinestones, studs), contemporary 2026 streetwear catalog, nothing else in frame.

If the garment says the flat lay shows the BACK (back-pocket art), show the back. Jeans must clearly read as ULTRA-WIDE (huge straight legs, not skinny, not tapered).
Accessories / jewellery: "…{garment}, on a seamless pure white surface, shot from directly above / slightly above…"; jewellery: sharp macro of sterling silver.

## Shot 2 — on model against a concrete wall (refs: [shot-1 job, models[model].job_id])
Garments:
> Full-body street-style lookbook photo: the exact person from image 2 ({desc}; same face, hair and skin tone) standing in front of the same raw grey concrete wall on a concrete floor, wearing the exact item from image 1 (identical colour, wash, cut, stitching, embroidery, print, studs and hardware) as the hero piece of a styled Y2K grunge street look: {pose}. Do not copy the plain black t-shirt, black jeans or black sneakers from image 2 unless the look asks for them. The hero piece stays fully visible; ultra-wide jeans pool over the shoes. Soft overcast daylight, straight-on framing, head to toe in frame, realistic candid street-style photo. No logos or brand marks on any garment or shoe.

Accessories / jewellery:
> Close-up street-style photo against a raw grey concrete wall: the exact person from image 2 ({desc}; same skin tone, and same face/hair if visible) wearing the exact item from image 1 (identical colour, material, shape and details). Framing: {pose}. Soft overcast daylight, sharp focus on the item. No logos.

STYLING IS A KEY QUALITY CRITERION: reproduce every element of `{pose}` (layering, footwear, belts, chains, keychains, beanie, headphones, attitude: hair over eyes, looking down, back view for back-art pieces…). Reject generic outfits, third-party logos (stripes/swooshes on sneakers, band names), hidden hero pieces, skinny jeans.

## Download & convert
```bash
OUT=/home/user/lacestadelasuerte/pecado/public/products/<slug>; mkdir -p "$OUT"
curl -sSf -o <scratch>/raw.png "<result_url>"
convert raw.png -resize 1200x1500^ -gravity center -extent 1200x1500 -strip -interlace JPEG -quality 82 "$OUT/<colour>-<n>.jpg"
```

## QA
Look at contact sheets (montage → Read) and zoomed crops. Regenerate once (max 4 retries per batch) if: background wrong (shot 1 must be pure white; shot 2 must be the concrete wall), shot 1 not top-down, item differs between shots, garbled/legible text, extra fingers/warped faces, casting identity drift, wrong fit (jeans not ultra-wide), generic or wrong styling, third-party logos.

## Manifest
`scripts/manifests/batch-<X>.json`: `{ "<public path>": { "job_id", "result_url" } }`, updated after each phase.
