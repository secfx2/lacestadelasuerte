"use client";
import { usePathname } from "next/navigation";

/** Renders `alt` instead of `children` on the given routes (e.g. a minimal footer on /checkout). */
export default function RouteGate({ routes, alt = null, children }) {
  const pathname = usePathname();
  return routes.includes(pathname) ? alt : children;
}
