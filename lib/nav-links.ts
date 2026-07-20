export const NAV_LINKS = [
  {
    href: "/loops",
    label: "Loops",
    isActive: (path: string) => path === "/loops" || path.startsWith("/loops/"),
  },
  {
    href: "/agent-loop-template",
    label: "Template",
    isActive: (path: string) => path === "/agent-loop-template",
  },
  {
    href: "/agent-loop-generator",
    label: "Generator",
    isActive: (path: string) => path === "/agent-loop-generator" || path === "/loop-readiness-checker",
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
