import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loops, getLoop } from "@/lib/loops";

export function generateStaticParams() {
  return loops.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const loop = getLoop(slug);
  if (!loop) return {};
  return {
    title: `${loop.name} template`,
    description: `${loop.goal} Trigger: ${loop.trigger}. Verify: ${loop.verify} ${loop.tokensPerCycle} tokens per cycle.`,
    alternates: { canonical: `/loops/${slug}` },
  };
}

const ROWS: { key: keyof ReturnType<typeof rowsOf>; label: string; hot?: boolean }[] = [
  { key: "goal", label: "F1 · Goal" },
  { key: "trigger", label: "F2 · Trigger" },
  { key: "discover", label: "F3 · Discover" },
  { key: "act", label: "F4 · Act" },
  { key: "verify", label: "F5 · Verify", hot: true },
  { key: "persist", label: "F6 · Persist" },
  { key: "exit", label: "F7 · Exit" },
];
function rowsOf(l: NonNullable<ReturnType<typeof getLoop>>) {
  const { goal, trigger, discover, act, verify, persist, exit } = l;
  return { goal, trigger, discover, act, verify, persist, exit };
}

export default async function LoopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loop = getLoop(slug);
  if (!loop) notFound();
  const rows = rowsOf(loop);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: loop.name,
    description: loop.goal,
    step: ROWS.map((r) => ({ "@type": "HowToStep", name: r.label, text: rows[r.key] })),
  };

  return (
    <main className="detail">
      <div className="wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <p className="crumb"><Link href="/loops">← All loops</Link> · {loop.category} · {loop.runtime}</p>
        <h1>{loop.name}</h1>
        <p className="lead">{loop.goal}</p>

        <div className="spec-table">
          {ROWS.map((r) => (
            <div key={r.key} className={`spec-row${r.hot ? " hot" : ""}`}>
              <div className="sk">{r.label}</div>
              <div className="sv">
                {r.key === "trigger" ? <span className="cron-badge">{rows[r.key]}</span> : rows[r.key]}
              </div>
            </div>
          ))}
          <div className="spec-row">
            <div className="sk">Cost</div>
            <div className="sv">{loop.tokensPerCycle} tokens per cycle (measured)</div>
          </div>
        </div>

        <h2 style={{ marginBottom: 14 }}>Runnable code</h2>
        <pre className="codeblock">{loop.code}</pre>

        <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
          Adapted it for your stack? <a className="sec-link" href="https://github.com/rudy2steiner/awesome-agent-loops" target="_blank" rel="noopener">Submit your variant →</a>
        </p>
      </div>
    </main>
  );
}
