import type { MetadataRoute } from "next";
import { loops } from "@/lib/loops";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://agentloophub.com";
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/loops`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/what-is-loop-engineering`, changeFrequency: "weekly", priority: 0.8 },
    ...loops.map((l) => ({
      url: `${base}/loops/${l.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
