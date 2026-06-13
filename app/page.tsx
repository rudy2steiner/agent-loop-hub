import Link from "next/link";
import LoopDial from "@/components/LoopDial";
import LoopGrid from "@/components/LoopGrid";
import FormatSpec from "@/components/FormatSpec";
import { loops } from "@/lib/loops";

const BASE = "https://www.agentloophub.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "agentLoopHub",
      url: BASE,
      description:
        "Copy-paste agent loop templates for Claude Code, Codex and OpenClaw — cron triggers, verify steps, exit conditions and real token costs per cycle.",
    },
    {
      "@type": "ItemList",
      name: "Agent loop templates",
      numberOfItems: loops.length,
      itemListElement: loops.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: l.name,
        url: `${BASE}/loops/${l.slug}`,
      })),
    },
  ],
};

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="hero">
        <div className="wrap">
          <div>
            <div className="eyebrow">Loop engineering · est. June 2026</div>
            <h1>
              <span className="strike">Stop prompting</span><br />your agents.<br />
              Design the <em>loops</em><br />that prompt them.
            </h1>
            <p className="sub">
              Copy-paste loop templates for AI coding agents — Claude Code, Codex and OpenClaw — each with a goal,
              a <code>cron</code> trigger, a verify step, an exit condition and a real token cost.
            </p>
            <div className="hero-ctas">
              <Link className="btn green" href="/loops">Browse loops →</Link>
              <Link className="btn" href="/what-is-loop-engineering">What is loop engineering?</Link>
            </div>
            <div className="hero-meta">
              <span><b>7</b> fields per loop</span>
              <span><b>3</b> agent runtimes</span>
              <span><b>100%</b> open source</span>
            </div>
          </div>
          <LoopDial />
        </div>
      </header>

      <section id="loops">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <h2>Agent loop templates</h2>
              <p>Every loop ships as a spec sheet plus runnable code. Read the verify step before you trust the loop — that&apos;s where the engineering is.</p>
            </div>
            <Link className="sec-link" href="/loops">View all →</Link>
          </div>
          <LoopGrid />
        </div>
      </section>

      <section className="teaser">
        <div className="wrap">
          <h2>What is loop engineering?</h2>
          <p>
            Loop engineering is the practice of designing systems that run your coding agents on a schedule —
            discover work, act, verify, and persist state without you in the loop. These agent loops replace
            one-off prompts with repeatable cycles that have exit conditions, verify gates, and measured token
            costs per cycle. Whether you run Claude Code, Codex, or OpenClaw, agent loops are how production
            teams ship autonomous workflows instead of babysitting every prompt. Every template on this site
            follows the same seven-field spec so you can audit any loop in under a minute.{" "}
            <Link className="sec-link" href="/what-is-loop-engineering">Read our full explainer on loop engineering →</Link>
          </p>
        </div>
      </section>

      <FormatSpec />

      <div className="band">
        <div className="wrap">
          <div>
            <h2>Running a loop we haven&apos;t catalogued?</h2>
            <p>Submit it in the seven-field format. We test-run every loop before it&apos;s listed, and credit you on the template page.</p>
          </div>
          <a className="btn green" href="https://github.com/rudy2steiner/awesome-agent-loops" target="_blank" rel="noopener">Submit a loop →</a>
        </div>
      </div>
    </main>
  );
}
