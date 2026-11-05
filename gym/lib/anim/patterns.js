// Patrones de animación 3D por ejercicio (datos puros, sin three.js).
// Cada patrón: a (pose inicial/estirada), b (pose contraída) o cycle(u) para cardio,
// tempo [concéntrica, pausa arriba, excéntrica, pausa abajo] en segundos,
// props, lock (bloqueo de pies/manos…), view (dirección de cámara), labels (fases).
//
// Pose: { root:{pos,rot}, hips:[x,y,z] (offset), spine:[°], chest:[°], neck:[°],
//         armSpace:'chest'|'root', arms|armL|armR:{up,fore}|{ik,pole},
//         legs|legL|legR:{thigh,shin,foot?,ankle?}|{ik,pole} }

const DEG = Math.PI / 180;

const STAND = { thigh: [0.06, -1, 0.02], shin: [0.06, -1, -0.01] };
const SIT = { thigh: [0.13, -0.06, 1], shin: [0.05, -1, 0.05] };

const L_DEFAULT = ['Sube', 'Aguanta', 'Baja', 'Abajo'];
const L_PUSH = ['Empuja', 'Aguanta', 'Baja', 'Abajo'];
const L_PULL = ['Tira', 'Aprieta', 'Controla', 'Estira'];
const L_FLY = ['Cierra', 'Aprieta', 'Abre', 'Estira'];
const L_EXT = ['Extiende', 'Aprieta', 'Controla', 'Estira'];
const L_CARDIO = ['Ritmo constante', 'Ritmo constante', 'Ritmo constante', 'Ritmo constante'];

// ───────── props reutilizables ─────────
const seat = (dz = 0.02, w = 0.38, d = 0.42) => ({ kind: 'rbox', size: [w, 0.08, d], at: { rel: 'A:hips', offset: [0, -0.155, dz] }, color: 'pad' });
const seatPost = (dz = 0.02) => ({ kind: 'post', at: { rel: 'A:hips', offset: [0, -0.2, dz] }, size: [0.07, 0.07] });
const seatSet = (dz) => [seat(dz), seatPost(dz)];
const backrest = (len = 0.62, w = 0.36, gap = 0) => ({
  kind: 'rbox',
  size: [w, len, 0.07],
  at: { rel: 'A:spine', offset: [0, len / 2 + gap, -0.158], frame: 'local' },
  rotFrame: 'local',
  color: 'pad',
});
const backPost = (y = 0.3) => ({ kind: 'post', at: { rel: 'A:spine', offset: [0, y, -0.2], frame: 'local' }, size: [0.06, 0.06] });
// banco tumbado bajo la espalda (marco local de la columna)
const benchAlong = (from, to, z = -0.15, w = 0.3) => ({
  kind: 'rbox',
  size: [w, to - from, 0.07],
  at: { rel: 'A:spine', offset: [0, (from + to) / 2, z], frame: 'local' },
  rotFrame: 'local',
  color: 'pad',
});
const benchLeg = (y, z = -0.19) => ({ kind: 'post', at: { rel: 'A:spine', offset: [0, y, z], frame: 'local' }, size: [0.06, 0.2] });

const DB = (axis = 'x', hand = 'both') => ({ kind: 'dumbbell', hand, axis });
const handles = (axis = 'y') => ({ kind: 'handle', hand: 'both', axis });
const rodsTo = (pivotL, pivotR, rel = 'A:spine') => [
  { kind: 'rod', from: { rel, offset: pivotL, frame: 'local' }, to: 'handL' },
  { kind: 'rod', from: { rel, offset: pivotR, frame: 'local' }, to: 'handR' },
];
const tower = (rel, offset, back = [0, 0, -0.12], height = 2.25) => ({ kind: 'tower', at: { rel, offset }, back, height });
const mat = (rel, offset, size = [0.55, 0.02, 0.8]) => ({ kind: 'rbox', size, at: { rel, offset }, color: 'belt', round: 0.008 });

// ───────── patrones ─────────
export const PATTERNS = {
  // ═══════ HOMBRO ═══════
  lateralRaise: {
    a: { spine: [4, 0, 0], arms: { up: [0.16, -1, 0.1], fore: [0.2, -1, 0.2] }, legs: STAND },
    b: { spine: [4, 0, 0], arms: { up: [1, 0.04, 0.16], fore: [1, -0.04, 0.32] }, legs: STAND },
    tempo: [1, 0.4, 2, 0.4],
    props: [DB('z')],
    lock: 'feet',
    view: [0.35, 0.25, 1],
  },
  lateralRaiseSeated: {
    a: { hips: [0, -0.42, 0], spine: [2, 0, 0], arms: { up: [0.2, -1, 0.08], fore: [0.24, -1, 0.28] }, legs: SIT },
    b: { hips: [0, -0.42, 0], spine: [2, 0, 0], arms: { up: [1, 0.06, 0.1], fore: [1, 0, 0.3] }, legs: SIT },
    tempo: [1, 0.4, 2, 0.4],
    props: [
      ...seatSet(),
      backrest(0.55, 0.3),
      handles('z'),
      { kind: 'rbox', size: [0.05, 0.13, 0.1], at: { rel: 'shoulderL', offset: [0.062, -0.22, 0], frame: 'local' }, rotFrame: 'local', color: 'pad' },
      { kind: 'rbox', size: [0.05, 0.13, 0.1], at: { rel: 'shoulderR', offset: [-0.062, -0.22, 0], frame: 'local' }, rotFrame: 'local', color: 'pad' },
      { kind: 'rod', from: { rel: 'A:shoulderL', offset: [0.02, 0.0, -0.12] }, to: { rel: 'shoulderL', offset: [0.07, -0.22, -0.02], frame: 'local' }, radius: 0.018 },
      { kind: 'rod', from: { rel: 'A:shoulderR', offset: [-0.02, 0.0, -0.12] }, to: { rel: 'shoulderR', offset: [-0.07, -0.22, -0.02], frame: 'local' }, radius: 0.018 },
    ],
    lock: 'ground',
    view: [0.3, 0.3, 1],
  },
  lateralRaiseCable: {
    a: {
      spine: [3, 0, -4],
      armL: { up: [-0.18, -1, 0.2], fore: [-0.12, -1, 0.26] },
      armR: { up: [-0.75, -0.6, 0.25], fore: [-0.85, -0.35, 0.35] },
      legs: STAND,
    },
    b: {
      spine: [3, 0, -4],
      armL: { up: [1, 0.05, 0.18], fore: [1, -0.04, 0.32] },
      armR: { up: [-0.75, -0.6, 0.25], fore: [-0.85, -0.35, 0.35] },
      legs: STAND,
    },
    tempo: [1, 0.4, 2, 0.3],
    props: [
      tower('A:hips', [-0.62, -0.83, 0.12], [-0.1, 0, 0]),
      { kind: 'handle', hand: 'L', axis: 'z' },
      { kind: 'cable', from: { rel: 'A:hips', offset: [-0.62, -0.83, 0.12] }, to: 'handL' },
    ],
    lock: 'feet',
    view: [0.15, 0.25, 1],
  },
  shoulderPressDB: {
    a: { hips: [0, -0.42, 0], spine: [-4, 0, 0], arms: { up: [1, -0.12, 0.22], fore: [0.04, 1, 0.06] }, legs: SIT },
    b: { hips: [0, -0.42, 0], spine: [-4, 0, 0], arms: { up: [0.32, 1, 0.06], fore: [0.08, 1, 0.03] }, legs: SIT },
    tempo: [1, 0.3, 2, 0.3],
    labels: L_PUSH,
    props: [...seatSet(), backrest(0.72, 0.32), backPost(0.2), DB('x')],
    lock: 'ground',
    view: [0.7, 0.25, 1],
  },
  shoulderPressMachine: {
    a: { hips: [0, -0.42, 0], spine: [-6, 0, 0], arms: { up: [0.95, -0.15, 0.35], fore: [0.0, 1, 0.1] }, legs: SIT },
    b: { hips: [0, -0.42, 0], spine: [-6, 0, 0], arms: { up: [0.4, 1, 0.12], fore: [0.05, 1, 0.05] }, legs: SIT },
    tempo: [1, 0.3, 2, 0.3],
    labels: L_PUSH,
    props: [...seatSet(), backrest(0.78, 0.34), backPost(0.2), handles('z'), ...rodsTo([0.36, 0.95, -0.32], [-0.36, 0.95, -0.32])],
    lock: 'ground',
    view: [0.75, 0.3, 1],
  },
  facePull: {
    a: {
      spine: [-4, 0, 0],
      arms: { ik: { rel: 'chest', offset: [0.07, 0.28, 0.58], frame: 'local' }, pole: [1, 0.45, -0.3] },
      legL: { thigh: [0.06, -1, 0.12], shin: [0.06, -1, 0.0] },
      legR: { thigh: [-0.06, -1, -0.1], shin: [-0.06, -1, -0.14] },
    },
    b: {
      spine: [-6, 0, 0],
      arms: { ik: { rel: 'chest', offset: [0.27, 0.48, 0.06], frame: 'local' }, pole: [1, 0.45, -0.3] },
      legL: { thigh: [0.06, -1, 0.12], shin: [0.06, -1, 0.0] },
      legR: { thigh: [-0.06, -1, -0.1], shin: [-0.06, -1, -0.14] },
    },
    tempo: [1, 0.6, 1.8, 0.3],
    labels: L_PULL,
    props: [tower('A:hips', [0, 0.68, 1.05], [0, 0, 0.12]), { kind: 'rope', anchor: { rel: 'A:hips', offset: [0, 0.68, 1.05] } }],
    lock: 'feet',
    view: [1, 0.4, -0.65],
  },
  reverseFly: {
    a: { hips: [0, -0.42, 0], spine: [6, 0, 0], arms: { up: [-0.06, -0.03, 1], fore: [-0.06, 0, 1] }, legs: SIT },
    b: { hips: [0, -0.42, 0], spine: [6, 0, 0], arms: { up: [1, -0.03, -0.22], fore: [1, 0, -0.16] }, legs: SIT },
    tempo: [1, 0.5, 2, 0.3],
    labels: ['Abre', 'Aprieta', 'Cierra', 'Estira'],
    props: [
      ...seatSet(),
      { kind: 'rbox', size: [0.32, 0.4, 0.07], at: { rel: 'A:chest', offset: [0, -0.06, 0.19], frame: 'local' }, rotFrame: 'local', color: 'pad' },
      { kind: 'post', at: { rel: 'A:chest', offset: [0, -0.26, 0.24], frame: 'local' }, size: [0.07, 0.07] },
      handles('y'),
      ...rodsTo([0.07, 0.52, 0.06], [-0.07, 0.52, 0.06], 'A:chest'),
    ],
    lock: 'ground',
    view: [0.8, 0.55, -1],
  },

  // ═══════ PECHO ═══════
  inclinePressDB: {
    a: { hips: [0, -0.4, 0], spine: [-60, 0, 0], arms: { up: [1, -0.25, -0.4], fore: [0.05, 0.5, 0.87] }, legs: { thigh: [0.16, -0.22, 1], shin: [0.05, -1, 0.12] } },
    b: { hips: [0, -0.4, 0], spine: [-60, 0, 0], arms: { up: [0.16, 0.5, 0.85], fore: [0.06, 0.5, 0.86] }, legs: { thigh: [0.16, -0.22, 1], shin: [0.05, -1, 0.12] } },
    tempo: [1, 0.3, 2, 0.4],
    labels: L_PUSH,
    props: [...seatSet(0.0), backrest(0.85, 0.32, 0.02), backPost(0.45), DB('x')],
    lock: 'ground',
    view: [1, 0.45, 0.7],
  },
  inclinePressBar: {
    a: { hips: [0, -0.4, 0], spine: [-60, 0, 0], arms: { up: [0.85, -0.3, -0.45], fore: [0.0, 0.5, 0.87] }, legs: { thigh: [0.16, -0.22, 1], shin: [0.05, -1, 0.12] } },
    b: { hips: [0, -0.4, 0], spine: [-60, 0, 0], arms: { up: [0.6, 0.4, 0.7], fore: [0.12, 0.5, 0.86] }, legs: { thigh: [0.16, -0.22, 1], shin: [0.05, -1, 0.12] } },
    tempo: [1, 0.3, 2, 0.4],
    labels: L_PUSH,
    props: [
      ...seatSet(0.0),
      backrest(0.85, 0.32, 0.02),
      backPost(0.45),
      { kind: 'bar', type: 'barbell', len: 1.6, plate: 0.18 },
      { kind: 'post', at: { rel: 'A:hands', offset: [0.92, 0, 0] }, topY: 2.1, size: [0.07, 0.07] },
      { kind: 'post', at: { rel: 'A:hands', offset: [-0.92, 0, 0] }, topY: 2.1, size: [0.07, 0.07] },
    ],
    lock: 'ground',
    view: [1, 0.45, 0.75],
  },
  pecFly: {
    a: { hips: [0, -0.42, 0], spine: [-4, 0, 0], arms: { up: [1, -0.06, -0.12], fore: [0.96, 0, 0.32] }, legs: SIT },
    b: { hips: [0, -0.42, 0], spine: [-4, 0, 0], arms: { up: [-0.05, -0.05, 1], fore: [-0.36, 0, 1] }, legs: SIT },
    tempo: [1, 0.5, 2, 0.3],
    labels: L_FLY,
    props: [
      ...seatSet(),
      backrest(0.75, 0.32),
      backPost(0.2),
      handles('y'),
      { kind: 'rod', from: { rel: 'A:shoulderL', offset: [0.03, 0.3, -0.06] }, to: 'handL' },
      { kind: 'rod', from: { rel: 'A:shoulderR', offset: [-0.03, 0.3, -0.06] }, to: 'handR' },
    ],
    lock: 'ground',
    view: [0.3, 0.55, 1],
  },
  chestPressMachine: {
    a: { hips: [0, -0.42, 0], spine: [-6, 0, 0], arms: { up: [0.85, -0.25, -0.4], fore: [0.08, 0.02, 1] }, legs: SIT },
    b: { hips: [0, -0.42, 0], spine: [-6, 0, 0], arms: { up: [0.3, -0.12, 1], fore: [0.04, 0, 1] }, legs: SIT },
    tempo: [1, 0.3, 2, 0.3],
    labels: L_PUSH,
    props: [...seatSet(), backrest(0.75, 0.34), backPost(0.2), handles('y'), ...rodsTo([0.5, 0.5, -0.12], [-0.5, 0.5, -0.12])],
    lock: 'ground',
    view: [1, 0.4, 0.9],
  },
  dipMachine: {
    a: { hips: [0, -0.42, 0], spine: [-4, 0, 0], arms: { up: [0.3, -0.45, -0.85], fore: [0.05, -0.52, 0.85] }, legs: SIT },
    b: { hips: [0, -0.42, 0], spine: [-4, 0, 0], arms: { up: [0.26, -1, -0.14], fore: [0.22, -1, -0.06] }, legs: SIT },
    tempo: [1, 0.4, 2, 0.3],
    labels: L_PUSH,
    props: [
      ...seatSet(),
      backrest(0.7, 0.32),
      backPost(0.2),
      handles('z'),
      { kind: 'rod', from: { rel: 'A:handL', offset: [0.02, -0.12, 0.42] }, to: 'handL' },
      { kind: 'rod', from: { rel: 'A:handR', offset: [-0.02, -0.12, 0.42] }, to: 'handR' },
    ],
    lock: 'ground',
    view: [1, 0.3, 0.7],
  },

  // ═══════ TRÍCEPS ═══════
  pushdown: {
    a: { spine: [12, 0, 0], arms: { up: [0.12, -1, 0.16], fore: [0.1, 0.32, 1] }, legs: STAND },
    b: { spine: [12, 0, 0], arms: { up: [0.13, -1, 0.1], fore: [0.24, -1, 0.12] }, legs: STAND },
    tempo: [1, 0.5, 2, 0.3],
    labels: ['Empuja', 'Aprieta', 'Sube', 'Arriba'],
    props: [tower('A:hips', [0, 1.2, 0.5], [0, 0, 0.12], 2.3), { kind: 'rope', anchor: { rel: 'A:hips', offset: [0, 1.2, 0.5] } }],
    lock: 'feet',
    view: [1, 0.3, 0.7],
  },
  overheadTriceps: {
    a: {
      spine: [25, 0, 0],
      neck: [-15, 0, 0],
      arms: { up: [0.12, 0.9, 0.18], fore: [0.03, -0.5, -0.86] },
      legL: { thigh: [0.06, -1, 0.25], shin: [0.06, -1, 0.05] },
      legR: { thigh: [-0.06, -1, -0.22], shin: [-0.06, -1, -0.28], ankle: 25 },
    },
    b: {
      spine: [25, 0, 0],
      neck: [-15, 0, 0],
      arms: { up: [0.12, 0.9, 0.3], fore: [0.08, 0.85, 0.45] },
      legL: { thigh: [0.06, -1, 0.25], shin: [0.06, -1, 0.05] },
      legR: { thigh: [-0.06, -1, -0.22], shin: [-0.06, -1, -0.28], ankle: 25 },
    },
    tempo: [1, 0.4, 2, 0.4],
    labels: L_EXT,
    props: [tower('A:hips', [0, 0.25, -0.85], [0, 0, -0.12]), { kind: 'rope', anchor: { rel: 'A:hips', offset: [0, 0.25, -0.85] } }],
    lock: 'feet',
    view: [1, 0.3, 0.3],
  },
  skullCrusher: {
    a: {
      root: { pos: [0, 0.53, 0], rot: [-90, 0, 0] },
      hips: [0, -0.945, 0],
      arms: { up: [0.12, 0.28, 1], fore: [0.05, 1, 0.12] },
      legs: { thigh: [0.16, -0.96, -0.06], shin: [0.06, -0.1, -1], foot: [0.08, -1, 0] },
    },
    b: {
      root: { pos: [0, 0.53, 0], rot: [-90, 0, 0] },
      hips: [0, -0.945, 0],
      arms: { up: [0.12, 0.22, 1], fore: [0.08, 0.2, 1] },
      legs: { thigh: [0.16, -0.96, -0.06], shin: [0.06, -0.1, -1], foot: [0.08, -1, 0] },
    },
    tempo: [1, 0.4, 2, 0.3],
    labels: L_EXT,
    props: [benchAlong(-0.28, 0.86), benchLeg(-0.15), benchLeg(0.72), { kind: 'bar', type: 'ez' }],
    lock: null,
    view: [1.2, 0.6, 0.1],
  },

  // ═══════ ESPALDA ═══════
  latPulldown: {
    a: { hips: [0, -0.42, 0], spine: [-10, 0, 0], arms: { up: [0.45, 1, 0.05], fore: [0.26, 1, 0.03] }, legs: { thigh: [0.12, -0.1, 1], shin: [0.05, -1, 0.1] } },
    b: { hips: [0, -0.42, 0], spine: [-20, 0, 0], arms: { up: [0.75, -0.55, -0.3], fore: [-0.1, 0.56, 0.82] }, legs: { thigh: [0.12, -0.1, 1], shin: [0.05, -1, 0.1] } },
    tempo: [1, 0.5, 2, 0.3],
    labels: L_PULL,
    props: [
      ...seatSet(),
      { kind: 'rbox', size: [0.42, 0.08, 0.12], at: { rel: 'A:knees', offset: [0, 0.115, -0.03] }, color: 'pad' },
      { kind: 'bar', type: 'cable', len: 1.15 },
      { kind: 'cable', from: { rel: 'A:hands', offset: [0, 0.5, 0] }, to: { rel: 'hands', offset: [0, 0, 0] } },
      tower('A:hands', [0, 0.5, 0], [0, 0, -0.45], 2.75),
    ],
    lock: 'ground',
    view: [0.6, 0.3, -1],
  },
  pullup: {
    a: {
      spine: [-4, 0, 0],
      arms: { up: [0.45, 1, 0.04], fore: [0.26, 1, 0.02] },
      legs: { thigh: [0.05, -1, 0.06], shin: [0.05, -0.05, -1], ankle: 20 },
    },
    b: {
      spine: [-16, 0, 0],
      arms: { up: [0.75, -0.55, -0.3], fore: [-0.1, 0.56, 0.82] },
      legs: { thigh: [0.05, -1, 0.06], shin: [0.05, -0.05, -1], ankle: 20 },
    },
    tempo: [1.2, 0.5, 2, 0.4],
    labels: ['Sube', 'Aprieta', 'Baja', 'Estira'],
    props: [
      { kind: 'cyl', radius: 0.018, height: 1.4, at: { rel: 'A:hands', offset: [0, 0, 0] }, rot: [0, 0, 90], color: 'metal' },
      { kind: 'post', at: { rel: 'A:hands', offset: [0.68, 0, -0.04] }, size: [0.07, 0.07] },
      { kind: 'post', at: { rel: 'A:hands', offset: [-0.68, 0, -0.04] }, size: [0.07, 0.07] },
      { kind: 'rbox', size: [0.42, 0.06, 0.3], at: { rel: 'knees', offset: [0, -0.08, -0.1] }, color: 'pad' },
      { kind: 'rod', from: { rel: 'knees', offset: [0, -0.1, -0.22] }, to: { rel: 'A:knees', offset: [0, -0.35, -0.75] }, radius: 0.025 },
    ],
    lock: { joint: 'hands', y: 2.3 },
    view: [0.6, 0.25, -1],
  },
  machineRow: {
    a: { hips: [0, -0.42, 0], spine: [12, 0, 0], arms: { up: [0.25, -0.2, 1], fore: [0.05, -0.05, 1] }, legs: SIT },
    b: { hips: [0, -0.42, 0], spine: [12, 0, 0], arms: { up: [0.55, -0.45, -0.7], fore: [0, 0.05, 1] }, legs: SIT },
    tempo: [1, 0.6, 2, 0.3],
    labels: L_PULL,
    props: [
      ...seatSet(),
      { kind: 'rbox', size: [0.3, 0.32, 0.07], at: { rel: 'A:chest', offset: [0, -0.03, 0.17], frame: 'local' }, rotFrame: 'local', color: 'pad' },
      { kind: 'post', at: { rel: 'A:chest', offset: [0, -0.22, 0.22], frame: 'local' }, size: [0.07, 0.07] },
      handles('y'),
      { kind: 'rod', from: { rel: 'A:handL', offset: [0, 0.6, 0.12] }, to: 'handL' },
      { kind: 'rod', from: { rel: 'A:handR', offset: [0, 0.6, 0.12] }, to: 'handR' },
    ],
    lock: 'ground',
    view: [1, 0.45, 0.4],
  },
  cableRow: {
    a: {
      hips: [0, -0.56, 0],
      spine: [18, 0, 0],
      arms: { up: [-0.15, -0.2, 1], fore: [-0.14, -0.08, 1] },
      legs: { thigh: [0.12, 0.06, 1], shin: [0.08, -0.22, 1], foot: [0.04, 1, 0.28] },
    },
    b: {
      hips: [0, -0.56, 0],
      spine: [-6, 0, 0],
      arms: { up: [0.25, -0.85, -0.4], fore: [-0.65, 0.01, 0.76] },
      legs: { thigh: [0.12, 0.06, 1], shin: [0.08, -0.22, 1], foot: [0.04, 1, 0.28] },
    },
    tempo: [1, 0.6, 2, 0.3],
    labels: L_PULL,
    props: [
      { kind: 'rbox', size: [0.32, 0.08, 1.0], at: { rel: 'A:hips', offset: [0, -0.155, 0.25] }, color: 'pad' },
      { kind: 'post', at: { rel: 'A:hips', offset: [0, -0.2, -0.1] }, size: [0.07, 0.2] },
      { kind: 'post', at: { rel: 'A:hips', offset: [0, -0.2, 0.6] }, size: [0.07, 0.2] },
      { kind: 'rbox', size: [0.42, 0.3, 0.05], at: { rel: 'A:ankles', offset: [0, 0.05, 0.11] }, rot: [16, 0, 0], color: 'frame' },
      { kind: 'bar', type: 'vhandle' },
      tower('A:hips', [0, -0.08, 1.45], [0, 0, 0.12]),
      { kind: 'cable', from: { rel: 'A:hips', offset: [0, -0.08, 1.45] }, to: { rel: 'hands', offset: [0, 0, 0] } },
    ],
    lock: null,
    view: [1, 0.35, 0.15],
  },
  straightArmPulldown: {
    a: { hips: [0, 0, -0.04], spine: [30, 0, 0], neck: [-15, 0, 0], arms: { up: [0.12, 0.75, 0.65], fore: [0.1, 0.76, 0.66] }, legs: { thigh: [0.06, -1, 0.12], shin: [0.06, -1, -0.04] } },
    b: { hips: [0, 0, -0.04], spine: [30, 0, 0], neck: [-15, 0, 0], arms: { up: [0.14, -0.95, 0.32], fore: [0.14, -0.94, 0.36] }, legs: { thigh: [0.06, -1, 0.12], shin: [0.06, -1, -0.04] } },
    tempo: [1, 0.5, 2, 0.3],
    labels: L_PULL,
    props: [
      { kind: 'bar', type: 'cable', len: 0.9 },
      tower('A:hips', [0, 1.25, 0.85], [0, 0, 0.12], 2.35),
      { kind: 'cable', from: { rel: 'A:hips', offset: [0, 1.25, 0.85] }, to: { rel: 'hands', offset: [0, 0, 0] } },
    ],
    lock: 'feet',
    view: [1, 0.3, 0.4],
  },
  oneArmRow: {
    a: {
      hips: [0, -0.005, 0],
      spine: [78, 0, 0],
      neck: [-30, 0, 0],
      armSpace: 'root',
      armL: { up: [0.0, -1, 0.06], fore: [0.0, -1, 0.08] },
      armR: { up: [-0.05, -1, 0.05], fore: [-0.05, -1, 0.08] },
      legL: { thigh: [0.0, -1, 0.0], shin: [0.0, 0.0, -1], foot: [0, -0.6, -0.8] },
      legR: { thigh: [-0.12, -1, -0.05], shin: [-0.12, -1, -0.03] },
    },
    b: {
      hips: [0, -0.005, 0],
      spine: [78, 0, 0],
      neck: [-30, 0, 0],
      armSpace: 'root',
      armL: { up: [0.0, -1, 0.06], fore: [0.0, -1, 0.08] },
      armR: { up: [-0.12, 0.25, -0.96], fore: [0.0, -1, 0.12] },
      legL: { thigh: [0.0, -1, 0.0], shin: [0.0, 0.0, -1], foot: [0, -0.6, -0.8] },
      legR: { thigh: [-0.12, -1, -0.05], shin: [-0.12, -1, -0.03] },
    },
    tempo: [1, 0.5, 2, 0.3],
    labels: L_PULL,
    props: [
      { kind: 'rbox', size: [0.3, 0.06, 1.15], at: { rel: 'A:kneeL', offset: [0.03, -0.085, 0.12] }, color: 'pad' },
      { kind: 'post', at: { rel: 'A:kneeL', offset: [0.03, -0.12, -0.3] }, size: [0.2, 0.06] },
      { kind: 'post', at: { rel: 'A:kneeL', offset: [0.03, -0.12, 0.55] }, size: [0.2, 0.06] },
      DB('z', 'R'),
    ],
    lock: null,
    view: [-1.1, 0.4, 0.7],
  },

  // ═══════ BÍCEPS ═══════
  curlBar: {
    a: { spine: [2, 0, 0], arms: { up: [0.12, -1, 0.04], fore: [0.12, -1, 0.12] }, legs: STAND },
    b: { spine: [0, 0, 0], arms: { up: [0.12, -1, 0.16], fore: [0.08, 0.75, 0.66] }, legs: STAND },
    tempo: [1, 0.4, 2, 0.3],
    props: [{ kind: 'bar', type: 'ez' }],
    lock: 'feet',
    view: [1, 0.3, 0.9],
  },
  hammerCurl: {
    a: { spine: [2, 0, 0], arms: { up: [0.1, -1, 0.03], fore: [0.1, -1, 0.1] }, legs: STAND },
    b: { spine: [0, 0, 0], arms: { up: [0.1, -1, 0.14], fore: [0.03, 0.72, 0.69] }, legs: STAND },
    tempo: [1, 0.4, 2, 0.3],
    props: [DB('hammer')],
    lock: 'feet',
    view: [1, 0.3, 0.9],
  },
  cableCurl: {
    a: { spine: [2, 0, 0], arms: { up: [0.12, -1, 0.04], fore: [0.12, -1, 0.14] }, legs: STAND },
    b: { spine: [0, 0, 0], arms: { up: [0.12, -1, 0.16], fore: [0.08, 0.75, 0.66] }, legs: STAND },
    tempo: [1, 0.5, 2, 0.3],
    props: [
      { kind: 'bar', type: 'cable', len: 0.62 },
      tower('A:hips', [0, -0.8, 0.6], [0, 0, 0.12]),
      { kind: 'cable', from: { rel: 'A:hips', offset: [0, -0.8, 0.6] }, to: { rel: 'hands', offset: [0, 0, 0] } },
    ],
    lock: 'feet',
    view: [1, 0.3, 0.9],
  },
  inclineCurl: {
    a: { hips: [0, -0.4, 0], spine: [-35, 0, 0], armSpace: 'root', arms: { up: [0.08, -1, -0.06], fore: [0.08, -1, -0.02] }, legs: { thigh: [0.14, -0.2, 1], shin: [0.05, -1, 0.1] } },
    b: { hips: [0, -0.4, 0], spine: [-35, 0, 0], armSpace: 'root', arms: { up: [0.08, -1, -0.04], fore: [0.04, 0.7, 0.71] }, legs: { thigh: [0.14, -0.2, 1], shin: [0.05, -1, 0.1] } },
    tempo: [1, 0.4, 2.2, 0.3],
    props: [...seatSet(0.0), backrest(0.8, 0.26, 0.02), backPost(0.35), DB('x')],
    lock: 'ground',
    view: [1.1, 0.3, 0.7],
  },
  preacherCurl: {
    a: { hips: [0, -0.42, 0], spine: [10, 0, 0], arms: { up: [0.14, -0.55, 0.85], fore: [0.13, -0.4, 0.9] }, legs: SIT },
    b: { hips: [0, -0.42, 0], spine: [10, 0, 0], arms: { up: [0.14, -0.55, 0.85], fore: [0.06, 0.85, 0.4] }, legs: SIT },
    tempo: [1, 0.4, 2.2, 0.3],
    props: [
      ...seatSet(),
      { kind: 'rbox', size: [0.52, 0.05, 0.3], at: { rel: 'A:chest', offset: [0, 0.06, 0.25], frame: 'local' }, rot: [33, 0, 0], rotFrame: 'local', color: 'pad' },
      { kind: 'post', at: { rel: 'A:chest', offset: [0, -0.05, 0.3], frame: 'local' }, size: [0.07, 0.07] },
      { kind: 'bar', type: 'ez', plate: 0.09 },
    ],
    lock: 'ground',
    view: [1, 0.35, 0.6],
  },

  // ═══════ PIERNA ═══════
  squat: {
    a: {
      spine: [34, 0, 0],
      neck: [-24, 0, 0],
      arms: { up: [0.6, -0.7, -0.4], fore: [0.12, 1, -0.02] },
      legs: { thigh: [0.24, -0.19, 0.95], shin: [0.05, -0.907, -0.408] },
    },
    b: {
      spine: [6, 0, 0],
      neck: [-6, 0, 0],
      arms: { up: [0.6, -0.7, -0.4], fore: [0.12, 1, -0.02] },
      legs: { thigh: [0.06, -1, 0.05], shin: [0.06, -1, -0.03] },
    },
    tempo: [1.2, 0.3, 2, 0.4],
    props: [
      { kind: 'bar', type: 'barbell', len: 1.7 },
      { kind: 'post', at: { rel: 'A:hands', offset: [0.95, 0, 0] }, topY: 2.2, size: [0.07, 0.07] },
      { kind: 'post', at: { rel: 'A:hands', offset: [-0.95, 0, 0] }, topY: 2.2, size: [0.07, 0.07] },
    ],
    lock: 'feet',
    view: [1, 0.3, 0.7],
  },
  legPress: {
    a: {
      hips: [0, -0.45, 0],
      spine: [-55, 0, 0],
      neck: [25, 0, 0],
      armSpace: 'root',
      arms: { up: [0.35, -1, 0.05], fore: [0.25, -0.5, 0.8] },
      legs: { thigh: [0.214, 0.963, 0.161], shin: [-0.1, -0.12, 0.99], foot: [0, 0.92, -0.4] },
    },
    b: {
      hips: [0, -0.45, 0],
      spine: [-55, 0, 0],
      neck: [25, 0, 0],
      armSpace: 'root',
      arms: { up: [0.35, -1, 0.05], fore: [0.25, -0.5, 0.8] },
      legs: { thigh: [0.12, 0.62, 0.78], shin: [0.08, 0.46, 0.88], foot: [0, 0.92, -0.4] },
    },
    tempo: [1.2, 0.3, 2, 0.4],
    labels: L_PUSH,
    props: [
      ...seatSet(0.02),
      backrest(0.78, 0.38),
      backPost(0.35),
      { kind: 'rbox', size: [0.62, 0.62, 0.05], at: { rel: 'ankles', offset: [0, 0.034, 0.078] }, rot: [-23.6, 0, 0], color: 'frame' },
      { kind: 'line', from: { rel: 'A:ankles', offset: [0.36, -0.14, -0.3] }, to: { rel: 'A:ankles', offset: [0.36, 0.3, 0.7] }, radius: 0.025 },
      { kind: 'line', from: { rel: 'A:ankles', offset: [-0.36, -0.14, -0.3] }, to: { rel: 'A:ankles', offset: [-0.36, 0.3, 0.7] }, radius: 0.025 },
      { kind: 'post', at: { rel: 'A:ankles', offset: [0.36, 0.3, 0.7] }, size: [0.06, 0.06] },
      { kind: 'post', at: { rel: 'A:ankles', offset: [-0.36, 0.3, 0.7] }, size: [0.06, 0.06] },
    ],
    lock: null,
    view: [1.3, 0.4, 0.15],
  },
  legExtension: {
    a: { hips: [0, -0.35, 0], spine: [-8, 0, 0], armSpace: 'root', arms: { up: [0.3, -1, 0.05], fore: [0.2, -0.7, 0.6] }, legs: { thigh: [0.1, -0.04, 1], shin: [0.05, -1, -0.12] } },
    b: { hips: [0, -0.35, 0], spine: [-8, 0, 0], armSpace: 'root', arms: { up: [0.3, -1, 0.05], fore: [0.2, -0.7, 0.6] }, legs: { thigh: [0.1, -0.04, 1], shin: [0.08, -0.02, 1] } },
    tempo: [1, 0.6, 2, 0.3],
    labels: L_EXT,
    props: [
      ...seatSet(0.06),
      backrest(0.62, 0.36),
      backPost(0.2),
      { kind: 'cyl', radius: 0.05, height: 0.42, at: { rel: 'ankles', offset: [0, 0.07, 0.08], frame: 'local', frameJoint: 'kneeL' }, rot: [0, 0, 90], orient: 'kneeL', color: 'pad' },
      { kind: 'rod', from: { rel: 'A:knees', offset: [0.27, 0, 0] }, to: { rel: 'ankles', offset: [0.21, 0.07, 0.08], frame: 'local', frameJoint: 'kneeL' }, radius: 0.02 },
    ],
    lock: null,
    view: [1.2, 0.3, 0.5],
  },
  seatedLegCurl: {
    a: { hips: [0, -0.35, 0], spine: [-12, 0, 0], armSpace: 'root', arms: { up: [0.3, -1, 0.05], fore: [0.2, -0.7, 0.6] }, legs: { thigh: [0.1, -0.02, 1], shin: [0.08, -0.06, 1] } },
    b: { hips: [0, -0.35, 0], spine: [-12, 0, 0], armSpace: 'root', arms: { up: [0.3, -1, 0.05], fore: [0.2, -0.7, 0.6] }, legs: { thigh: [0.1, -0.02, 1], shin: [0.05, -0.95, -0.35] } },
    tempo: [1, 0.5, 2, 0.3],
    labels: ['Flexiona', 'Aprieta', 'Controla', 'Estira'],
    props: [
      ...seatSet(0.06),
      backrest(0.62, 0.36),
      backPost(0.2),
      { kind: 'rbox', size: [0.44, 0.06, 0.12], at: { rel: 'A:knees', offset: [0, 0.11, -0.1] }, color: 'pad' },
      { kind: 'cyl', radius: 0.05, height: 0.42, at: { rel: 'ankles', offset: [0, 0.08, -0.08], frame: 'local', frameJoint: 'kneeL' }, rot: [0, 0, 90], orient: 'kneeL', color: 'pad' },
      { kind: 'rod', from: { rel: 'A:knees', offset: [0.27, 0, 0] }, to: { rel: 'ankles', offset: [0.21, 0.08, -0.08], frame: 'local', frameJoint: 'kneeL' }, radius: 0.02 },
    ],
    lock: null,
    view: [1.2, 0.3, 0.4],
  },
  lyingLegCurl: {
    a: {
      root: { pos: [0, 0.68, 0], rot: [90, 0, 0] },
      hips: [0, -0.945, 0],
      neck: [-20, 0, 0],
      arms: { up: [0.35, 0.8, 0.5], fore: [0.12, 0.05, 1] },
      legs: { thigh: [0.06, -1, 0.05], shin: [0.06, -1, 0.04] },
    },
    b: {
      root: { pos: [0, 0.68, 0], rot: [90, 0, 0] },
      hips: [0, -0.945, 0],
      neck: [-20, 0, 0],
      arms: { up: [0.35, 0.8, 0.5], fore: [0.12, 0.05, 1] },
      legs: { thigh: [0.06, -1, 0.05], shin: [0.05, 0.3, -0.95] },
    },
    tempo: [1, 0.5, 2, 0.3],
    labels: ['Flexiona', 'Aprieta', 'Controla', 'Estira'],
    props: [
      benchAlong(-0.38, 0.78, 0.158, 0.32),
      benchLeg(-0.25, 0.2),
      benchLeg(0.62, 0.2),
      { kind: 'cyl', radius: 0.05, height: 0.42, at: { rel: 'ankles', offset: [0, 0.08, -0.075], frame: 'local', frameJoint: 'kneeL' }, rot: [0, 0, 90], orient: 'kneeL', color: 'pad' },
      { kind: 'rod', from: { rel: 'A:knees', offset: [0.27, 0, 0] }, to: { rel: 'ankles', offset: [0.21, 0.08, -0.075], frame: 'local', frameJoint: 'kneeL' }, radius: 0.02 },
    ],
    lock: null,
    view: [1.3, 0.5, 0.1],
  },
  calfRaise: {
    a: { spine: [2, 0, 0], arms: { up: [0.55, -0.75, 0.35], fore: [0.1, 0.9, 0.4] }, legs: { thigh: [0.06, -1, 0.02], shin: [0.06, -1, -0.01], ankle: -18 } },
    b: { spine: [2, 0, 0], arms: { up: [0.55, -0.75, 0.35], fore: [0.1, 0.9, 0.4] }, legs: { thigh: [0.06, -1, 0.02], shin: [0.06, -1, -0.01], ankle: 32 } },
    tempo: [1, 0.8, 2, 0.6],
    props: [
      { kind: 'rbox', size: [0.5, 0.1, 0.22], at: { rel: 'A:toes', offset: [0, -0.05, -0.05] }, color: 'frame' },
      { kind: 'rbox', size: [0.13, 0.07, 0.2], at: { rel: 'shoulderL', offset: [0.0, 0.085, 0.0] }, color: 'pad' },
      { kind: 'rbox', size: [0.13, 0.07, 0.2], at: { rel: 'shoulderR', offset: [0.0, 0.085, 0.0] }, color: 'pad' },
      { kind: 'rod', from: { rel: 'shoulders', offset: [0, 0.11, -0.06] }, to: { rel: 'A:hips', offset: [0, 0.6, -0.4] }, radius: 0.025 },
      { kind: 'post', at: { rel: 'A:hips', offset: [0, 1.25, -0.42] }, size: [0.12, 0.12] },
    ],
    lock: { joint: 'toes', y: 0.1 },
    view: [1.1, 0.25, 0.6],
  },
  seatedCalf: {
    a: {
      hips: [0, -0.42, 0],
      spine: [8, 0, 0],
      arms: { ik: { rel: 'knees', offset: [0.25, 0.1, 0.02] }, pole: [0.6, -0.5, -0.5] },
      legs: { thigh: [0.1, -0.05, 1], shin: [0.05, -1, 0.05], ankle: -15 },
    },
    b: {
      hips: [0, -0.42, 0],
      spine: [8, 0, 0],
      arms: { ik: { rel: 'knees', offset: [0.25, 0.1, 0.02] }, pole: [0.6, -0.5, -0.5] },
      legs: { thigh: [0.1, -0.05, 1], shin: [0.05, -1, 0.05], ankle: 30 },
    },
    tempo: [1, 0.8, 2, 0.6],
    props: [
      { kind: 'rbox', size: [0.38, 0.08, 0.42], at: { rel: 'hips', offset: [0, -0.155, 0.02] }, color: 'pad' },
      { kind: 'post', at: { rel: 'hips', offset: [0, -0.2, 0.02] }, size: [0.07, 0.07] },
      { kind: 'rbox', size: [0.5, 0.1, 0.22], at: { rel: 'A:toes', offset: [0, -0.05, -0.05] }, color: 'frame' },
      { kind: 'rbox', size: [0.5, 0.06, 0.14], at: { rel: 'knees', offset: [0, 0.09, 0.0] }, color: 'pad' },
    ],
    lock: { joint: 'toes', y: 0.1 },
    view: [1.1, 0.3, 0.6],
  },
  rdl: {
    a: { spine: [60, 0, 0], neck: [-30, 0, 0], armSpace: 'root', arms: { up: [0.11, -1, 0.02], fore: [0.11, -1, 0.03] }, legs: { thigh: [0.06, -0.62, 0.78], shin: [0.05, -1, -0.1] } },
    b: { spine: [3, 0, 0], neck: [-4, 0, 0], armSpace: 'root', arms: { up: [0.11, -1, 0.02], fore: [0.11, -1, 0.03] }, legs: { thigh: [0.06, -1, 0.04], shin: [0.06, -1, -0.02] } },
    tempo: [1.2, 0.4, 2.2, 0.3],
    props: [{ kind: 'bar', type: 'barbell', len: 1.7 }],
    lock: 'feet',
    view: [1.2, 0.3, 0.5],
  },
  hipThrust: {
    a: {
      spine: [-61, 0, 0],
      neck: [25, 0, 0],
      arms: { ik: { rel: 'spine', offset: [0.26, 0.0, 0.16], frame: 'local' }, pole: [0.6, -0.6, 0.4] },
      legs: { thigh: [0.1, 0.486, 0.874], shin: [0.06, -0.963, 0.267] },
    },
    b: {
      spine: [-90, 0, 0],
      neck: [35, 0, 0],
      arms: { ik: { rel: 'spine', offset: [0.26, 0.0, 0.16], frame: 'local' }, pole: [0.6, -0.6, 0.4] },
      legs: { thigh: [0.1, 0.02, 1], shin: [0.06, -1, 0.02] },
    },
    tempo: [1, 0.8, 2, 0.3],
    props: [
      { kind: 'rbox', size: [1.0, 0.4, 0.32], at: { rel: 'A:shoulders', offset: [0, -0.3, -0.12] }, color: 'pad' },
      { kind: 'bar', type: 'barbell', len: 1.7, plate: 0.2 },
    ],
    lock: 'feet',
    view: [1, 0.75, 0.85],
  },
  splitSquat: {
    a: {
      spine: [14, 0, 0],
      neck: [-10, 0, 0],
      armSpace: 'root',
      arms: { up: [0.12, -1, 0.0], fore: [0.12, -1, 0.04] },
      legL: { thigh: [0.08, -0.25, 0.97], shin: [0.03, -0.95, -0.3] },
      legR: { thigh: [-0.08, -0.97, -0.2], shin: [-0.03, 0.644, -0.765], foot: [0, -0.25, -0.97], ik: { rel: 'A:ankleR' }, pole: [0, -0.3, 1] },
    },
    b: {
      spine: [8, 0, 0],
      neck: [-6, 0, 0],
      armSpace: 'root',
      arms: { up: [0.12, -1, 0.0], fore: [0.12, -1, 0.04] },
      legL: { thigh: [0.06, -0.85, 0.52], shin: [0.03, -1, -0.05] },
      legR: { thigh: [-0.08, -0.97, -0.2], shin: [-0.03, 0.644, -0.765], foot: [0, -0.25, -0.97], ik: { rel: 'A:ankleR' }, pole: [0, -0.3, 1] },
    },
    tempo: [1.2, 0.3, 2, 0.4],
    props: [{ kind: 'rbox', size: [0.42, 0.42, 0.34], at: { rel: 'A:ankleR', offset: [0, -0.26, -0.04] }, color: 'pad' }, DB('z')],
    lock: { joint: 'ankleL', y: 0.075 },
    view: [1.2, 0.3, 0.5],
  },

  // ═══════ ABDOMEN ═══════
  cableCrunch: {
    a: {
      spine: [12, 0, 0],
      neck: [5, 0, 0],
      arms: { ik: { rel: 'head', offset: [0.075, -0.03, 0.07], frame: 'local' }, pole: [0.5, -0.8, 0.4] },
      legs: { thigh: [0.07, -1, 0.12], shin: [0.05, 0.02, -1], foot: [0, -0.55, -0.83] },
    },
    b: {
      spine: [42, 0, 0],
      chest: [30, 0, 0],
      neck: [20, 0, 0],
      arms: { ik: { rel: 'head', offset: [0.075, -0.03, 0.07], frame: 'local' }, pole: [0.5, -0.8, 0.4] },
      legs: { thigh: [0.07, -1, 0.12], shin: [0.05, 0.02, -1], foot: [0, -0.55, -0.83] },
    },
    tempo: [1, 0.6, 2, 0.3],
    labels: ['Encoge', 'Aprieta', 'Controla', 'Estira'],
    props: [
      mat('A:knees', [0, -0.045, -0.2], [0.5, 0.02, 0.75]),
      tower('A:knees', [0, 1.95, 0.75], [0, 0, 0.12], 2.25),
      { kind: 'rope', anchor: { rel: 'A:knees', offset: [0, 1.95, 0.75] } },
    ],
    lock: { joint: 'knees', y: 0.055 },
    view: [1.2, 0.3, 0.3],
  },
  legRaise: {
    a: { spine: [0, 0, 0], arms: { up: [0.3, 1, 0.02], fore: [0.12, 1, 0.0] }, legs: { thigh: [0.06, -1, 0.04], shin: [0.06, -1, 0.0] } },
    b: { spine: [-8, 0, 0], arms: { up: [0.3, 1, 0.02], fore: [0.12, 1, 0.0] }, legs: { thigh: [0.08, 0.05, 1], shin: [0.08, -0.12, 1] } },
    tempo: [1.2, 0.5, 2, 0.4],
    props: [
      { kind: 'cyl', radius: 0.018, height: 1.3, at: { rel: 'A:hands', offset: [0, 0, 0] }, rot: [0, 0, 90], color: 'metal' },
      { kind: 'post', at: { rel: 'A:hands', offset: [0.62, 0, -0.03] }, size: [0.07, 0.07] },
      { kind: 'post', at: { rel: 'A:hands', offset: [-0.62, 0, -0.03] }, size: [0.07, 0.07] },
    ],
    lock: { joint: 'hands', y: 2.25 },
    view: [1.3, 0.2, 0.5],
  },
  abWheel: {
    a: {
      spine: [80, 0, 0],
      neck: [-20, 0, 0],
      arms: { ik: { rel: 'A:knees', offset: [0.17, 0.045, 1.38] }, pole: [0.5, 0.3, -0.6] },
      legs: { thigh: [0.04, -0.45, -0.89], shin: [0.03, 0.0, -1], foot: [0, -0.6, -0.8] },
    },
    b: {
      spine: [64, 0, 0],
      neck: [-10, 0, 0],
      arms: { ik: { rel: 'A:knees', offset: [0.17, 0.065, 0.5] }, pole: [0.5, 0.3, -0.6] },
      legs: { thigh: [0.06, -1, 0.05], shin: [0.03, 0.0, -1], foot: [0, -0.6, -0.8] },
    },
    tempo: [1.2, 0.3, 2, 0.4],
    labels: ['Recoge', 'Aprieta', 'Rueda', 'Estira'],
    props: [mat('A:knees', [0, -0.045, 0.2], [0.55, 0.02, 1.6]), { kind: 'wheel' }],
    lock: { joint: 'knees', y: 0.055 },
    view: [1.3, 0.35, 0.3],
  },
  plank: {
    a: {
      root: { rot: [80, 0, 0] },
      neck: [-15, 0, 0],
      arms: { up: [0.05, -0.17, 0.98], fore: [-0.12, 0.98, 0.17] },
      legs: { thigh: [0.07, -1, 0.0], shin: [0.07, -1, 0.0], foot: [0, -0.35, 0.94] },
    },
    b: {
      root: { rot: [80, 0, 0] },
      spine: [-3, 0, 0],
      neck: [-12, 0, 0],
      arms: { up: [0.05, -0.17, 0.98], fore: [-0.12, 0.98, 0.17] },
      legs: { thigh: [0.07, -1, 0.0], shin: [0.07, -1, 0.0], foot: [0, -0.35, 0.94] },
    },
    tempo: [2, 1, 2, 1],
    labels: ['Aprieta', 'Aguanta', 'Respira', 'Respira'],
    props: [mat('A:elbows', [0, -0.04, -0.7], [0.6, 0.02, 1.9])],
    lock: { joint: 'elbows', y: 0.05 },
    view: [1.3, 0.4, 0.3],
  },

  // ═══════ CUELLO ═══════
  neckFlexion: {
    a: {
      root: { pos: [0, 0.53, 0], rot: [-90, 0, 0] },
      hips: [0, -0.945, 0],
      neck: [-38, 0, 0],
      arms: { ik: { rel: 'head', offset: [0.06, 0.03, 0.12], frame: 'local' }, pole: [0.8, -0.3, 0.1] },
      legs: { thigh: [0.16, -0.96, -0.06], shin: [0.06, -0.1, -1], foot: [0.08, -1, 0] },
    },
    b: {
      root: { pos: [0, 0.53, 0], rot: [-90, 0, 0] },
      hips: [0, -0.945, 0],
      neck: [32, 0, 0],
      arms: { ik: { rel: 'head', offset: [0.06, 0.03, 0.12], frame: 'local' }, pole: [0.8, -0.3, 0.1] },
      legs: { thigh: [0.16, -0.96, -0.06], shin: [0.06, -0.1, -1], foot: [0.08, -1, 0] },
    },
    tempo: [1.2, 0.5, 2, 0.4],
    props: [
      benchAlong(-0.3, 0.42),
      benchLeg(-0.15),
      benchLeg(0.3),
      { kind: 'cyl', radius: 0.11, height: 0.025, at: { rel: 'head', offset: [0, 0.03, 0.12], frame: 'local' }, rot: [90, 0, 0], rotFrame: 'local', color: 'plate' },
    ],
    lock: null,
    view: [1.2, 0.45, -0.35],
  },
  neckExtension: {
    a: {
      root: { pos: [0, 0.55, 0], rot: [90, 0, 0] },
      hips: [0, -0.945, 0],
      neck: [42, 0, 0],
      arms: { ik: { rel: 'head', offset: [0.06, 0.04, -0.12], frame: 'local' }, pole: [0.9, 0, 0.3] },
      legs: { thigh: [0.06, -1, 0.08], shin: [0.06, -1, 0.04], ankle: 40 },
    },
    b: {
      root: { pos: [0, 0.55, 0], rot: [90, 0, 0] },
      hips: [0, -0.945, 0],
      neck: [-30, 0, 0],
      arms: { ik: { rel: 'head', offset: [0.06, 0.04, -0.12], frame: 'local' }, pole: [0.9, 0, 0.3] },
      legs: { thigh: [0.06, -1, 0.08], shin: [0.06, -1, 0.04], ankle: 40 },
    },
    tempo: [1.2, 0.5, 2, 0.4],
    props: [
      benchAlong(-1.0, 0.42, 0.158, 0.32),
      benchLeg(-0.8, 0.2),
      benchLeg(0.25, 0.2),
      { kind: 'cyl', radius: 0.11, height: 0.025, at: { rel: 'head', offset: [0, 0.04, -0.12], frame: 'local' }, rot: [90, 0, 0], rotFrame: 'local', color: 'plate' },
    ],
    lock: null,
    view: [1.2, 0.5, 0.45],
  },

  // ═══════ CARDIO (cíclicos) ═══════
  walkIncline: {
    period: 1.15,
    cycle: (u) => walkPose(u),
    labels: L_CARDIO,
    props: [
      { kind: 'rbox', size: [0.66, 0.1, 1.75], at: [0, 0.1, 0.05], rot: [-5, 0, 0], color: 'frame' },
      { kind: 'rbox', size: [0.5, 0.02, 1.6], at: [0, 0.155, 0.05], rot: [-5, 0, 0], color: 'belt', round: 0.008 },
      { kind: 'line', from: [0.37, 0.2, 0.86], to: [0.37, 1.22, 0.98], radius: 0.03 },
      { kind: 'line', from: [-0.37, 0.2, 0.86], to: [-0.37, 1.22, 0.98], radius: 0.03 },
      { kind: 'line', from: [0.37, 1.02, 0.95], to: [0.37, 1.0, 0.3], radius: 0.018, color: 'metal' },
      { kind: 'line', from: [-0.37, 1.02, 0.95], to: [-0.37, 1.0, 0.3], radius: 0.018, color: 'metal' },
      { kind: 'rbox', size: [0.8, 0.28, 0.1], at: [0, 1.3, 1.0], rot: [-30, 0, 0], color: 'frame' },
    ],
    lock: { joint: 'foot', y: 0.165, mode: 'lowest' },
    view: [1.2, 0.3, 0.6],
  },
  bike: {
    period: 1.0,
    cycle: (u) => bikePose(u),
    labels: L_CARDIO,
    props: [
      { kind: 'rbox', size: [0.5, 0.06, 1.05], at: [0, 0.03, 0.25], color: 'frame' },
      { kind: 'line', from: [0, 0.06, -0.05], to: [0, 0.78, -0.04], radius: 0.03 },
      { kind: 'rbox', size: [0.18, 0.06, 0.27], at: [0, 0.8, -0.02], color: 'pad' },
      { kind: 'line', from: [0, 0.06, 0.62], to: [0, 1.02, 0.6], radius: 0.035 },
      { kind: 'cyl', radius: 0.018, height: 0.52, at: [0, 1.04, 0.6], rot: [0, 0, 90], color: 'grip' },
      { kind: 'cyl', radius: 0.22, height: 0.05, at: [0, 0.36, 0.62], rot: [0, 0, 90], color: 'plate' },
      { kind: 'cyl', radius: 0.08, height: 0.04, at: [0, 0.34, 0.3], rot: [0, 0, 90], color: 'metal' },
      { kind: 'line', from: [0.04, 0.34, 0.3], to: { rel: 'ankleL', offset: [0, -0.07, 0.02] }, radius: 0.012, color: 'metal' },
      { kind: 'line', from: [-0.04, 0.34, 0.3], to: { rel: 'ankleR', offset: [0, -0.07, 0.02] }, radius: 0.012, color: 'metal' },
    ],
    lock: null,
    view: [1.2, 0.3, 0.45],
  },
  stairs: {
    period: 1.0,
    cycle: (u) => stairsPose(u),
    labels: L_CARDIO,
    props: [
      { kind: 'rbox', size: [0.62, 0.06, 0.3], at: [0, 0.2, 0.0], color: 'frame' },
      { kind: 'rbox', size: [0.62, 0.06, 0.3], at: [0, 0.42, 0.28], color: 'frame' },
      { kind: 'rbox', size: [0.62, 0.06, 0.3], at: [0, 0.64, 0.56], color: 'frame' },
      { kind: 'rbox', size: [0.66, 0.9, 0.1], at: [0, 0.5, 0.86], rot: [-38, 0, 0], color: 'frame' },
      { kind: 'rbox', size: [0.5, 0.22, 0.08], at: [0, 1.28, 0.62], rot: [-30, 0, 0], color: 'frame' },
      { kind: 'line', from: [0, 0.9, 0.95], to: [0, 1.2, 0.66], radius: 0.03 },
      { kind: 'line', from: [0.34, 1.1, -0.15], to: [0.34, 1.12, 0.62], radius: 0.018, color: 'metal' },
      { kind: 'line', from: [-0.34, 1.1, -0.15], to: [-0.34, 1.12, 0.62], radius: 0.018, color: 'metal' },
      { kind: 'line', from: [0.34, 0.0, -0.15], to: [0.34, 1.1, -0.15], radius: 0.02 },
      { kind: 'line', from: [-0.34, 0.0, -0.15], to: [-0.34, 1.1, -0.15], radius: 0.02 },
    ],
    lock: { joint: 'foot', y: 0.23, mode: 'lowest' },
    view: [1.2, 0.3, 0.6],
  },
};

// ───────── generadores de ciclo (cardio) ─────────
const dirAt = (deg, x = 0.05) => [x, -Math.cos(deg * DEG), Math.sin(deg * DEG)];

function walkPose(u) {
  const ph = u * 2 * Math.PI;
  const leg = (phi, x) => {
    const a = 24 * Math.sin(phi);
    const k = 6 + 56 * Math.pow(Math.max(0, Math.cos(phi)), 2);
    const push = 18 * Math.max(0, -Math.cos(phi + 0.6)) * Math.max(0, -Math.sin(phi));
    return { thigh: dirAt(a, x), shin: dirAt(a - k, x), ankle: push };
  };
  const arm = (phi, x) => {
    const s = -20 * Math.sin(phi);
    return { up: dirAt(s, x), fore: dirAt(s + 38, x) };
  };
  return {
    hips: [0.012 * Math.sin(ph), 0, 0],
    spine: [8, 4 * Math.sin(ph), 0],
    neck: [-6, -4 * Math.sin(ph), 0],
    legL: leg(ph, 0.05),
    legR: leg(ph + Math.PI, -0.05),
    armL: arm(ph, 0.12),
    armR: arm(ph + Math.PI, -0.12),
  };
}

function bikePose(u) {
  const ph = u * 2 * Math.PI;
  const C = [0, 0.34, 0.3];
  const r = 0.17;
  const pedal = (phi, x) => [x, C[1] + r * Math.cos(phi) + 0.07, C[2] + r * Math.sin(phi) - 0.02];
  return {
    hips: [0, -0.04, -0.02],
    spine: [28, 0, 0],
    neck: [-22, 0, 0],
    legL: { ik: { rel: 'world', offset: pedal(ph, 0.12) }, pole: [0, 0.3, 1], foot: [0.02, -0.12, 1], thigh: [0.1, -0.4, 1], shin: [0.05, -1, -0.1] },
    legR: { ik: { rel: 'world', offset: pedal(ph + Math.PI, -0.12) }, pole: [0, 0.3, 1], foot: [-0.02, -0.12, 1], thigh: [-0.1, -0.4, 1], shin: [-0.05, -1, -0.1] },
    armL: { ik: { rel: 'world', offset: [0.21, 1.05, 0.6] }, pole: [0.5, -0.8, -0.3] },
    armR: { ik: { rel: 'world', offset: [-0.21, 1.05, 0.6] }, pole: [-0.5, -0.8, -0.3] },
  };
}

function stairsPose(u) {
  const ph = u * 2 * Math.PI;
  const leg = (phi, x) => {
    const a = 30 + 28 * Math.sin(phi);
    const k = 1.5 * a + 5;
    return { thigh: dirAt(a, x), shin: dirAt(a - k, x), foot: [x * 0.5, 0, 1] };
  };
  return {
    hips: [0.01 * Math.sin(ph), 0, 0],
    spine: [12, 3 * Math.sin(ph), 0],
    neck: [-10, 0, 0],
    legL: leg(ph, 0.05),
    legR: leg(ph + Math.PI, -0.05),
    armL: { ik: { rel: 'world', offset: [0.33, 1.13, 0.32] }, pole: [0.5, -0.8, -0.4] },
    armR: { ik: { rel: 'world', offset: [-0.33, 1.13, 0.32] }, pole: [-0.5, -0.8, -0.4] },
  };
}

// Patrón de reserva (respiración de pie) para claves desconocidas.
export const FALLBACK_PATTERN = {
  a: { arms: { up: [0.14, -1, 0.0], fore: [0.12, -1, 0.12] }, legs: STAND },
  b: { spine: [-2, 0, 0], arms: { up: [0.2, -1, 0.0], fore: [0.16, -1, 0.14] }, legs: STAND },
  tempo: [1.6, 0.4, 1.6, 0.4],
  labels: ['Respira', 'Respira', 'Respira', 'Respira'],
  props: [],
  lock: 'feet',
  view: [0.4, 0.25, 1],
};

export const PATTERN_KEYS = Object.keys(PATTERNS);

export function getPattern(key) {
  const p = PATTERNS[key] || FALLBACK_PATTERN;
  return {
    tempo: [1, 0.4, 2, 0.3],
    labels: L_DEFAULT,
    view: [0.5, 0.3, 1],
    props: [],
    ...p,
    key: PATTERNS[key] ? key : 'fallback',
  };
}
