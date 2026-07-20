import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loops, getLoop } from "@/lib/loops";
import CopyButton from "@/components/CopyButton";

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

function markdownOf(loop: NonNullable<ReturnType<typeof getLoop>>) {
  const lines = [
    `# ${loop.name}`,
    "",
    loop.goal,
    "",
    "## Seven-field spec",
    `- Goal: ${loop.goal}`,
    `- Trigger: ${loop.trigger}`,
    `- Discover: ${loop.discover}`,
    `- Act: ${loop.act}`,
    `- Verify: ${loop.verify}`,
    `- Persist: ${loop.persist}`,
    `- Exit: ${loop.exit}`,
    "",
    "## Runtime",
    `- Runtime: ${loop.runtime}`,
    `- Tokens per cycle: ${loop.tokensPerCycle}`,
    "",
    "## Runnable code",
    "```",
    loop.code,
    "```",
  ];

  if (loop.whenToUse) lines.push("", "## When to use", loop.whenToUse);
  if (loop.requiredTools?.length) lines.push("", "## Required tools", ...loop.requiredTools.map((item) => `- ${item}`));
  if (loop.humanGates?.length) lines.push("", "## Human gates", ...loop.humanGates.map((item) => `- ${item}`));
  if (loop.failureModes?.length) lines.push("", "## Failure modes", ...loop.failureModes.map((item) => `- ${item}`));
  if (loop.minimumVerifier) lines.push("", "## Minimum verifier", loop.minimumVerifier);

  return lines.join("\n");
}

export default async function LoopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loop = getLoop(slug);
  if (!loop) notFound();
  const rows = rowsOf(loop);
  const markdown = markdownOf(loop);

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

        {(loop.whenToUse || loop.requiredTools?.length || loop.humanGates?.length || loop.failureModes?.length || loop.minimumVerifier) && (
          <div className="enhanced-spec">
            {loop.whenToUse && (
              <div>
                <h2>When to use</h2>
                <p>{loop.whenToUse}</p>
              </div>
            )}
            {loop.minimumVerifier && (
              <div>
                <h2>Minimum verifier</h2>
                <p>{loop.minimumVerifier}</p>
              </div>
            )}
            {loop.requiredTools?.length ? (
              <div>
                <h2>Required tools</h2>
                <ul>{loop.requiredTools.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ) : null}
            {loop.humanGates?.length ? (
              <div>
                <h2>Human gates</h2>
                <ul>{loop.humanGates.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ) : null}
            {loop.failureModes?.length ? (
              <div>
                <h2>Failure modes</h2>
                <ul>{loop.failureModes.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ) : null}
          </div>
        )}

        <div className="code-head">
          <h2>Runnable code</h2>
          <div className="code-actions">
            <CopyButton text={loop.code} />
            <a
              className="mini-action"
              href={`data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`}
              download={`${loop.slug}.md`}
            >
              Download .md
            </a>
          </div>
        </div>
        <pre className="codeblock">{loop.code}</pre>

        <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
          Adapted it for your stack? <a className="sec-link" href="https://github.com/rudy2steiner/awesome-agent-loops" target="_blank" rel="noopener">Submit your variant →</a>
        </p>
      </div>
    </main>
  );
}
