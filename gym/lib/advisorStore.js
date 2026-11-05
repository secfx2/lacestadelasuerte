'use client';

// API key y conversación del asesor: solo en este dispositivo (no van en la exportación de datos).
const KEY_K = 'aesthetic-coach-anthropic-key';
const CHAT_K = 'aesthetic-coach-chat-v1';
const MODEL_K = 'aesthetic-coach-advisor-model';

const safe = (fn, fb) => {
  try {
    return fn();
  } catch {
    return fb;
  }
};

export const getLocalKey = () => safe(() => localStorage.getItem(KEY_K) || '', '');
export const setLocalKey = (v) => safe(() => (v ? localStorage.setItem(KEY_K, v.trim()) : localStorage.removeItem(KEY_K)));
export const getChat = () => safe(() => JSON.parse(localStorage.getItem(CHAT_K) || '[]'), []);
export const saveChat = (msgs) => safe(() => localStorage.setItem(CHAT_K, JSON.stringify(msgs.slice(-60))));
export const getModelPref = () => safe(() => localStorage.getItem(MODEL_K) || 'opus', 'opus');
export const setModelPref = (m) => safe(() => localStorage.setItem(MODEL_K, m));
