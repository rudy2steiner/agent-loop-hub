import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Codex loops",
  description:
    "Codex loop patterns for goal-driven coding agents, repository maintenance and verified workflow automation.",
  alternates: { canonical: "/codex-loops" },
};

export default function Page() {
  return (
    <main className="article">
      <div className="eyebrow">Runtime</div>
      <h1>Codex loops</h1>
      <p className="lead">
        Codex loops turn a goal-driven coding agent into a repeatable workflow. The loop supplies
        the queue, the repo boundary, the verification command, the state record, and the stop rule.
      </p>

      <h2>What to automate first</h2>
      <p>
        Start with tasks where Codex can prove the result with local commands: tests, builds,
        linters, schema checks, generated artifact checks, or small repository audits. Avoid loops
        where success is only a subjective writing judgment unless another metric can gate the run.
      </p>

      <h2>Good Codex loop candidates</h2>
      <p>
        The <Link className="sec-link" href="/loops/test-fix-loop">test-fix loop</Link> maps cleanly to
        goal-driven coding because it repeats until the suite is green. The{" "}
        <Link className="sec-link" href="/loops/codex-loop-plugin-audit-loop">Codex loop plugin audit loop</Link>{" "}
        helps decide whether recurring automation is safe before it is enabled. The{" "}
        <Link className="sec-link" href="/loops/loop-yaml-bootstrap-loop">Loop YAML bootstrap loop</Link>{" "}
        creates a conservative first config with verifier and exit policy.
      </p>

      <h2>Codex loop skeleton</h2>
      <pre className="codeblock">{`/goal all tests pass and the diff stays scoped -- run the suite, fix the first failure, verify, persist notes, repeat until green or blocked`}</pre>

      <h2>State and review</h2>
      <p>
        Store loop state in a file that reviewers can inspect: what was attempted, which verifier
        ran, what failed, and why the loop stopped. For production repos, require a pull request
        before merge and keep destructive operations behind a human gate.
      </p>

      <p>
        For the reusable field format, read the{" "}
        <Link className="sec-link" href="/agent-loop-template">agent loop template</Link>. For more
        runtime-neutral examples, browse all{" "}
        <Link className="sec-link" href="/loops">agent loop templates</Link>.
      </p>
    </main>
  );
}
