"""Catálogo borrador para la nueva marca de calle ({{MARCA}}).

Mismo esquema que orbita/src/data/catalog.json (categories, models, products).
Uso:  python3 drafts/marca-calle/build_catalog.py   -> escribe drafts/marca-calle/catalog.json
Sin nombre de marca: donde haría falta se usa el token {{MARCA}}.
"""
import json
import os
import re
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "catalog.json")

TOPS = ["XS", "S", "M", "L", "XL", "XXL"]
JEANS = ["28", "30", "32", "34", "36", "38"]
RING = ["12", "14", "16", "18", "20", "22"]
BELT = ["80", "90", "100", "110"]
SHOES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]
OS = ["Talla única"]
SILVER = ("Silver", "silver", "#C0C0C0")
STERLING = "Plata de ley 925"

# Recurring prompt fragments ------------------------------------------------
def jean_shape(opening):
    return (f"extremely wide straight leg, leg opening around {opening} cm, huge volume, hem stacking slightly, "
            "low-mid rise, oversized back pockets")

BACK_JEANS = "the flat lay shows the BACK of the jeans so the art is fully visible"
FRONT_JEANS = "front view laid flat with both legs spread to show their full width"
HIP = "hem at the hip, not long, not oversized"

CATEGORIES = [
    ("vaqueros", "Vaqueros"),
    ("camisetas", "Camisetas"),
    ("sudaderas", "Sudaderas"),
    ("polos-y-camisas", "Polos y camisas"),
    ("chaquetas", "Chaquetas"),
    ("capas", "Capas"),
    ("accesorios", "Accesorios"),
    ("joyeria", "Joyería"),
]

# Fixed street casting (generate once; paste job_id after approval) ---------
CASTING_TPL = (
    "Full-body street casting photo of a {desc}, about 20 years old, natural face, neutral expression, "
    "standing straight facing camera, arms relaxed at the sides, wearing a plain black crew-neck t-shirt, "
    "plain black straight jeans and plain black sneakers. Standing in front of a raw grey concrete wall with "
    "a concrete floor, soft overcast daylight, straight-on eye-level framing, head to toe in frame, sharp focus, "
    "no accessories{extra}, no logos, no text."
)
MODELS = {
    "bruno": dict(
        desc="lanky young Spanish man with North African roots, olive skin, big voluminous dark curly mop falling over the forehead, light stubble",
        extra=""),
    "kio": dict(
        desc="androgynous young East Asian person, pale skin, slim build, glossy straight black hair with a long emo fringe falling over the eyes and choppy layers to the jaw",
        extra=""),
    "vera": dict(
        desc="young Spanish woman, pale skin, jet-black shoulder-length hair with a heavy blunt fringe, small silver septum ring, thin winged eyeliner",
        extra=" except the small septum ring"),
    "yara": dict(
        desc="young Afro-Latina woman, deep brown skin, short bleached blonde curls with dark roots growing out, fine-line black tattoos on both forearms and hands",
        extra=""),
}

P = []


def add(slug, name, cat, price, model, color, desc, details, comp, garment, pose,
        fit="Boxy", kind="garment", sizes=None, badge=None, featured=False, unisex=True):
    if sizes is None:
        sizes = JEANS if cat == "vaqueros" else TOPS if kind == "garment" else OS
    cname, cslug, chex = color
    P.append(dict(
        slug=slug, name=name, category=cat, price=price, sizes=sizes, model=model,
        description=desc, details=details, composition=comp, fit=fit, unisex=unisex,
        badge=badge, featured=featured, kind=kind, line="2026",
        batch=None,
        prompt=dict(garment=garment, back="", detail="", pose=pose),
        colors=[dict(name=cname, slug=cslug, hex=chex, variant=None,
                     images=[f"/products/{slug}/{cslug}-1.jpg", f"/products/{slug}/{cslug}-2.jpg"])],
    ))


# =============================== VAQUEROS ===============================
add("seraph-baggy", "Seraph Baggy", "vaqueros", 95, "bruno", ("Washed Black", "washed-black", "#2B2A2D"),
    "El vaquero que define {{MARCA}}: pernera ultra ancha que se come la zapatilla y dos cruces aladas bordadas en blanco sobre los bolsillos traseros XL. Denim negro lavado con pespunte grueso en crudo, hecho para patinar, arrastrarlo por el suelo y repetir.",
    ["Bajo de 34 cm", "Tiro medio-bajo", "Denim 14 oz lavado a la piedra", "Cruces aladas bordadas en los bolsillos traseros", "Pespunte grueso en contraste crudo"],
    "100% algodón",
    "ultra-wide baggy jeans in washed black denim with a faded stone wash and lighter fading across the seat and thighs, "
    + jean_shape(34) + ", thick contrast off-white topstitching on every seam; each oversized back pocket is embroidered edge to edge "
    "with a large original winged cross in dense white and silver-grey thread: a slim ornate cross with pointed filigree tips and a pair "
    "of spread feathered wings behind it; " + BACK_JEANS,
    "back view looking over the shoulder: worn low on the hips with a white pyramid-studded leather belt, a black boxy tee layered over "
    "a white long-sleeve, black puffy skate shoes half swallowed by the stacked hems, a heavy silver wallet chain looping from the front "
    "belt loop to the back pocket edge, a black ribbed beanie pushed back on the big curly mop; slouched with the weight on one leg, "
    "hands in the front pockets, both back pockets fully visible",
    fit="Ultra baggy", badge="Top", featured=True)

add("thorn-vine-jean", "Thorn Vine Jean", "vaqueros", 99, "vera", ("Raw Indigo", "raw-indigo", "#1F2A44"),
    "Índigo crudo sin lavar con una enredadera de espinas bordada que trepa desde el bajo hasta el muslo. Se irá destiñendo contigo, así que cuanto más lo lleves, más tuyo será.",
    ["Bajo de 33 cm", "Tiro medio-bajo", "Denim crudo 14,5 oz sin lavar", "Enredadera de espinas bordada en cadeneta crudo y burdeos", "Bolsillos traseros XL con pespunte crudo"],
    "100% algodón",
    "ultra-wide baggy jeans in dark raw indigo rigid unwashed denim with a slight sheen, " + jean_shape(33)
    + ", thick ecru topstitching; on the FRONT a thorned vine embroidered in ecru chain-stitch climbs from the hem up the outer side "
    "of both legs to mid-thigh, with sharp thorns, curling tendrils and a few small oxblood red rosebuds; " + FRONT_JEANS,
    "worn with a fitted black baby tee with a black rhinestone print layered over a sheer black mesh long-sleeve, a black leather belt "
    "with a double row of silver grommets, black chunky platform Mary Janes with white frilly ankle socks peeking under the huge hems, "
    "small silver cross hoop earrings and septum ring; standing pigeon-toed, one finger hooked in a belt loop, chin down with a hard "
    "stare through the blunt fringe",
    fit="Ultra baggy", badge="Nuevo")

add("limbo-jean", "Limbo Jean", "vaqueros", 89, "kio", ("Ash Grey", "ash-grey", "#8C8A88"),
    "Gris ceniza desteñido, como un vaquero negro que ha sobrevivido a demasiados veranos. Detrás, un halo con alas en estampado negro craquelado se desborda por los dos bolsillos.",
    ["Bajo de 34 cm", "Tiro medio-bajo", "Denim 13 oz con lavado gris desteñido", "Estampado craquelado de halo y alas en la espalda", "Pespunte blanco grueso"],
    "100% algodón",
    "ultra-wide baggy jeans in faded ash grey denim, a washed-out black turned soft grey with whiskering at the hips, " + jean_shape(34)
    + ", thick white topstitching; across both back pockets one large cracked black screen print: an ornate filigree halo ring above a "
    "pair of spread angel wings whose feathers spill over the pocket edges onto the seat, distressed and crackled like an old transfer; "
    + BACK_JEANS,
    "back view, head bowed so the long black fringe hangs forward: worn with a short boxy black zip hoodie zipped to the chin, hood down, "
    "grey chunky skate sneakers buried under the stacked hems, a cluster of small silver keychain charms hanging from a back belt loop, "
    "wired headphones around the neck; both hands shoved in the hoodie pockets, shoulders hunched, the hoodie hem sitting above the "
    "back pockets so the print is fully visible",
    fit="Ultra baggy")

add("pyre-baggy", "Pyre Baggy", "vaqueros", 89, "yara", ("Black", "black", "#0B0B0C"),
    "Negro profundo con llamas en crudo y burdeos que suben desde el bajo hasta la rodilla. Para quemar la calle sin pedirle permiso a nadie.",
    ["Bajo de 35 cm", "Tiro medio-bajo", "Denim 14 oz negro sobreteñido", "Llamas estampadas en descarga crudo con perfil burdeos", "Bolsillos traseros XL"],
    "100% algodón",
    "ultra-wide baggy jeans in deep overdyed black denim, " + jean_shape(35)
    + ", thick off-white topstitching; on the FRONT tall licking flames printed in faded ecru discharge ink with a thin oxblood red "
    "outline rise from the hem of both legs up to the knee, slightly cracked and vintage-looking; " + FRONT_JEANS,
    "worn with a fitted white ribbed tank under an open black leather biker jacket with silver pyramid studs on the shoulders, a black "
    "pyramid-studded belt, chunky black-and-white skate sneakers, layered silver chains, tattoos on the forearms; feet planted wide, "
    "thumbs hooked in the front pockets, chin up with a defiant look, the flames fully visible from hem to knee",
    fit="Ultra baggy")

add("rosary-jean", "Rosary Jean", "vaqueros", 99, "yara", ("Bone", "bone", "#E9E2D3"),
    "Denim color hueso con pespunte negro grueso y filigrana gótica bordada alrededor de los bolsillos traseros. Es el negativo perfecto de un vaquero negro y se nota desde la otra punta del parque.",
    ["Bajo de 33 cm", "Tiro medio-bajo", "Denim 13 oz sin teñir color hueso", "Filigrana bordada en negro en los bolsillos traseros", "Pespunte negro grueso en contraste"],
    "100% algodón",
    "ultra-wide baggy jeans in ecru bone-coloured undyed denim, " + jean_shape(33)
    + ", thick black contrast topstitching on every seam; both oversized back pockets are framed by dense black embroidered gothic "
    "filigree: curling ornamental scrolls, small pointed crosses at the pocket corners and a beaded chain-like line that drapes between "
    "the two pockets like a rosary; " + BACK_JEANS,
    "back view turned three-quarters to show both pockets: worn with a sheer black mesh short-sleeve tee over a black and white striped "
    "long-sleeve tucked in at the back, a black leather belt with a double row of silver grommets, worn black leather lace-up boots under "
    "the stacked hems, a silver wallet chain swinging at the hip, bleached curls with dark roots; looking back over the shoulder with a "
    "bored expression, arms relaxed",
    fit="Ultra baggy")

add("crypt-double-knee", "Crypt Double Knee", "vaqueros", 105, "bruno", ("Washed Black", "washed-black", "#2B2A2D"),
    "Carpenter de doble rodilla en negro lavado con trabilla de martillo y un parche bordado de calavera con rosas en la rodilla. Aguanta caídas en el bowl y noches enteras en el banco de la plaza.",
    ["Bajo de 36 cm", "Tiro medio-bajo", "Denim 14 oz con doble rodilla", "Trabilla de martillo y bolsillo de herramientas", "Parche bordado de calavera con rosas"],
    "100% algodón",
    "ultra-wide baggy carpenter jeans in washed black denim with double-layer knee panels, " + jean_shape(36)
    + ", thick off-white topstitching, a hammer loop and a narrow tool pocket on the right leg; on the left knee panel an embroidered "
    "patch of an original anatomical skull wrapped in blooming roses, the skull in bone white thread and the roses in oxblood red with "
    "dark green leaves; " + FRONT_JEANS,
    "worn with a faded charcoal boxy tee with a cracked flame print, a black leather belt with a double row of silver grommets, black "
    "puffy skate shoes, a black trucker cap worn backwards over the curly mop; standing with one foot up on the tail of a skateboard, "
    "leaning forward with a forearm on the raised knee so the skull patch faces the camera, cheeky half-smile",
    fit="Ultra baggy")

add("wingspan-jean", "Wingspan Jean", "vaqueros", 110, "vera", ("Midnight Indigo", "midnight-indigo", "#1B2233"),
    "Unas alas gigantes en foil plateado se abren desde los bolsillos traseros y bajan por detrás de los muslos. Índigo oscuro, pernera infinita y la espalda más fotografiada del skatepark.",
    ["Bajo de 34 cm", "Tiro medio-bajo", "Denim 14 oz índigo oscuro enjuagado", "Alas estampadas en foil plateado envejecido", "Pespunte blanco grueso y bolsillos traseros XL"],
    "100% algodón",
    "ultra-wide baggy jeans in dark rinsed midnight indigo denim, " + jean_shape(34)
    + ", thick white topstitching; a huge pair of original feathered wings printed in distressed cracked silver foil opens outward from "
    "the two back pockets and sweeps down the back of both thighs almost to the knees, each feather sharply drawn, the foil worn and "
    "flaking at the edges; " + BACK_JEANS,
    "full back view, walking away and glancing back over the shoulder: worn with a short boxy washed black zip hoodie with silver pyramid "
    "studs along the shoulders, a white pyramid-studded belt, black platform Mary Janes with white socks under the stacked hems, black "
    "blunt fringe and silver hoop in profile; one hand flicking the fringe, the hoodie hem above the pockets so the wings are fully visible",
    fit="Ultra baggy", badge="Nuevo", featured=True)

add("gutter-jort", "Gutter Jort", "vaqueros", 79, "kio", ("Washed Black", "washed-black", "#2B2A2D"),
    "El baggy en versión verano: jort ultra ancho por debajo de la rodilla con una cruz de filigrana bordada en una pernera. Bajo deshilachado, bolsillos traseros XL y cero ganas de volver a casa.",
    ["Bajo de 32 cm", "Tiro medio-bajo", "Largo por debajo de la rodilla, bajo deshilachado", "Cruz de filigrana bordada en la pernera izquierda", "Denim 14 oz con pespunte crudo"],
    "100% algodón",
    "ultra-baggy denim jorts in washed black denim, extremely wide legs ending below the knee with a raw frayed hem, leg opening around "
    "32 cm, huge volume, low-mid rise, oversized back pockets, thick off-white topstitching; on the FRONT left leg a large embroidered "
    "original filigree cross in white thread with ornate looping scrollwork arms and small thorn spikes at each tip; front view laid flat",
    "worn with a washed black boxy tee with a toxic lime cracked cross print layered over a white long-sleeve, grey ribbed knee-high socks "
    "pulled up, chunky black skate sneakers, a silver wallet chain, wired headphones around the neck, long black fringe covering the "
    "eyes; leaning back against the wall with one sole flat on it and arms crossed, the embroidered leg toward the camera",
    fit="Ultra baggy")

# =============================== CAMISETAS ===============================
add("second-skin-tee", "Second Skin Tee", "camisetas", 45, "kio", ("Black / Stripe", "black-stripe", "#0B0B0C"),
    "Camiseta negra con mangas largas de rayas cosidas por debajo, así que el layering ya viene hecho de casa. En el pecho, un corazón alado envuelto en espinas en estampado blanco craquelado.",
    ["Corte regular, largo a la cadera", "Mangas largas de rayas cosidas bajo la manga corta", "Algodón 220 g/m²", "Estampado craquelado de corazón alado", "Puños con agujero para el pulgar"],
    "100% algodón. Mangas 95% algodón, 5% elastano",
    "a regular-fit black cotton t-shirt, " + HIP + ", with attached long under-sleeves in thin black and white horizontal stripes sewn "
    "beneath the short sleeves so it looks like a tee layered over a striped long-sleeve, thumbhole cuffs; on the chest a cracked white "
    "screen print of an original winged heart wrapped in a thorned vine with small radiating lines, distressed and crackled",
    "worn loosely half-tucked into washed black ultra-wide baggy jeans with white topstitching, a white pyramid-studded belt, black puffy "
    "skate shoes, a fine silver chain with a filigree cross pendant, long black fringe over the eyes; arms hanging with thumbs through "
    "the thumbholes, slightly hunched, the chest print unobstructed",
    fit="Regular", badge="Nuevo", featured=True)

add("thorned-heart-baby-tee", "Thorned Heart Baby Tee", "camisetas", 35, "vera", ("Baby Pink", "baby-pink", "#F6C6D6"),
    "Baby tee ajustada en rosa bebé con un corazón envuelto en espinas y alitas de murciélago en strass negro. Dulce por fuera y nada dulce por dentro.",
    ["Corte ajustado y corto, a la cintura", "Punto de algodón elástico", "Corazón con espinas en strass negro", "Ribetes negros en cuello y mangas"],
    "95% algodón, 5% elastano",
    "a fitted cropped baby tee in baby pink stretch cotton with black contrast binding at the neckline and short cap sleeves, hem ending "
    "at the natural waist; centred on the chest an original heart wrapped in a thorned vine with small bat-like wings, made entirely of "
    "black rhinestones with a few silver ones catching the light",
    "worn with raw indigo ultra-wide baggy jeans slung low with an ecru thorned vine embroidered up the legs, a black leather belt with a "
    "double row of silver grommets, black chunky platform Mary Janes with white lace ankle socks, a black leather backpack with pyramid "
    "studs on both shoulders, a silver choker with a small charm and septum ring; toes pointed inward, hands holding the backpack straps "
    "at shoulder height, unimpressed stare",
    fit="Ajustado", unisex=False)

add("rosebone-raglan", "Rosebone Raglan", "camisetas", 39, "bruno", ("Bone / Black", "bone-black", "#E9E2D3"),
    "Raglán con cuerpo hueso y mangas negras con una calavera atravesada por rosas en estampado desgastado. Tiene pinta de camiseta heredada de tu hermano mayor, pero es solo tuya.",
    ["Corte regular, largo a la cadera", "Mangas raglán tres cuartos en negro", "Algodón 200 g/m² lavado", "Estampado desgastado de calavera con rosas"],
    "100% algodón",
    "a regular-fit raglan t-shirt with an ecru bone-coloured body and black three-quarter raglan sleeves, " + HIP + "; on the chest a "
    "faded vintage-style screen print of an original detailed human skull in profile with roses growing through the eye socket and "
    "blooming around the jaw, in washed black and oxblood red, slightly cracked",
    "worn with ash grey ultra-wide baggy jeans with white topstitching, black puffy skate shoes, a black ribbed beanie on the big curly "
    "mop, a chunky silver curb bracelet, over-ear headphones resting around the neck, a skateboard held by the trucks down at his side; "
    "grinning sideways with the weight on one hip",
    fit="Regular")

add("bramble-mesh-tee", "Bramble Mesh Tee", "camisetas", 39, "yara", ("Black", "black", "#0B0B0C"),
    "Malla negra transparente con zarzas espinosas flocadas en relieve. Encima de una manga larga o sola, según cómo venga la noche.",
    ["Corte ajustado", "Malla semitransparente elástica", "Estampado flocado de zarzas en relieve", "Cuello redondo con ribete"],
    "92% poliamida, 8% elastano",
    "a fitted short-sleeve t-shirt in sheer black stretch mesh, hem at the hip, with an all-over pattern of thorny bramble vines in raised "
    "black velvety flock print winding across the body and sleeves, neat black binding at the neckline; semi-transparent fabric",
    "worn over a fitted white long-sleeve so the bramble pattern stands out, with black ultra-wide baggy jeans with ecru flames rising "
    "from the hem, a black pyramid-studded belt, worn black leather lace-up boots, stacked silver rings and a barbed silver chain, "
    "tattooed hands; one shoulder against the wall, looking down at the camera with half-closed eyes",
    fit="Ajustado")

add("halo-foil-tee", "Halo Foil Tee", "camisetas", 39, "yara", ("Black", "black", "#0B0B0C"),
    "La básica de {{MARCA}}: negra, corte regular y una cruz alada con halo en foil plateado craquelado. Va con todo lo que tienes en el armario y con todo lo que te vas a comprar.",
    ["Corte regular, largo a la cadera", "Algodón peinado 220 g/m²", "Estampado en foil plateado craquelado", "Cuello de canalé reforzado"],
    "100% algodón",
    "a regular-fit black cotton t-shirt with a ribbed crew neck, " + HIP + "; on the chest a large distressed silver foil print of an "
    "original winged cross: a slim pointed cross with filigree ends, spread feathered wings behind it and a thin halo ring with radiating "
    "lines above, the foil cracked and partly worn away like a vintage transfer",
    "worn over a white long-sleeve with the sleeves pushed up, with washed black ultra-wide baggy jeans with white topstitching, a white "
    "pyramid-studded belt, black puffy skate shoes, a small silver keychain charm set clipped to a belt loop, bleached curls with dark "
    "roots; hands in the front pockets, chin up, relaxed straight-on stance",
    fit="Regular", badge="Top", featured=True)

add("ashfall-tee", "Ashfall Tee", "camisetas", 42, "bruno", ("Faded Charcoal", "faded-charcoal", "#4A4A4C"),
    "Gris carbón con lavado vintage y llamas desgastadas que suben por el pecho bajo una floritura caligráfica. Parece que la llevas desde hace diez años, y esa es justo la idea.",
    ["Corte boxy, largo a la cadera", "Algodón 240 g/m² con lavado enzimático", "Estampado craquelado de llamas", "Cuello y bajo ligeramente desgastados"],
    "100% algodón",
    "a boxy heavyweight cotton t-shirt in faded charcoal grey with a sun-faded vintage wash, wide square body, " + HIP + ", slightly frayed "
    "collar and hem; on the chest a distressed cracked screen print of rising flames in off-white and faded blood red, crowned by an arch "
    "of illegible ornamental calligraphic flourishes, the print worn and crackled",
    "worn with ecru bone ultra-wide baggy jeans with thick black topstitching, a black leather belt with a double row of silver grommets, "
    "black puffy skate shoes, a black trucker cap worn backwards over the curly mop, a silver wallet chain; mid-laugh, one hand on the "
    "cap brim and the other in a pocket",
    fit="Boxy")

add("venom-cross-tee", "Venom Cross Tee", "camisetas", 42, "kio", ("Washed Black", "washed-black", "#2B2A2D"),
    "Negro lavado con una cruz que se derrite en relieve puff verde tóxico, rodeada de espinas. Es el único chispazo de color que necesitas esta temporada.",
    ["Corte boxy, largo a la cadera", "Algodón 240 g/m² lavado", "Estampado puff craquelado verde tóxico", "Cuello de canalé grueso"],
    "100% algodón",
    "a boxy washed black heavyweight cotton t-shirt, wide square body, " + HIP + ", thick ribbed collar; centred on the chest a raised "
    "cracked puff print in toxic lime green of an original gothic cross with dripping melting edges, encircled by a ring of sharp thorns",
    "worn over a fitted black fishnet long-sleeve, with ecru bone ultra-wide baggy jeans with black topstitching, a black pyramid-studded "
    "belt with a small lime green padlock charm, grey chunky skate sneakers, long black fringe over the eyes, wired headphones around the "
    "neck; slouched with one shoulder dropped, thumbs hooked in the belt",
    fit="Boxy")

add("stone-angel-tee", "Stone Angel Tee", "camisetas", 45, "vera", ("Oxblood", "oxblood", "#4A1015"),
    "Burdeos oscuro con un ángel de piedra de cementerio con las alas abiertas en estampado crudo envejecido. Romántica, rara y muy de calle.",
    ["Corte boxy, largo a la cadera", "Algodón 240 g/m²", "Estampado crudo envejecido a gran formato", "Cuello de canalé"],
    "100% algodón",
    "a boxy oxblood red heavyweight cotton t-shirt, wide square body, " + HIP + "; a large distressed ecru screen print across the chest "
    "of an original weathered stone cemetery angel statue with wide spread wings and bowed head, cracked and faded like an old poster",
    "worn with black ultra-wide baggy jeans, a white pyramid-studded belt, black Mary Janes with grey ankle socks, a black ribbed beanie "
    "pulled over the blunt fringe, a silver filigree cross pendant and small cross hoop earrings; knees slightly bent, hands in the back "
    "pockets, staring straight into the camera",
    fit="Boxy")

# =============================== SUDADERAS ===============================
add("phantom-full-zip", "Phantom Full-Zip", "sudaderas", 89, "kio", ("Black", "black", "#0B0B0C"),
    "Sudadera con cremallera que sube hasta cerrar la capucha sobre la cara, con dos ventanas de malla para ver sin que te vean. Filigrana plateada en la capucha y el anonimato que pide un lunes cualquiera.",
    ["Corte boxy, largo a la cadera", "Cremallera completa hasta la coronilla", "Ventanas de malla a la altura de los ojos", "Felpa 400 g/m²", "Filigrana plateada estampada en la capucha"],
    "80% algodón, 20% poliéster. Malla 100% poliéster",
    "a boxy black heavyweight fleece full-zip hoodie whose long silver zip runs from the hem all the way up through the hood over the face "
    "to the crown, two small black mesh eye windows in the hood, silver ornamental filigree print of curling scrolls on both sides of the "
    "hood, two front pockets, ribbed cuffs and hem, " + HIP + "; laid flat with the hood fully zipped and spread above the body",
    "worn zipped all the way over the face so only the mesh eye windows show, with washed black ultra-wide baggy jeans with white "
    "topstitching, black puffy skate shoes, a silver wallet chain hanging below the hoodie hem; standing dead still facing the camera, "
    "hands in the hoodie pockets, eerie and calm",
    badge="Nuevo", featured=True)

add("spike-hoodie", "Spike Hoodie", "sudaderas", 89, "yara", ("Washed Black", "washed-black", "#2B2A2D"),
    "Zip hoodie negro lavado con tachuelas piramidales plateadas en los hombros y en el borde de la capucha. Abrazos, sí, pero con cuidado.",
    ["Corte boxy, largo a la cadera", "Felpa lavada 400 g/m²", "Tachuelas piramidales metálicas en hombros y capucha", "Cremallera metálica plateada"],
    "80% algodón, 20% poliéster. Tachuelas de metal sin níquel",
    "a boxy washed black heavyweight fleece zip hoodie, " + HIP + ", with rows of polished silver pyramid studs along both shoulder seams "
    "and lining the edge of the hood, silver metal zip, two front pockets, ribbed cuffs and hem",
    "worn half-zipped over a white ribbed tank, hood down, with raw indigo ultra-wide baggy jeans with an ecru thorned vine climbing the "
    "legs, a white pyramid-studded belt, chunky black-and-white skate sneakers, layered silver chains and a spike ring, tattooed hands; "
    "hands in the hoodie pockets, shoulders up, chewing-gum attitude",
    badge="Nuevo")

add("ruin-knit", "Ruin Knit", "sudaderas", 85, "bruno", ("Faded Grey", "faded-grey", "#9A9896"),
    "Jersey de punto gris desgastado con carreras, agujeros y una enredadera de espinas negra en intarsia. Viene roto de serie, así que tranquilo si se te engancha.",
    ["Corte boxy, largo a la cadera", "Punto grueso con agujeros y carreras", "Intarsia de espinas en negro", "Puños y bajo sin rematar"],
    "70% algodón, 30% acrílico",
    "a boxy faded grey chunky knit crewneck sweater, wide square body, " + HIP + ", deliberately distressed with ladders, small holes and "
    "dropped stitches, raw unfinished edges at the cuffs and hem; a black intarsia thorned vine twists diagonally from the left shoulder "
    "across the chest to the right hip",
    "worn over a white long-sleeve that shows through the holes, with washed black double-knee ultra-wide baggy carpenter jeans, black "
    "puffy skate shoes, a black ribbed beanie on the curly mop, wired headphones around the neck; hands in the jeans pockets, looking "
    "down at his shoes in a shy slouch")

add("cathedral-hoodie", "Cathedral Hoodie", "sudaderas", 79, "vera", ("Washed Black", "washed-black", "#2B2A2D"),
    "Zip hoodie negro lavado con una vidriera gótica en estampado crudo que ocupa toda la espalda y unas alas que se abren sobre los hombros. Por delante va limpia, porque el espectáculo está detrás.",
    ["Corte boxy, largo a la cadera", "Felpa 400 g/m²", "Estampado XL en toda la espalda", "Delantero liso", "Cremallera metálica"],
    "80% algodón, 20% poliéster",
    "a boxy washed black fleece zip hoodie, " + HIP + ", plain front, shown from the BACK so the print is visible: a large ecru screen "
    "print covering the entire back of an original gothic cathedral window with pointed-arch tracery, a rose window and filigree, flanked "
    "by feathered wings that spread across both shoulders onto the upper sleeves, lightly cracked; hood laid flat above",
    "back view looking over the shoulder through the black blunt fringe: hood down, worn with ash grey ultra-wide baggy jeans, black "
    "platform Mary Janes with white socks, small silver cross hoop earrings, a black ribbed beanie dangling from one hand; feet together, "
    "the other hand in the back pocket, the whole back print unobstructed",
    badge="Top", featured=True)

add("rosethorn-zip", "Rosethorn Zip", "sudaderas", 75, "yara", ("Heather Grey", "heather-grey", "#A7A7A9"),
    "Zip hoodie gris jaspeado con una rama de rosa espinosa en strass negro que baja desde la capucha hasta el bolsillo. Brilla poco, pero brilla donde tiene que brillar.",
    ["Corte regular, largo a la cadera", "Felpa jaspeada 360 g/m²", "Rama de rosa en strass negro", "Cremallera negra mate"],
    "80% algodón, 20% poliéster",
    "a regular-fit heather grey fleece zip hoodie, " + HIP + ", matte black zip; a long thorned rose stem made of black and dark grey "
    "rhinestones runs from the left side of the hood down across the chest to the left pocket, ending in one open rose bloom, sparkling; "
    "ribbed cuffs and hem",
    "worn zipped to mid-chest over a fitted black long-sleeve, hood up loosely framing the bleached curls with dark roots, with washed "
    "black ultra-wide baggy jeans, a white pyramid-studded belt with a small silver charm cluster, worn black leather boots; one hand on "
    "the zip pull, the other hanging relaxed, sly half-smile",
    fit="Regular")

add("wildfire-hoodie", "Wildfire Hoodie", "sudaderas", 79, "bruno", ("Black", "black", "#0B0B0C"),
    "Zip hoodie negro con llamas rojo sangre y crudo que suben desde el bajo y los puños. Póntela y verás cómo te hacen hueco en la rampa.",
    ["Corte boxy, largo a la cadera", "Felpa 400 g/m²", "Llamas estampadas en bajo y puños", "Cremallera plateada"],
    "80% algodón, 20% poliéster",
    "a boxy black heavyweight fleece zip hoodie, " + HIP + ", silver zip; tall blood red flames with ecru inner cores printed rising from "
    "the hem up to the chest and from both cuffs up to the elbows, crisp edges with slight cracking",
    "worn zipped halfway over a faded grey tee, with raw indigo ultra-wide baggy jeans, black puffy skate shoes, a black ribbed beanie on "
    "the curly mop, a silver wallet chain, a skateboard held upright by the nose beside him; mid-stride toward the camera with a cheeky "
    "grin")

add("iron-gate-hoodie", "Iron Gate Hoodie", "sudaderas", 75, "kio", ("Bone", "bone", "#E9E2D3"),
    "Zip hoodie color hueso con una verja de cementerio de forja estampada en negro en toda la espalda. Clara por delante y bastante tétrica por detrás.",
    ["Corte boxy, largo a la cadera", "Felpa 380 g/m² color hueso", "Estampado de verja de forja en la espalda", "Cremallera negra"],
    "80% algodón, 20% poliéster",
    "a boxy ecru bone-coloured fleece zip hoodie, " + HIP + ", black zip, plain front, shown from the BACK so the print is visible: a large "
    "black screen print covering the back of an original ornate wrought-iron cemetery gate with spear-tipped bars, curling scrollwork and "
    "a small cross on top, a thorned vine wrapped around the bars; hood laid flat above",
    "back view, long black fringe visible from behind: hood down, worn with black ultra-wide baggy jeans with white topstitching, grey "
    "chunky skate sneakers, a black leather backpack with pyramid studs held low by its top handle at the side, wired headphones around "
    "the neck; head bowed, standing completely still, the back print unobstructed")

add("nightmoth-hoodie", "Nightmoth Hoodie", "sudaderas", 72, "vera", ("Oxblood Acid", "oxblood-acid", "#5A1A20"),
    "Sudadera de capucha burdeos con lavado ácido y una polilla nocturna con alas de filigrana en negro desteñido. Cuadrada, cómoda y con cara de haberla encontrado en el mejor puesto del Rastro.",
    ["Corte boxy, largo a la cadera", "Felpa con lavado ácido", "Estampado desteñido de polilla de filigrana", "Bolsillo delantero de parche"],
    "100% algodón",
    "a boxy oxblood red acid-washed fleece pullover hoodie with a mottled faded wash, " + HIP + ", front pouch pocket; a large sun-faded "
    "black print on the chest of an original night moth with wide wings patterned in ornamental filigree and a small skull-like marking "
    "on its body, cracked and soft",
    "worn hood up over the black blunt fringe, with ecru bone ultra-wide baggy jeans with black topstitching, black patent Mary Janes "
    "with white socks, a silver choker with a small winged heart charm, septum ring, sleeves pulled over the hands; arms hanging, head "
    "slightly tilted, deadpan stare")

# ============================ POLOS Y CAMISAS ============================
add("chapel-polo", "Chapel Polo", "polos-y-camisas", 49, "bruno", ("Black", "black", "#0B0B0C"),
    "Polo negro de manga corta con un escudo de filigrana y espinas en foil plateado craquelado. El polo que tu abuelo no reconocería ni de lejos.",
    ["Corte regular, largo a la cadera", "Piqué de algodón 220 g/m²", "Escudo en foil plateado craquelado", "Tapeta de tres botones negros"],
    "100% algodón",
    "a regular-fit short-sleeve polo shirt in black cotton piqué, " + HIP + ", ribbed collar and sleeve bands, three-button placket with "
    "black buttons; across the chest a large cracked silver foil print of an original ornamental shield-shaped crest made of filigree "
    "scrolls and thorned vines with a small cross at its centre and an arch of illegible ornamental calligraphic flourishes above",
    "worn over a white long-sleeve with the collar popped, with washed black ultra-wide baggy jeans, a white pyramid-studded belt, black "
    "puffy skate shoes, a black ribbed beanie on the big curly mop; rocking back on his heels with hands in the pockets, cocky grin",
    fit="Regular", featured=True)

add("thornline-polo", "Thornline Polo", "polos-y-camisas", 52, "kio", ("Ash Grey", "ash-grey", "#8C8A88"),
    "Polo gris ceniza con una línea de espinas en strass negro que lo cruza en diagonal. Discreto de lejos e inesperado de cerca.",
    ["Corte regular, largo a la cadera", "Punto de algodón lavado", "Espinas en strass negro", "Cuello de punto con ribete negro"],
    "100% algodón",
    "a regular-fit short-sleeve polo shirt in washed ash grey cotton jersey, " + HIP + ", black-tipped knit collar and sleeve bands, two "
    "grey buttons; a band of black rhinestone thorned vine wraps diagonally across the front from the right shoulder down to the left hip, "
    "glinting",
    "worn over a black and white striped long-sleeve, with raw indigo ultra-wide baggy jeans, a black leather belt with a double row of "
    "silver grommets hung with small silver charms, worn black leather boots, long black emo fringe covering the eyes, a silver spike "
    "ring; one hand gripping the opposite elbow, awkward sideways lean",
    fit="Regular")

add("static-zip-polo", "Static Zip Polo", "polos-y-camisas", 55, "yara", ("Black", "black", "#0B0B0C"),
    "Polo de cremallera negro con cuello color hueso y llamas desgastadas alrededor del bajo. Medio deportivo, medio callejero y cien por cien de noche.",
    ["Corte boxy, largo a la cadera", "Piqué de algodón", "Cremallera metálica corta", "Cuello en contraste hueso", "Llamas estampadas desgastadas"],
    "100% algodón",
    "a boxy short-sleeve zip polo in black cotton piqué, " + HIP + ", short silver metal zip at the neck, contrast ecru bone knit collar "
    "and sleeve bands; faded cracked ecru and grey flames printed rising from the hem around the lower body",
    "worn zipped halfway with a silver chain at the open neck, with ecru bone ultra-wide baggy jeans with black topstitching, a black "
    "pyramid-studded belt, black puffy skate shoes, tattooed forearms, bleached curls with dark roots; holding the zip pull, head tilted, "
    "smirk",
    badge="Nuevo")

add("lullaby-polo", "Lullaby Polo", "polos-y-camisas", 45, "vera", ("Baby Pink", "baby-pink", "#F6C6D6"),
    "Polo ajustado rosa bebé con un pequeño corazón alado en estampado negro craquelado. Para romper un look negro con algo que también muerde.",
    ["Corte ajustado", "Punto de canalé elástico", "Corazón alado en negro craquelado", "Botones negros"],
    "95% algodón, 5% elastano",
    "a fitted short-sleeve polo shirt in baby pink fine ribbed stretch knit, " + HIP + ", black contrast collar, three small black "
    "buttons; on the left chest a small cracked black print of an original winged heart with a tiny cross above it",
    "worn with dark midnight indigo ultra-wide baggy jeans, a white pyramid-studded belt, black chunky platform Mary Janes with frilly "
    "white socks, small silver cross hoop earrings and septum ring, a black ribbed beanie over the blunt fringe; hands on hips, chin down, "
    "serious",
    fit="Ajustado")

add("nave-knit-polo", "Nave Knit Polo", "polos-y-camisas", 55, "bruno", ("Washed Black", "washed-black", "#2B2A2D"),
    "Polo de punto fino negro lavado con una banda de jacquard color hueso que dibuja arcos góticos sobre el pecho. Elegante a su manera, que no se parece a la de nadie.",
    ["Corte boxy, largo a la cadera", "Punto fino de algodón", "Jacquard de arcos góticos", "Cuello abierto sin botones"],
    "100% algodón",
    "a boxy short-sleeve fine-gauge knit polo in washed black cotton, " + HIP + ", open johnny collar without buttons, ribbed hem and "
    "cuffs; a horizontal jacquard band across the chest in ecru bone of repeating gothic pointed arches with small crosses and filigree",
    "worn with faded ash grey ultra-wide baggy jeans, a black leather belt with a double row of silver grommets, grey chunky skate "
    "sneakers, a chunky silver curb bracelet and a spike ring, the curly mop falling into his face, over-ear headphones around the neck; "
    "one shoulder on the wall, arms loose, looking off to the side")

add("sanctuary-bowling-shirt", "Sanctuary Bowling Shirt", "polos-y-camisas", 55, "yara", ("Black / Oxblood", "black-oxblood", "#0B0B0C"),
    "Camisa de bolos negra y burdeos con llamas y filigrana bordadas en crudo en la espalda. Llévala abierta sobre una camiseta y date la vuelta despacio.",
    ["Corte boxy, largo a la cadera", "Viscosa con caída", "Bordado en cadeneta en la espalda", "Paneles bicolor y cuello camp"],
    "100% viscosa",
    "a boxy short-sleeve bowling shirt in black viscose with oxblood red vertical contrast panels down each side of the front and an "
    "oxblood back yoke, camp collar, black buttons, " + HIP + "; shown from the BACK so the art is visible: across the back an ecru "
    "chain-stitch embroidery of flames rising beneath an ornate filigree arch with a small winged cross at its peak",
    "back view turning the head over the shoulder: worn open over a white tank, with black ultra-wide baggy jeans, black puffy skate "
    "shoes, layered silver chains, tattoos on the arms, bleached curls with dark roots; arms relaxed at the sides, one hand holding a "
    "black ribbed beanie, the back embroidery unobstructed",
    badge=None)

add("vigil-camp-shirt", "Vigil Camp Shirt", "polos-y-camisas", 52, "kio", ("Black", "black", "#0B0B0C"),
    "Camisa de cuello abierto en viscosa negra con estampado integral de enredaderas espinosas y crucecitas aladas en gris. El verano de los que no toman el sol.",
    ["Corte regular, largo a la cadera", "Viscosa fluida", "Estampado integral en gris desteñido", "Cuello camp y botones negros"],
    "100% viscosa",
    "a regular-fit short-sleeve camp collar shirt in black fluid viscose, " + HIP + ", black buttons; an all-over print in faded grey of "
    "thorned vines intertwined with small winged crosses and tiny roses",
    "worn buttoned to the top, with ecru bone ultra-wide baggy jeans with black topstitching, a white pyramid-studded belt, black Mary "
    "Janes with white socks, long black fringe covering the eyes, small silver cross hoop earrings, wired headphones around the neck; "
    "standing straight with hands loosely clasped at the belt, eerie calm",
    fit="Regular")

add("veil-mesh-shirt", "Veil Mesh Shirt", "polos-y-camisas", 45, "vera", ("Black", "black", "#0B0B0C"),
    "Camisa de malla negra transparente con botones plateados y un ribete de encaje de espinas en el cuello. Encima de una camiseta o de un top, tú decides cuánto se ve.",
    ["Corte regular, largo a la cadera", "Malla semitransparente", "Botones metálicos plateados", "Ribete de encaje de espinas en el cuello"],
    "100% poliamida",
    "a regular-fit short-sleeve button-up shirt in sheer black mesh, " + HIP + ", point collar edged with a narrow black lace trim "
    "patterned with thorns, small silver metal buttons; semi-transparent fabric",
    "worn open over a fitted baby pink baby tee with a black rhinestone heart, with black ultra-wide baggy jeans, a black leather belt "
    "with a double row of silver grommets and a small charm cluster, worn black leather boots, a silver choker, septum ring and black "
    "blunt fringe; one hand in the hair, the other on the hip, bored stare",
    fit="Regular")

# =============================== CHAQUETAS ===============================
add("sinner-biker", "Sinner Biker", "chaquetas", 240, "yara", ("Black", "black", "#0B0B0C"),
    "Biker de piel negra con tachuelas piramidales en los hombros y en las solapas. La chaqueta que te va a durar más que cualquier relación.",
    ["Corte regular, largo a la cadera", "Piel bovina con acabado mate", "Tachuelas piramidales metálicas", "Cremallera asimétrica plateada", "Cinturón en el bajo con hebilla"],
    "100% piel bovina. Forro 100% poliéster",
    "a regular-fit classic biker jacket in matte black leather, " + HIP + ", asymmetric silver zip, wide notched lapels with snap studs, "
    "belted hem with a silver buckle, zipped cuffs; rows of polished silver pyramid studs cover both shoulder yokes and line the edges of "
    "the lapels; front view laid flat",
    "worn open over a black regular tee with a cracked silver winged cross print, with washed black ultra-wide baggy jeans with white "
    "topstitching, a black pyramid-studded belt, chunky black-and-white skate sneakers, a chunky silver curb bracelet and stacked rings, "
    "tattooed hands, bleached curls with dark roots; collar flipped up, hands in the jacket pockets, chin raised, hard stare",
    fit="Regular", badge="Top", featured=True)

add("relic-denim-jacket", "Relic Denim Jacket", "chaquetas", 139, "bruno", ("Washed Black", "washed-black", "#2B2A2D"),
    "Cazadora vaquera negra lavada y rota con un corazón en llamas, alas y espinas bordado en toda la espalda. A juego con tus baggy o en contra de todo.",
    ["Corte boxy, largo a la cintura", "Denim 14 oz lavado y desgastado", "Bordado XL en la espalda", "Pespunte grueso crudo", "Botones metálicos plateados"],
    "100% algodón",
    "a boxy distressed denim trucker jacket in washed black denim with frayed edges and abrasions at the elbows and collar, thick "
    "off-white topstitching, silver metal buttons, hem at the waist, not long; shown from the BACK so the art is visible: a huge "
    "embroidery covering the whole back of an original flaming heart pierced by a long slim cross, with spread feathered wings and a ring "
    "of thorned vine around it, in white, silver-grey and oxblood red thread",
    "back view, half turned with one hand pushing the curly mop off his face: worn over a white long-sleeve, with raw indigo ultra-wide "
    "baggy jeans with an ecru thorned vine up the legs, black puffy skate shoes, a silver wallet chain, a black ribbed beanie stuffed in "
    "the back pocket; weight on one leg, the back embroidery fully visible",
    featured=True)

add("nocturne-track-jacket", "Nocturne Track Jacket", "chaquetas", 120, "kio", ("Black / Oxblood", "black-oxblood", "#0B0B0C"),
    "Chaqueta de chándal de nylon negro con paneles burdeos, vivos plateados y espinas estampadas bajando por las mangas. Deportiva de nombre y nocturna de corazón.",
    ["Corte boxy, largo a la cadera", "Tricot de nylon brillante", "Paneles laterales burdeos", "Espinas estampadas en las mangas", "Cuello alto con cremallera"],
    "100% poliamida. Forro 100% poliéster",
    "a boxy zip track jacket in glossy black nylon tricot, " + HIP + ", stand-up collar, silver zip, oxblood red panels down both sides "
    "and under the arms with thin silver-white piping along the seams, black thorned vines printed running down the outer sleeves over "
    "the oxblood, elastic cuffs and hem; no stripe tape, no logos",
    "worn zipped up to the chin with the collar over the mouth, with ash grey ultra-wide baggy jeans, grey chunky skate sneakers, a "
    "small silver charm set on a belt loop, wired headphones over the collar, long black fringe over the eyes; hands in the jacket "
    "pockets, hunched against the cold")

add("howl-collar-jacket", "Howl Collar Jacket", "chaquetas", 159, "vera", ("Washed Black", "washed-black", "#2B2A2D"),
    "Chaqueta corta de denim negro lavado con un cuello de pelo sintético negro enorme y desgreñado. Y2K de verdad, sin que parezca un disfraz.",
    ["Corte boxy, largo a la cintura", "Denim 13 oz lavado", "Cuello de pelo sintético desmontable", "Botones metálicos plateados"],
    "100% algodón. Cuello 100% poliéster",
    "a boxy short jacket in washed black denim, hem at the waist, not long, silver metal buttons, two chest flap pockets, an oversized "
    "shaggy black faux-fur collar that spreads over the shoulders; front view laid flat",
    "worn buttoned with the faux-fur collar framing the face, with dark midnight indigo ultra-wide baggy jeans, black platform Mary Janes "
    "with white socks, small silver cross hoops, septum ring and black blunt fringe; hands shoved in the jeans pockets, chin buried in the "
    "fur, cold stare")

add("briar-puffer", "Briar Puffer", "chaquetas", 179, "yara", ("Matte Black", "matte-black", "#111113"),
    "Plumífero corto negro mate con el pespunte del acolchado dibujando una enredadera de espinas en color hueso. Abriga como un edredón y se ve como un tatuaje.",
    ["Corte boxy, largo a la cintura", "Nylon mate", "Acolchado con pespunte de espinas en hueso", "Relleno 100% poliéster reciclado", "Cuello alto"],
    "100% nylon. Relleno 100% poliéster reciclado",
    "a boxy short puffer jacket in matte black nylon, hem at the waist, not long, high funnel collar, silver zip; the quilting is stitched "
    "in ecru bone thread as winding thorned vines instead of straight channels, so the puffy baffles follow the vine shapes; front view "
    "laid flat",
    "worn zipped to the chest over a black hoodie with the hood out, with ecru bone ultra-wide baggy jeans with black topstitching, a "
    "black pyramid-studded belt, chunky black skate sneakers, a black ribbed beanie over the bleached curls with dark roots, a barbed "
    "silver chain; thumbs hooked in the jean pockets, wide stance, unbothered",
    badge="Nuevo")

add("sexton-work-jacket", "Sexton Work Jacket", "chaquetas", 135, "bruno", ("Faded Coal", "faded-coal", "#3A3836"),
    "Chaqueta de trabajo en lona negra desteñida con cuello de pana color hueso y una pala cruzada con una rosa espinosa bordada en el bolsillo. Hecha para currar, patinar y mancharse sin drama.",
    ["Corte boxy, largo a la cadera", "Lona de algodón 12 oz desteñida", "Cuello de pana color hueso", "Bordado de pala y rosa en el bolsillo", "Pespunte triple crudo"],
    "100% algodón",
    "a boxy work jacket in faded black cotton duck canvas with a sun-faded worn look, " + HIP + ", ecru bone corduroy collar, silver "
    "metal snaps, two lower patch pockets and one chest pocket, thick triple ecru topstitching; on the chest pocket a small embroidered "
    "original motif of a shovel crossed with a thorned rose in bone white and oxblood thread",
    "worn open over a black tee and a white long-sleeve, with raw indigo ultra-wide baggy jeans, black puffy skate shoes, a black trucker "
    "cap backwards over the curly mop, a silver wallet chain, a skateboard held by the trucks at his side; easy stance, smirking")

add("burnout-racer", "Burnout Racer", "chaquetas", 149, "kio", ("Black / Blood Red", "black-blood-red", "#0B0B0C"),
    "Chaqueta racing de nylon negro con llamas rojo sangre que suben por el cuerpo y las mangas, sin un solo parche de marca. Velocidad de los 2000 sin patrocinadores.",
    ["Corte boxy, largo a la cintura", "Nylon con acolchado ligero", "Llamas rojo sangre estampadas", "Cuello mao con presilla", "Sin logotipos"],
    "100% nylon. Relleno 100% poliéster",
    "a boxy short racing jacket in glossy black nylon, hem at the waist, not long, mandarin collar with a snap tab, silver zip, padded "
    "shoulders; bold blood red flames with thin ecru outlines lick up from the hem across the body and from the cuffs up the sleeves; no "
    "patches, no logos, no text",
    "worn zipped up, with washed black ultra-wide baggy jeans, a white pyramid-studded belt, grey chunky skate sneakers, wired headphones "
    "around the neck, long black fringe over one eye; one hand on the back of the neck, slouched sideways")

add("requiem-varsity", "Requiem Varsity", "chaquetas", 199, "vera", ("Washed Black / Bone", "washed-black-bone", "#2B2A2D"),
    "Varsity de paño negro lavado con mangas de polipiel color hueso y un corazón con espinas en chenilla en el pecho. El uniforme de un equipo que no existe y al que todos quieren unirse.",
    ["Corte boxy, largo a la cadera", "Cuerpo de paño de lana", "Mangas de polipiel color hueso", "Parche de chenilla de corazón con espinas", "Ribetes de punto rayados"],
    "Cuerpo 70% lana, 30% poliéster. Mangas 100% poliuretano",
    "a boxy varsity jacket with a washed black wool body and ecru bone faux-leather sleeves, black and bone striped rib-knit collar, cuffs "
    "and hem, silver snaps, " + HIP + "; on the left chest a black and bone chenille patch of an original heart wrapped in thorns with a "
    "small flame on top, no letters, no numbers",
    "worn open over a sheer black mesh tee and a white long-sleeve, with black ultra-wide baggy jeans, a black leather belt with a double "
    "row of silver grommets and a small charm cluster, black platform Mary Janes with grey socks, black blunt fringe, septum ring; leaning "
    "back against the wall with one knee bent, hands in the jacket pockets",
    badge="Nuevo")

# ================================= CAPAS =================================
add("insomnia-stripe-ls", "Insomnia Stripe LS", "capas", 35, "vera", ("Black / White Stripe", "black-white-stripe", "#0B0B0C"),
    "Manga larga ajustada de rayas finas blancas y negras, la base de cualquier layering que se precie. Póntela debajo de cualquier camiseta y el look ya está medio hecho.",
    ["Corte ajustado", "Punto de algodón elástico", "Rayas tejidas, no estampadas", "Puños largos con agujero para el pulgar"],
    "95% algodón, 5% elastano",
    "a fitted long-sleeve top in stretch cotton jersey with thin even horizontal yarn-dyed black and white stripes, crew neck, hem at the "
    "hip, extra-long cuffs with thumbholes; plain, no print",
    "worn under a sheer black mesh short-sleeve tee so the stripes show through everywhere, with washed black ultra-wide baggy jeans, a "
    "white pyramid-studded belt, black puffy skate shoes, a silver spike ring, black blunt fringe and septum ring; arms stretched out in "
    "front with thumbs through the thumbholes, sleepy face",
    fit="Ajustado", featured=True)

add("altar-longsleeve", "Altar Longsleeve", "capas", 29, "kio", ("Optic White", "optic-white", "#F4F3EF"),
    "Manga larga blanca ajustada con una crucecita negra bordada en el puño. Es la pieza más sencilla de la tienda y la que más vas a usar.",
    ["Corte ajustado", "Algodón 180 g/m² con elastano", "Cruz bordada en el puño izquierdo", "Agujero para el pulgar"],
    "95% algodón, 5% elastano",
    "a fitted long-sleeve t-shirt in optic white stretch cotton, crew neck, hem at the hip, extra-long sleeves with thumbholes and a tiny "
    "black embroidered cross on the left cuff; otherwise plain",
    "worn alone and loosely tucked into ash grey ultra-wide baggy jeans, a black leather belt with a double row of silver grommets hung "
    "with small silver charms, grey chunky skate sneakers, a silver filigree cross pendant on the chest, wired headphones around the neck, "
    "long black fringe over the eyes; sleeves pulled over the knuckles, head tilted, quiet",
    fit="Ajustado")

add("wraith-thermal", "Wraith Thermal", "capas", 39, "bruno", ("Washed Black", "washed-black", "#2B2A2D"),
    "Térmica de punto gofre negro lavado con bordes sin rematar y espinas estampadas en las mangas. Calentita, gastada y lista para ir debajo de todo.",
    ["Corte regular, largo a la cadera", "Punto gofre de algodón", "Bordes sin rematar", "Espinas estampadas en las mangas"],
    "100% algodón",
    "a regular-fit long-sleeve thermal top in washed black cotton waffle knit, crew neck, " + HIP + ", raw unfinished edges at the neck, "
    "cuffs and hem, faded ecru thorned vine prints running down the outside of both sleeves",
    "worn alone with raw indigo ultra-wide baggy jeans with ecru topstitching, a white pyramid-studded belt, black puffy skate shoes, a "
    "black ribbed beanie on the curly mop, a chunky silver curb bracelet, a skateboard leaning against his leg; arms stretched up behind "
    "the head showing the sleeve prints, yawning half-smile",
    fit="Regular")

add("ladder-arm-warmers", "Ladder Arm Warmers", "capas", 22, "yara", ("Black / Grey Stripe", "black-grey-stripe", "#0B0B0C"),
    "Calentadores de brazo de punto a rayas negras y grises con agujero para el pulgar y alguna carrera hecha a propósito. El truco para convertir cualquier camiseta en layering.",
    ["Punto acrílico suave", "Rayas negras y gris ceniza", "Agujero para el pulgar", "Carreras decorativas", "Largo hasta por encima del codo"],
    "100% acrílico",
    "a pair of long knit arm warmers in black and ash grey horizontal stripes reaching above the elbow, thumbholes at the ends, a few "
    "deliberate decorative ladders and runs in the knit, laid flat side by side",
    "three-quarter framing from the thighs up: worn on both arms with a washed black boxy tee with a toxic lime cracked cross print, "
    "washed black ultra-wide baggy jeans, a black pyramid-studded belt, silver rings on the fingers poking out of the thumbholes, bleached "
    "curls with dark roots; arms raised and crossed above the head to show the arm warmers, smirk",
    kind="accessory", sizes=OS, fit="Elástico")

add("snare-fishnet-top", "Snare Fishnet Top", "capas", 29, "vera", ("Black", "black", "#0B0B0C"),
    "Top de rejilla ancha negra de manga larga para llevar debajo de camisetas o encima de tops. Es el detalle que convierte un look normal en uno muy tuyo.",
    ["Corte ajustado", "Rejilla ancha elástica", "Cuello redondo con ribete", "Mangas largas hasta la mano"],
    "90% poliamida, 10% elastano",
    "a fitted long-sleeve top in wide-hole black stretch fishnet, crew neck with a neat black binding, hem at the hip, extra-long sleeves; "
    "see-through net",
    "worn over a fitted oxblood red tank top, with ecru bone ultra-wide baggy jeans with black topstitching, a black leather belt with a "
    "double row of silver grommets, black platform Mary Janes with white socks, a silver choker with a small winged heart charm, septum "
    "ring, black blunt fringe; hands in the back pockets, hip popped, sharp gaze",
    fit="Ajustado")

add("lattice-knit-vest", "Lattice Knit Vest", "capas", 49, "kio", ("Faded Grey", "faded-grey", "#9A9896"),
    "Chaleco de punto gris desgastado con cenefas de espinas y una celosía gótica en jacquard negro. Encima de una manga larga de rayas o de una camisa, sin miedo.",
    ["Corte boxy, largo a la cadera", "Punto de algodón y lana", "Jacquard de espinas y celosía gótica", "Cuello de pico con ribete negro"],
    "60% algodón, 40% lana",
    "a boxy V-neck sweater vest in faded grey knit, " + HIP + ", black ribbed V-neck, armholes and hem, a black jacquard pattern of gothic "
    "lattice diamonds framed by thorned vine borders across the front, a few small deliberate snags",
    "worn over a black and white striped long-sleeve, with black ultra-wide baggy jeans with white topstitching, a white pyramid-studded "
    "belt, worn black leather boots, a silver safety-pin earring, long black fringe covering the eyes; hands clasped behind the back, head "
    "slightly bowed")

add("litany-longsleeve", "Litany Longsleeve", "capas", 42, "yara", ("Ash Grey", "ash-grey", "#8C8A88"),
    "Manga larga gris ceniza con florituras caligráficas negras estampadas a lo largo de las dos mangas y una cruz alada pequeña en el pecho. Para que se lea en los brazos lo que no dices en voz alta.",
    ["Corte regular, largo a la cadera", "Algodón 200 g/m² lavado", "Estampado caligráfico en las mangas", "Cruz alada pequeña en el pecho"],
    "100% algodón",
    "a regular-fit long-sleeve t-shirt in washed ash grey cotton, crew neck, " + HIP + "; long cracked black prints of illegible ornamental "
    "calligraphic flourishes run vertically down the outside of both sleeves from shoulder to cuff, and a small black winged cross is "
    "printed on the left chest",
    "worn alone with black ultra-wide baggy jeans with ecru flames rising from the hem, chunky black-and-white skate sneakers, a black "
    "trucker cap, a chunky silver curb bracelet, tattooed hands, bleached curls with dark roots; arms held out to the sides with palms up "
    "to show the sleeve prints, shrugging",
    fit="Regular")

add("toxic-rib-longsleeve", "Toxic Rib Longsleeve", "capas", 32, "bruno", ("Toxic Lime", "toxic-lime", "#B6F20D"),
    "Manga larga de canalé ajustada en verde tóxico con agujero para el pulgar. El chispazo de color que asoma por debajo de una camiseta negra.",
    ["Corte ajustado", "Canalé de algodón elástico", "Agujero para el pulgar", "Cuello redondo fino"],
    "95% algodón, 5% elastano",
    "a fitted long-sleeve top in toxic lime green stretch cotton rib knit, narrow crew neck, hem at the hip, long sleeves with thumbholes; "
    "plain, no print",
    "worn alone with washed black double-knee ultra-wide baggy carpenter jeans with a skull patch on the knee, a black leather belt with a "
    "double row of silver grommets and a small lime padlock charm, black puffy skate shoes, a black ribbed beanie on the curly mop, wired "
    "headphones around the neck; mid-laugh, hands in pockets, leaning slightly forward",
    fit="Ajustado")

# =============================== ACCESORIOS ===============================
add("bone-pyramid-belt", "Bone Pyramid Belt", "accesorios", 39, "yara", ("White", "white", "#F2F0EA"),
    "Cinturón de piel blanca con tres hileras de tachuelas piramidales plateadas. Es la diferencia entre llevar baggy y saber llevarlo.",
    ["Piel vacuna blanca", "Tres hileras de tachuelas piramidales", "Hebilla de rodillo plateada", "Ancho de 4 cm"],
    "100% piel vacuna. Herrajes de metal sin níquel",
    "a white leather belt about 4 cm wide covered with three neat rows of polished silver pyramid studs along its full length, a silver "
    "roller buckle, coiled loosely in an S-shape, no logos",
    "waist-down framing from the ribs to the knees: worn slung low through the loops of washed black ultra-wide baggy jeans with thick "
    "white topstitching, a black boxy tee tucked in at the front only, a silver wallet chain hanging from the hip and a small charm "
    "cluster on a belt loop, tattooed hand with one thumb hooked in the belt",
    kind="accessory", sizes=BELT, fit="Talla por cintura en cm", badge="Top")

add("twin-grommet-belt", "Twin Grommet Belt", "accesorios", 35, "vera", ("Black", "black", "#0B0B0C"),
    "Cinturón de piel negra con doble hilera de ojales plateados y hebilla de doble púa. Un clásico de toda la vida, pero de la nuestra.",
    ["Piel vacuna negra", "Doble hilera de ojales metálicos", "Hebilla de doble púa", "Ancho de 4 cm"],
    "100% piel vacuna. Herrajes de metal sin níquel",
    "a black leather belt about 4 cm wide with two parallel rows of silver metal grommets along its full length and a double-prong silver "
    "buckle, coiled loosely, no logos",
    "waist framing from the chest to mid-thigh: worn over a fitted baby pink baby tee through the loops of raw indigo ultra-wide baggy "
    "jeans, a small silver charm set clipped to one grommet, the ends of the black blunt fringe and a silver choker just visible at the "
    "top of the frame; hands resting on the hips",
    kind="accessory", sizes=BELT, fit="Talla por cintura en cm")

add("reliquary-backpack", "Reliquary Backpack", "accesorios", 89, "kio", ("Black", "black", "#0B0B0C"),
    "Mochila de piel sintética negra con tachuelas piramidales en la solapa y las asas, cierres plateados y anilla para colgar tus charms. Cabe el portátil, cabe la cámara y caben todos tus problemas.",
    ["Piel sintética negra de grano", "Tachuelas piramidales en solapa y asas", "Funda acolchada para portátil de 14 pulgadas", "Anilla en D para llaveros", "35 × 28 × 12 cm"],
    "Exterior 100% poliuretano (piel sintética). Forro 100% poliéster. Tachuelas de metal sin níquel",
    "a medium black grained faux-leather backpack with a rounded flap top fastened by two silver buckle straps, the flap edged with a row "
    "of silver pyramid studs and a cluster of studs forming a small cross in its centre, studded shoulder straps, a silver D-ring on the "
    "side, a front zip pocket, no logos, standing upright",
    "three-quarter back view from mid-thigh up: worn on both shoulders over a boxy black zip hoodie, with ash grey ultra-wide baggy jeans, "
    "a small cluster of silver charms hanging from the backpack D-ring, long black fringe visible in profile as the head turns back over "
    "the shoulder",
    kind="accessory", fit="Talla única", featured=True)

add("grave-chain", "Grave Chain", "accesorios", 29, "bruno", SILVER,
    "Cadena de cartera gruesa de acero con dos mosquetones y una pequeña cruz alada colgando. Suena cuando caminas, y de eso se trata.",
    ["Acero inoxidable", "Eslabón barbado grueso", "Dos mosquetones", "Charm de cruz alada", "Largo de 60 cm"],
    "Acero inoxidable 316L",
    "a heavy silver-tone stainless steel wallet chain with chunky curb links, a lobster clasp at each end and a small winged cross charm "
    "hanging near one end, laid in a loose U-shape",
    "hip framing from waist to knee: clipped from the front belt loop to the back pocket of washed black ultra-wide baggy jeans with white "
    "topstitching, worn with a black leather belt with a double row of silver grommets and a faded grey tee hanging over the waist, one "
    "hand lifting the chain slightly",
    kind="accessory", fit="Talla única")

add("lurk-beanie", "Lurk Beanie", "accesorios", 25, "kio", ("Black", "black", "#0B0B0C"),
    "Gorro de canalé negro con vuelta y una pequeña cruz alada bordada en hilo plateado. Se lleva encasquetado hasta las cejas, sin excepciones.",
    ["Punto de canalé", "Vuelta doble", "Cruz alada bordada en plateado"],
    "100% acrílico",
    "a black ribbed knit cuffed beanie with a small embroidered winged cross in silver thread on the cuff, no text, laid flat",
    "portrait framing from the chest up: worn pulled low to the eyebrows over the long black fringe, with a black zip hoodie with the hood "
    "down, wired headphones around the neck and a silver safety-pin earring; looking up from under the fringe",
    kind="accessory", fit="Talla única")

add("talisman-charm-set", "Talisman Charm Set", "accesorios", 22, "vera", ("Silver / Lime", "silver-lime", "#BFC2C6"),
    "Set de cuatro charms con mosquetón para la trabilla o la mochila: calavera, corazón alado, cruz y un candado verde tóxico. Combínalos como quieras o cuélgalos todos a la vez.",
    ["4 charms y mosquetón", "Metal con baño plateado", "Candado de acrílico verde tóxico", "Mosquetón con cierre de resorte"],
    "Aleación de zinc con baño plateado. Candado de acrílico",
    "a set of four small keychain charms on a silver carabiner: a tiny silver skull, a silver heart with small wings, a slim silver cross "
    "and a mini padlock in translucent toxic lime green acrylic, arranged neatly in a row, no text",
    "close-up from waist to mid-thigh: the charm set hanging from a belt loop of ecru bone ultra-wide baggy jeans with black topstitching, "
    "with a black pyramid-studded belt and a fitted black long-sleeve top, fingers with black nail polish flicking the charms",
    kind="accessory", fit="Talla única")

add("scorch-trucker", "Scorch Trucker", "accesorios", 32, "yara", ("Washed Black", "washed-black", "#2B2A2D"),
    "Gorra trucker con frontal de espuma negro lavado, rejilla trasera y llamas rojo sangre bordadas alrededor de una cruz pequeña. Para llevar hacia atrás, por supuesto.",
    ["Frontal de espuma", "Rejilla trasera transpirable", "Bordado de llamas y cruz", "Cierre trasero de presión"],
    "Frontal 100% poliéster. Rejilla 100% nylon",
    "a trucker cap with a high washed black foam front panel, black mesh back, curved black brim and snapback closure; on the front a "
    "small embroidered ecru cross surrounded by blood red and ecru flames, no text, placed at a three-quarter angle",
    "portrait framing from the chest up: worn slightly tilted with bleached curls with dark roots poking out, over a washed black zip "
    "hoodie with silver pyramid studs on the shoulders, layered silver chains, a tattooed hand pinching the brim; squinting at the camera",
    kind="accessory", fit="Ajustable")

add("fat-tongue-skate", "Fat Tongue Skate", "accesorios", 99, "bruno", ("Black Suede", "black-suede", "#141414"),
    "Zapatilla de skate inflada en ante negro con lengüeta gorda acolchada, suela blanca gruesa y pespunte crudo. La silueta de los 2000 vuelve a mandar en el parque.",
    ["Ante y lona", "Lengüeta y cuello acolchados XL", "Suela de goma gruesa", "Cordones planos anchos", "Sin logotipos"],
    "Exterior ante y lona. Suela de caucho",
    "a pair of chunky puffy skate shoes in black suede with an extremely padded fat tongue and padded collar, thick white rubber cupsole, "
    "ecru contrast stitching, wide flat black laces, plain side panels with no logos or stripes, placed side by side at a slight "
    "three-quarter angle",
    "framing from the knees down: worn with white crew socks and washed black ultra-wide baggy jeans cuffed up twice so the whole shoe "
    "is visible, one foot resting on a scuffed skateboard on the concrete floor",
    kind="accessory", sizes=SHOES, fit="Horma amplia: pide tu talla habitual", badge="Nuevo")

# ================================= JOYERÍA =================================
add("filigree-cross", "Filigree Cross", "joyeria", 59, "vera", SILVER,
    "Colgante de cruz en plata de ley 925 con bordes de filigrana y pequeñas espinas en las puntas, con cadena fina. La pieza que no te vas a quitar ni para dormir.",
    [STERLING, "Cruz de filigrana de 4 cm", "Relieves oxidados", "Cadena forzada fina incluida"],
    STERLING,
    "a sterling silver cross pendant about 4 cm tall with ornate openwork filigree edges, tiny thorn points at the end of each arm and "
    "dark oxidized recesses, hanging on a fine silver cable chain arranged in a loose curve",
    "close-up of the chest and collarbones: the cross hanging over a black boxy tee layered on a white long-sleeve, the black blunt fringe "
    "and septum ring visible at the top of the frame, a hand with silver rings lifting the chain slightly",
    kind="jewellery", sizes=["50 cm", "60 cm"], fit="Plata 925", featured=True)

add("barb-chain", "Barb Chain", "joyeria", 69, "yara", SILVER,
    "Collar de plata 925 con eslabones de alambre de espino retorcido. Duro de aspecto y ligero de llevar.",
    [STERLING, "Eslabones de espino retorcido", "Cierre de mosquetón", "Grosor de 5 mm"],
    STERLING,
    "a sterling silver chain necklace made of twisted barbed-wire style links with small sharp barbs every few centimetres, polished with "
    "slightly oxidized recesses, lobster clasp, laid in a loose oval",
    "close-up of the neck and collarbones: worn layered with a thinner silver chain over a white ribbed tank under the open collar of a "
    "black leather jacket, a small neck tattoo visible, bleached curls with dark roots at the edge of the frame",
    kind="jewellery", sizes=["45 cm", "50 cm", "55 cm"], fit="Plata 925", badge="Nuevo")

add("spike-ring", "Spike Ring", "joyeria", 39, "bruno", SILVER,
    "Anillo de plata 925 con una fila de pinchos cónicos alrededor de la banda. Pequeño, punki y mucho más cómodo de lo que parece.",
    [STERLING, "Pinchos cónicos de 3 mm", "Banda de 5 mm", "Pulido espejo"],
    STERLING,
    "a sterling silver band ring with a single row of small polished cone spikes all around it, mirror finish, standing upright",
    "close-up of a hand wearing the spike ring on the index finger, hooked in the front pocket of washed black ultra-wide baggy jeans with "
    "white topstitching, a chunky silver curb bracelet on the wrist",
    kind="jewellery", sizes=RING, fit="Plata 925", badge="Top")

add("fallen-wing-ring", "Fallen Wing Ring", "joyeria", 45, "kio", SILVER,
    "Anillo de plata 925 con forma de ala que envuelve el dedo. Cada pluma está detallada y oxidada para que el relieve destaque.",
    [STERLING, "Ala de plumas envolvente", "Relieve oxidado", "Bordes pulidos"],
    STERLING,
    "a sterling silver ring shaped like a single feathered wing that wraps around the finger, each feather finely detailed with dark "
    "oxidized grooves, polished edges, standing upright",
    "close-up of a pale hand with chipped black nail polish wearing the wing ring on the middle finger, brushing the long black fringe "
    "away from the face, the cuff of a black and white striped long-sleeve at the wrist",
    kind="jewellery", sizes=RING, fit="Plata 925")

add("pinprick-earring", "Pinprick Earring", "joyeria", 22, "yara", SILVER,
    "Pendiente imperdible de plata 925 con una crucecita colgando. Se vende por unidad, porque los pares están sobrevalorados.",
    [STERLING, "Imperdible de 25 mm", "Cruz colgante", "Se vende por unidad"],
    STERLING,
    "a single sterling silver safety-pin earring about 25 mm long with a tiny polished silver cross dangling from the coil, placed "
    "diagonally",
    "close-up profile of the ear wearing the safety-pin earring, short bleached curls with dark roots tucked behind the ear, the collar of "
    "a black zip hoodie at the bottom of the frame",
    kind="jewellery", sizes=["Unidad"], fit="Plata 925")

add("knuckle-curb-bracelet", "Knuckle Curb Bracelet", "joyeria", 65, "bruno", SILVER,
    "Pulsera de plata 925 de eslabón barbado grueso con cierre de caja. Pesa lo justo para que la notes cada vez que empujas.",
    [STERLING, "Eslabón barbado de 9 mm", "Cierre de caja con seguro", "Pulido espejo"],
    STERLING,
    "a chunky sterling silver curb chain bracelet with wide flat 9 mm links and a box clasp, polished mirror finish, laid in a loose "
    "circle",
    "close-up of a wrist and hand wearing the curb bracelet, gripping the nose of a skateboard, the cuff of a black zip hoodie pushed up "
    "the forearm",
    kind="jewellery", sizes=["18 cm", "20 cm", "22 cm"], fit="Plata 925")

add("wingheart-choker", "Wingheart Choker", "joyeria", 49, "vera", SILVER,
    "Gargantilla de plata 925 de cadena serpiente con un corazón alado colgando en el centro. Corta, ceñida y muy 2003.",
    [STERLING, "Cadena serpiente de 2 mm", "Charm de corazón alado de 1,5 cm", "Alargador de 5 cm"],
    STERLING,
    "a sterling silver snake chain choker necklace with a small polished heart charm with tiny feathered wings hanging at the centre, "
    "lobster clasp with a short extender chain, laid in a circle",
    "close-up of the neck and chin: worn snug at the base of the neck above the collar of a fitted baby pink baby tee, black blunt fringe, "
    "septum ring and dark lipstick visible, chin slightly raised",
    kind="jewellery", sizes=["35 cm", "40 cm"], fit="Plata 925")

add("crosshang-hoops", "Crosshang Hoops", "joyeria", 35, "kio", SILVER,
    "Pareja de aros pequeños de plata 925 con una cruz colgando de cada uno. Para llevarlos dobles, en el cartílago o donde te dé la gana.",
    [STERLING, "Aros de 12 mm", "Cruces colgantes de 1 cm", "Se venden por pareja"],
    STERLING,
    "a pair of small sterling silver hoop earrings about 12 mm wide with a slim polished cross dangling from each, placed side by side",
    "close-up three-quarter profile of the ear wearing a cross hoop, long black fringe swept to the side, wired headphones around the "
    "neck, the collar of a sheer black mesh shirt",
    kind="jewellery", sizes=["Par"], fit="Plata 925")

# ---------------------------------------------------------------------------
# Batches A–D: the i-th product of each category goes to batch "ABCD"[i % 4],
# so every batch holds 2 pieces of each category (16 per batch, mixed).
_seen = Counter()
for p in P:
    p["batch"] = "ABCD"[_seen[p["category"]] % 4]
    _seen[p["category"]] += 1

data = dict(
    categories=[dict(slug=s, name=n) for s, n in CATEGORIES],
    models={k: dict(job_id=None, desc=v["desc"], casting_prompt=CASTING_TPL.format(desc=v["desc"], extra=v["extra"]))
            for k, v in MODELS.items()},
    products=P,
)

# ------------------------------- validation --------------------------------
BANNED = ["jnco", "affliction", "ed hardy", "chrome hearts", "westwood", "misfits", "sonic youth", "kangaroo",
          "nike", "adidas", "vans", "converse", "dr. martens", "supreme", "bape", "balenciaga", "rick owens"]
slugs = [p["slug"] for p in P]
names = [p["name"] for p in P]
assert len(P) == 64, len(P)
assert len(set(slugs)) == 64, "duplicate slugs"
assert len(set(names)) == 64, "duplicate names"
cats = Counter(p["category"] for p in P)
assert set(cats) == {s for s, _ in CATEGORIES} and all(v == 8 for v in cats.values()), cats
batches = Counter(p["batch"] for p in P)
assert all(batches[b] == 16 for b in "ABCD"), batches
models = Counter(p["model"] for p in P)
assert set(models) == set(MODELS), models
assert sum(p["featured"] for p in P) == 12
for p in P:
    assert len(p["colors"]) == 1 and len(p["colors"][0]["images"]) == 2, p["slug"]
    assert p["colors"][0]["variant"] is None
    assert 4 <= len(p["details"]) <= 5 or p["slug"] == "lurk-beanie", (p["slug"], len(p["details"]))
    n_sent = len(re.findall(r"[.!?](?:\s|$)", p["description"]))
    assert n_sent == 2, (p["slug"], n_sent)
    assert p["kind"] in ("garment", "accessory", "jewellery")
    blob = json.dumps(p, ensure_ascii=False).lower()
    for w in BANNED:
        assert not re.search(r"\b" + re.escape(w) + r"\b", blob), (p["slug"], w)
    if p["category"] == "vaqueros":
        assert p["fit"] == "Ultra baggy" and p["sizes"] == JEANS
        assert any(d.startswith("Bajo de") for d in p["details"]) and "Tiro medio-bajo" in p["details"], p["slug"]

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
    f.write("\n")

print(len(P), "products |", sum(len(p["colors"][0]["images"]) for p in P), "images |",
      "featured", sum(p["featured"] for p in P))
print("categories", dict(cats))
print("batches", dict(sorted(batches.items())), "| models", dict(models))
for b in "ABCD":
    print(" batch", b, dict(Counter(p["category"] for p in P if p["batch"] == b)))
print("badges", dict(Counter(str(p["badge"]) for p in P)))
print("kinds", dict(Counter(p["kind"] for p in P)))
print("->", OUT)
