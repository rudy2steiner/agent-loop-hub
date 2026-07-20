import type { MetadataRoute } from "next";
import { loops } from "@/lib/loops";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.agentloophub.com";
  const staticPages = [
    { path: "/loops", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/what-is-loop-engineering", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/agent-loop-template", changeFrequency: "weekly" as const, priority: 0.75 },
    { path: "/agent-loop-examples", changeFrequency: "weekly" as const, priority: 0.75 },
    { path: "/claude-code-loops", changeFrequency: "weekly" as const, priority: 0.75 },
    { path: "/codex-loops", changeFrequency: "weekly" as const, priority: 0.75 },
    { path: "/loop-engineering-vs-prompt-engineering", changeFrequency: "monthly" as const, priority: 0.65 },
    { path: "/loop-engineering-vs-agentic-workflows", changeFrequency: "monthly" as const, priority: 0.65 },
    { path: "/agent-loop-generator", changeFrequency: "weekly" as const, priority: 0.82 },
  ];

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...staticPages.map((page) => ({
      url: `${base}${page.path}`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...loops.map((l) => ({
      url: `${base}/loops/${l.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
