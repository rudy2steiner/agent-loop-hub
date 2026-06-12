"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  {
    href: "/loops",
    label: "Loops",
    isActive: (path: string) => path === "/loops" || path.startsWith("/loops/"),
  },
  {
    href: "/#format",
    label: "Format spec",
    isActive: (path: string, hash: string) => path === "/" && hash === "#format",
  },
  {
    href: "/what-is-loop-engineering",
    label: "What is loop engineering?",
    isActive: (path: string) => path === "/what-is-loop-engineering",
  },
] as const;

export default function NavLinks() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  return (
    <div className="nav-links">
      {LINKS.map(({ href, label, isActive }) => {
        const active = isActive(pathname, hash);
        return (
          <Link
            key={href}
            href={href}
            className={active ? "active" : undefined}
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
