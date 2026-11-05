// Catálogo de ejercicios.
// Campos estructurales (id, name, img, anim, primary, secondary, equip, cardio) = esqueleto fijo.
// Campos descriptivos (zone, setup, steps, mistakes, tip, alt, cardioHow) = contenido en español.
//
// img  -> id de free-exercise-db (fotos inicio/fin en /public/ex/<id>-0.webp y -1.webp)
// anim -> patrón de animación 3D (lib/anim/patterns.js)
// primary/secondary -> claves de músculo:
//   delts (lateral), deltsFront, deltsRear, traps, chest, lats, upperBack, lowerBack,
//   abs, obliques, biceps, triceps, forearms, glutes, quads, hamstrings, adductors, calves, neck
// alt -> { id: <id de este catálogo o null>, text: 'alternativa si la máquina está ocupada' }

export const MUSCLE_LABELS = {
  delts: 'Deltoides lateral',
  deltsFront: 'Deltoides frontal',
  deltsRear: 'Deltoides posterior',
  traps: 'Trapecio',
  chest: 'Pectoral',
  lats: 'Dorsal ancho',
  upperBack: 'Espalda media (romboides)',
  lowerBack: 'Lumbar',
  abs: 'Abdomen',
  obliques: 'Oblicuos',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  forearms: 'Antebrazo',
  glutes: 'Glúteo',
  quads: 'Cuádriceps',
  hamstrings: 'Femoral',
  adductors: 'Aductores',
  calves: 'Gemelo',
  neck: 'Cuello',
};

export const EXERCISES = [
  // ───────────── EMPUJE ─────────────
  {
    id: 'press-inclinado-mancuernas', name: 'Press inclinado con mancuernas', img: 'Incline_Dumbbell_Press', anim: 'inclinePressDB', primary: ['chest', 'deltsFront'], secondary: ['triceps'], equip: 'Banco regulable a 30° + mancuernas',
    zone: 'Zona de peso libre: bancos regulables junto al rack de mancuernas.',
    setup: [
      'Respaldo a 30° (2-3 muescas). Más inclinado = más hombro y menos pecho.',
      'Siéntate con las mancuernas sobre los muslos y túmbate llevándolas al pecho con un golpe de rodilla.',
      'Escápulas juntas y hacia abajo, pecho alto, pies firmes en el suelo.',
    ],
    steps: [
      'Empieza con las mancuernas a la altura del pecho alto, codos a unos 45-60° del torso (no en cruz).',
      'Empuja hacia arriba y ligeramente hacia dentro, soltando el aire. Arriba no choques las mancuernas.',
      'Baja en 2-3 s hasta notar estiramiento en el pecho alto, con antebrazos verticales.',
      'Pausa corta abajo, sin rebotar, y repite.',
    ],
    mistakes: [
      'Banco demasiado inclinado (45°+): se convierte en un press de hombro.',
      'Abrir los codos a 90°: carga el hombro y aumenta el riesgo de lesión.',
      'Despegar los glúteos del banco o arquear en exceso la espalda.',
      'Recorrido corto: si no bajas, no trabajas el estiramiento.',
    ],
    tip: 'Piensa en llevar los bíceps hacia la cara al subir: así el pectoral superior "llena" la camiseta por arriba.',
    alt: { id: 'press-inclinado-smith', text: 'Press inclinado en Smith o máquina de press inclinado' },
  },
  {
    id: 'press-hombro-maquina', name: 'Press de hombro en máquina', img: 'Machine_Shoulder_Military_Press', anim: 'shoulderPressMachine', primary: ['deltsFront', 'delts'], secondary: ['triceps', 'traps'], equip: 'Máquina de press de hombro',
    zone: 'Zona de máquinas guiadas (circuito de placas): "Shoulder Press".',
    setup: [
      'Ajusta el asiento para que las asas queden a la altura de los hombros (o un poco por debajo).',
      'Espalda pegada al respaldo, pies apoyados y core apretado.',
    ],
    steps: [
      'Agarra las asas con los codos ligeramente por delante del cuerpo, no totalmente abiertos.',
      'Empuja hacia arriba soltando el aire hasta casi estirar los codos (sin bloquear fuerte).',
      'Baja controlando en 2-3 s hasta que las manos queden a la altura de la barbilla o algo más abajo.',
      'Mantén la cabeza neutra y la espalda pegada durante toda la serie.',
    ],
    mistakes: [
      'Asiento demasiado bajo o alto: recorrido raro y molestias en el hombro.',
      'Despegar la espalda y convertirlo en un press inclinado de pecho.',
      'Bajar a medias para mover más peso.',
    ],
    tip: 'Empuja "hacia el techo y ligeramente hacia atrás": nota cómo trabajan el frontal y el lateral juntos.',
    alt: { id: 'press-hombro-mancuernas', text: 'Press de hombro sentado con mancuernas' },
  },
  {
    id: 'elevacion-lateral-mancuerna', name: 'Elevaciones laterales con mancuernas', img: 'Side_Lateral_Raise', anim: 'lateralRaise', primary: ['delts'], secondary: ['traps'], equip: 'Mancuernas',
    zone: 'Zona de peso libre, frente al espejo junto al rack de mancuernas.',
    setup: [
      'Coge un peso ligero (normalmente 6-12 kg): aquí manda la técnica, no el ego.',
      'De pie, pies a la anchura de las caderas, torso un pelín inclinado hacia delante y codos ligeramente flexionados.',
    ],
    steps: [
      'Sube los brazos hacia los lados "empujando las mancuernas hacia las paredes", no hacia el techo.',
      'Para cuando los brazos estén paralelos al suelo; los codos van a la altura o un pelín por encima de las manos.',
      'Pausa de 1 s arriba soltando el aire.',
      'Baja en 2-3 s sin dejar que las mancuernas descansen en los muslos.',
    ],
    mistakes: [
      'Balancearse con el cuerpo para subir más peso.',
      'Encoger los hombros: trabaja el trapecio en lugar del deltoides.',
      'Subir con las manos por delante del codo o girando el pulgar hacia arriba.',
      'Dejar caer el peso en la bajada.',
    ],
    tip: 'Es EL ejercicio de la anchura de hombros: imagina que alejas las mancuernas de ti lo máximo posible.',
    alt: { id: 'elevacion-lateral-polea', text: 'Lateral en polea o máquina de laterales' },
  },
  {
    id: 'contractor-pecho', name: 'Contractor de pecho (pec deck)', img: 'Butterfly', anim: 'pecFly', primary: ['chest'], secondary: ['deltsFront'], equip: 'Máquina contractor / pec deck',
    zone: 'Zona de máquinas guiadas: "Pec Deck / Butterfly" (suele ser la misma máquina que el contractor inverso).',
    setup: [
      'Asiento a una altura en la que las asas queden a la altura del pecho medio.',
      'Ajusta las asas para notar un buen estiramiento al inicio sin que el hombro se vaya atrás.',
      'Espalda pegada, pecho alto y escápulas juntas.',
    ],
    steps: [
      'Con los codos ligeramente flexionados, junta las asas delante del pecho haciendo un abrazo amplio.',
      'Aprieta el pecho 1 s cuando las manos se junten, soltando el aire.',
      'Abre despacio en 2-3 s hasta notar estiramiento, sin pasar los brazos por detrás del cuerpo.',
    ],
    mistakes: [
      'Empujar con las manos/tríceps en lugar de "abrazar" con el pecho.',
      'Despegar la espalda o adelantar los hombros al cerrar.',
      'Abrir demasiado atrás: tensión innecesaria en el hombro.',
    ],
    tip: 'Imagina que intentas juntar los codos, no las manos: el pecho se contrae mucho más.',
    alt: { id: null, text: 'Cruce de poleas de pie o aperturas con mancuernas' },
  },
  {
    id: 'elevacion-lateral-polea', name: 'Elevación lateral unilateral en polea', img: 'Cable_Seated_Lateral_Raise', anim: 'lateralRaiseCable', primary: ['delts'], secondary: [], equip: 'Polea baja con maneral',
    zone: 'Zona de poleas (torre de cruce de poleas / multipolea).',
    setup: [
      'Polea en la posición más baja con un maneral (estribo).',
      'Ponte de lado a la polea y agarra el maneral con la mano contraria (el cable pasa por delante de tus piernas).',
      'Puedes sujetarte a la torre con la otra mano e inclinarte un poco hacia fuera.',
    ],
    steps: [
      'Con el codo ligeramente flexionado, sube el brazo hacia el lado hasta la altura del hombro.',
      'Pausa 1 s arriba soltando el aire.',
      'Baja en 2-3 s hasta que la mano quede delante de la cadera, sin soltar la tensión.',
      'Haz todas las reps con un brazo y luego cambia.',
    ],
    mistakes: [
      'Tirar con el trapecio encogiendo el hombro.',
      'Girar el torso para ayudar.',
      'Usar demasiado peso y acortar el recorrido.',
    ],
    tip: 'La polea mantiene tensión abajo, donde la mancuerna no: perfecto para dar "redondez" al hombro.',
    alt: { id: 'elevacion-lateral-mancuerna', text: 'Elevación lateral con mancuerna a una mano' },
  },
  {
    id: 'triceps-polea-cuerda', name: 'Extensión de tríceps en polea con cuerda', img: 'Triceps_Pushdown_-_Rope_Attachment', anim: 'pushdown', primary: ['triceps'], secondary: [], equip: 'Polea alta + cuerda',
    zone: 'Zona de poleas: polea en la posición más alta con la cuerda.',
    setup: [
      'Agarra la cuerda con las palmas enfrentadas, de pie y muy cerca de la polea.',
      'Codos pegados a los costados, torso un pelín inclinado hacia delante.',
    ],
    steps: [
      'Estira los codos empujando la cuerda hacia abajo, soltando el aire.',
      'Abajo separa los extremos de la cuerda hacia fuera y aprieta el tríceps 1 s.',
      'Sube en 2 s hasta que los antebrazos queden algo por encima de la paralela, sin mover los codos.',
    ],
    mistakes: [
      'Mover los codos hacia delante y atrás (se convierte en un press).',
      'Echar el peso del cuerpo encima para mover más carga.',
      'Subir demasiado y perder la tensión.',
    ],
    tip: 'El tríceps es 2/3 del brazo: unos brazos grandes en camiseta dependen sobre todo de él.',
    alt: { id: null, text: 'Extensión en polea con barra recta o barra V' },
  },
  {
    id: 'triceps-sobre-cabeza', name: 'Extensión de tríceps sobre la cabeza en polea', img: 'Triceps_Overhead_Extension_with_Rope', anim: 'overheadTriceps', primary: ['triceps'], secondary: [], equip: 'Polea + cuerda',
    zone: 'Zona de poleas: cuerda en polea media-alta, de espaldas a la máquina.',
    setup: [
      'Agarra la cuerda, gírate de espaldas a la polea y da un paso adelante con un pie (posición de zancada).',
      'Codos apuntando al frente, junto a la cabeza, y torso algo inclinado.',
    ],
    steps: [
      'Desde la posición con los codos doblados y las manos detrás de la cabeza, estira los codos hacia delante y arriba.',
      'Aprieta el tríceps 1 s con los brazos estirados, soltando el aire.',
      'Vuelve en 2-3 s dejando que el tríceps se estire bien detrás de la cabeza.',
    ],
    mistakes: [
      'Abrir los codos hacia los lados.',
      'Arquear la zona lumbar en exceso.',
      'Recorrido corto: el estiramiento es lo que hace crecer la cabeza larga.',
    ],
    tip: 'Esta posición estira la cabeza larga del tríceps, la que da volumen al brazo visto de lado.',
    alt: { id: 'press-frances', text: 'Press francés con barra Z o extensión con mancuerna' },
  },

  // ───────────── TIRÓN ─────────────
  {
    id: 'jalon-agarre-ancho', name: 'Jalón al pecho agarre ancho', img: 'Wide-Grip_Lat_Pulldown', anim: 'latPulldown', primary: ['lats'], secondary: ['biceps', 'upperBack', 'deltsRear'], equip: 'Máquina de jalón',
    zone: 'Zona de máquinas o poleas: "Lat Pulldown" con barra larga.',
    setup: [
      'Ajusta el rodillo para que los muslos queden bien bloqueados.',
      'Agarre prono algo más ancho que los hombros (no en los extremos de la barra).',
    ],
    steps: [
      'Brazos estirados, pecho alto e inclinación ligera hacia atrás (10-15°).',
      'Baja primero las escápulas y luego tira de la barra hacia la parte alta del pecho llevando los codos hacia abajo y a los costados.',
      'Aprieta la espalda 1 s abajo, soltando el aire.',
      'Sube en 2-3 s hasta estirar del todo los brazos y notar el dorsal estirado.',
    ],
    mistakes: [
      'Tirar con los brazos y balancear el cuerpo hacia atrás.',
      'Llevar la barra detrás de la nuca.',
      'No estirar del todo arriba (pierdes la mitad del trabajo del dorsal).',
    ],
    tip: 'Imagina que tus manos son ganchos y tiras con los codos hacia los bolsillos: así se abre la "V".',
    alt: { id: 'dominadas-asistidas', text: 'Dominadas asistidas o jalón unilateral en polea' },
  },
  {
    id: 'remo-maquina', name: 'Remo en máquina con pecho apoyado', img: 'Leverage_Iso_Row', anim: 'machineRow', primary: ['upperBack', 'lats'], secondary: ['deltsRear', 'biceps'], equip: 'Máquina de remo (pecho apoyado)',
    zone: 'Zona de máquinas (de placas o de discos tipo Hammer): "Seated Row / Iso Row".',
    setup: [
      'Ajusta el asiento y el apoyo de pecho para que las asas queden a la altura de la parte baja del pecho.',
      'Pecho pegado al apoyo durante toda la serie.',
    ],
    steps: [
      'Con los brazos estirados, deja que los hombros se vayan un poco hacia delante para estirar la espalda.',
      'Tira llevando los codos hacia atrás, rozando el torso, y junta las escápulas, soltando el aire.',
      'Aprieta 1 s atrás.',
      'Vuelve en 2-3 s hasta estirar del todo.',
    ],
    mistakes: [
      'Despegar el pecho del apoyo para tirar con el cuerpo.',
      'Encoger los hombros hacia las orejas.',
      'Mover solo los brazos sin juntar las escápulas.',
    ],
    tip: 'Codos pegados = más dorsal; codos abiertos = más espalda alta y deltoides posterior. Hoy, pegados.',
    alt: { id: 'remo-polea-baja', text: 'Remo en polea baja o remo con mancuerna' },
  },
  {
    id: 'pullover-polea', name: 'Pullover en polea alta (brazos rectos)', img: 'Straight-Arm_Pulldown', anim: 'straightArmPulldown', primary: ['lats'], secondary: ['triceps'], equip: 'Polea alta + barra recta o cuerda',
    zone: 'Zona de poleas: polea en la posición más alta.',
    setup: [
      'Barra recta o cuerda en la polea alta. Da 1-2 pasos atrás.',
      'Inclina el torso unos 30° con la cadera atrás, rodillas un pelín flexionadas y brazos casi rectos.',
    ],
    steps: [
      'Desde los brazos arriba y estirados, lleva la barra hacia los muslos describiendo un arco.',
      'Mantén los codos casi rectos (ligera flexión fija) durante todo el recorrido.',
      'Aprieta el dorsal 1 s abajo, soltando el aire.',
      'Sube en 2-3 s hasta notar el estiramiento bajo las axilas.',
    ],
    mistakes: [
      'Doblar los codos y convertirlo en un empuje de tríceps.',
      'Mover el torso arriba y abajo.',
      'Usar demasiado peso y perder la sensación en el dorsal.',
    ],
    tip: 'Ejercicio de aislamiento del dorsal: perfecto para aprender a "sentir" la espalda y ganar anchura.',
    alt: { id: null, text: 'Pullover con mancuerna en banco plano' },
  },
  {
    id: 'remo-polea-baja', name: 'Remo en polea baja agarre neutro', img: 'Seated_Cable_Rows', anim: 'cableRow', primary: ['upperBack', 'lats'], secondary: ['biceps', 'deltsRear'], equip: 'Remo en polea baja + triángulo',
    zone: 'Zona de poleas: banco de remo bajo con estribo para los pies.',
    setup: [
      'Engancha el triángulo (agarre neutro, palmas enfrentadas).',
      'Siéntate con los pies en los apoyos y las rodillas algo flexionadas; espalda recta.',
    ],
    steps: [
      'Brazos estirados y torso ligeramente adelantado para estirar la espalda (sin redondear).',
      'Tira llevando el triángulo hacia el ombligo, con los codos pegados, y vuelve el torso a vertical.',
      'Junta las escápulas y saca pecho 1 s, soltando el aire.',
      'Vuelve en 2-3 s estirando los brazos.',
    ],
    mistakes: [
      'Balancear el torso adelante y atrás como si remaras en una barca.',
      'Redondear la zona lumbar al estirar.',
      'Encoger los hombros al tirar.',
    ],
    tip: 'Da grosor a la espalda media: piensa en "sacar pecho" al final de cada repetición.',
    alt: { id: 'remo-maquina', text: 'Remo en máquina o remo con mancuerna' },
  },
  {
    id: 'pajaros-contractor', name: 'Pájaros en contractor inverso', img: 'Reverse_Machine_Flyes', anim: 'reverseFly', primary: ['deltsRear'], secondary: ['upperBack', 'traps'], equip: 'Contractor (posición inversa)',
    zone: 'Zona de máquinas: la misma "Pec Deck" pero sentado mirando al respaldo.',
    setup: [
      'Siéntate mirando al apoyo, con el pecho pegado.',
      'Coloca las asas en la posición más adelantada y a la altura de los hombros.',
      'Agarre neutro o prono, codos ligeramente flexionados.',
    ],
    steps: [
      'Abre los brazos hacia atrás en arco, "empujando" con el dorso de las manos.',
      'Para cuando los brazos estén en línea con el cuerpo, sin juntar del todo las escápulas.',
      'Aprieta 1 s el hombro trasero, soltando el aire.',
      'Vuelve en 2-3 s sin dejar que las placas choquen.',
    ],
    mistakes: [
      'Juntar las escápulas al máximo: se lo lleva la espalda media.',
      'Encoger los hombros.',
      'Usar impulso con el cuerpo.',
    ],
    tip: 'El deltoides posterior da la "bola" completa al hombro visto de lado y de espaldas. Peso ligero, recorrido limpio.',
    alt: { id: 'face-pull', text: 'Face pull o pájaros con mancuernas inclinado' },
  },
  {
    id: 'curl-barra-z', name: 'Curl de bíceps con barra Z', img: 'EZ-Bar_Curl', anim: 'curlBar', primary: ['biceps'], secondary: ['forearms'], equip: 'Barra Z',
    zone: 'Zona de peso libre: barras Z prealmacenadas o barra Z con discos.',
    setup: [
      'Agarra la barra por las curvas interiores o exteriores (más ancho = más cabeza corta).',
      'De pie, codos pegados a los costados, hombros atrás.',
    ],
    steps: [
      'Flexiona los codos subiendo la barra hacia los hombros sin mover los codos hacia delante.',
      'Aprieta el bíceps 1 s arriba, soltando el aire.',
      'Baja en 2-3 s hasta estirar casi por completo los brazos.',
    ],
    mistakes: [
      'Balancear la cadera para subir el peso.',
      'Adelantar los codos al final (descansa el bíceps).',
      'Bajar a medias.',
    ],
    tip: 'Controla la bajada: es la fase que más músculo construye y la que casi todo el mundo regala.',
    alt: { id: 'curl-polea', text: 'Curl en polea baja o curl con mancuernas' },
  },
  {
    id: 'curl-martillo', name: 'Curl martillo con mancuernas', img: 'Hammer_Curls', anim: 'hammerCurl', primary: ['biceps', 'forearms'], secondary: [], equip: 'Mancuernas',
    zone: 'Zona de peso libre, junto al rack de mancuernas.',
    setup: [
      'De pie con una mancuerna en cada mano, palmas mirándose (agarre neutro).',
      'Codos pegados al cuerpo.',
    ],
    steps: [
      'Sube las mancuernas manteniendo el agarre neutro, como si fueran martillos.',
      'Arriba aprieta 1 s, soltando el aire.',
      'Baja en 2-3 s. Puedes alternar brazos o subir los dos a la vez.',
    ],
    mistakes: [
      'Girar la muñeca durante el recorrido.',
      'Balancear el cuerpo.',
      'Mover los codos hacia delante.',
    ],
    tip: 'Trabaja el braquial y el braquiorradial: hacen el brazo más ancho visto de frente y el antebrazo más marcado.',
    alt: { id: null, text: 'Curl martillo en polea con cuerda' },
  },

  // ───────────── PIERNA A ─────────────
  {
    id: 'sentadilla-hack', name: 'Sentadilla hack (o en Smith)', img: 'Hack_Squat', anim: 'squat', primary: ['quads', 'glutes'], secondary: ['adductors'], equip: 'Hack squat o multipower (Smith)',
    zone: 'Zona de máquinas de discos (hack squat) o zona de multipower/Smith.',
    setup: [
      'Espalda y hombros pegados a los apoyos; pies a la anchura de las caderas en la mitad de la plataforma.',
      'Puntas ligeramente hacia fuera. Quita los seguros antes de empezar.',
    ],
    steps: [
      'Coge aire, aprieta el abdomen y baja en 2-3 s flexionando rodillas y cadera.',
      'Baja hasta que los muslos queden al menos paralelos (más si tu movilidad lo permite sin despegar la lumbar).',
      'Empuja con toda la planta del pie para subir, soltando el aire al pasar la parte difícil.',
      'Arriba no bloquees las rodillas de golpe.',
    ],
    mistakes: [
      'Despegar los talones o la zona lumbar del respaldo.',
      'Dejar que las rodillas se vayan hacia dentro.',
      'Bajar solo un cuarto del recorrido para mover más peso.',
    ],
    tip: 'Rodillas en la dirección de las puntas y profundidad completa: unas piernas proporcionadas completan el look aesthetic.',
    alt: { id: 'prensa', text: 'Sentadilla en Smith o prensa' },
  },
  {
    id: 'prensa', name: 'Prensa de piernas', img: 'Leg_Press', anim: 'legPress', primary: ['quads', 'glutes'], secondary: ['adductors'], equip: 'Prensa inclinada 45°',
    zone: 'Zona de pierna / máquinas de discos: prensa inclinada a 45°.',
    setup: [
      'Espalda y glúteos bien pegados al respaldo.',
      'Pies a la anchura de los hombros en el centro de la plataforma (más altos = más glúteo y femoral).',
      'Quita los seguros con las piernas casi estiradas.',
    ],
    steps: [
      'Baja la plataforma en 2-3 s llevando las rodillas hacia el pecho.',
      'Para justo antes de que la pelvis se despegue del respaldo.',
      'Empuja con todo el pie, soltando el aire, hasta casi estirar.',
      'No bloquees las rodillas arriba.',
    ],
    mistakes: [
      'Despegar el culo abajo: la lumbar se redondea bajo carga.',
      'Bloquear las rodillas con fuerza arriba.',
      'Rodillas hacia dentro al empujar.',
      'Cargar mucho peso y hacer medio recorrido.',
    ],
    tip: 'Profundidad hasta donde la pelvis aguante pegada. Mejor 3 discos bien que 6 a medias.',
    alt: { id: 'sentadilla-hack', text: 'Sentadilla hack o en Smith' },
  },
  {
    id: 'extension-cuadriceps', name: 'Extensión de cuádriceps', img: 'Leg_Extensions', anim: 'legExtension', primary: ['quads'], secondary: [], equip: 'Máquina de extensiones',
    zone: 'Zona de máquinas guiadas de pierna: "Leg Extension".',
    setup: [
      'Ajusta el respaldo para que la rodilla quede alineada con el eje de giro de la máquina.',
      'El rodillo apoya en la parte baja de la espinilla, justo encima del tobillo.',
      'Agárrate a las asas laterales.',
    ],
    steps: [
      'Estira las rodillas hasta casi bloquear, soltando el aire.',
      'Aprieta el cuádriceps 1 s arriba.',
      'Baja en 2-3 s hasta unos 90° sin dejar que las placas choquen.',
    ],
    mistakes: [
      'Despegar el culo del asiento para ayudar.',
      'Bajar de golpe.',
      'Eje de la máquina desalineado con la rodilla (molestias).',
    ],
    tip: 'Aguantar 1 s arriba es lo que marca el "teardrop" encima de la rodilla.',
    alt: { id: null, text: 'Sentadilla sissy asistida o zancadas cortas' },
  },
  {
    id: 'curl-femoral-sentado', name: 'Curl femoral sentado', img: 'Seated_Leg_Curl', anim: 'seatedLegCurl', primary: ['hamstrings'], secondary: ['calves'], equip: 'Máquina de curl femoral sentado',
    zone: 'Zona de máquinas guiadas de pierna: "Seated Leg Curl".',
    setup: [
      'Rodilla alineada con el eje de la máquina.',
      'Rodillo inferior bajo los tobillos y rodillo superior bien apretado sobre los muslos.',
      'Inclínate un poco hacia delante: estiras más el femoral.',
    ],
    steps: [
      'Flexiona las rodillas llevando los talones hacia debajo del asiento, soltando el aire.',
      'Aprieta 1 s abajo.',
      'Vuelve en 2-3 s hasta casi estirar del todo.',
    ],
    mistakes: [
      'Rodillo de los muslos suelto: te levantas del asiento.',
      'Recorrido corto.',
      'Hacerlo rápido y sin control.',
    ],
    tip: 'Con el torso algo adelantado el femoral trabaja más estirado: mejor estímulo con menos peso.',
    alt: { id: 'curl-femoral-tumbado', text: 'Curl femoral tumbado' },
  },
  {
    id: 'gemelo-de-pie', name: 'Gemelo de pie en máquina', img: 'Standing_Calf_Raises', anim: 'calfRaise', primary: ['calves'], secondary: [], equip: 'Máquina de gemelo de pie (o Smith + step)',
    zone: 'Zona de pierna: máquina de gemelos de pie con hombreras (o Smith con un step o disco bajo las puntas).',
    setup: [
      'Hombros bajo las almohadillas y puntas de los pies en el borde del escalón.',
      'Rodillas casi rectas (sin bloquear).',
    ],
    steps: [
      'Baja los talones lo máximo posible y aguanta 1-2 s en el estiramiento.',
      'Sube a la punta de los pies lo más alto que puedas, soltando el aire.',
      'Aprieta 1 s arriba y baja en 2 s.',
    ],
    mistakes: [
      'Rebotar abajo (el tendón hace el trabajo, no el músculo).',
      'Recorrido corto y rápido.',
      'Doblar las rodillas para ayudarte.',
    ],
    tip: 'Pausa abajo y arriba en cada rep: el gemelo responde a recorrido completo y control.',
    alt: { id: null, text: 'Gemelo en prensa o en Smith con step' },
  },
  {
    id: 'crunch-polea', name: 'Crunch en polea alta de rodillas', img: 'Cable_Crunch', anim: 'cableCrunch', primary: ['abs'], secondary: ['obliques'], equip: 'Polea alta + cuerda',
    zone: 'Zona de poleas: cuerda en la polea alta. Pon una esterilla bajo las rodillas.',
    setup: [
      'Arrodíllate de cara a la polea sujetando la cuerda junto a la cabeza o la frente.',
      'Cadera un poco por detrás de las rodillas, glúteos algo hacia atrás.',
    ],
    steps: [
      'Enrolla la columna llevando los codos hacia los muslos, soltando el aire.',
      'Aprieta el abdomen 1 s abajo: piensa en acercar las costillas a la pelvis.',
      'Vuelve en 2 s hasta estirar el abdomen sin cambiar la posición de la cadera.',
    ],
    mistakes: [
      'Bajar moviendo la cadera (como una reverencia) en vez de enrollar la columna.',
      'Tirar con los brazos.',
      'Usar tanto peso que el abdomen no se entere.',
    ],
    tip: 'Al abdomen se le trata como a cualquier músculo: con carga y progresión. Se verá cuando bajes de grasa.',
    alt: { id: null, text: 'Crunch en máquina o crunch en el suelo con disco' },
  },
  {
    id: 'elevacion-piernas', name: 'Elevación de piernas (silla romana o colgado)', img: 'Hanging_Leg_Raise', anim: 'legRaise', primary: ['abs'], secondary: ['obliques', 'forearms'], equip: 'Silla romana / barra de dominadas',
    zone: 'Zona funcional o de máquinas: silla romana ("Captain\'s chair") o la barra de dominadas.',
    setup: [
      'En la silla romana: antebrazos en los apoyos y espalda pegada al respaldo.',
      'Colgado: agarre prono a la anchura de los hombros, sin balancearte.',
    ],
    steps: [
      'Sube las rodillas hacia el pecho y, al final, enrolla la pelvis hacia arriba, soltando el aire.',
      'Aguanta 1 s arriba.',
      'Baja en 2-3 s sin balanceo.',
      'Cuando te resulte fácil, hazlo con las piernas más estiradas.',
    ],
    mistakes: [
      'Balancearte para subir las piernas.',
      'Subir solo hasta 90° de cadera (eso trabaja el flexor, no el abdomen).',
      'Dejar caer las piernas.',
    ],
    tip: 'La clave es la retroversión de la pelvis al final: ahí es donde trabaja el abdomen bajo.',
    alt: { id: null, text: 'Elevación de piernas tumbado en banco' },
  },

  // ───────────── HOMBRO + BRAZO ─────────────
  {
    id: 'press-hombro-mancuernas', name: 'Press de hombro sentado con mancuernas', img: 'Seated_Dumbbell_Press', anim: 'shoulderPressDB', primary: ['deltsFront', 'delts'], secondary: ['triceps'], equip: 'Banco a 80-90° + mancuernas',
    zone: 'Zona de peso libre: banco regulable casi vertical junto al rack de mancuernas.',
    setup: [
      'Respaldo a 80-90°. Sube las mancuernas a los hombros apoyándolas primero en los muslos.',
      'Espalda pegada, pies firmes y abdomen apretado.',
    ],
    steps: [
      'Empieza con las mancuernas a la altura de las orejas, codos algo por delante del cuerpo (no en cruz).',
      'Empuja hacia arriba soltando el aire hasta casi estirar los brazos; las mancuernas se acercan arriba sin chocar.',
      'Baja en 2-3 s hasta la altura de las orejas o algo más abajo.',
    ],
    mistakes: [
      'Arquear mucho la espalda (se convierte en un press inclinado).',
      'Bajar a medias.',
      'Chocar las mancuernas arriba y perder tensión.',
    ],
    tip: 'Básico de fuerza para el hombro: progresa en peso aquí y en las laterales para ganar anchura.',
    alt: { id: 'press-hombro-maquina', text: 'Press de hombro en máquina' },
  },
  {
    id: 'elevacion-lateral-maquina', name: 'Elevaciones laterales en máquina', img: 'Seated_Side_Lateral_Raise', anim: 'lateralRaiseSeated', primary: ['delts'], secondary: [], equip: 'Máquina de laterales (o mancuernas sentado)',
    zone: 'Zona de máquinas guiadas: "Lateral Raise". Si no hay, mancuernas sentado en un banco.',
    setup: [
      'Ajusta el asiento para que el hombro quede alineado con el eje de giro.',
      'Apoya el lateral del antebrazo o el codo en los rodillos; pecho contra el apoyo si lo tiene.',
    ],
    steps: [
      'Sube los brazos hacia los lados empujando con los codos hasta la altura de los hombros.',
      'Pausa 1 s arriba, soltando el aire.',
      'Baja en 2-3 s sin dejar que las placas choquen.',
      'Última serie: myo-reps (al fallo técnico, 5 respiraciones, 3-5 reps más, repite 2-3 veces).',
    ],
    mistakes: [
      'Encoger los hombros.',
      'Asiento mal ajustado (el hombro no coincide con el eje).',
      'Tirones rápidos sin control.',
    ],
    tip: 'La máquina te deja llegar al fallo con seguridad: aquí es donde aprietas de verdad el deltoides lateral.',
    alt: { id: 'elevacion-lateral-mancuerna', text: 'Laterales con mancuernas sentado' },
  },
  {
    id: 'face-pull', name: 'Face pull en polea', img: 'Face_Pull', anim: 'facePull', primary: ['deltsRear', 'upperBack'], secondary: ['traps'], equip: 'Polea a la altura de la cara + cuerda',
    zone: 'Zona de poleas: cuerda en la polea a la altura de la cara o un poco más arriba.',
    setup: [
      'Agarra la cuerda con las palmas hacia abajo o enfrentadas y da un paso atrás.',
      'Pies a la anchura de las caderas, abdomen firme.',
    ],
    steps: [
      'Tira de la cuerda hacia la cara separando las manos, con los codos altos (a la altura de los hombros).',
      'Al final, gira las manos hacia atrás como si hicieras un "doble bíceps", soltando el aire.',
      'Aguanta 1 s y vuelve en 2 s.',
    ],
    mistakes: [
      'Tirar con los codos bajos (se convierte en un remo).',
      'Echarse hacia atrás con el cuerpo.',
      'Demasiado peso: es un ejercicio de control.',
    ],
    tip: 'Hombro trasero + salud del hombro + mejor postura: hombros atrás y pecho abierto en las fotos.',
    alt: { id: 'pajaros-contractor', text: 'Pájaros en contractor inverso o con mancuernas' },
  },
  {
    id: 'curl-inclinado', name: 'Curl inclinado con mancuernas', img: 'Incline_Dumbbell_Curl', anim: 'inclineCurl', primary: ['biceps'], secondary: [], equip: 'Banco a 45-60° + mancuernas',
    zone: 'Zona de peso libre: banco regulable a 45-60°.',
    setup: [
      'Siéntate con la espalda pegada al respaldo inclinado y los brazos colgando por detrás del torso.',
      'Palmas mirando al frente (supinación).',
    ],
    steps: [
      'Sube las mancuernas flexionando los codos sin adelantarlos; los brazos siguen colgando por detrás.',
      'Aprieta 1 s arriba, soltando el aire.',
      'Baja en 3 s hasta estirar del todo el brazo y notar el estiramiento del bíceps.',
    ],
    mistakes: [
      'Adelantar los hombros o los codos para ayudarte.',
      'Usar demasiado peso: aquí vas a mover menos que de pie, es normal.',
      'No estirar del todo abajo.',
    ],
    tip: 'Con el brazo por detrás estiras la cabeza larga del bíceps: es la que da el "pico" al brazo.',
    alt: { id: 'curl-polea', text: 'Curl en polea baja de espaldas (Bayesian curl)' },
  },
  {
    id: 'press-frances', name: 'Press francés con barra Z', img: 'Lying_Triceps_Press', anim: 'skullCrusher', primary: ['triceps'], secondary: [], equip: 'Banco plano + barra Z',
    zone: 'Zona de peso libre: banco plano + barra Z (con discos o prealmacenada).',
    setup: [
      'Túmbate en el banco con la barra Z en agarre prono estrecho (curvas interiores).',
      'Brazos estirados por encima del pecho, ligeramente inclinados hacia la cabeza.',
    ],
    steps: [
      'Flexiona solo los codos bajando la barra hacia la frente o justo por detrás de la cabeza, en 2-3 s.',
      'Mantén los codos apuntando al techo, sin abrirlos.',
      'Estira los codos para volver arriba, soltando el aire.',
    ],
    mistakes: [
      'Abrir los codos hacia fuera.',
      'Mover los hombros (se convierte en un pullover).',
      'Bajar demasiado rápido: cuidado con la cabeza.',
    ],
    tip: 'Llevar la barra un poco por detrás de la cabeza estira más el tríceps: mejor estímulo para la cabeza larga.',
    alt: { id: 'triceps-sobre-cabeza', text: 'Extensión de tríceps sobre la cabeza en polea' },
  },
  {
    id: 'curl-predicador', name: 'Curl predicador en máquina (Scott)', img: 'Machine_Preacher_Curls', anim: 'preacherCurl', primary: ['biceps'], secondary: [], equip: 'Máquina de curl Scott / banco Scott',
    zone: 'Zona de máquinas guiadas: "Biceps Curl / Preacher". Si no hay, banco Scott con barra Z.',
    setup: [
      'Ajusta el asiento para que las axilas queden apoyadas en el borde superior del pad.',
      'La parte trasera de los brazos queda totalmente apoyada en el pad.',
    ],
    steps: [
      'Sube las asas flexionando los codos, soltando el aire.',
      'Aprieta el bíceps 1 s arriba.',
      'Baja en 3 s hasta casi estirar el brazo (sin bloquear de golpe).',
    ],
    mistakes: [
      'Levantar los codos o el culo del asiento.',
      'Dejar caer el peso abajo: es la zona de más riesgo para el bíceps.',
      'Recorrido corto.',
    ],
    tip: 'El pad elimina el balanceo: concéntrate en apretar el bíceps arriba en cada repetición.',
    alt: { id: 'curl-barra-z', text: 'Curl en banco Scott con barra Z o curl con mancuerna' },
  },
  {
    id: 'fondos-maquina', name: 'Fondos en máquina', img: 'Dip_Machine', anim: 'dipMachine', primary: ['triceps'], secondary: ['chest', 'deltsFront'], equip: 'Máquina de fondos sentado',
    zone: 'Zona de máquinas guiadas: "Dip / Triceps Press" sentado.',
    setup: [
      'Ajusta el asiento para que las asas queden a la altura de las costillas con los codos doblados.',
      'Espalda pegada al respaldo y torso erguido (más erguido = más tríceps).',
    ],
    steps: [
      'Empuja las asas hacia abajo hasta estirar los codos, soltando el aire.',
      'Aprieta el tríceps 1 s abajo.',
      'Sube en 2 s hasta que los codos formen unos 90°, sin que los hombros se vayan hacia delante.',
    ],
    mistakes: [
      'Abrir los codos hacia fuera.',
      'Inclinarse hacia delante y encoger los hombros.',
      'Subir demasiado: los hombros se van hacia delante y sufren.',
    ],
    tip: 'Codos pegados al cuerpo y torso recto: así el tríceps se lleva todo el trabajo.',
    alt: { id: 'triceps-polea-cuerda', text: 'Extensión de tríceps en polea o fondos en paralelas asistidos' },
  },
  {
    id: 'cuello-flexion', name: 'Cuello: flexión con disco (opcional)', img: 'Lying_Face_Up_Plate_Neck_Resistance', anim: 'neckFlexion', primary: ['neck'], secondary: [], equip: 'Banco plano + disco ligero + toalla',
    zone: 'Zona de peso libre: banco plano y un disco pequeño (2,5-5 kg).',
    setup: [
      'SEGURIDAD: empieza SIN peso o con 2,5 kg. Si tienes o has tenido problemas de cuello o cervicales, sáltatelo.',
      'Túmbate boca arriba con la cabeza y el cuello fuera del extremo del banco.',
      'Pon una toalla doblada en la frente y el disco encima, sujetándolo con ambas manos.',
    ],
    steps: [
      'Deja que la cabeza baje despacio hacia atrás hasta una posición cómoda (sin forzar).',
      'Lleva la barbilla hacia el pecho de forma lenta y controlada, 2 s.',
      'Baja en 2-3 s. Nada de tirones ni rebotes.',
      'Para en cuanto notes cualquier dolor, hormigueo o mareo.',
    ],
    mistakes: [
      'Usar mucho peso o hacerlo rápido.',
      'Forzar el rango extremo hacia atrás.',
      'Seguir con molestias.',
    ],
    tip: 'Un cuello algo más grueso enmarca la mandíbula. Progresa muy poco a poco: más reps antes que más peso.',
    alt: { id: null, text: 'Isométricos de cuello con la mano (5 × 10 s)' },
  },
  {
    id: 'cuello-extension', name: 'Cuello: extensión con disco (opcional)', img: 'Lying_Face_Down_Plate_Neck_Resistance', anim: 'neckExtension', primary: ['neck'], secondary: ['traps'], equip: 'Banco plano + disco ligero + toalla',
    zone: 'Zona de peso libre: banco plano y un disco pequeño (2,5-5 kg).',
    setup: [
      'SEGURIDAD: empieza SIN peso o con 2,5 kg. Si tienes problemas de cuello o cervicales, sáltatelo.',
      'Túmbate boca abajo con la cabeza fuera del extremo del banco.',
      'Toalla en la nuca y el disco encima, sujeto con ambas manos.',
    ],
    steps: [
      'Deja caer la barbilla hacia el pecho despacio.',
      'Lleva la cabeza hacia arriba hasta que quede en línea con la espalda (no la eches atrás del todo), 2 s.',
      'Baja en 2-3 s, siempre lento.',
      'Para ante cualquier dolor, hormigueo o mareo.',
    ],
    mistakes: [
      'Hiperextender el cuello mirando al techo.',
      'Peso excesivo o movimientos bruscos.',
      'Hacerlo con el cuello cargado o con molestias.',
    ],
    tip: 'Equilibra la parte trasera del cuello y mejora la postura (adiós cabeza adelantada).',
    alt: { id: null, text: 'Isométricos de cuello con la mano en la nuca (5 × 10 s)' },
  },

  // ───────────── ESPALDA + PECHO ─────────────
  {
    id: 'dominadas-asistidas', name: 'Dominadas (asistidas si hace falta)', img: 'Pullups', anim: 'pullup', primary: ['lats'], secondary: ['biceps', 'upperBack'], equip: 'Máquina de dominadas asistidas / barra',
    zone: 'Zona de máquinas: "Assisted Chin/Dip" (rodillas en la plataforma) o la barra de dominadas.',
    setup: [
      'En la asistida: elige un contrapeso con el que hagas 6-10 reps limpias (más peso = más ayuda).',
      'Agarre prono algo más ancho que los hombros.',
    ],
    steps: [
      'Cuelga con los brazos estirados y baja primero las escápulas.',
      'Sube llevando el pecho hacia la barra y los codos hacia las costillas, soltando el aire.',
      'Barbilla por encima de la barra, aguanta 1 s.',
      'Baja en 2-3 s hasta estirar del todo los brazos.',
    ],
    mistakes: [
      'Medio recorrido (no estirar abajo).',
      'Balancearse o patalear.',
      'Encoger los hombros al subir.',
    ],
    tip: 'Objetivo: cada semana un poco menos de asistencia. La primera dominada sin ayuda llega más rápido de lo que crees al bajar peso.',
    alt: { id: 'jalon-agarre-ancho', text: 'Jalón al pecho' },
  },
  {
    id: 'press-pecho-maquina', name: 'Press de pecho en máquina', img: 'Leverage_Chest_Press', anim: 'chestPressMachine', primary: ['chest'], secondary: ['triceps', 'deltsFront'], equip: 'Máquina de press de pecho',
    zone: 'Zona de máquinas (de placas o de discos): "Chest Press".',
    setup: [
      'Ajusta el asiento para que las asas queden a la altura de la parte media-baja del pecho.',
      'Escápulas juntas y hacia abajo, pecho alto, espalda pegada.',
    ],
    steps: [
      'Empuja las asas hacia delante soltando el aire hasta casi estirar los codos.',
      'Vuelve en 2-3 s hasta notar estiramiento en el pecho, sin que los hombros se adelanten.',
      'Codos a unos 45-60° del torso.',
    ],
    mistakes: [
      'Asiento demasiado alto: se lo lleva el hombro.',
      'Despegar los hombros del respaldo al empujar.',
      'Recorrido corto.',
    ],
    tip: 'Mantén el pecho "orgulloso" todo el rato: el pectoral trabaja, el hombro descansa.',
    alt: { id: null, text: 'Press de banca con barra o con mancuernas' },
  },
  {
    id: 'remo-mancuerna', name: 'Remo con mancuerna a una mano', img: 'One-Arm_Dumbbell_Row', anim: 'oneArmRow', primary: ['lats', 'upperBack'], secondary: ['biceps', 'deltsRear'], equip: 'Banco plano + mancuerna',
    zone: 'Zona de peso libre: banco plano junto al rack de mancuernas.',
    setup: [
      'Apoya la rodilla y la mano del mismo lado en el banco; el otro pie en el suelo.',
      'Espalda recta y paralela al suelo, mancuerna colgando con el brazo estirado.',
    ],
    steps: [
      'Tira de la mancuerna hacia la cadera (no hacia el pecho), con el codo pegado al cuerpo, soltando el aire.',
      'Aprieta el dorsal 1 s arriba.',
      'Baja en 2-3 s dejando que el hombro baje un poco para estirar.',
      'Todas las reps con un lado y luego cambia.',
    ],
    mistakes: [
      'Girar el torso para subir más.',
      'Tirar hacia el pecho (trabaja más el brazo y el trapecio).',
      'Redondear la espalda.',
    ],
    tip: 'Imagina que la mano es un gancho y tiras con el codo hacia el bolsillo trasero.',
    alt: { id: 'remo-polea-baja', text: 'Remo unilateral en polea o remo en máquina' },
  },
  {
    id: 'press-inclinado-smith', name: 'Press inclinado en Smith', img: 'Smith_Machine_Incline_Bench_Press', anim: 'inclinePressBar', primary: ['chest', 'deltsFront'], secondary: ['triceps'], equip: 'Multipower (Smith) + banco a 30°',
    zone: 'Zona de multipower (Smith) con un banco regulable debajo.',
    setup: [
      'Banco a 30° colocado para que la barra baje a la parte alta del pecho.',
      'Agarre algo más ancho que los hombros; ajusta los topes de seguridad.',
      'Escápulas juntas, pecho alto y pies firmes.',
    ],
    steps: [
      'Desbloquea la barra girándola y bájala en 2-3 s hasta rozar el pecho alto.',
      'Codos a unos 45-60° del torso, antebrazos verticales.',
      'Empuja hacia arriba soltando el aire, sin bloquear del todo.',
      'Al terminar, gira la barra para engancharla.',
    ],
    mistakes: [
      'Bajar la barra al cuello o a la parte baja del pecho.',
      'Rebotar en el pecho.',
      'Abrir los codos a 90°.',
    ],
    tip: 'La Smith te deja centrarte solo en empujar: ideal para progresar peso de forma segura sin compañero.',
    alt: { id: 'press-inclinado-mancuernas', text: 'Press inclinado con mancuernas o en máquina' },
  },
  {
    id: 'curl-polea', name: 'Curl de bíceps en polea baja', img: 'Standing_Biceps_Cable_Curl', anim: 'cableCurl', primary: ['biceps'], secondary: ['forearms'], equip: 'Polea baja + barra',
    zone: 'Zona de poleas: barra recta o Z en la polea baja.',
    setup: [
      'De pie frente a la polea, agarre supino a la anchura de los hombros.',
      'Codos pegados a los costados.',
    ],
    steps: [
      'Sube la barra flexionando los codos sin moverlos, soltando el aire.',
      'Aprieta 1 s arriba.',
      'Baja en 2-3 s hasta casi estirar.',
      'Combínalo en superserie con el tríceps en polea para ahorrar tiempo.',
    ],
    mistakes: [
      'Echarse hacia atrás para subir.',
      'Adelantar los codos.',
      'No controlar la bajada.',
    ],
    tip: 'La polea mantiene tensión constante: perfecto para terminar el brazo con un buen "pump".',
    alt: { id: 'curl-barra-z', text: 'Curl con barra Z o con mancuernas' },
  },

  // ───────────── PIERNA B ─────────────
  {
    id: 'peso-muerto-rumano', name: 'Peso muerto rumano', img: 'Romanian_Deadlift', anim: 'rdl', primary: ['hamstrings', 'glutes'], secondary: ['lowerBack', 'forearms'], equip: 'Barra o mancuernas',
    zone: 'Zona de peso libre: barra olímpica en el rack o mancuernas.',
    setup: [
      'Saca la barra del rack a la altura de los muslos; agarre prono a la anchura de los hombros.',
      'Pies a la anchura de las caderas, rodillas ligeramente flexionadas (y así se quedan).',
      'Pecho alto, escápulas atrás y abdomen apretado.',
    ],
    steps: [
      'Coge aire y lleva la cadera hacia atrás, como si cerraras una puerta con el culo; la barra baja rozando los muslos.',
      'Baja en 3 s hasta notar un buen estiramiento en el femoral (normalmente a media espinilla), con la espalda neutra.',
      'Sube empujando la cadera hacia delante y apretando el glúteo, soltando el aire.',
      'Arriba no eches el cuerpo hacia atrás.',
    ],
    mistakes: [
      'Redondear la espalda.',
      'Doblar mucho las rodillas (se convierte en una sentadilla).',
      'Separar la barra de las piernas.',
      'Bajar más de lo que te permite tu flexibilidad sin perder la espalda neutra.',
    ],
    tip: 'Piensa en "cadera atrás", no en "bajar la barra". El estiramiento del femoral marca el final del recorrido.',
    alt: { id: null, text: 'Peso muerto rumano con mancuernas o en Smith' },
  },
  {
    id: 'hip-thrust', name: 'Hip thrust', img: 'Barbell_Hip_Thrust', anim: 'hipThrust', primary: ['glutes'], secondary: ['hamstrings'], equip: 'Máquina de hip thrust o barra + banco',
    zone: 'Zona de glúteo (máquina de hip thrust) o zona de peso libre con banco plano y barra con almohadilla.',
    setup: [
      'Apoya la parte baja de las escápulas en el borde del banco; barra sobre la cadera con almohadilla.',
      'Pies a la anchura de las caderas; con la cadera arriba, las rodillas deben formar 90°.',
    ],
    steps: [
      'Con la barbilla hacia el pecho, empuja con los talones y sube la cadera hasta alinearla con el torso, soltando el aire.',
      'Aprieta el glúteo 1-2 s arriba con la pelvis en retroversión (sin arquear la lumbar).',
      'Baja en 2 s sin llegar a apoyar del todo.',
    ],
    mistakes: [
      'Arquear la zona lumbar arriba en lugar de apretar el glúteo.',
      'Pies demasiado lejos (trabaja el femoral) o demasiado cerca (cuádriceps).',
      'Mirar al techo: la cabeza acompaña al torso.',
    ],
    tip: 'Glúteo fuerte = mejor postura y unos vaqueros que sientan mejor. Aprieta arriba como si te fuera la vida.',
    alt: { id: null, text: 'Hip thrust en Smith o puente de glúteo con barra' },
  },
  {
    id: 'sentadilla-bulgara', name: 'Sentadilla búlgara (Smith o mancuernas)', img: 'Split_Squat_with_Dumbbells', anim: 'splitSquat', primary: ['quads', 'glutes'], secondary: ['adductors'], equip: 'Banco + mancuernas o Smith',
    zone: 'Zona de peso libre (banco + mancuernas) o multipower (Smith) con un banco detrás.',
    setup: [
      'Apoya el empeine del pie trasero en un banco detrás de ti.',
      'Pie delantero a un paso largo del banco: al bajar, la rodilla delantera no debe adelantarse mucho a la punta.',
      'Una mancuerna en cada mano (o barra de la Smith en la espalda).',
    ],
    steps: [
      'Baja en 2-3 s flexionando la rodilla delantera hasta que el muslo quede casi paralelo al suelo.',
      'Torso ligeramente inclinado hacia delante = más glúteo; más vertical = más cuádriceps.',
      'Sube empujando con todo el pie delantero, soltando el aire.',
      'Todas las reps con una pierna y luego cambia.',
    ],
    mistakes: [
      'Empujar con la pierna de atrás.',
      'Rodilla delantera hacia dentro.',
      'Pie delantero demasiado cerca del banco.',
    ],
    tip: 'Es dura, pero da piernas fuertes y equilibradas sin cargar la espalda. Empieza solo con el cuerpo si hace falta.',
    alt: { id: 'prensa', text: 'Zancadas en Smith o prensa a una pierna' },
  },
  {
    id: 'curl-femoral-tumbado', name: 'Curl femoral tumbado', img: 'Lying_Leg_Curls', anim: 'lyingLegCurl', primary: ['hamstrings'], secondary: ['calves'], equip: 'Máquina de curl femoral tumbado',
    zone: 'Zona de máquinas guiadas de pierna: "Lying Leg Curl".',
    setup: [
      'Túmbate boca abajo con las rodillas justo por fuera del borde del banco, alineadas con el eje.',
      'Rodillo en la parte baja de los gemelos, encima del tobillo. Agarra las asas.',
    ],
    steps: [
      'Flexiona las rodillas llevando los talones hacia el culo, soltando el aire.',
      'Aprieta 1 s arriba con la cadera pegada al banco.',
      'Baja en 2-3 s hasta casi estirar.',
    ],
    mistakes: [
      'Levantar la cadera del banco para ayudarte.',
      'Bajar de golpe.',
      'Recorrido corto.',
    ],
    tip: 'Mantén la pelvis pegada al banco y piensa en "clavar" la cadera: así trabaja solo el femoral.',
    alt: { id: 'curl-femoral-sentado', text: 'Curl femoral sentado' },
  },
  {
    id: 'gemelo-sentado', name: 'Gemelo sentado', img: 'Seated_Calf_Raise', anim: 'seatedCalf', primary: ['calves'], secondary: [], equip: 'Máquina de gemelo sentado',
    zone: 'Zona de pierna: "Seated Calf" (máquina de discos con almohadilla sobre las rodillas).',
    setup: [
      'Siéntate con las puntas de los pies en el escalón y la almohadilla sobre la parte baja de los muslos.',
      'Quita el seguro con los talones elevados.',
    ],
    steps: [
      'Baja los talones lo máximo posible y aguanta 1-2 s.',
      'Sube a la punta de los pies, soltando el aire.',
      'Aprieta 1 s arriba y baja en 2 s.',
    ],
    mistakes: [
      'Rebotar abajo.',
      'Recorrido corto.',
      'Ayudarte con las manos empujando la almohadilla.',
    ],
    tip: 'Sentado trabajas el sóleo, que da grosor a la parte baja de la pierna. Pausa en cada rep.',
    alt: { id: 'gemelo-de-pie', text: 'Gemelo de pie o en prensa' },
  },
  {
    id: 'rueda-abdominal', name: 'Rueda abdominal', img: 'Ab_Roller', anim: 'abWheel', primary: ['abs'], secondary: ['lats', 'obliques'], equip: 'Rueda abdominal (zona funcional)',
    zone: 'Zona funcional / estiramientos: rueda abdominal y una esterilla.',
    setup: [
      'De rodillas sobre la esterilla, rueda en el suelo bajo los hombros y brazos estirados.',
      'Aprieta el glúteo y mete la pelvis (retroversión) antes de empezar.',
    ],
    steps: [
      'Rueda hacia delante despacio, en 3 s, manteniendo el abdomen apretado y la espalda sin hundirse.',
      'Llega solo hasta donde puedas mantener la lumbar neutra.',
      'Vuelve tirando con el abdomen, soltando el aire.',
      'Si aún no puedes, empieza contra una pared para limitar el recorrido.',
    ],
    mistakes: [
      'Hundir la zona lumbar (curva hacia el suelo).',
      'Ir más lejos de lo que controlas.',
      'Volver tirando con la cadera en lugar del abdomen.',
    ],
    tip: 'Uno de los mejores ejercicios de core: abdomen fuerte y cintura más estrecha y firme.',
    alt: { id: 'plancha', text: 'Plancha' },
  },
  {
    id: 'plancha', name: 'Plancha', img: 'Plank', anim: 'plank', primary: ['abs', 'obliques'], secondary: [], equip: 'Esterilla',
    zone: 'Zona funcional / estiramientos con esterilla.',
    setup: [
      'Antebrazos en el suelo con los codos bajo los hombros.',
      'Piernas estiradas apoyando las puntas de los pies.',
    ],
    steps: [
      'Aprieta glúteos y abdomen y mete la pelvis: cuerpo recto de cabeza a talones.',
      'Respira de forma corta y controlada, sin soltar la tensión.',
      'Aguanta 30-45 s. Cuando sea fácil, aprieta más o alarga a 60 s.',
    ],
    mistakes: [
      'Hundir la cadera.',
      'Subir el culo demasiado.',
      'Aguantar la respiración.',
    ],
    tip: 'Mejor 30 s apretando a tope que 2 min "colgado" de la lumbar.',
    alt: { id: 'rueda-abdominal', text: 'Rueda abdominal o dead bug' },
  },

  // ───────────── GLÚTEO / CINTURA (michelines) ─────────────
  {
    id: 'abduccion-cadera',
    name: 'Abducción de cadera en máquina',
    img: 'Thigh_Abductor',
    anim: 'hipAbduction',
    primary: ['glutes'],
    secondary: [],
    equip: 'Máquina de abductores (la de abrir piernas)',
    zone: 'Zona de máquinas de pierna: es la máquina de abrir/cerrar piernas (abductor/aductor). Pon las almohadillas por FUERA de las rodillas.',
    setup: [
      'Almohadillas en la cara exterior de las rodillas y rango cerrado al empezar.',
      'Agarra las asas. Inclinarte un poco hacia delante carga más la parte alta del glúteo.',
    ],
    steps: [
      'Abre las rodillas empujando hacia fuera con el lateral de la cadera (glúteo medio), no con los pies.',
      'En la máxima apertura aprieta 1 s: lo tienes que notar en el glúteo de arriba, justo debajo del michelín.',
      'Vuelve en 2-3 s sin dejar que las placas choquen.',
      'Mantén el culo pegado al asiento todo el recorrido.',
    ],
    mistakes: [
      'Poner tanto peso que solo abres unos centímetros.',
      'Rebotar en la parte cerrada.',
      'Levantar el culo del asiento para ayudarte.',
    ],
    tip: 'Es el ejercicio que más rellena la zona de encima de la cadera: más glúteo medio = transición cintura-cadera limpia y menos "corte" con el calzoncillo.',
    alt: { id: null, text: 'Abducción en polea baja con tobillera, o pasos laterales con banda elástica en las rodillas.' },
  },
  {
    id: 'vacio-abdominal',
    name: 'Vacío abdominal (stomach vacuum)',
    img: 'Stomach_Vacuum',
    anim: 'vacuum',
    primary: ['abs'],
    secondary: ['obliques'],
    equip: 'Nada (en casa o en el gym)',
    zone: 'En cualquier sitio. Mejor por la mañana en ayunas, de pie o a cuatro patas.',
    setup: ['De pie o a cuatro patas, espalda neutra.', 'Con el estómago vacío (al levantarte es ideal).'],
    steps: [
      'Saca TODO el aire de los pulmones.',
      'Sin coger aire, mete el ombligo hacia la columna lo máximo posible, como si quisieras tocar la espalda.',
      'Aguanta 20-30 s respirando muy poco por arriba.',
      'Suelta, respira normal 30 s y repite 3 veces.',
    ],
    mistakes: ['Meter tripa cogiendo aire (eso es otra cosa).', 'Encorvar la espalda.', 'Hacerlo justo después de comer.'],
    tip: 'Entrena el transverso, tu "faja" natural: con el tiempo la cintura se ve más recogida incluso relajado.',
    alt: { id: 'plancha', text: 'Plancha frontal' },
  },

  // ───────────── CARDIO ─────────────
  {
    id: 'cinta-inclinada', name: 'Cinta inclinada (caminar en cuesta)', img: 'Walking_Treadmill', anim: 'walkIncline', primary: ['glutes', 'calves', 'hamstrings'], secondary: [], equip: 'Cinta de correr', cardio: true,
    zone: 'Zona de cardio: cintas de correr.',
    setup: [
      'Ajusta la inclinación al 8-12 % y la velocidad a 4,5-5,5 km/h.',
      'Ponte la pinza de seguridad si la cinta la tiene.',
    ],
    steps: [
      'Camina erguido, sin agarrarte a las barras (si te agarras, baja la inclinación).',
      'Mantén un ritmo en el que puedas hablar pero no cantar (zona 2).',
      'Termina con 2 min a inclinación baja para bajar pulsaciones.',
    ],
    mistakes: [
      'Agarrarte a la cinta: quema mucho menos y estropea la postura.',
      'Empezar demasiado fuerte y no aguantar el tiempo.',
      'Hacerlo justo antes de pierna (mejor después de pesas).',
    ],
    tip: 'El cardio más rentable para quemar grasa sin comerse la recuperación de las piernas.',
    alt: { id: 'escaladora', text: 'Escaladora o bici' },
    cardioHow: 'Zona 2: 60-70 % de tu FC máx. (aprox. 120-140 ppm), puedes hablar con frases cortas. Empieza con 8 % y 4,5 km/h; cada semana sube un 1 % de inclinación o 0,2 km/h hasta 12 % y 5,5 km/h. Después de pesas: 20-40 min según la fase.',
  },
  {
    id: 'bici-estatica', name: 'Bici estática', img: 'Bicycling_Stationary', anim: 'bike', primary: ['quads'], secondary: ['calves'], equip: 'Bici estática / reclinada', cardio: true,
    zone: 'Zona de cardio: bicis estáticas o reclinadas.',
    setup: [
      'Sillín a la altura de la cadera: con el pedal abajo, la rodilla queda casi estirada (ligera flexión).',
      'Elige un nivel de resistencia moderado.',
    ],
    steps: [
      'Pedalea a 80-90 rpm con una resistencia que te deje hablar con frases cortas.',
      'Espalda recta y hombros relajados.',
      'Termina con 2 min suaves.',
    ],
    mistakes: [
      'Sillín demasiado bajo (carga la rodilla).',
      'Resistencia tan baja que no te enteras.',
      'Ir con el móvil y bajar el ritmo sin darte cuenta.',
    ],
    tip: 'La mejor opción los días de pierna o si te molestan las rodillas o los tobillos.',
    alt: { id: 'cinta-inclinada', text: 'Cinta inclinada o elíptica' },
    cardioHow: 'Zona 2 (60-70 % FC máx.) a 80-90 rpm. Opcional 1 vez por semana: HIIT 8-10 × (20 s fuerte + 100 s suave), nunca el día antes de pierna.',
  },
  {
    id: 'escaladora', name: 'Escaladora (StairMaster)', img: 'Stairmaster', anim: 'stairs', primary: ['glutes', 'quads'], secondary: ['calves'], equip: 'Escaladora', cardio: true,
    zone: 'Zona de cardio: escaladora de escalones giratorios (StairMaster).',
    setup: [
      'Empieza a un nivel bajo (3-5) para coger el ritmo.',
      'Las manos solo rozan las barras para mantener el equilibrio.',
    ],
    steps: [
      'Sube escalón a escalón apoyando todo el pie, con el torso erguido o muy poco inclinado.',
      'Mantén un ritmo en zona 2 (puedes hablar a frases cortas).',
      'Termina con 1-2 min a nivel bajo.',
    ],
    mistakes: [
      'Apoyarte con todo el peso en las barras.',
      'Pisar solo con la punta del pie.',
      'Ir demasiado rápido y acabar a los 5 min.',
    ],
    tip: 'Quema mucho en poco tiempo y trabaja el glúteo. Ideal cuando vas justo de tiempo.',
    alt: { id: 'cinta-inclinada', text: 'Cinta inclinada' },
    cardioHow: 'Empieza con 10-15 min a nivel 4-6 en zona 2 y súmale 2-3 min por semana hasta 20-25 min. Equivale aprox. a 30-35 min de cinta inclinada.',
  },
];

export const EXERCISE_BY_ID = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));
export const getExercise = (id) => EXERCISE_BY_ID[id];
