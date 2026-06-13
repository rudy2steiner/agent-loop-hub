export const NAV_LINKS = [
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
