"use client";

import { useEffect, useState } from "react";
import {
  persistThemeChoice,
  readThemeCookie,
  readThemeFromDom,
  type Theme,
} from "@/lib/theme";

function currentTheme(): Theme {
  return readThemeCookie() ?? readThemeFromDom();
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(currentTheme());
    const onThemeChange = (e: Event) => {
      const detail = (e as CustomEvent<Theme>).detail;
      setTheme(detail ?? currentTheme());
    };
    window.addEventListener("themechange", onThemeChange);
    return () => window.removeEventListener("themechange", onThemeChange);
  }, []);

  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    persistThemeChoice(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      data-current={theme}
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-pressed={theme === "dark"}
      title={`${theme === "dark" ? "Dark" : "Light"} mode · click for ${theme === "dark" ? "light" : "dark"}`}
    >
      <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}
