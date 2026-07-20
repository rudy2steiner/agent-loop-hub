import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Claude Code loops",
  description:
    "Claude Code loop patterns for scheduled maintenance, test fixing, dependency upgrades and content workflows with verification gates and exit conditions.",
  alternates: { canonical: "/claude-code-loops" },
};

export default function Page() {
  return (
    <main className="article">
      <div className="eyebrow">Runtime</div>
      <h1>Claude Code loops</h1>
      <p className="lead">
        Claude Code loops are recurring agent runs where Claude Code is the worker and the loop
        harness decides when to call it, what files it may touch, how the result is verified, and
        when the run stops.
      </p>

      <h2>When Claude Code fits</h2>
      <p>
        Use Claude Code when the loop needs local repository context, shell commands, tests, or
        scripted checks. It is a strong fit for maintenance loops that can run from cron, CI, or a
        small wrapper script with a scoped prompt and allowed tools.
      </p>

      <h2>Starter patterns</h2>
      <p>
        The <Link className="sec-link" href="/loops/test-fix-loop">test-fix loop</Link> is the cleanest
        Claude Code starting point because the test suite is the verifier. The{" "}
        <Link className="sec-link" href="/loops/scheduled-claude-code-maintenance-loop">scheduled Claude Code maintenance loop</Link>{" "}
        shows how to choose between cron, session commands and GitHub Actions. The{" "}
        <Link className="sec-link" href="/loops/docs-refresh-loop">docs refresh loop</Link>{" "}
        shows a scheduled workflow with build verification.
      </p>

      <h2>Trigger choice</h2>
      <p>
        Choose cron for recurring maintenance, CI triggers for code health, and manual goal runs for
        one-off cleanup. The trigger should be boring. The engineering lives in the verifier, state
        file and exit condition.
      </p>

      <h2>Claude Code loop skeleton</h2>
      <pre className="codeblock">{`0 4 * * 1 cd ~/repo && claude -p "$(cat loops/weekly-maintenance.md)" --allowedTools "Bash,Edit,Write"`}</pre>

      <p>
        Compare these with runtime-neutral templates in the{" "}
        <Link className="sec-link" href="/loops">loop library</Link>, or use the{" "}
        <Link className="sec-link" href="/agent-loop-template">agent loop template</Link> format to
        design a Claude Code loop from scratch.
      </p>
    </main>
  );
}
