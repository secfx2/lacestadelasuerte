"use client";
import { useEffect, useRef, useState } from "react";
import { store } from "@/lib/client";

/** useState guardado en localStorage (se restaura al volver a la pantalla). */
export function usePersisted(key, initial, { max } = {}) {
  const [v, setV] = useState(initial);
  const loaded = useRef(false);
  useEffect(() => {
    const s = store.get(key, undefined);
    if (s !== undefined && s !== null) setV(s);
    loaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (!loaded.current) return;
    store.set(key, Array.isArray(v) && max ? v.slice(0, max) : v);
  }, [key, v, max]);
  return [v, setV];
}
