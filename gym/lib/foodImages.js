// Fotos de las recetas generadas con IA (Higgsfield · GPT Image) para esta app.
// Se sirven desde el CDN de Higgsfield y Next/Image las optimiza (webp/avif al tamaño justo).
export const FOOD_CDN_HOST = 'd8j0ntlcm91z4.cloudfront.net';
export const FOOD_IMAGES = {
  'tortitas-avena': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090402_3cc13f11-5e39-448a-af92-ab180bcd3951.png',
  'tostadas-pavo-huevo': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090400_cbc1ba5f-aca1-4e4a-af4d-d91731cb8f77.png',
  'bol-batido-avena': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090402_9cf6cd7f-0096-4a0f-93e3-b44d27235f44.png',
  'batido-verde': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090404_93ba0f26-bb8f-49ee-a6bc-a251c26b1fcc.png',
  'yogur-platano': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090403_ffd03c92-7c33-40c1-b22d-0f2c7ca2d52e.png',
  'bocadillo-atun': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090404_2f3c9f2d-0a7c-4c29-9a62-3a93d5ed5c46.png',
  'batido-whey-fruta': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090402_56a6587b-ace4-45e2-a4e3-6e6ec1d85729.png',
  'tortitas-pavo': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090401_2799cab6-e3eb-40b0-8b02-bba8a0e154c5.png',
  'pollo-curry': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090403_8b008fc6-8f49-4a37-8db4-6a9bddb0c5ee.png',
  'lentejas-pollo': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090403_248f4803-e1a5-42f9-b364-d8da32e069de.png',
  'bolonesa': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090404_8f5dde67-f14c-444f-9f42-ffaee060369b.png',
  'burrito-bowl': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090401_ffc0b68b-cb5e-43a8-8e21-3c02642ba009.png',
  'salmon-patatas': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090411_9560c5de-ab0e-45a6-94e0-c2e7124826e2.png',
  'ternera-teriyaki': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090408_94cb53dc-bffc-4138-b537-e970163d6f18.png',
  'arroz-pollo': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090406_33ae7dca-c0e8-474b-a323-e38b2d6f99b9.png',
  'hamburguesa-casera': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090410_aaf88fab-8ef2-447f-a078-fbaad92637d7.png',
  'pre-tortitas-cacahuete': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090407_141c00e7-bcd9-41b4-9d6a-63d0c37d0d1c.png',
  'pre-bocadillo-pavo': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090409_c9050c7f-5eb4-4b19-b43b-b9cf9975a982.png',
  'pre-yogur-avena': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090407_2f6bea1b-078a-40c8-b7f4-4894fb0c4aab.png',
  'merienda-descanso': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090407_e325aaf4-3c7b-4f94-9607-0dbb7899a5fc.png',
  'merluza-salmorejo': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090409_061d473c-bb49-46cb-a0fa-5c2cb55148a1.png',
  'tortilla-pavo-gazpacho': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090411_7f648d2b-8ce7-40e9-88f1-62ff3df9f752.png',
  'pizza-wrap': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090408_100b3441-5bbd-411b-b430-602f478dfbda.png',
  'pechuga-pure': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090408_23f26a6e-cec5-4407-b86d-a1bb5f064892.png',
  'wrap-pollo': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090416_f1d47795-69c6-4cf8-8569-8d44dc6e3fd3.png',
  'revuelto-gambas': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090415_cff57d8f-bb49-4408-8084-5e3729e96275.png',
};

export const foodImage = (id) => FOOD_IMAGES[id] || null;
