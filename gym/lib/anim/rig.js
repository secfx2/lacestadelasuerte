// Maniquí 3D estilizado + props de gimnasio para animar ejercicios.
// Convenciones: Y arriba, el personaje mira a +Z, su lado izquierdo es +X.
// Brazos: direcciones (hombro→codo "up", codo→mano "fore") en el marco del pecho
//         (o del root si pose.armSpace === 'root'), o IK a un punto.
// Piernas: direcciones (cadera→rodilla "thigh", rodilla→tobillo "shin", talón→punta "foot")
//          en el marco del root/caderas, o IK a un punto.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const DEG = Math.PI / 180;

export const DIM = {
  HIP_H: 0.945,
  HIP_X: 0.095,
  THIGH: 0.44,
  SHIN: 0.43,
  ANKLE_H: 0.075,
  SPINE_CHEST: 0.22,
  SHOULDER_X: 0.19,
  SHOULDER_Y: 0.25,
  NECK_Y: 0.3,
  UPPER: 0.29,
  FORE: 0.26,
  GRIP: 0.05, // muñeca → centro del agarre
};
const ARM_REACH = DIM.FORE + DIM.GRIP;

export const COLORS = {
  body: 0x7f879a,
  bodyDark: 0x1b1e27,
  primary: 0xc8ff3d,
  secondary: 0x5ee7ff,
  frame: 0x3b404c,
  pad: 0x4a5162,
  metal: 0xc3c9d4,
  plate: 0x4d5366,
  grip: 0x262931,
  cable: 0xe3e6ec,
  accent: 0xc8ff3d,
  belt: 0x1a1c22,
};

// ───────────────────────── utilidades ─────────────────────────
const v3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);
const _m = new THREE.Matrix4();
const _qa = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _e = new THREE.Euler();
const X = new THREE.Vector3(1, 0, 0);
const Y = new THREE.Vector3(0, 1, 0);
const Z = new THREE.Vector3(0, 0, 1);

function perp(h, axis) {
  return h.clone().addScaledVector(axis, -h.dot(axis));
}

// Cuaternión cuya Y local = yAxis y Z local ≈ zHint (ortogonalizada).
function basisQuat(yAxis, zHints, out = new THREE.Quaternion()) {
  const y = yAxis.clone().normalize();
  let z = null;
  for (const h of zHints) {
    if (!h) continue;
    const c = perp(h, y);
    if (c.lengthSq() > 1e-4) {
      z = c.normalize();
      break;
    }
  }
  if (!z) z = perp(Math.abs(y.dot(Z)) < 0.9 ? Z : X, y).normalize();
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  z = new THREE.Vector3().crossVectors(x, y).normalize();
  _m.makeBasis(x, y, z);
  return out.setFromRotationMatrix(_m);
}

// Basis con Z local = zAxis e Y local ≈ yHint.
function basisQuatZ(zAxis, yHint, out = new THREE.Quaternion()) {
  const z = zAxis.clone().normalize();
  let y = perp(yHint, z);
  if (y.lengthSq() < 1e-4) y = perp(Y, z);
  if (y.lengthSq() < 1e-4) y = perp(X, z);
  y.normalize();
  const x = new THREE.Vector3().crossVectors(y, z).normalize();
  _m.makeBasis(x, y, z);
  return out.setFromRotationMatrix(_m);
}

// IK de 2 huesos: devuelve direcciones d1, d2 para llegar a target desde origin.
function ik2(origin, target, l1, l2, pole) {
  const D = target.clone().sub(origin);
  let d = D.length();
  const dir = d > 1e-6 ? D.clone().divideScalar(d) : new THREE.Vector3(0, -1, 0);
  d = THREE.MathUtils.clamp(d, Math.abs(l1 - l2) + 1e-3, (l1 + l2) * 0.9995);
  const cosA = THREE.MathUtils.clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1);
  const a = Math.acos(cosA);
  let p = perp(pole, dir);
  if (p.lengthSq() < 1e-6) p = perp(Math.abs(dir.y) < 0.9 ? Y : Z, dir);
  p.normalize();
  const d1 = dir.clone().multiplyScalar(Math.cos(a)).addScaledVector(p, Math.sin(a)).normalize();
  const elbow = origin.clone().addScaledVector(d1, l1);
  const tgt = origin.clone().addScaledVector(dir, d);
  const d2 = tgt.sub(elbow).normalize();
  return { d1, d2 };
}

function slerpDir(a, b, t) {
  const va = v3(a).normalize();
  const vb = v3(b).normalize();
  const dot = THREE.MathUtils.clamp(va.dot(vb), -1, 1);
  const ang = Math.acos(dot);
  if (ang < 1e-4) return [va.x, va.y, va.z];
  if (Math.PI - ang < 1e-3) {
    // casi opuestos: interpolación lineal sencilla con desvío
    const r = va.clone().lerp(vb, t).add(new THREE.Vector3(0, 0, 1e-3)).normalize();
    return [r.x, r.y, r.z];
  }
  const s = Math.sin(ang);
  const wa = Math.sin((1 - t) * ang) / s;
  const wb = Math.sin(t * ang) / s;
  return [va.x * wa + vb.x * wb, va.y * wa + vb.y * wb, va.z * wa + vb.z * wb];
}

const DIR_KEYS = new Set(['up', 'fore', 'thigh', 'shin', 'foot']);

export function lerpPose(a, b, t, key) {
  if (a === undefined) return b;
  if (b === undefined) return a;
  if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * t;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (DIR_KEYS.has(key) && a.length === 3) return slerpDir(a, b, t);
    return a.map((x, i) => (typeof x === 'number' ? x + ((b[i] ?? x) - x) * t : x));
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const out = {};
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) out[k] = lerpPose(a[k], b[k], t, k);
    return out;
  }
  return t < 0.5 ? a : b;
}

const mirrorVec = (a) => (Array.isArray(a) ? [-a[0], a[1], a[2]] : a);
function mirrorLimb(l) {
  if (!l) return l;
  const o = { ...l };
  for (const k of ['up', 'fore', 'thigh', 'shin', 'foot', 'pole']) if (o[k]) o[k] = mirrorVec(o[k]);
  if (o.ik) {
    o.ik = { ...o.ik };
    if (o.ik.offset) o.ik.offset = mirrorVec(o.ik.offset);
    if (o.ik.rel && /L$/.test(o.ik.rel)) o.ik.rel = o.ik.rel.replace(/L$/, 'R');
  }
  return o;
}

const DEFAULT_ARM = { up: [0.12, -1, 0.0], fore: [0.1, -1, 0.14] };
const DEFAULT_LEG = { thigh: [0.06, -1, 0.02], shin: [0.06, -1, -0.01] };

export function normalizePose(p = {}) {
  const armL = p.armL || p.arms || DEFAULT_ARM;
  const armR = p.armR || mirrorLimb(p.arms || DEFAULT_ARM);
  const legL = p.legL || p.legs || DEFAULT_LEG;
  const legR = p.legR || mirrorLimb(p.legs || DEFAULT_LEG);
  return {
    root: { pos: p.root?.pos || [0, 0, 0], rot: p.root?.rot || [0, 0, 0] },
    hips: p.hips || [0, 0, 0],
    spine: p.spine || [0, 0, 0],
    chest: p.chest || [0, 0, 0],
    neck: p.neck || [0, 0, 0],
    armSpace: p.armSpace || 'chest',
    armL,
    armR,
    legL,
    legR,
  };
}

// ───────────────────────── geometrías compartidas ─────────────────────────
function makeGeoCache() {
  const cache = new Map();
  const get = (key, fn) => {
    if (!cache.has(key)) cache.set(key, fn());
    return cache.get(key);
  };
  return {
    sphere: () => get('sphere', () => new THREE.SphereGeometry(1, 28, 18)),
    capsule: (r, len) => get(`cap${r}_${len}`, () => new THREE.CapsuleGeometry(r, len, 6, 16)),
    box: (w, h, d) => get(`box${w}_${h}_${d}`, () => new THREE.BoxGeometry(w, h, d)),
    rbox: (w, h, d, r = 0.02) => get(`rbox${w}_${h}_${d}_${r}`, () => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.2, h / 2.2, d / 2.2))),
    cyl: (r, h, seg = 20) => get(`cyl${r}_${h}_${seg}`, () => new THREE.CylinderGeometry(r, r, h, seg)),
    unitCyl: () => get('unitcyl', () => new THREE.CylinderGeometry(1, 1, 1, 10)),
    dispose: () => cache.forEach((g) => g.dispose()),
  };
}

function mesh(geo, mat, { pos, scale, rot } = {}) {
  const m = new THREE.Mesh(geo, mat);
  if (pos) m.position.set(pos[0], pos[1], pos[2]);
  if (scale) m.scale.set(scale[0], scale[1], scale[2]);
  if (rot) m.rotation.set(rot[0] * DEG, rot[1] * DEG, rot[2] * DEG);
  m.castShadow = true;
  m.receiveShadow = false;
  return m;
}

// ───────────────────────── maniquí ─────────────────────────
function buildPerson(G, mats) {
  const J = {};
  const muscles = {};
  const addMuscle = (key, parent, pos, scale) => {
    const m = mesh(G.sphere(), mats.body, { pos, scale });
    m.userData.muscle = key;
    parent.add(m);
    (muscles[key] ||= []).push(m);
    return m;
  };
  const S = G.sphere();

  const root = new THREE.Group();
  J.root = root;
  const hips = new THREE.Group();
  hips.position.set(0, DIM.HIP_H, 0);
  root.add(hips);
  J.hips = hips;

  const spine = new THREE.Group();
  hips.add(spine);
  J.spine = spine;
  spine.add(mesh(S, mats.body, { pos: [0, -0.01, -0.005], scale: [0.14, 0.105, 0.106] })); // pelvis
  spine.add(mesh(S, mats.body, { pos: [0, 0.12, 0], scale: [0.122, 0.15, 0.094] })); // cintura
  addMuscle('abs', spine, [0, 0.13, 0.078], [0.078, 0.125, 0.032]);
  for (const s of [1, -1]) {
    addMuscle('obliques', spine, [s * 0.108, 0.12, 0.032], [0.034, 0.1, 0.058]);
    addMuscle('lowerBack', spine, [s * 0.04, 0.12, -0.078], [0.04, 0.09, 0.03]);
    addMuscle('glutes', spine, [s * 0.066, -0.045, -0.078], [0.076, 0.085, 0.058]);
  }

  const chest = new THREE.Group();
  chest.position.set(0, DIM.SPINE_CHEST, 0);
  spine.add(chest);
  J.chest = chest;
  chest.add(mesh(S, mats.body, { pos: [0, 0.09, -0.005], scale: [0.182, 0.165, 0.115] })); // caja torácica
  chest.add(mesh(S, mats.body, { pos: [0, 0.215, -0.01], scale: [0.215, 0.078, 0.098] })); // cintura escapular (V)
  for (const s of [1, -1]) {
    addMuscle('chest', chest, [s * 0.082, 0.13, 0.078], [0.092, 0.07, 0.045]);
    addMuscle('lats', chest, [s * 0.128, 0.06, -0.04], [0.052, 0.13, 0.07]);
    addMuscle('traps', chest, [s * 0.068, 0.268, -0.03], [0.078, 0.045, 0.05]);
  }
  addMuscle('upperBack', chest, [0, 0.14, -0.09], [0.115, 0.085, 0.034]);

  const neck = new THREE.Group();
  neck.position.set(0, DIM.NECK_Y, -0.012);
  chest.add(neck);
  J.neck = neck;
  neck.add(mesh(G.capsule(0.046, 0.07), mats.body, { pos: [0, 0.045, 0] }));
  addMuscle('neck', neck, [0, 0.05, 0], [0.054, 0.058, 0.054]);
  const head = new THREE.Group();
  head.position.set(0, 0.145, 0.012);
  neck.add(head);
  J.head = head;
  head.add(mesh(S, mats.body, { pos: [0, 0.01, 0], scale: [0.09, 0.108, 0.098] }));
  head.add(mesh(S, mats.body, { pos: [0, -0.052, 0.024], scale: [0.074, 0.05, 0.074] })); // mandíbula
  head.add(mesh(S, mats.dark, { pos: [0, 0.018, 0.07], scale: [0.068, 0.028, 0.04] })); // visor/ojos

  for (const [S2, s] of [['L', 1], ['R', -1]]) {
    const sh = new THREE.Group();
    sh.position.set(s * DIM.SHOULDER_X, DIM.SHOULDER_Y, 0);
    chest.add(sh);
    J['shoulder' + S2] = sh;
    sh.add(mesh(S, mats.body, { pos: [0, -0.005, 0], scale: [0.06, 0.06, 0.06] }));
    sh.add(mesh(G.capsule(0.046, 0.24), mats.body, { pos: [0, -0.15, 0] }));
    addMuscle('delts', sh, [s * 0.034, -0.035, 0], [0.046, 0.075, 0.058]);
    addMuscle('deltsFront', sh, [s * 0.006, -0.042, 0.04], [0.04, 0.066, 0.034]);
    addMuscle('deltsRear', sh, [s * 0.006, -0.042, -0.04], [0.04, 0.066, 0.034]);
    addMuscle('biceps', sh, [0, -0.155, 0.03], [0.04, 0.085, 0.036]);
    addMuscle('triceps', sh, [0, -0.13, -0.032], [0.043, 0.095, 0.038]);

    const el = new THREE.Group();
    el.position.set(0, -DIM.UPPER, 0);
    sh.add(el);
    J['elbow' + S2] = el;
    el.add(mesh(G.capsule(0.039, 0.21), mats.body, { pos: [0, -0.13, 0] }));
    addMuscle('forearms', el, [0, -0.075, 0.006], [0.044, 0.085, 0.042]);
    const hand = new THREE.Group();
    hand.position.set(0, -ARM_REACH, 0);
    el.add(hand);
    J['hand' + S2] = hand;
    hand.add(mesh(S, mats.body, { pos: [0, 0.012, 0], scale: [0.032, 0.052, 0.03] }));

    const hip = new THREE.Group();
    hip.position.set(s * DIM.HIP_X, 0, 0);
    hips.add(hip);
    J['hip' + S2] = hip;
    hip.add(mesh(G.capsule(0.068, 0.33), mats.body, { pos: [0, -0.215, 0] }));
    addMuscle('quads', hip, [0, -0.2, 0.034], [0.066, 0.16, 0.055]);
    addMuscle('hamstrings', hip, [0, -0.21, -0.038], [0.06, 0.15, 0.048]);
    addMuscle('adductors', hip, [-s * 0.04, -0.13, 0.0], [0.034, 0.12, 0.045]);

    const knee = new THREE.Group();
    knee.position.set(0, -DIM.THIGH, 0);
    hip.add(knee);
    J['knee' + S2] = knee;
    knee.add(mesh(S, mats.body, { pos: [0, 0, 0.006], scale: [0.054, 0.054, 0.054] }));
    knee.add(mesh(G.capsule(0.05, 0.35), mats.body, { pos: [0, -0.21, 0] }));
    addMuscle('calves', knee, [0, -0.13, -0.034], [0.05, 0.1, 0.042]);

    const ankle = new THREE.Group();
    ankle.position.set(0, -DIM.SHIN, 0);
    knee.add(ankle);
    J['ankle' + S2] = ankle;
    ankle.add(mesh(G.rbox(0.085, 0.06, 0.245, 0.025), mats.body, { pos: [0, -0.045, 0.07] }));
    const toe = new THREE.Object3D();
    toe.position.set(0, -0.075, 0.19);
    ankle.add(toe);
    J['toe' + S2] = toe;
    const heel = new THREE.Object3D();
    heel.position.set(0, -0.075, -0.05);
    ankle.add(heel);
    J['heel' + S2] = heel;
  }
  return { root, J, muscles };
}

// ───────────────────────── aplicar pose ─────────────────────────
function limbQuats(d1, d2, anteriorFromChild, fallbacks) {
  // d1: dirección del hueso 1, d2: del hueso 2 (en el marco padre).
  const a = v3(d1).normalize();
  const b = v3(d2).normalize();
  const p = perp(b, a);
  let hint;
  if (p.length() > 0.1) hint = anteriorFromChild ? p : p.negate();
  const q1 = basisQuat(a.clone().negate(), [hint, ...fallbacks]);
  const z1 = new THREE.Vector3(0, 0, 1).applyQuaternion(q1);
  const q2 = basisQuat(b.clone().negate(), [z1, ...fallbacks]);
  return { q1, q2, a, b };
}

const ARM_FALLBACK = [new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0)];
const LEG_FALLBACK = [new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 1, 0)];

export class Rig {
  constructor(mats, G) {
    this.mats = mats;
    this.G = G;
    const { root, J, muscles } = buildPerson(G, mats);
    this.root = root;
    this.J = J;
    this.muscles = muscles;
    this.anchorsA = {};
    this.lock = null;
    this.lockTarget = null;
    this.onceOffset = new THREE.Vector3();
    this.legIK = true;
  }

  jointWorld(name, out = new THREE.Vector3()) {
    const pairs = { ankles: 'ankle', toes: 'toe', hands: 'hand', knees: 'knee', elbows: 'elbow', shoulders: 'shoulder', heels: 'heel', hipsJ: 'hip' };
    if (pairs[name]) {
      const a = this.J[pairs[name] + 'L'].getWorldPosition(new THREE.Vector3());
      const b = this.J[pairs[name] + 'R'].getWorldPosition(new THREE.Vector3());
      return out.copy(a).add(b).multiplyScalar(0.5);
    }
    const j = this.J[name];
    if (!j) return out.set(0, 0, 0);
    return j.getWorldPosition(out);
  }

  jointQuat(name, out = new THREE.Quaternion()) {
    const map = { ankles: 'ankleL', toes: 'toeL', hands: 'handL', knees: 'kneeL', elbows: 'elbowL', shoulders: 'chest', heels: 'heelL', hipsJ: 'hips' };
    const j = this.J[map[name] || name];
    if (!j) return out.identity();
    return j.getWorldQuaternion(out);
  }

  // Resuelve un punto { rel, offset, frame } a coordenadas mundo.
  resolvePoint(spec, out = new THREE.Vector3()) {
    if (!spec) return out.set(0, 0, 0);
    if (Array.isArray(spec)) return out.set(spec[0], spec[1], spec[2]);
    const off = spec.offset ? v3(spec.offset) : new THREE.Vector3();
    const rel = spec.rel || 'world';
    if (rel === 'world') return out.copy(off);
    if (rel.startsWith('A:')) {
      const a = this.anchorsA[rel.slice(2)];
      if (!a) return out.copy(off);
      if (spec.frame === 'local') {
        const fj = spec.frameJoint ? this.anchorsA[spec.frameJoint.replace(/^A:/, '')]?.quat : a.quat;
        if (fj) off.applyQuaternion(fj);
      }
      return out.copy(a.pos).add(off);
    }
    this.jointWorld(rel, out);
    if (spec.frame === 'local') off.applyQuaternion(this.jointQuat(spec.frameJoint || rel, _qa));
    return out.add(off);
  }

  setLimb(upperJ, lowerJ, endJ, d1, d2, footDir, isLeg, ankleDeg) {
    const { q1, q2, b } = limbQuats(d1, d2, !isLeg, isLeg ? LEG_FALLBACK : ARM_FALLBACK);
    upperJ.quaternion.copy(q1);
    lowerJ.quaternion.copy(q1.clone().invert().multiply(q2));
    if (isLeg && endJ) {
      // pie: Z local = dirección talón→punta; Y ≈ hacia la rodilla
      let fd;
      if (footDir) fd = v3(footDir).normalize();
      else {
        const zShin = new THREE.Vector3(0, 0, 1).applyQuaternion(q2);
        const a = (ankleDeg || 0) * DEG;
        fd = zShin.multiplyScalar(Math.cos(a)).addScaledVector(b, Math.sin(a)).normalize();
      }
      const q3 = basisQuatZ(fd, b.clone().negate());
      endJ.quaternion.copy(q2.clone().invert().multiply(q3));
    }
  }

  applyLegIK(side, L) {
    const J = this.J;
    const target = this.resolvePoint(L.ik);
    const hipW = J['hip' + side].getWorldPosition(new THREE.Vector3());
    const inv = J.hips.getWorldQuaternion(new THREE.Quaternion()).invert();
    const t = target.sub(hipW).applyQuaternion(inv);
    const pole = v3(L.pole || [0, 0.2, 1]);
    const { d1, d2 } = ik2(new THREE.Vector3(), t, DIM.THIGH, DIM.SHIN, pole);
    this.setLimb(J['hip' + side], J['knee' + side], J['ankle' + side], d1.toArray(), d2.toArray(), L.foot, true, L.ankle);
  }

  applyArm(side, A, armSpace, phase) {
    const J = this.J;
    const sh = J['shoulder' + side];
    if (A.ik) {
      if (phase !== 'ik') return;
      const target = this.resolvePoint(A.ik);
      J.chest.updateWorldMatrix(true, false);
      const tLocal = J.chest.worldToLocal(target.clone());
      const pole = v3(A.pole || [side === 'L' ? 0.6 : -0.6, -0.6, -0.4]);
      const { d1, d2 } = ik2(sh.position.clone(), tLocal, DIM.UPPER, ARM_REACH, pole);
      this.setLimb(sh, J['elbow' + side], null, d1.toArray(), d2.toArray(), null, false);
      return;
    }
    if (phase === 'ik') return;
    let up = A.up;
    let fore = A.fore || A.up;
    if (armSpace === 'root') {
      const q = J.spine.quaternion.clone().multiply(J.chest.quaternion).invert();
      up = v3(up).applyQuaternion(q).toArray();
      fore = v3(fore).applyQuaternion(q).toArray();
    }
    this.setLimb(sh, J['elbow' + side], null, up, fore, null, false);
  }

  applyPose(pose) {
    const P = normalizePose(pose);
    const J = this.J;
    J.root.position.set(P.root.pos[0], P.root.pos[1], P.root.pos[2]);
    J.root.rotation.set(P.root.rot[0] * DEG, P.root.rot[1] * DEG, P.root.rot[2] * DEG);
    J.hips.position.set(P.hips[0], DIM.HIP_H + P.hips[1], P.hips[2]);
    J.spine.rotation.set(P.spine[0] * DEG, P.spine[1] * DEG, P.spine[2] * DEG);
    J.chest.rotation.set(P.chest[0] * DEG, P.chest[1] * DEG, P.chest[2] * DEG);
    J.neck.rotation.set(P.neck[0] * DEG, P.neck[1] * DEG, P.neck[2] * DEG);

    // 1) piernas y brazos explícitos
    for (const [s, L] of [['L', P.legL], ['R', P.legR]]) {
      if (L.ik && this.legIK) continue;
      if (L.thigh) this.setLimb(J['hip' + s], J['knee' + s], J['ankle' + s], L.thigh, L.shin || L.thigh, L.foot, true, L.ankle);
    }
    this.applyArm('L', P.armL, P.armSpace, 'main');
    this.applyArm('R', P.armR, P.armSpace, 'main');
    J.root.position.add(this.onceOffset);
    J.root.updateMatrixWorld(true);

    // 2) bloqueo (pies/manos/rodillas…)
    if (this.lock && this.lockTarget && this.lock.mode !== 'once') {
      const d = new THREE.Vector3();
      if (this.lock.mode === 'lowest') {
        d.set(0, this.lock.y - this.lowestY(this.lock.joint), 0);
      } else {
        const cur = this.jointWorld(this.lock.joint, new THREE.Vector3());
        d.copy(this.lockTarget).sub(cur);
        if (this.lock.mode === 'y') d.set(0, d.y, 0);
      }
      J.root.position.add(d);
      J.root.updateMatrixWorld(true);
    }

    // 3) IK (piernas y brazos)
    if (this.legIK) {
      for (const [s, L] of [['L', P.legL], ['R', P.legR]]) {
        if (L.ik) {
          this.applyLegIK(s, L);
          J.root.updateMatrixWorld(true);
        }
      }
    }
    for (const [s, A] of [['L', P.armL], ['R', P.armR]]) {
      if (A.ik) {
        this.applyArm(s, A, P.armSpace, 'ik');
        J.root.updateMatrixWorld(true);
      }
    }
  }

  lowestY(joint) {
    const names = joint === 'foot' ? ['heelL', 'heelR', 'toeL', 'toeR'] : [joint + 'L', joint + 'R'];
    let m = Infinity;
    for (const n of names) m = Math.min(m, this.jointWorld(n, _v2).y);
    return m;
  }

  // Calcula objetivos de bloqueo y anclas a partir de la pose A.
  initFrom(pattern, poseA) {
    this.lock = pattern.lock ? (typeof pattern.lock === 'string' ? presetLock(pattern.lock) : { ...pattern.lock }) : null;
    this.onceOffset.set(0, 0, 0);
    this.lockTarget = null;
    this.legIK = false;
    this.applyPose(poseA);
    if (this.lock) {
      if (this.lock.mode === 'lowest') {
        this.lockTarget = new THREE.Vector3();
      } else {
        const cur = this.jointWorld(this.lock.joint, new THREE.Vector3());
        const tgt = cur.clone();
        if (typeof this.lock.y === 'number') tgt.y = this.lock.y;
        if (this.lock.at) tgt.set(this.lock.at[0], this.lock.at[1], this.lock.at[2]);
        this.lockTarget = tgt;
        if (this.lock.mode === 'once') this.onceOffset.copy(tgt).sub(cur);
      }
    }
    this.applyPose(poseA);
    this.anchorsA = {};
    const names = [...Object.keys(this.J), 'ankles', 'toes', 'hands', 'knees', 'elbows', 'shoulders', 'heels', 'hipsJ'];
    for (const n of names) {
      this.anchorsA[n] = { pos: this.jointWorld(n, new THREE.Vector3()), quat: this.jointQuat(n, new THREE.Quaternion()) };
    }
    this.legIK = true;
  }
}

function presetLock(name) {
  switch (name) {
    case 'feet':
      return { joint: 'ankles', y: DIM.ANKLE_H };
    case 'toes':
      return { joint: 'toes', y: 0.0 };
    case 'hands':
      return { joint: 'hands' };
    case 'ground':
      return { joint: 'ankles', y: DIM.ANKLE_H, mode: 'once' };
    case 'groundToes':
      return { joint: 'toes', y: 0.0, mode: 'once' };
    case 'walk':
      return { joint: 'foot', y: 0.0, mode: 'lowest' };
    default:
      return null;
  }
}

// ───────────────────────── props ─────────────────────────
function propMat(mats, color) {
  return mats.props[color] || mats.props.frame;
}

function placeBetween(m, a, b, radius) {
  const d = _v.copy(b).sub(a);
  const len = Math.max(d.length(), 1e-4);
  m.position.copy(a).addScaledVector(d, 0.5);
  m.scale.set(radius, len, radius);
  m.quaternion.setFromUnitVectors(Y, d.normalize());
}

export function buildProps(rig, pattern, mats, G) {
  const group = new THREE.Group();
  const dynamic = [];
  const R = rig;

  const isDynamicSpec = (spec) => spec && !Array.isArray(spec) && spec.rel && spec.rel !== 'world' && !spec.rel.startsWith('A:');

  const orientQuat = (p, outQ) => {
    outQ.setFromEuler(_e.set((p.rot?.[0] || 0) * DEG, (p.rot?.[1] || 0) * DEG, (p.rot?.[2] || 0) * DEG));
    let of = p.orient;
    if (!of && p.rotFrame === 'local' && p.at?.rel) {
      const fj = p.at.frameJoint;
      of = fj ? (p.at.rel.startsWith('A:') ? 'A:' + fj : fj) : p.at.rel;
    }
    if (of) {
      let q;
      if (of.startsWith('A:')) q = R.anchorsA[of.slice(2)]?.quat;
      else q = R.jointQuat(of, new THREE.Quaternion());
      if (q) outQ.premultiply(q);
    }
    return outQ;
  };

  const handWorld = (h) => R.jointWorld(h === 'L' ? 'handL' : h === 'R' ? 'handR' : 'hands', new THREE.Vector3());
  const rootQuat = () => R.J.root.getWorldQuaternion(new THREE.Quaternion());

  const axisWorld = (axis, hand) => {
    if (Array.isArray(axis)) return v3(axis).applyQuaternion(rootQuat()).normalize();
    if (axis === 'y') return Y.clone().applyQuaternion(rootQuat());
    if (axis === 'z') return Z.clone().applyQuaternion(rootQuat());
    if (axis === 'hammer' || axis === 'fore') {
      const el = R.jointWorld(hand === 'R' ? 'elbowR' : 'elbowL', new THREE.Vector3());
      const hw = handWorld(hand === 'R' ? 'R' : 'L');
      const f = hw.sub(el).normalize();
      const xr = X.clone().applyQuaternion(rootQuat());
      const c = new THREE.Vector3().crossVectors(f, xr);
      if (c.lengthSq() < 1e-4) return Z.clone();
      return c.normalize();
    }
    return X.clone().applyQuaternion(rootQuat());
  };

  for (const p of pattern.props || []) {
    const kind = p.kind;
    if (kind === 'box' || kind === 'rbox' || kind === 'cyl' || kind === 'pad') {
      const geo =
        kind === 'cyl'
          ? G.cyl(p.radius || 0.05, p.height || 0.1, p.seg || 24)
          : kind === 'box'
            ? G.box(...p.size)
            : G.rbox(...p.size, p.round ?? 0.03);
      const m = mesh(geo, propMat(mats, p.color || (kind === 'pad' || kind === 'rbox' ? 'pad' : 'frame')));
      m.receiveShadow = true;
      group.add(m);
      const upd = () => {
        R.resolvePoint(p.at, m.position);
        orientQuat(p, m.quaternion);
      };
      upd();
      if (isDynamicSpec(p.at)) dynamic.push(upd);
    } else if (kind === 'post') {
      // columna vertical desde un punto hasta el suelo
      const m = mesh(G.box(1, 1, 1), propMat(mats, p.color || 'frame'));
      if (typeof p.topY === 'number' || p.noFit) m.userData.noFit = true;
      group.add(m);
      const upd = () => {
        const top = R.resolvePoint(p.at, new THREE.Vector3());
        if (typeof p.topY === 'number') top.y = p.topY;
        const h = Math.max(top.y - (p.bottom || 0), 0.01);
        m.position.set(top.x, (p.bottom || 0) + h / 2, top.z);
        m.scale.set(p.size?.[0] || 0.06, h, p.size?.[1] || 0.06);
      };
      upd();
      if (isDynamicSpec(p.at)) dynamic.push(upd);
    } else if (kind === 'dumbbell') {
      const hands = p.hand === 'both' || !p.hand ? ['L', 'R'] : [p.hand];
      for (const h of hands) {
        const db = new THREE.Group();
        const handle = mesh(G.cyl(0.015, 0.15), propMat(mats, 'metal'), { rot: [0, 0, 90] });
        db.add(handle);
        for (const s of [1, -1]) db.add(mesh(G.cyl(p.size || 0.052, 0.07, 8), propMat(mats, 'plate'), { pos: [s * 0.105, 0, 0], rot: [0, 0, 90] }));
        group.add(db);
        const upd = () => {
          db.position.copy(handWorld(h));
          db.quaternion.setFromUnitVectors(X, axisWorld(p.axis || 'x', h));
        };
        upd();
        dynamic.push(upd);
      }
    } else if (kind === 'bar') {
      const type = p.type || 'barbell';
      const len = p.len || (type === 'barbell' ? 1.75 : type === 'ez' ? 1.2 : type === 'cable' ? 1.15 : 0.28);
      const bar = new THREE.Group();
      const metal = propMat(mats, 'metal');
      bar.add(mesh(G.cyl(type === 'cable' ? 0.016 : 0.014, len), metal, { rot: [0, 0, 90] }));
      if (type === 'barbell' || type === 'ez') {
        const pr = p.plate ?? (type === 'barbell' ? 0.2 : 0.13);
        const at = len / 2 - (type === 'barbell' ? 0.2 : 0.12);
        for (const s of [1, -1]) {
          bar.add(mesh(G.cyl(pr, 0.045, 28), propMat(mats, 'plate'), { pos: [s * at, 0, 0], rot: [0, 0, 90] }));
          bar.add(mesh(G.cyl(0.03, 0.03), metal, { pos: [s * (at - 0.04), 0, 0], rot: [0, 0, 90] }));
        }
      }
      if (type === 'cable') {
        for (const s of [1, -1]) bar.add(mesh(G.cyl(0.02, 0.14), propMat(mats, 'grip'), { pos: [s * (len / 2 - 0.08), 0, 0], rot: [0, 0, 90] }));
      }
      if (type === 'vhandle') {
        for (const s of [1, -1]) bar.add(mesh(G.cyl(0.02, 0.1), propMat(mats, 'grip'), { pos: [s * 0.1, 0, 0], rot: [0, 0, 90] }));
      }
      group.add(bar);
      const upd = () => {
        const a = handWorld('L');
        const b = handWorld('R');
        bar.position.copy(a).add(b).multiplyScalar(0.5);
        if (p.offset) bar.position.add(v3(p.offset));
        const d = a.sub(b);
        if (d.lengthSq() > 1e-4) bar.quaternion.setFromUnitVectors(X, d.normalize());
      };
      upd();
      dynamic.push(upd);
      bar.userData.isBar = true;
    } else if (kind === 'rope') {
      const ropeMat = propMat(mats, 'grip');
      const segs = [mesh(G.unitCyl(), ropeMat), mesh(G.unitCyl(), ropeMat)];
      segs.forEach((s) => group.add(s));
      const cable = p.anchor ? mesh(G.unitCyl(), propMat(mats, 'cable')) : null;
      if (cable) group.add(cable);
      const upd = () => {
        const a = handWorld('L');
        const b = handWorld('R');
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const anchor = p.anchor ? R.resolvePoint(p.anchor, new THREE.Vector3()) : mid.clone().add(new THREE.Vector3(0, 0.2, 0));
        const knot = mid.clone().add(anchor.clone().sub(mid).normalize().multiplyScalar(p.knot ?? 0.14));
        placeBetween(segs[0], knot, a, 0.011);
        placeBetween(segs[1], knot, b, 0.011);
        if (cable) placeBetween(cable, anchor, knot, 0.005);
      };
      upd();
      dynamic.push(upd);
    } else if (kind === 'cable' || kind === 'rod') {
      const m = mesh(G.unitCyl(), propMat(mats, kind === 'rod' ? p.color || 'frame' : 'cable'));
      group.add(m);
      const r = kind === 'rod' ? p.radius || 0.022 : p.radius || 0.005;
      const upd = () => {
        const a = R.resolvePoint(p.from, new THREE.Vector3());
        let b;
        if (p.to === 'handL' || p.to === 'handR' || p.to === 'hands') b = handWorld(p.to === 'handL' ? 'L' : p.to === 'handR' ? 'R' : 'both');
        else b = R.resolvePoint(p.to, new THREE.Vector3());
        if (p.toOffset) b.add(v3(p.toOffset));
        placeBetween(m, a, b, r);
      };
      upd();
      if (isDynamicSpec(p.from) || typeof p.to === 'string' || isDynamicSpec(p.to)) dynamic.push(upd);
    } else if (kind === 'handle') {
      const hands = p.hand === 'both' || !p.hand ? ['L', 'R'] : [p.hand];
      for (const h of hands) {
        const m = new THREE.Group();
        m.add(mesh(G.cyl(0.019, 0.13), propMat(mats, 'grip'), { rot: [0, 0, 90] }));
        group.add(m);
        const upd = () => {
          m.position.copy(handWorld(h));
          m.quaternion.setFromUnitVectors(X, axisWorld(p.axis || 'y', h));
        };
        upd();
        dynamic.push(upd);
      }
    } else if (kind === 'tower') {
      // columna de polea: anclaje = punto de la polea
      const anchor = R.resolvePoint(p.at, new THREE.Vector3());
      const back = p.back ? v3(p.back) : new THREE.Vector3(0, 0, -0.12);
      const h = p.height || 2.25;
      const col = mesh(G.box(0.14, h, 0.14), propMat(mats, 'frame'));
      col.userData.noFit = true;
      col.position.set(anchor.x + back.x, h / 2, anchor.z + back.z);
      col.receiveShadow = true;
      group.add(col);
      const wheel = mesh(G.cyl(0.045, 0.03, 20), propMat(mats, 'metal'), { rot: [0, 0, 90] });
      wheel.position.copy(anchor);
      group.add(wheel);
      const arm = mesh(G.unitCyl(), propMat(mats, 'frame'));
      placeBetween(arm, new THREE.Vector3(anchor.x + back.x, anchor.y, anchor.z + back.z), anchor, 0.022);
      group.add(arm);
    } else if (kind === 'wheel') {
      const w = new THREE.Group();
      w.add(mesh(G.cyl(0.09, 0.06, 28), propMat(mats, 'plate'), { rot: [0, 0, 90] }));
      w.add(mesh(G.cyl(0.014, 0.34), propMat(mats, 'metal'), { rot: [0, 0, 90] }));
      group.add(w);
      const upd = () => {
        w.position.copy(handWorld('both'));
        w.quaternion.copy(rootQuat());
      };
      upd();
      dynamic.push(upd);
    } else if (kind === 'line') {
      // tubo estático entre dos puntos
      const m = mesh(G.unitCyl(), propMat(mats, p.color || 'frame'));
      group.add(m);
      const upd = () => placeBetween(m, R.resolvePoint(p.from, new THREE.Vector3()), R.resolvePoint(p.to, new THREE.Vector3()), p.radius || 0.02);
      upd();
      if (isDynamicSpec(p.from) || isDynamicSpec(p.to)) dynamic.push(upd);
    }
  }
  return {
    group,
    update() {
      for (const f of dynamic) f();
    },
  };
}

// ───────────────────────── escena completa ─────────────────────────
export function createMaterials() {
  const std = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.72, metalness: 0.06, ...extra });
  return {
    body: std(COLORS.body, { roughness: 0.62 }),
    dark: std(COLORS.bodyDark, { roughness: 0.4 }),
    primary: std(COLORS.primary, { emissive: COLORS.primary, emissiveIntensity: 0.35, roughness: 0.45 }),
    secondary: std(COLORS.secondary, { emissive: COLORS.secondary, emissiveIntensity: 0.15, roughness: 0.5 }),
    props: {
      frame: std(COLORS.frame, { roughness: 0.55, metalness: 0.35 }),
      pad: std(COLORS.pad, { roughness: 0.85 }),
      metal: std(COLORS.metal, { roughness: 0.28, metalness: 0.85 }),
      plate: std(COLORS.plate, { roughness: 0.6, metalness: 0.3 }),
      grip: std(COLORS.grip, { roughness: 0.9 }),
      cable: std(COLORS.cable, { roughness: 0.4, metalness: 0.2 }),
      accent: std(COLORS.accent, { emissive: COLORS.accent, emissiveIntensity: 0.2 }),
      belt: std(COLORS.belt, { roughness: 0.95 }),
    },
  };
}

const ease = (t) => 0.5 - 0.5 * Math.cos(Math.PI * THREE.MathUtils.clamp(t, 0, 1));

// Devuelve { p (0..1), phase: 0..3, glow } para un tiempo dado (segundos) y tempo.
export function tempoState(time, tempo) {
  const [up, top, down, bottom] = tempo;
  const T = up + top + down + bottom;
  let t = ((time % T) + T) % T;
  if (t < up) return { p: ease(t / up), phase: 0, glow: 0.45 + 0.55 * (t / up) };
  t -= up;
  if (t < top) return { p: 1, phase: 1, glow: 1 };
  t -= top;
  if (t < down) return { p: 1 - ease(t / down), phase: 2, glow: 0.85 - 0.4 * (t / down) };
  return { p: 0, phase: 3, glow: 0.4 };
}

export function createExerciseScene(pattern, { primary = [], secondary = [] } = {}) {
  const G = makeGeoCache();
  const mats = createMaterials();
  const rig = new Rig(mats, G);
  const group = new THREE.Group();
  group.add(rig.root);

  // asignación de materiales de músculos
  const prim = new Set(primary);
  const sec = new Set(secondary.filter((m) => !prim.has(m)));
  for (const [key, list] of Object.entries(rig.muscles)) {
    for (const m of list) m.material = prim.has(key) ? mats.primary : sec.has(key) ? mats.secondary : mats.body;
  }

  const poseAt = (x) => (pattern.cycle ? pattern.cycle(x) : lerpPose(pattern.a, pattern.b, x));
  rig.initFrom(pattern, poseAt(0));
  const props = buildProps(rig, pattern, mats, G);
  group.add(props.group);

  const setProgress = (x) => {
    rig.applyPose(poseAt(x));
    props.update();
  };

  // límites (para encuadre de cámara)
  const bounds = new THREE.Box3();
  const samples = pattern.cycle ? [0, 0.17, 0.33, 0.5, 0.67, 0.83] : [0, 0.25, 0.5, 0.75, 1];
  for (const s of samples) {
    setProgress(s);
    group.updateMatrixWorld(true);
    bounds.expandByObject(rig.root);
    for (const ch of props.group.children) if (!ch.userData.noFit) bounds.expandByObject(ch);
  }
  setProgress(0);

  return {
    group,
    rig,
    mats,
    bounds,
    setProgress,
    setGlow(g) {
      mats.primary.emissiveIntensity = 0.18 + 0.75 * g;
      mats.secondary.emissiveIntensity = 0.08 + 0.3 * g;
    },
    dispose() {
      G.dispose();
      const all = [mats.body, mats.dark, mats.primary, mats.secondary, ...Object.values(mats.props)];
      all.forEach((m) => m.dispose());
    },
  };
}
