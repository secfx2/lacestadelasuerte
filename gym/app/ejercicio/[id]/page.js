import { notFound } from 'next/navigation';
import ExerciseDetail from '../../../components/ExerciseDetail';
import { BackLink } from '../../../components/ui';
import { EXERCISES, getExercise } from '../../../lib/exercises';

export function generateStaticParams() {
  return EXERCISES.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const ex = getExercise(id);
  return { title: ex ? `${ex.name} · Aesthetic Coach` : 'Ejercicio' };
}

export default async function ExercisePage({ params }) {
  const { id } = await params;
  const ex = getExercise(id);
  if (!ex) notFound();
  return (
    <>
      <BackLink href="/entreno" label="Entreno" />
      <header className="page-head" style={{ marginTop: 0 }}>
        <div>
          <div className="eyebrow">{ex.cardio ? 'Cardio' : 'Técnica'}</div>
          <h1 style={{ fontSize: 28 }}>{ex.name}</h1>
        </div>
      </header>
      <ExerciseDetail id={ex.id} />
    </>
  );
}
