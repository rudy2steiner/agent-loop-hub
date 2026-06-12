import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "What is loop engineering?",
  description:
    "Loop engineering is designing systems that prompt your AI agents for you: discover work, act, verify, persist state, decide. The definitive explainer with examples.",
  alternates: { canonical: "/what-is-loop-engineering" },
};

export default function Page() {
  return (
    <main className="article">
      <div className="eyebrow">Explainer</div>
      <h1>What is loop engineering?</h1>
      <p className="lead">
        Loop engineering is the practice of designing a system that prompts your AI agent for you:
        it discovers work, hands tasks to the agent, verifies the result, persists state, and
        decides what happens next — on a schedule or until a goal is met.
      </p>
      <p>
        The term took off in June 2026, when OpenClaw creator Peter Steinberger posted that you
        shouldn&apos;t be prompting coding agents anymore — you should be designing loops that prompt
        your agents. Boris Cherny, creator of Claude Code, had said the same thing on stage days
        earlier: he doesn&apos;t prompt Claude anymore; his job is to write loops.
      </p>
      <h2>The five phases of a loop</h2>
      <p>
        Every production loop cycles through the same five phases: <strong>discover</strong> (where does
        work come from — a queue, a diff, an API), <strong>act</strong> (the agent call),
        <strong> verify</strong> (an automated check that gates the cycle: tests, lint, rank data),
        <strong> persist</strong> (state that survives the run, often a plain markdown file), and
        <strong> decide</strong> (continue, exit, or escalate to a human).
      </p>
      <h2>Verify is the hard part</h2>
      <p>
        An open loop with no feedback is a machine for generating confident mistakes. The verify
        step is where loop engineering earns its name: something in the loop has to be able to say
        no — a test suite, a type checker, a second model judging the goal, a real-world metric.
        Design the verify step first; the rest of the loop falls out of it.
      </p>
      <h2>Loops vs prompts vs harnesses</h2>
      <p>
        Prompt engineering shapes a single turn. Context engineering shapes what the model sees.
        Harness engineering shapes the environment an agent runs in. Loop engineering sits above
        all three: it decides when the agent runs at all, what counts as done, and what happens
        between runs. The vocabulary keeps shifting; the layering is the durable idea.
      </p>
      <h2>Where to start</h2>
      <p>
        Pick a task with a built-in verifier — failing tests are the classic. Write the goal as an
        acceptance criterion, add an exit condition (always add an exit condition), and run it on a
        schedule. Our <Link className="sec-link" href="/loops">template library</Link> has runnable
        seven-field specs for coding, content/SEO, data and ops loops, each with measured token
        cost per cycle.
      </p>
    </main>
  );
}
