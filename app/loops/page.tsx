import type { Metadata } from "next";
import LoopGrid from "@/components/LoopGrid";

export const metadata: Metadata = {
  title: "Agent loop templates",
  description: "Browse copy-paste agent loop templates: coding, content/SEO, data and ops loops for Claude Code, Codex and OpenClaw, each with verify steps and token costs.",
  alternates: { canonical: "/loops" },
};

export default async function LoopsPage({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  return (
    <main>
      <section>
        <div className="wrap">
          <div className="sec-head">
            <div>
              <div className="eyebrow">Library</div>
              <h2>Agent loop templates</h2>
              <p>Each template is a seven-field spec plus runnable code. Filter by category.</p>
            </div>
          </div>
          <LoopGrid initial={cat ?? "all"} />
        </div>
      </section>
    </main>
  );
}
