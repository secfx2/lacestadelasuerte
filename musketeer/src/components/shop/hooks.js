"use client";
import { useEffect, useRef, useState } from "react";

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let lockCount = 0;

/** Locks page scroll while `active` (ref-counted so stacked overlays behave). */
export function useLockBody(active) {
  useEffect(() => {
    if (!active) return;
    lockCount += 1;
    document.documentElement.classList.add("mk-locked");
    return () => {
      lockCount -= 1;
      if (lockCount <= 0) {
        lockCount = 0;
        document.documentElement.classList.remove("mk-locked");
      }
    };
  }, [active]);
}

/**
 * Traps Tab focus inside `ref` while active, closes on Escape,
 * focuses the first focusable (or `initialFocus`) and restores focus on close.
 */
export function useDialog(ref, active, onClose, initialFocus) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!active) return;
    const node = ref.current;
    const previous = document.activeElement;
    const t = setTimeout(() => {
      const target = initialFocus?.current || node?.querySelector("[data-autofocus]") || node?.querySelector(FOCUSABLE);
      target?.focus({ preventScroll: true });
    }, 30);

    function onKey(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        closeRef.current?.();
        return;
      }
      if (e.key !== "Tab" || !node) return;
      const items = [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      if (previous && typeof previous.focus === "function") previous.focus({ preventScroll: true });
    };
  }, [active, ref, initialFocus]);
}

export function useMediaQuery(query, initial = false) {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/** Keeps an element mounted until its exit transition ends. */
export function usePresence(open, ms = 450) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      return () => cancelAnimationFrame(r);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), ms);
    return () => clearTimeout(t);
  }, [open, ms]);
  return { mounted, visible };
}
