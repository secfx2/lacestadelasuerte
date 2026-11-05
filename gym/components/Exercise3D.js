'use client';

// Visor 3D de un ejercicio (three.js cargado dinámicamente en cliente).
// Props: { anim, primary, secondary, className, style, autoPlay, freezeAt, showControls }
//  - freezeAt (0..1): congela la animación en ese progreso (QA / capturas).
import { useEffect, useRef, useState } from 'react';

const ui = {
  wrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '4 / 3',
    borderRadius: 18,
    overflow: 'hidden',
    background: 'radial-gradient(120% 90% at 50% 15%, #1d1f2a 0%, #15151c 55%, #111117 100%)',
    touchAction: 'none',
    userSelect: 'none',
  },
  host: { position: 'absolute', inset: 0 },
  pill: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 10px',
    borderRadius: 999,
    background: 'rgba(11,11,16,0.62)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#f2f2f5',
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: 0.2,
    lineHeight: 1,
    pointerEvents: 'none',
  },
  btnRow: { position: 'absolute', left: 10, bottom: 10, display: 'flex', gap: 6 },
  btn: {
    height: 32,
    minWidth: 32,
    padding: '0 10px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(11,11,16,0.62)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    color: '#f2f2f5',
    fontSize: 12,
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    cursor: 'pointer',
  },
  center: {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    color: 'rgba(242,242,245,0.55)',
    fontSize: 13,
    textAlign: 'center',
    padding: 16,
  },
};

const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3 1.8v8.4L10 6z" fill="currentColor" />
  </svg>
);
const PauseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <rect x="2.5" y="2" width="2.6" height="8" rx="0.8" fill="currentColor" />
    <rect x="6.9" y="2" width="2.6" height="8" rx="0.8" fill="currentColor" />
  </svg>
);
const ResetIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 8a5.5 5.5 0 1 0 1.7-4" />
    <path d="M2.5 2.5v3.2h3.2" />
  </svg>
);

function radialTexture(THREE, inner = 'rgba(200,255,61,0.10)', mid = 'rgba(94,231,255,0.04)') {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, inner);
  grd.addColorStop(0.55, mid);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Encaje de cámara: distancia mínima para que todo el bounding box quepa.
function fitCamera(THREE, camera, bounds, viewDir) {
  const center = bounds.getCenter(new THREE.Vector3());
  const d = new THREE.Vector3(viewDir[0], viewDir[1], viewDir[2]).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(up, d).normalize();
  const camUp = new THREE.Vector3().crossVectors(d, right).normalize();
  const vHalf = (camera.fov * Math.PI) / 360;
  const hHalf = Math.atan(Math.tan(vHalf) * camera.aspect);
  let dist = 0.5;
  const min = bounds.min;
  const max = bounds.max;
  for (let i = 0; i < 8; i++) {
    const p = new THREE.Vector3(i & 1 ? max.x : min.x, i & 2 ? max.y : min.y, i & 4 ? max.z : min.z).sub(center);
    const f = p.dot(d);
    const u = Math.abs(p.dot(camUp));
    const r = Math.abs(p.dot(right));
    dist = Math.max(dist, u / Math.tan(vHalf) + f, r / Math.tan(hHalf) + f);
  }
  dist *= 1.06;
  return { target: center, position: center.clone().addScaledVector(d, dist), dist };
}

export default function Exercise3D({ anim, primary = [], secondary = [], className, style, autoPlay = true, freezeAt, showControls = true }) {
  const hostRef = useRef(null);
  const apiRef = useRef(null);
  const frozen = typeof freezeAt === 'number' && !Number.isNaN(freezeAt);
  const [playing, setPlaying] = useState(autoPlay && !frozen);
  const [speed, setSpeed] = useState(1);
  const [label, setLabel] = useState('');
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  playingRef.current = playing;
  speedRef.current = speed;

  const primKey = primary.join(',');
  const secKey = secondary.join(',');

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    setStatus('loading');

    (async () => {
      try {
        const THREE = await import('three');
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
        const { createExerciseScene, tempoState } = await import('@/lib/anim/rig');
        const { getPattern } = await import('@/lib/anim/patterns');
        if (disposed || !hostRef.current) return;
        const host = hostRef.current;

        const pattern = getPattern(anim);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: frozen });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.display = 'block';
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        scene.add(new THREE.HemisphereLight(0xdfe6ff, 0x1a1a22, 1.15));
        const key = new THREE.DirectionalLight(0xffffff, 2.3);
        key.position.set(2.2, 4.2, 3.2);
        key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024);
        key.shadow.camera.left = -2.4;
        key.shadow.camera.right = 2.4;
        key.shadow.camera.top = 2.4;
        key.shadow.camera.bottom = -2.4;
        key.shadow.camera.near = 0.5;
        key.shadow.camera.far = 12;
        key.shadow.bias = -0.0006;
        key.shadow.radius = 4;
        scene.add(key);
        const rim = new THREE.DirectionalLight(0x5ee7ff, 0.9);
        rim.position.set(-3, 2.6, -3.2);
        scene.add(rim);
        const fill = new THREE.DirectionalLight(0xffffff, 0.45);
        fill.position.set(-2.5, 1.2, 2.5);
        scene.add(fill);

        const ex = createExerciseScene(pattern, { primary, secondary });
        scene.add(ex.group);

        // suelo: sombra + disco degradado + aro
        const b = ex.bounds;
        const c = b.getCenter(new THREE.Vector3());
        const size = b.getSize(new THREE.Vector3());
        const R = Math.max(0.9, Math.max(size.x, size.z) * 0.62);
        key.target.position.set(c.x, 0, c.z);
        scene.add(key.target);
        const shadowGeo = new THREE.PlaneGeometry(R * 3, R * 3);
        const shadowMat = new THREE.ShadowMaterial({ opacity: 0.38 });
        const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.set(c.x, 0.0005, c.z);
        shadowPlane.receiveShadow = true;
        scene.add(shadowPlane);
        const discTex = radialTexture(THREE);
        const discGeo = new THREE.CircleGeometry(R * 1.15, 64);
        const discMat = new THREE.MeshBasicMaterial({ map: discTex, transparent: true, depthWrite: false });
        const disc = new THREE.Mesh(discGeo, discMat);
        disc.rotation.x = -Math.PI / 2;
        disc.position.set(c.x, 0.001, c.z);
        scene.add(disc);
        const ringGeo = new THREE.RingGeometry(R * 1.12, R * 1.13, 128);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xc8ff3d, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(c.x, 0.002, c.z);
        scene.add(ring);

        const camera = new THREE.PerspectiveCamera(32, 4 / 3, 0.05, 60);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enablePan = false;
        controls.maxPolarAngle = Math.PI * 0.52;
        controls.rotateSpeed = 0.8;
        let userMoved = false;
        controls.addEventListener('start', () => {
          userMoved = true;
        });

        const doFit = () => {
          const fit = fitCamera(THREE, camera, b, pattern.view || [0.5, 0.3, 1]);
          camera.position.copy(fit.position);
          controls.target.copy(fit.target);
          controls.minDistance = fit.dist * 0.45;
          controls.maxDistance = fit.dist * 2.2;
          camera.near = Math.max(0.02, fit.dist / 100);
          camera.far = fit.dist * 20;
          camera.updateProjectionMatrix();
          controls.update();
        };

        let w = 0;
        let h = 0;
        const resize = () => {
          const r = host.getBoundingClientRect();
          const nw = Math.max(1, Math.round(r.width));
          const nh = Math.max(1, Math.round(r.height));
          if (nw === w && nh === h) return;
          w = nw;
          h = nh;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          if (!userMoved) doFit();
          needsRender = true;
        };

        let needsRender = true;
        let visible = true;
        let pageVisible = typeof document === 'undefined' ? true : document.visibilityState !== 'hidden';
        let raf = 0;
        let t = 0;
        let last = performance.now();
        let lastPhase = -1;

        const labels = pattern.labels || ['Sube', 'Aguanta', 'Baja', 'Abajo'];
        const applyAt = (time) => {
          if (pattern.cycle) {
            const u = (((time / (pattern.period || 1)) % 1) + 1) % 1;
            ex.setProgress(u);
            ex.setGlow(0.65 + 0.35 * Math.sin(u * Math.PI * 4));
            if (lastPhase !== 0) {
              lastPhase = 0;
              setLabel(labels[0]);
            }
          } else {
            const st = tempoState(time, pattern.tempo);
            ex.setProgress(st.p);
            ex.setGlow(st.glow);
            if (st.phase !== lastPhase) {
              lastPhase = st.phase;
              setLabel(labels[st.phase] || '');
            }
          }
        };

        if (frozen) {
          const f = Math.min(1, Math.max(0, freezeAt));
          ex.setProgress(f);
          ex.setGlow(0.4 + 0.6 * f);
          setLabel(pattern.cycle ? labels[0] : f > 0.5 ? labels[1] : labels[3]);
        } else {
          applyAt(0);
        }

        const loop = (now) => {
          raf = 0;
          if (!visible || !pageVisible) return;
          const dt = Math.min(0.1, (now - last) / 1000);
          last = now;
          if (!frozen && playingRef.current) {
            t += dt * speedRef.current;
            applyAt(t);
            needsRender = true;
          }
          if (controls.update()) needsRender = true;
          if (needsRender) {
            renderer.render(scene, camera);
            needsRender = false;
          }
          raf = requestAnimationFrame(loop);
        };
        const start = () => {
          if (raf || !visible || !pageVisible) return;
          last = performance.now();
          raf = requestAnimationFrame(loop);
        };
        controls.addEventListener('change', () => {
          needsRender = true;
          start();
        });

        const ro = new ResizeObserver(() => {
          resize();
          start();
        });
        ro.observe(host);
        const io = new IntersectionObserver(
          (entries) => {
            visible = entries.some((e) => e.isIntersecting);
            if (visible) {
              needsRender = true;
              start();
            }
          },
          { threshold: 0.01 }
        );
        io.observe(host);
        const onVis = () => {
          pageVisible = document.visibilityState !== 'hidden';
          if (pageVisible) {
            needsRender = true;
            start();
          }
        };
        document.addEventListener('visibilitychange', onVis);

        resize();
        doFit();
        renderer.render(scene, camera);
        start();

        apiRef.current = {
          reset: () => {
            userMoved = false;
            doFit();
            needsRender = true;
            start();
          },
          kick: () => {
            last = performance.now();
            start();
          },
        };
        setStatus('ready');

        cleanup = () => {
          if (raf) cancelAnimationFrame(raf);
          ro.disconnect();
          io.disconnect();
          document.removeEventListener('visibilitychange', onVis);
          controls.dispose();
          ex.dispose();
          [shadowGeo, discGeo, ringGeo].forEach((g) => g.dispose());
          [shadowMat, discMat, ringMat].forEach((m) => m.dispose());
          discTex.dispose();
          renderer.dispose();
          renderer.forceContextLoss?.();
          renderer.domElement.remove();
          apiRef.current = null;
        };
        if (disposed) cleanup();
      } catch (err) {
        console.error('[Exercise3D]', err);
        if (!disposed) setStatus('error');
      }
    })();

    return () => {
      disposed = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anim, primKey, secKey, frozen, freezeAt]);

  useEffect(() => {
    if (playing) apiRef.current?.kick();
  }, [playing]);

  return (
    <div className={className} style={{ ...ui.wrap, ...style }} data-anim={anim} data-status={status}>
      <div ref={hostRef} style={ui.host} />
      {status === 'loading' && <div style={ui.center}>Cargando 3D…</div>}
      {status === 'error' && <div style={ui.center}>Tu navegador no puede mostrar la animación 3D. Mira las fotos de abajo.</div>}
      {status === 'ready' && label && (
        <div style={{ ...ui.pill, left: 10, top: 10 }} aria-live="polite">
          <span style={{ width: 7, height: 7, borderRadius: 99, background: '#c8ff3d', boxShadow: '0 0 8px #c8ff3d' }} />
          {label}
        </div>
      )}
      {status === 'ready' && showControls && (
        <>
          <div style={ui.btnRow}>
            {!frozen && (
              <button type="button" style={ui.btn} onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pausar' : 'Reproducir'}>
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>
            )}
            {!frozen && (
              <button type="button" style={ui.btn} onClick={() => setSpeed((s) => (s === 1 ? 0.5 : 1))} aria-label="Cambiar velocidad">
                {speed === 1 ? '1×' : '0.5×'}
              </button>
            )}
            <button type="button" style={ui.btn} onClick={() => apiRef.current?.reset()} aria-label="Centrar cámara">
              <ResetIcon />
            </button>
          </div>
          <div style={{ ...ui.pill, right: 10, bottom: 14, fontWeight: 500, opacity: 0.75 }}>Arrastra para girar</div>
        </>
      )}
    </div>
  );
}
