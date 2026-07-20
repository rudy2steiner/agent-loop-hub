import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Agent loop examples",
  description:
    "Practical agent loop examples for coding, SEO, data pipelines and operations, with triggers, verifiers, state and exit conditions.",
  alternates: { canonical: "/agent-loop-examples" },
};

export default function Page() {
  return (
    <main className="article">
      <div className="eyebrow">Examples</div>
      <h1>Agent loop examples</h1>
      <p className="lead">
        The useful agent loop examples are not vague automations. They have a work source, a narrow
        agent action, a verifier that can reject bad output, persistent state, and a clear exit
        condition.
      </p>

      <h2>Coding loops</h2>
      <p>
        Coding loops work best when the verifier already exists. The{" "}
        <Link className="sec-link" href="/loops/test-fix-loop">test-fix loop</Link> runs the suite,
        fixes the first failure, and requires two consecutive green runs before it exits. The{" "}
        <Link className="sec-link" href="/loops/ci-failure-fixer-loop">CI failure fixer loop</Link>{" "}
        starts from a failed workflow and opens a scoped PR only after local reproduction.
      </p>

      <h2>Content and SEO loops</h2>
      <p>
        Content loops need real-world signals. The{" "}
        <Link className="sec-link" href="/loops/content-refresh-loop">content refresh loop</Link> looks
        for pages that lost rank, rewrites only when the page has evidence of decay, and persists
        position history. The{" "}
        <Link className="sec-link" href="/loops/search-console-striking-distance-loop">Search Console striking-distance loop</Link>{" "}
        turns query/page data into a prioritized queue of recoverable rankings.
      </p>

      <h2>Data and ops loops</h2>
      <p>
        Data loops should verify structure and counts, not prose quality. The{" "}
        <Link className="sec-link" href="/loops/scrape-validate-loop">scrape-and-validate loop</Link>{" "}
        retries stale sources, validates schema, and quarantines repeated failures. For team queues,
        the <Link className="sec-link" href="/loops/stale-pr-cleanup-loop">stale PR cleanup loop</Link>{" "}
        keeps review queues moving without giving the agent authority to close work automatically.
      </p>

      <h2>How to choose an example</h2>
      <p>
        Pick the example whose verifier looks most like your own system. Then change the trigger,
        state file and tool permissions before you change the agent prompt. The{" "}
        <Link className="sec-link" href="/agent-loop-template">agent loop template</Link> page shows the
        field-by-field format used by every example in the library.
      </p>
    </main>
  );
}
