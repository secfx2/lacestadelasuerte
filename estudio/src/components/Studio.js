"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { api, store } from "@/lib/client";
import { BRANDS, DEFAULT_BRAND } from "@/config/brands";
import styles from "./Studio.module.css";

const Ctx = createContext(null);

export function StudioProvider({ children }) {
  const [brand, setBrandState] = useState(DEFAULT_BRAND);
  const [usage, setUsage] = useState(null);
  const [toasts, setToasts] = useState([]);
  const tid = useRef(0);

  useEffect(() => {
    const b = store.get("brand", DEFAULT_BRAND);
    if (BRANDS[b]) setBrandState(b);
  }, []);

  const setBrand = useCallback((b) => {
    setBrandState(b);
    store.set("brand", b);
  }, []);

  const refreshUsage = useCallback(async () => {
    try {
      const d = await api("/api/usage?summary=1");
      setUsage(d.today);
    } catch {}
  }, []);

  useEffect(() => {
    refreshUsage();
    const on = () => refreshUsage();
    window.addEventListener("estudio:usage", on);
    const t = setInterval(refreshUsage, 60000);
    return () => {
      window.removeEventListener("estudio:usage", on);
      clearInterval(t);
    };
  }, [refreshUsage]);

  const toast = useCallback((text, tone = "info") => {
    const id = ++tid.current;
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  return (
    <Ctx.Provider value={{ brand, setBrand, usage, refreshUsage, toast }}>
      {children}
      <div className={styles.toasts} aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={styles.toast} data-tone={t.tone}>
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useStudio() {
  return useContext(Ctx);
}
