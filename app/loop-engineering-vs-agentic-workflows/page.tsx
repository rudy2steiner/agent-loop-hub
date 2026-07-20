import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Loop engineering vs agentic workflows",
  description:
    "Loop engineering vs agentic workflows: how loops add triggers, verification, persistence and exit rules to autonomous agent processes.",
  alternates: { canonical: "/loop-engineering-vs-agentic-workflows" },
};

export default function Page() {
  return (
    <main className="article">
      <div className="eyebrow">Comparison</div>
      <h1>Loop engineering vs agentic workflows</h1>
      <p className="lead">
        Agentic workflows describe how agents perform a task. Loop engineering describes the control
        system around those workflows: what starts them, what verifies them, what state they keep,
        and when they stop.
      </p>

      <h2>Agentic workflow is the path</h2>
      <p>
        An agentic workflow might route research to one agent, implementation to another, and review
        to a third. It focuses on delegation, tool use, handoffs and intermediate artifacts inside a
        task.
      </p>

      <h2>Loop engineering is the controller</h2>
      <p>
        A loop decides whether that workflow should run again. It watches a queue or metric, starts
        the agentic workflow, checks the result, writes state, and either schedules the next cycle or
        escalates to a human.
      </p>

      <h2>Example: content operations</h2>
      <p>
        The <Link className="sec-link" href="/loops/content-refresh-loop">content refresh loop</Link>{" "}
        can contain an agentic workflow for research, rewriting and QA. The loop itself is the outer
        system: it discovers rank drops, verifies internal links and build health, persists position
        history, and exits when the queue is empty.
      </p>

      <h2>Example: software maintenance</h2>
      <p>
        The <Link className="sec-link" href="/loops/dependency-upgrade-loop">dependency upgrade loop</Link>{" "}
        may use several agent steps to inspect breakage and patch tests. Loop engineering keeps that
        work bounded by upgrading one package per cycle and rejecting unrelated lockfile churn.
      </p>

      <p>
        Use the <Link className="sec-link" href="/agent-loop-template">agent loop template</Link> when
        your agentic workflow needs recurrence, state and an exit condition. Browse{" "}
        <Link className="sec-link" href="/agent-loop-examples">agent loop examples</Link> or the{" "}
        <Link className="sec-link" href="/loops/agent-state-machine-loop">agent state-machine loop</Link>{" "}
        to see how different workflows become auditable loops.
      </p>
    </main>
  );
}
