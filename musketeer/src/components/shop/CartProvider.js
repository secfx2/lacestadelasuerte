"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getColor, FREE_SHIPPING_FROM } from "@/lib/shop";

const STORAGE_KEY = "musketeer.cart.v1";
const WISH_KEY = "musketeer.wishlist.v1";
const MAX_QTY = 10;

const CatalogContext = createContext([]);
const CartContext = createContext(null);
const WishContext = createContext(null);

const lineKey = (slug, color, size) => `${slug}__${color}__${size}`;

/**
 * Wraps the shop: exposes the slim catalog (server-provided, no internal fields)
 * and the cart (persisted in localStorage, synced across tabs).
 */
export function CartProvider({ catalog, children }) {
  const bySlug = useMemo(() => new Map(catalog.map((p) => [p.slug, p])), [catalog]);
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);
  const [wish, setWish] = useState([]);

  const sanitize = useCallback(
    (raw) => {
      if (!Array.isArray(raw)) return [];
      const seen = new Set();
      const out = [];
      for (const i of raw) {
        const product = i && bySlug.get(i.slug);
        if (!product) continue;
        const color = getColor(product, i.color).slug;
        const size = product.sizes.includes(i.size) ? i.size : product.sizes[0];
        const key = lineKey(product.slug, color, size);
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ key, slug: product.slug, color, size, qty: Math.max(1, Math.min(MAX_QTY, Number(i.qty) || 1)) });
      }
      return out;
    },
    [bySlug]
  );

  useEffect(() => {
    try {
      setItems(sanitize(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]")));
    } catch {
      /* storage unavailable: in-memory cart */
    }
    try {
      const w = JSON.parse(window.localStorage.getItem(WISH_KEY) || "[]");
      if (Array.isArray(w)) setWish(w.filter((s) => bySlug.has(s)));
    } catch {}
    setReady(true);
    function onStorage(e) {
      try {
        if (e.key === STORAGE_KEY) setItems(sanitize(JSON.parse(e.newValue || "[]")));
        if (e.key === WISH_KEY) setWish((JSON.parse(e.newValue || "[]") || []).filter((s) => bySlug.has(s)));
      } catch {}
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [sanitize, bySlug]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map(({ slug, color, size, qty }) => ({ slug, color, size, qty }))));
    } catch {}
  }, [items, ready]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(WISH_KEY, JSON.stringify(wish));
    } catch {}
  }, [wish, ready]);

  const toggleWish = useCallback((slug) => setWish((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev])), []);
  const wishValue = useMemo(
    () => ({ slugs: wish, count: wish.length, ready, has: (slug) => wish.includes(slug), toggle: toggleWish }),
    [wish, ready, toggleWish]
  );

  const add = useCallback(
    ({ slug, color, size, qty = 1 }, { open = true } = {}) => {
      const product = bySlug.get(slug);
      if (!product) return;
      const c = getColor(product, color).slug;
      const key = lineKey(slug, c, size);
      setItems((prev) => {
        const found = prev.find((i) => i.key === key);
        if (found) return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty) } : i));
        return [{ key, slug, color: c, size, qty }, ...prev];
      });
      setLastAdded({ key, at: Date.now() });
      if (open) setIsOpen(true);
    },
    [bySlug]
  );

  const setQty = useCallback((key, qty) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty: Math.min(MAX_QTY, qty) } : i))
    );
  }, []);
  const remove = useCallback((key) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => {
    const lines = items
      .map((i) => {
        const product = bySlug.get(i.slug);
        if (!product) return null;
        const color = getColor(product, i.color);
        return { ...i, product, colorObj: color, image: color.images[0], unit: product.price, total: product.price * i.qty };
      })
      .filter(Boolean);
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.total, 0);
    return {
      ready,
      lines,
      count,
      subtotal,
      remainingForFree: Math.max(0, FREE_SHIPPING_FROM - subtotal),
      freeShipping: subtotal >= FREE_SHIPPING_FROM,
      isOpen,
      lastAdded,
      maxQty: MAX_QTY,
      add,
      setQty,
      remove,
      clear,
      openCart,
      closeCart,
    };
  }, [items, bySlug, ready, isOpen, lastAdded, add, setQty, remove, clear, openCart, closeCart]);

  return (
    <CatalogContext.Provider value={catalog}>
      <CartContext.Provider value={value}>
        <WishContext.Provider value={wishValue}>{children}</WishContext.Provider>
      </CartContext.Provider>
    </CatalogContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

/** Wishlist ("Favoritos"): { slugs, count, has(slug), toggle(slug) } — persisted in localStorage. */
export function useWishlist() {
  const ctx = useContext(WishContext);
  if (!ctx) throw new Error("useWishlist must be used inside <CartProvider>");
  return ctx;
}

/** Slim catalog (array of client-safe products). */
export function useCatalog() {
  return useContext(CatalogContext);
}
