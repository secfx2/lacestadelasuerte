# Aesthetic Coach 💎

Web-app privada (tipo app de móvil) con mi plan de **entreno + dieta** para definir y verme ancho/aesthetic: hombros, espalda, brazos y mandíbula.

- **Hoy**: mosaico con el entreno del día, la próxima comida según la hora (abre la receta paso a paso), pesaje si toca, agua, cardio, pasos, sueño, suplementos, racha, progreso y tip del día.
- **Entreno**: rutina de 6 días para Fitness Park (máquinas, poleas, Smith y peso libre). Marcas cada serie con kg × reps, temporizador de descanso con vibración, sugerencia de subir peso (doble progresión), calentamiento, cardio y resumen con récords.
- **Técnica**: cada ejercicio tiene animación 3D (three.js) con los músculos que trabaja iluminados, fotos reales de inicio/fin, colocación, ejecución, errores típicos y alternativa si la máquina está ocupada.
- **Dieta**: menú semanal (~2.300 kcal los días de entreno, ~2.100 el domingo, 190-210 g de proteína) **sin verdura slimy ni crujiente**: va triturada, en crema o escondida. Recetas con modo paso a paso y temporizadores, ingredientes escalables (meal prep), lista de la compra y reglas de intercambio.
- **Progreso**: gráfica de peso con media semanal y proyección, coach que te dice si ajustar calorías, medidas, % de grasa (método Navy), índice hombros/cintura (Adonis ≈ 1,6), historial y récords.
- **Plan**: expectativas semana a semana, fases (adaptación → construcción → descarga → intensificación → diet break → afinado), suplementos con evidencia (y lo que no merece la pena), guía de mandíbula y reglas de oro.

Los datos (series, pesos, medidas…) se guardan en **localStorage** del dispositivo. En Ajustes puedes exportarlos/importarlos en JSON.

## Privacidad

Toda la web está detrás de una contraseña (`middleware.js`). Se configura con la variable de entorno **`APP_PASSWORD`** en Vercel. La sesión dura 180 días; cambiar la contraseña cierra todas las sesiones. Además se envía `noindex` y `robots.txt` bloquea buscadores.

## Desarrollo

```bash
cd gym
npm install
npm run dev        # http://localhost:3000 (sin APP_PASSWORD en local no pide contraseña)
```

Página de QA de animaciones: `/dev/anim`.

## Despliegue en Vercel

1. Nuevo proyecto en Vercel importando este repo.
2. **Root Directory: `gym`** (el resto del repo es La Cesta de la Suerte y no se toca).
3. Variable de entorno `APP_PASSWORD` = tu contraseña (Production y Preview).
4. Deploy. Abre la URL en el móvil → *Añadir a pantalla de inicio* para usarla como app.

## Estructura

```
gym/
  app/            páginas (Hoy, entreno, ejercicio/[id], dieta, receta/[id], progreso, plan, ajustes, login)
  components/     UI, visor 3D (Exercise3D), detalle de ejercicio, receta paso a paso
  lib/
    program.js    rutina, fases, cardio, pesajes, suplementos, mandíbula
    exercises.js  catálogo de ejercicios (técnica en español)
    recipes.js    recetas + menú semanal (macros calculados desde foods.js)
    foods.js      base de alimentos (por 100 g)
    coach.js      lógica: qué toca hoy, progresión, estadísticas, proyecciones
    anim/         rig del maniquí 3D y patrones de movimiento
    store.js      estado en localStorage
  public/ex/      fotos de ejercicios (free-exercise-db, dominio público)
```

Fotos de las recetas generadas con IA (Higgsfield) y servidas desde su CDN vía `next/image`.

> Guía general de entrenamiento y nutrición, no consejo médico.
