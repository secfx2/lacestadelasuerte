"use client";
import { usePathname } from "next/navigation";
import Newsletter from "./Newsletter";

/** The home page has its own large newsletter block — avoid showing two. */
export default function FooterNewsletter({ title }) {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/checkout") return null;
  return (
    <div>
      {title}
      <Newsletter variant="footer" />
    </div>
  );
}
