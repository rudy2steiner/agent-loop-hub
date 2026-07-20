import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Agent loop template",
  description:
    "A copy-paste agent loop template format with goal, trigger, discover, act, verify, persist, exit and token cost fields for production AI agents.",
  alternates: { canonical: "/agent-loop-template" },
};

export default function Page() {
  return (
    <main className="article">
      <div className="eyebrow">Template</div>
      <h1>Agent loop template</h1>
      <p className="lead">
        An agent loop template is a small operating spec for a recurring AI agent run. It says what
        the loop is trying to finish, when it starts, where it finds work, how it acts, how it is
        verified, where state is stored, and when the loop must stop.
      </p>

      <h2>The seven fields</h2>
      <p>
        Every AgentLoopHub template uses the same shape: <strong>goal</strong>, <strong>trigger</strong>,{" "}
        <strong>discover</strong>, <strong>act</strong>, <strong>verify</strong>,{" "}
        <strong>persist</strong>, and <strong>exit</strong>. The field that matters most is verify:
        without an independent check, the loop is just a scheduled prompt.
      </p>
      <p>
        Start with a goal that can be judged, then choose a trigger that matches the work source.
        A test-fix loop can run on push. A Search Console loop should run on a schedule. A triage
        loop can run every few minutes while the queue is open.
      </p>

      <h2>A minimal template</h2>
      <pre className="codeblock">{`Goal: The selected task is complete and verified.
Trigger: 0 9 * * 1
Discover: Read the queue and pick the highest-priority item not marked blocked.
Act: Give the scoped task to the agent with only the tools needed for that repo.
Verify: Run the automated check that proves the task is done.
Persist: Append the result, links, and next state to .loop/state.md.
Exit: Stop when the queue is empty, the verifier fails twice, or the token budget is reached.`}</pre>

      <h2>Good starter loops</h2>
      <p>
        If your verifier is a test suite, start with the{" "}
        <Link className="sec-link" href="/loops/test-fix-loop">test-fix loop</Link>. If the work comes
        from Search Console, study the{" "}
        <Link className="sec-link" href="/loops/search-console-striking-distance-loop">Search Console striking-distance loop</Link>. If
        the work is operational queue cleanup, use the{" "}
        <Link className="sec-link" href="/loops/issue-dedupe-loop">issue dedupe loop</Link> as the
        base pattern.
      </p>
      <p>
        Browse the full <Link className="sec-link" href="/loops">agent loop template library</Link> to
        compare triggers, verifiers, exit conditions and token costs across coding, content, data and
        ops workflows.
      </p>
    </main>
  );
}
