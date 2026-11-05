# Aesthetic Coach 💎

Web-app privada (tipo app de móvil) con mi plan de **entreno + dieta** para definir y verme ancho/aesthetic: hombros, espalda, brazos y mandíbula.

- **Hoy**: mosaico con el entreno del día, la próxima comida según la hora (abre la receta paso a paso), pesaje si toca, agua, cardio, pasos, sueño, suplementos, racha, progreso y tip del día.
- **Entreno**: rutina de 6 días para Fitness Park (máquinas, poleas, Smith y peso libre). Marcas cada serie con kg × reps, temporizador de descanso con vibración, sugerencia de subir peso (doble progresión), calentamiento, cardio y resumen con récords.
- **Técnica**: cada ejercicio tiene animación 3D (three.js) con los músculos que trabaja iluminados, fotos reales de inicio/fin, colocación, ejecución, errores típicos y alternativa si la máquina está ocupada.
- **Dieta**: menú semanal (~2.300 kcal los días de entreno, ~2.100 el domingo, 190-210 g de proteína) **sin verdura slimy ni crujiente**: va triturada, en crema o escondida. Recetas con modo paso a paso y temporizadores, ingredientes escalables (meal prep), lista de la compra y reglas de intercambio.
- **Progreso**: gráfica de peso con media semanal y proyección, coach que te dice si ajustar calorías, medidas, % de grasa (método Navy), índice hombros/cintura (Adonis ≈ 1,6), historial y récords.
- **Plan**: expectativas semana a semana, fases (adaptación → construcción → descarga → intensificación → diet break → afinado), suplementos con evidencia (y lo que no merece la pena), guía de mandíbula, guía de cuello (tensión de oficina) y reglas de oro.
- **Sueño**: botones *Me acuesto* / *Me levanto* (o las horas a mano). Con la hora a la que te levantas se recoloca el horario de comidas del día; si has dormido poco, el entreno te avisa de no ir al fallo, y te dice a qué hora acostarte para dormir 8 h.
- **Asesor IA** (Claude): conoce tu plan y tus datos, puedes mandarle **fotos** (comida, etiquetas, cartas, máquinas, tu físico) y, si se lo pides, **cambia el plan**: comidas del menú (para siempre o un día), recetas nuevas, ejercicios de la rutina, perfil y notas que debe recordar. Los cambios se ven en la conversación y se pueden deshacer; la lista está en Ajustes → *Tus cambios del plan*.
- **Fotos de progreso** (opcional): en Progreso, privadas en Supabase.

## Datos y sincronización

Los datos (series, pesos, medidas, comidas…) se guardan **en la nube y en cada dispositivo**:

- Copia local en `localStorage`: la app funciona sin conexión.
- Copia en la nube: Supabase (proyecto `embersaintco-web`), esquema privado `aesthetic_coach` (tablas `state`, `state_history`, `secret`) que la API pública no expone. Solo se accede mediante las funciones RPC `ac_get_state`, `ac_put_state`, `ac_list_backups` y `ac_get_backup`, que exigen un token secreto.
- El servidor (`/api/state`, protegido por la sesión) calcula ese token a partir de `APP_PASSWORD`; en Supabase solo se guarda su hash.
- Escritura con control de versión: si otro dispositivo guardó antes, la app combina ambos estados campo a campo (`lib/merge.js`, gana lo más reciente) y vuelve a guardar.
- Copia de seguridad diaria automática (últimos 90 días), restaurable desde Ajustes. Exportar/importar JSON sigue disponible.
- Tus cambios del plan van en `custom` (`lib/plan.js`, `lib/planOps.js`) y se sincronizan igual que el resto.
- Las fotos de progreso van aparte, en la tabla `aesthetic_coach.photos` (funciones `ac_list_photos`, `ac_put_photo`, `ac_get_photo`, `ac_delete_photo`, con el mismo token). No entran en la exportación JSON ni en las copias diarias.

Variables en Vercel: `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY`. Si faltan, la app funciona solo en local.

> **Si cambias `APP_PASSWORD`**, la sincronización deja de funcionar hasta que actualices el hash en Supabase:
> `update aesthetic_coach.secret set token_hash = encode(extensions.digest(encode(extensions.digest('aesthetic-coach-sync:v1:' || '<NUEVA_CONTRASEÑA>', 'sha256'), 'hex'), 'sha256'), 'hex') where id = 1;`
>
> Para quitarlo todo de Supabase: `drop schema aesthetic_coach cascade;` y borrar las funciones `public.ac_*` (las de estado y copias, y las cuatro de fotos).

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
    plan.js       plan personalizado = plan base + tus cambios (menú, recetas, rutina, notas)
    planOps.js    operaciones de cambio (las usa el asesor y la app)
    advisorTools.js  herramientas del asesor IA (validan y simulan los cambios)
    sleep.js      sueño, hora de acostarse y horario de comidas según cuándo te levantas
    anim/         rig del maniquí 3D y patrones de movimiento
    store.js      estado en localStorage
  public/ex/      fotos de ejercicios (free-exercise-db, dominio público)
```

Fotos de las recetas generadas con IA (Higgsfield) y servidas desde su CDN vía `next/image`.

> Guía general de entrenamiento y nutrición, no consejo médico.
