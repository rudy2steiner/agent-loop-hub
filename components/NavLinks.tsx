"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/nav-links";

function useNavHash() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [pathname]);

  return { pathname, hash };
}

export default function NavLinks() {
  const { pathname, hash } = useNavHash();

  return (
    <div className="nav-links">
      {NAV_LINKS.map(({ href, label, isActive }) => {
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

export function MobileMenu() {
  const { pathname, hash } = useNavHash();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="mobile-menu">
      <button
        type="button"
        className={`menu-toggle${open ? " open" : ""}`}
        aria-expanded={open}
        aria-controls="nav-drawer"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="menu-bar" aria-hidden="true" />
        <span className="menu-bar" aria-hidden="true" />
        <span className="menu-bar" aria-hidden="true" />
      </button>
      <div
        id="nav-drawer"
        className={`nav-drawer${open ? " open" : ""}`}
        aria-hidden={!open}
      >
        <nav className="nav-drawer-links" aria-label="Mobile">
          {NAV_LINKS.map(({ href, label, isActive }) => {
            const active = isActive(pathname, hash);
            return (
              <Link
                key={href}
                href={href}
                className={active ? "active" : undefined}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="nav-drawer-actions">
          <a
            className="btn"
            href="https://github.com/rudy2steiner/awesome-agent-loops"
            target="_blank"
            rel="noopener"
            onClick={() => setOpen(false)}
          >
            ★ Awesome list
          </a>
          <Link className="btn primary" href="/loops" onClick={() => setOpen(false)}>
            Browse loops
          </Link>
        </div>
      </div>
      {open && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}
