/* Esquemas zod de las respuestas de texto (Claude) y tipos de entrada. */
import { z } from "zod";

export const NamesSchema = z.object({
  names: z.array(
    z.object({
      name: z.string().describe("The brand name, exactly as it would be written in the logo"),
      why: z.string().describe("Por qué funciona, en español, 1-2 frases"),
      vibe: z.array(z.string()).describe("3-4 etiquetas cortas de ambiente, en español, minúsculas"),
      tagline: z.string().describe("Lema corto, en el idioma pedido"),
      handle: z.string().describe("Instagram/TikTok handle suggestion starting with @, lowercase, no spaces"),
      domains: z.array(z.string()).describe("1-2 domain ideas, .com and/or .es"),
      caution: z.string().describe("Aviso breve en español: posibles conflictos (marcas parecidas, significado en otros idiomas) y recordar comprobar registro en OEPM/EUIPO"),
    })
  ),
});

export const IdeasSchema = z.object({
  concepts: z.array(
    z.object({
      name: z.string().describe("Product name in English, 2-3 words, catalog style (e.g. 'Seraph Baggy')"),
      category: z.string().describe("Category slug from the allowed list"),
      kind: z.enum(["garment", "accessory", "jewellery"]),
      description_es: z.string().describe("Descripción de producto en español de España, 1-2 frases, tono de la marca"),
      details_es: z.array(z.string()).describe("3-5 detalles de producto cortos en español"),
      garment_en: z.string().describe("Precise English description of the garment for the flat-lay image prompt: garment type, colour and wash, fabric, cut and fit, every graphic/embroidery/hardware detail; no background or camera words"),
      styling_en: z.string().describe("English styling for an on-model shot: full outfit, footwear, accessories, attitude"),
      price_eur: z.number().describe("Suggested retail price in euros, coherent with the brand"),
    })
  ),
});

export const ImproveSchema = z.object({
  garment_en: z.string().describe("Precise English description of the item for the image prompt (type, colour, wash, fabric, fit, graphics, hardware)"),
  styling_en: z.string().describe("English styling for an on-model photo: full outfit, footwear, accessories, pose, attitude"),
  kind: z.enum(["garment", "accessory", "jewellery"]),
  name: z.string().describe("Product name in English, 2-3 words, catalog style"),
  category: z.string().describe("Category slug from the allowed list"),
  description_es: z.string().describe("Descripción de producto en español de España, 1-2 frases"),
  details_es: z.array(z.string()).describe("3-5 detalles cortos en español"),
  notes_es: z.string().describe("Una frase en español explicando qué has interpretado o qué falta por concretar"),
});
