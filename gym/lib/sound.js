'use client';

// Pitido + vibración para temporizadores (el audio se desbloquea con el primer toque del usuario)
let audioCtx = null;

export function unlockAudio() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
  } catch {
    /* sin audio */
  }
}

export function beep() {
  try {
    if (navigator.vibrate) navigator.vibrate([250, 120, 250]);
    if (!audioCtx) return;
    const t = audioCtx.currentTime;
    [0, 0.22, 0.44].forEach((dt, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = i === 2 ? 1320 : 880;
      g.gain.setValueAtTime(0.0001, t + dt);
      g.gain.exponentialRampToValueAtTime(0.35, t + dt + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dt + 0.18);
      o.connect(g).connect(audioCtx.destination);
      o.start(t + dt);
      o.stop(t + dt + 0.2);
    });
  } catch {
    /* sin audio */
  }
}
