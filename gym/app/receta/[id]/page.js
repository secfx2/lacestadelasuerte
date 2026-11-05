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
  return { title: r ? `${r.name} · Aesthetic Coach` : 'Receta' };
}

export default async function RecipePage({ params }) {
  const { id } = await params;
  if (!getRecipe(id)) notFound();
  return (
    <Suspense fallback={null}>
      <RecipeView id={id} />
    </Suspense>
  );
}
