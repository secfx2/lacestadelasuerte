# MUSKETEER — 2026 line image protocol (addendum to IMAGE_PIPELINE.md)

Applies to every product in `src/data/catalog.json` with `"line": "2026"` (15 products). Everything in IMAGE_PIPELINE.md still applies (tools, download/convert, QA, manifest) except:

## Params
```json
{ "model": "gpt_image_2_6", "quality": "medium", "resolution": "2k", "aspect_ratio": "4:5" }
```
≈ 1 credit per image.

## Shots
Primary colour: **3 shots** — n=1 flat lay front, n=2 on model, n=3 back (`prompt.back`, same template as n=3 in the main protocol). No detail shot.
Other colours: n=1 flat (variant template) and n=2 on model. Accessories (`kind: accessory`) other colours: n=1 flat only.

## Fit language (append to every n=1 and n=2 prompt)
> Contemporary 2026 boxy fit: the garment keeps a square, structured shape; tops end at the waist (cropped), shoulders sit only slightly dropped, sleeves end at the right length (no bunching). Trousers are relaxed straight or barrel leg with a clean break on the shoe — never puddling or oversized.

## Reuse
If `prompt.seed_job` is set, that job is ALREADY the n=1 flat lay of the primary colour: do not regenerate it — download its result (fetch the URL with `jobs_wait` on that job id) and convert it to the n=1 path, then use the job id as the reference for n=2, n=3 and other colours.

## Batch 2 (fields `batch: "A"` / `batch: "B"`)
- Products with only 2 entries in their `images` array (accessories and jewellery) get n=1 flat lay + n=2 on model only (no back shot; `prompt.back` is empty).
- Every flat lay prompt must also say: "blank woven neck label with no text; no text anywhere except the garment's own print described above".
- These are deliberately original, statement-but-wearable pieces: render the special construction detail (paned sleeves, ruff collar, gorget collar, armour-plate quilting, mesh hood visor, bandolier pocket, tabard side straps…) clearly and accurately in every shot — regenerate if the model shot loses it.
