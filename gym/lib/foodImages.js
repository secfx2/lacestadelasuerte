// Fotos de las recetas generadas con IA (Higgsfield · GPT Image) para esta app.
// Se sirven desde el CDN de Higgsfield y Next/Image las optimiza (webp/avif al tamaño justo).
export const FOOD_CDN_HOST = 'd8j0ntlcm91z4.cloudfront.net';
export const FOOD_IMAGES = {
  'merienda-descanso-cacao': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_112944_a26fc54c-650c-43c4-8a8a-918979ea5046.png',
  'pre-tortitas-miel': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_112943_2dcd2c0c-ad2c-4806-8862-e9082d2e60a7.png',
  'tortitas-pavo-queso': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_112944_39b6ce69-6843-4281-9835-ee7687cd5c8f.png',
  'batido-whey-avena': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_112943_77f0ae1c-71f5-4498-8f93-711f41f40195.png',
  'yogur-cacao-tortitas': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_112946_db22b1b8-8dad-410c-b5df-b9908c793d91.png',
  'batido-choco-avena': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_112943_ad5b38ab-38ee-47f9-85fa-18acc2fe32b9.png',
  'bol-batido-cacao': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_112945_4ca16c30-bf16-40b2-aa0a-a51564047534.png',
  'tortitas-avena-cacao': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_112943_e5234aac-6b2d-40e4-8c4b-bdb2c4b0adea.png',
  'tostadas-pavo-huevo': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261124_100931_6116190d-7ee0-4d1a-a642-b3df0de86fd8.png',
  'bocadillo-atun': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090404_2f3c9f2d-0a7c-4c29-9a62-3a93d5ed5c46.png',
  'pollo-curry': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090403_8b008fc6-8f49-4a37-8db4-6a9bddb0c5ee.png',
  'bolonesa': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090404_8f5dde67-f14c-444f-9f42-ffaee060369b.png',
  'burrito-bowl': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261124_100928_32132d5e-353c-44c6-b871-8c6394744979.png',
  'salmon-patatas': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090411_9560c5de-ab0e-45a6-94e0-c2e7124826e2.png',
  'ternera-teriyaki': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_112942_9d1613c5-c473-4522-9696-1b51e4abdfc1.png',
  'arroz-pollo': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090406_33ae7dca-c0e8-474b-a323-e38b2d6f99b9.png',
  'hamburguesa-casera': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090410_aaf88fab-8ef2-447f-a078-fbaad92637d7.png',
  'pre-bocadillo-pavo': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_112943_1fb4b429-0299-474d-929a-e6a88240e3ec.png',
  'pre-yogur-avena': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090407_2f6bea1b-078a-40c8-b7f4-4894fb0c4aab.png',
  'pizza-wrap': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090408_100b3441-5bbd-411b-b430-602f478dfbda.png',
  'pechuga-pure': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090408_23f26a6e-cec5-4407-b86d-a1bb5f064892.png',
  'wrap-pollo': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_112949_54db53c7-7b79-426d-9038-f3492c2ed1b1.png',
  'revuelto-gambas': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261105_090415_cff57d8f-bb49-4408-8084-5e3729e96275.png',
  'ternera-patatas': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261124_100929_89b2b948-9823-40b6-8997-7d6b70cd8342.png',
  'merluza-crema': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261124_100930_a53abeff-523c-4678-bccf-63a828e4197c.png',
  'tortilla-pavo-pan': 'https://d8j0ntlcm91z4.cloudfront.net/user_2wxauV6GMeROg6twq5pzSRd9O3O/hf_20261124_100929_57523042-e396-4dd5-9769-1455010200d8.png',
};

export const foodImage = (id) => FOOD_IMAGES[id] || null;
