import type { Metadata } from "next";
import LoopReadinessChecker from "@/components/LoopReadinessChecker";

export const metadata: Metadata = {
  title: "Agent Loop Generator & Editor",
  description:
    "Edit an agent loop spec, check readiness, and generate a copyable command with Goal, Trigger, Discover, Act, Verify, Persist, and Exit rules.",
  alternates: { canonical: "/agent-loop-generator" },
};

export default function AgentLoopGeneratorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Agent Loop Generator",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    description:
      "An agent loop editor and command generator for creating runnable Goal, Trigger, Discover, Act, Verify, Persist, and Exit loop specs.",
    url: "https://www.agentloophub.com/agent-loop-generator",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LoopReadinessChecker />
    </>
  );
}
