import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Loop engineering vs prompt engineering",
  description:
    "Loop engineering vs prompt engineering: how repeatable agent systems differ from one-off prompts, and when to use each practice.",
  alternates: { canonical: "/loop-engineering-vs-prompt-engineering" },
};

export default function Page() {
  return (
    <main className="article">
      <div className="eyebrow">Comparison</div>
      <h1>Loop engineering vs prompt engineering</h1>
      <p className="lead">
        Prompt engineering improves a single model turn. Loop engineering designs the system that
        decides when prompts run, what work they receive, how output is verified, and when the
        process stops.
      </p>

      <h2>The core difference</h2>
      <p>
        Prompt engineering is about instruction quality: role, context, examples, constraints and
        output format. Loop engineering is about operational control: discovery, action,
        verification, persistence and exit. A strong prompt can still fail as a system if nothing
        checks the result or records state between runs.
      </p>

      <h2>When prompt engineering is enough</h2>
      <p>
        Use a prompt when the task is one-off, low risk, and easy for a human to inspect in the
        moment. Drafting a short explanation, summarizing a document, or generating a quick idea
        list usually does not need a loop.
      </p>

      <h2>When you need loop engineering</h2>
      <p>
        Use a loop when work recurs, when the queue can be discovered automatically, or when the
        output must survive review. The{" "}
        <Link className="sec-link" href="/loops/test-fix-loop">test-fix loop</Link> is a simple
        example: the prompt matters, but the verifier and exit rule matter more.
      </p>

      <h2>How they work together</h2>
      <p>
        A loop still contains prompts. The difference is that the prompt is only one part of the
        machine. The loop also decides which prompt to run, what context to attach, which command
        proves success, where to write state, and whether the next cycle should continue.
      </p>

      <p>
        For a full definition, read{" "}
        <Link className="sec-link" href="/what-is-loop-engineering">what is loop engineering</Link>.
        To build one, start with the{" "}
        <Link className="sec-link" href="/agent-loop-template">agent loop template</Link>.
      </p>
    </main>
  );
}
