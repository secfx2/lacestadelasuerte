import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import RecipeView from '../../../components/RecipeView';
import { RECIPES, getRecipe } from '../../../lib/recipes';

export function generateStaticParams() {
  return RECIPES.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const r = getRecipe(id);
  return { title: r ? `${r.name} · Aesthetic Coach` : 'Tu receta · Aesthetic Coach' };
}

export default async function RecipePage({ params }) {
  const { id } = await params;
  // Las recetas creadas por tu asesor (c-…) viven en tus datos: se cargan en el móvil
  if (!getRecipe(id) && !/^c-[a-z0-9]{4,30}$/.test(id)) notFound();
  return (
    <Suspense fallback={null}>
      <RecipeView id={id} />
    </Suspense>
  );
}
