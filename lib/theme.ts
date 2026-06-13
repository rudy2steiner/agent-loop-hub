export type Theme = "light" | "dark";

export const THEME_COOKIE = "theme";

export function defaultThemeForPath(pathname: string): Theme {
  if (pathname === "/" || pathname === "/loops") return "dark";
  if (pathname === "/what-is-loop-engineering") return "light";
  if (/^\/loops\/[^/]+$/.test(pathname)) return "light";
  return "dark";
}

export function readThemeCookie(): Theme | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )theme=(light|dark)(?:;|$)/);
  return match ? (match[1] as Theme) : null;
}

export function writeThemeCookie(theme: Theme) {
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; SameSite=Lax`;
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function readThemeFromDom(): Theme {
  const value = document.documentElement.getAttribute("data-theme");
  return value === "dark" ? "dark" : "light";
}

export function resolveTheme(pathname: string, cookie: Theme | null): Theme {
  if (cookie === "light" || cookie === "dark") return cookie;
  return defaultThemeForPath(pathname);
}

/** One-time migration from the old localStorage key. */
export function migrateLegacyThemeStorage(): Theme | null {
  const existing = readThemeCookie();
  if (existing) return existing;
  try {
    const legacy = localStorage.getItem("theme");
    if (legacy === "light" || legacy === "dark") {
      writeThemeCookie(legacy);
      localStorage.removeItem("theme");
      return legacy;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function persistThemeChoice(theme: Theme) {
  applyTheme(theme);
  writeThemeCookie(theme);
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}

export function syncThemeForPath(pathname: string) {
  migrateLegacyThemeStorage();
  const theme = resolveTheme(pathname, readThemeCookie());
  applyTheme(theme);
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
  return theme;
}

export function parseThemeCookie(value: string | undefined): Theme | null {
  return value === "light" || value === "dark" ? value : null;
}

/** Inline in <head> before paint — cookie (incl. legacy localStorage) wins, else per-route default. */
export const themeInitScript = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(light|dark)(?:;|$)/);var s=m?m[1]:null;if(!s){try{var ls=localStorage.getItem('theme');if(ls==='light'||ls==='dark'){s=ls;document.cookie='theme='+ls+'; path=/; max-age=31536000; SameSite=Lax';localStorage.removeItem('theme');}}catch(e){}}var p=location.pathname;var d=(p==='/'||p==='/loops')?'dark':(p==='/what-is-loop-engineering'||/^\\/loops\\/[^/]+$/.test(p))?'light':'dark';var t=(s==='light'||s==='dark')?s:d;document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;
