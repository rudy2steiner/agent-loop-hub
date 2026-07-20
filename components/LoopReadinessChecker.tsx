"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { loops, type Loop } from "@/lib/loops";

type FieldKey =
  | "goal"
  | "trigger"
  | "discovery"
  | "actionScope"
  | "verifier"
  | "persistence"
  | "budgetGate";

type FieldState = {
  label: string;
  placeholder: string;
  aliases: string[];
};

type CheckResult = {
  key: FieldKey;
  label: string;
  score: number;
  status: "ready" | "partial" | "missing";
  summary: string;
  recommendation: string;
};

type CommandTarget = "generic" | "codex" | "claude";

type GeneratedCommand = {
  target: CommandTarget;
  text: string;
};

const commandTargets: Array<{ value: CommandTarget; label: string }> = [
  { value: "generic", label: "Generic" },
  { value: "codex", label: "Codex" },
  { value: "claude", label: "Claude Code" },
];

const initialFields: Record<FieldKey, FieldState> = {
  goal: {
    label: "Goal",
    placeholder: "Define the exact outcome and the owner of the loop.",
    aliases: ["goal", "objective", "purpose"],
  },
  trigger: {
    label: "Trigger",
    placeholder: "Example: every weekday at 9am, on PR open, when queue.md has unchecked items",
    aliases: ["trigger", "schedule", "start condition", "when it runs"],
  },
  discovery: {
    label: "Discover",
    placeholder: "Example: read failing CI jobs, pull stale tickets, diff GSC queries against pages",
    aliases: ["discovery", "discover", "source", "work source", "input", "selection"],
  },
  actionScope: {
    label: "Act",
    placeholder: "Describe what the agent may change and what stays out of bounds.",
    aliases: ["action", "act", "action scope", "execution", "scope"],
  },
  verifier: {
    label: "Verify",
    placeholder: "Example: npm test and build pass, lint is clean, row counts stay within expected band",
    aliases: ["verifier", "verify", "validation", "checks", "test"],
  },
  persistence: {
    label: "Persist",
    placeholder: "Example: append decisions to .loop/state.jsonl with timestamps and failure counts",
    aliases: ["persistence", "persist", "state", "memory", "history"],
  },
  budgetGate: {
    label: "Exit",
    placeholder: "Set max cycles/tokens/time plus stop, approval and escalation rules.",
    aliases: ["budget", "human gate", "gate", "exit", "stop", "escalation", "cost"],
  },
};

const keywordGroups: Record<FieldKey, string[]> = {
  goal: ["goal", "objective", "outcome", "owner", "improve", "reduce", "ship", "maintain"],
  trigger: ["cron", "schedule", "every", "on ", "when", "webhook", "push", "pr", "*"],
  discovery: ["queue", "list", "diff", "search", "collect", "pull", "crawl", "failing", "stale", "source"],
  actionScope: ["edit", "change", "update", "draft", "fix", "create", "open pr", "scope", "do not", "only"],
  verifier: ["test", "build", "lint", "schema", "metric", "pass", "check", "ci", "type", "score"],
  persistence: ["state", "log", "jsonl", "md", "table", "record", "append", "history", "timestamp"],
  budgetGate: ["token", "cycle", "minute", "hour", "max", "limit", "stop", "attempt", "human", "approve", "review", "escalate", "exit", "kill"],
};

const recommendations: Record<FieldKey, string> = {
  goal: "Add a specific loop goal with a measurable outcome and a clear owner or target surface.",
  trigger: "Add a concrete start condition: cron, schedule, webhook, push event, queue threshold, or explicit manual command.",
  discovery: "Define where work comes from and how one item is selected: queue file, API query, failing test list, stale source table, or ranking delta.",
  actionScope: "Define the allowed action scope: what the agent may edit, what it must leave alone, and whether it can open a PR or only draft changes.",
  verifier: "Add a repeatable verifier such as tests, build, lint, schema validation, CI status, real metric thresholds, or deterministic checks.",
  persistence: "Write loop state somewhere durable: .loop/state.jsonl, queue.md, a database row, a failure log, or a timestamped run record.",
  budgetGate: "Set hard limits and gates: max cycles, token ceiling, runtime limit, retry count, spend limit, exit condition, kill switch, or human approval gate.",
};

const blankSpec = `# Untitled loop

## Goal

## Trigger

## Discover

## Act

## Verify

## Persist

## Exit
`;

const fieldOrder = Object.keys(initialFields) as FieldKey[];

function scoreField(key: FieldKey, value: string): number {
  const text = value.trim().toLowerCase();
  if (!text) return 0;

  const keywordHits = keywordGroups[key].filter((word) => text.includes(word)).length;
  const lengthScore = text.length >= 36 ? 45 : text.length >= 18 ? 30 : 16;
  const keywordScore = Math.min(40, keywordHits * 14);
  const specificityScore = /\d|\.jsonl|\.md|npm|pytest|ci|gsc|cron|schema|lint|build/.test(text) ? 15 : 0;

  return Math.min(100, lengthScore + keywordScore + specificityScore);
}

function statusFor(score: number): CheckResult["status"] {
  if (score >= 75) return "ready";
  if (score >= 35) return "partial";
  return "missing";
}

function summarize(key: FieldKey, score: number): string {
  if (score >= 75) return "Looks runnable.";
  if (score >= 35) return "Usable, but underspecified.";
  if (key === "verifier") return "No reliable no-go signal yet.";
  if (key === "budgetGate") return "Not safe for unattended runs yet.";
  return "Missing or too vague.";
}

function normalizeHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[`*_#:-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function headingMatches(heading: string, field: FieldState): boolean {
  const normalized = normalizeHeading(heading);
  return field.aliases.some((alias) => {
    const normalizedAlias = normalizeHeading(alias);
    return normalized === normalizedAlias || normalized.includes(normalizedAlias);
  });
}

function headingFor(key: FieldKey): string {
  return initialFields[key].label;
}

function parseSpecSections(spec: string): Record<FieldKey, string> {
  const parsed = Object.fromEntries(
    (Object.keys(initialFields) as FieldKey[]).map((key) => [key, ""]),
  ) as Record<FieldKey, string>;

  const lines = spec.split(/\r?\n/);
  let activeKey: FieldKey | null = null;

  for (const line of lines) {
    const heading = line.match(/^\s{0,3}#{1,3}\s+(.+?)\s*$/);
    if (heading) {
      activeKey =
        (Object.keys(initialFields) as FieldKey[]).find((key) => headingMatches(heading[1], initialFields[key])) ?? null;
      continue;
    }

    if (activeKey) parsed[activeKey] += `${line}\n`;
  }

  const wholeSpec = spec.toLowerCase();
  for (const key of Object.keys(initialFields) as FieldKey[]) {
    if (parsed[key].trim()) continue;
    const field = initialFields[key];
    const marker = field.aliases.find((alias) => wholeSpec.includes(alias));
    if (marker) parsed[key] = marker;
  }

  return parsed;
}

function inferRelevantLoops(text: string): Loop[] {
  const input = text.toLowerCase();
  const category =
    /seo|content|keyword|gsc|rank|page|brief/.test(input) ? "content" :
    /test|ci|lint|dependency|package|pr|code|build/.test(input) ? "coding" :
    /data|scrape|schema|row|source|pipeline/.test(input) ? "data" :
    /issue|ticket|triage|ops|alert|label/.test(input) ? "ops" :
    "all";

  const categoryMatches = loops.filter((loop) => category === "all" || loop.category === category);
  return (categoryMatches.length ? categoryMatches : loops).slice(0, 3);
}

function loopToSpec(loop: Loop): string {
  return `# ${loop.name}

## Goal
${loop.goal}

## Trigger
${loop.trigger}

## Discover
${loop.discover}

## Act
${loop.act}

## Verify
${loop.verify}

## Persist
${loop.persist}

## Exit
${loop.tokensPerCycle} per cycle. ${loop.exit}${loop.humanGates?.length ? ` Human gates: ${loop.humanGates.join("; ")}` : ""}`;
}

function sectionOrTodo(value: string, fallback: string): string {
  const trimmed = value.trim();
  return trimmed || `[TODO] ${fallback}`;
}

function buildAgentCommand(
  title: string,
  sections: Record<FieldKey, string>,
  missing: CheckResult[],
  target: CommandTarget,
): string {
  const missingLabels = missing.map((result) => result.label).join(", ") || "none";
  const targetRules = {
    generic: `- Run only one loop cycle.
- Select one work item from Discover.
- Stay inside Act scope.
- Run Verify before reporting success.
- Apply Persist exactly as written.
- Stop immediately on the Exit rule or any missing safety gate.
- Final response must include the selected item, changes made, verifier result, persisted state location, and whether another cycle is allowed.`,
    codex: `- Run only one loop cycle.
- Follow repository instructions in AGENTS.md before acting.
- Inspect the relevant files and existing patterns before editing.
- Select one work item from Discover.
- Stay inside Act scope and preserve unrelated user changes.
- Run Verify before reporting success.
- Stage explicit file paths only if staging is required; never use git add -A.
- Apply Persist exactly as written.
- Stop immediately on the Exit rule or any missing safety gate.
- Final response must include the selected item, files changed, verifier result, persisted state location, and whether another cycle is allowed.`,
    claude: `- Run only one loop cycle.
- Follow CLAUDE.md, project instructions, and available project skills before acting.
- Use parallel subagents only for independent discovery or analysis work.
- Select one work item from Discover.
- Stay inside Act scope and do not continue past the Exit rule.
- Run Verify before reporting success.
- Apply Persist exactly as written.
- Stop immediately on any missing safety gate, approval gate, or repeated failure.
- Final response must include the selected item, changes made, verifier result, persisted state location, and whether another cycle is allowed.`,
  } satisfies Record<CommandTarget, string>;
  const targetPrefix = {
    generic: "/goal Run one controlled cycle of this agent loop",
    codex: "/goal Run one controlled Codex cycle of this agent loop",
    claude: "Run one controlled Claude Code cycle of this agent loop",
  } satisfies Record<CommandTarget, string>;

  return `${targetPrefix[target]}: ${title}

Before acting, check missing sections: ${missingLabels}. If any required section is still TODO or unsafe, stop and return the exact edits needed instead of executing.

Loop spec:
- Goal: ${sectionOrTodo(sections.goal, initialFields.goal.placeholder)}
- Trigger: ${sectionOrTodo(sections.trigger, initialFields.trigger.placeholder)}
- Discover: ${sectionOrTodo(sections.discovery, initialFields.discovery.placeholder)}
- Act: ${sectionOrTodo(sections.actionScope, initialFields.actionScope.placeholder)}
- Verify: ${sectionOrTodo(sections.verifier, initialFields.verifier.placeholder)}
- Persist: ${sectionOrTodo(sections.persistence, initialFields.persistence.placeholder)}
- Exit: ${sectionOrTodo(sections.budgetGate, initialFields.budgetGate.placeholder)}

Execution rules:
${targetRules[target]}`;
}

export default function LoopReadinessChecker() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [spec, setSpec] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(loops[0]?.slug ?? "");
  const [commandTarget, setCommandTarget] = useState<CommandTarget>("generic");
  const [copied, setCopied] = useState(false);
  const [commandCopied, setCommandCopied] = useState(false);
  const [generatedCommand, setGeneratedCommand] = useState<GeneratedCommand | null>(null);
  const selectedLoop = loops.find((loop) => loop.slug === selectedSlug) ?? loops[0];
  const liveExampleSpec = selectedLoop ? loopToSpec(selectedLoop) : "";
  const sections = useMemo(() => parseSpecSections(spec), [spec]);
  const specTitle = spec.match(/^\s*#\s+(.+?)\s*$/m)?.[1]?.trim() || selectedLoop?.name || "Untitled loop";

  const results = useMemo<CheckResult[]>(() => {
    return (Object.keys(initialFields) as FieldKey[]).map((key) => {
      const score = scoreField(key, sections[key]);
      return {
        key,
        label: initialFields[key].label,
        score,
        status: statusFor(score),
        summary: summarize(key, score),
        recommendation: recommendations[key],
      };
    });
  }, [sections]);

  const overall = Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length);
  const missing = results.filter((result) => result.status !== "ready");
  const readyCount = results.length - missing.length;
  const relevantLoops = inferRelevantLoops(spec);
  const unattendedReady = overall >= 75 && results.every((result) => result.status === "ready");
  const agentCommand = buildAgentCommand(specTitle, sections, missing, commandTarget);
  const commandText = generatedCommand?.text || "Click Generate command to create a one-cycle agent command from the current spec.";
  const generatedCommandIsStale = Boolean(generatedCommand && (generatedCommand.text !== agentCommand || generatedCommand.target !== commandTarget));
  const wordCount = spec.trim() ? spec.trim().split(/\s+/).length : 0;
  const resultByKey = Object.fromEntries(results.map((result) => [result.key, result])) as Record<FieldKey, CheckResult>;

  function loadExample(loop: Loop) {
    setSelectedSlug(loop.slug);
    setSpec(loopToSpec(loop));
    setGeneratedCommand(null);
  }

  function updateSpec(nextSpec: string) {
    setSpec(nextSpec);
    setGeneratedCommand(null);
  }

  function focusOrInsertSection(key: FieldKey) {
    const heading = headingFor(key);
    const headingPattern = new RegExp(`^##\\s+${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "mi");
    const match = spec.match(headingPattern);
    const textarea = textareaRef.current;

    if (match && textarea) {
      const start = match.index ?? 0;
      textarea.focus();
      textarea.setSelectionRange(start, start + match[0].length);
      return;
    }

    const addition = `${spec.trim() ? "\n\n" : ""}## ${heading}\n${initialFields[key].placeholder}\n`;
    updateSpec(`${spec}${addition}`);
    window.setTimeout(() => {
      const current = textareaRef.current;
      if (!current) return;
      const position = current.value.length;
      current.focus();
      current.setSelectionRange(position, position);
    }, 0);
  }

  async function copySpec() {
    if (!spec.trim()) return;
    await navigator.clipboard.writeText(spec);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  async function copyCommand() {
    if (!generatedCommand) return;
    await navigator.clipboard.writeText(commandText);
    setCommandCopied(true);
    window.setTimeout(() => setCommandCopied(false), 1400);
  }

  return (
    <div className="checker">
      <section className="checker-hero">
        <div className="wrap checker-hero-grid">
          <div>
            <div className="eyebrow">Agent loop editor</div>
            <h1>Agent Loop Generator</h1>
            <p className="checker-sub">
              Edit a seven-field loop spec, check whether it is runnable, and generate a copyable agent
              command with goal, trigger, discovery, action, verification, persistence, and exit rules.
            </p>
          </div>
          <div className="score-panel" aria-live="polite">
            <span className="score-label">Readiness</span>
            <strong>{overall}</strong>
            <span className="score-count">{readyCount}/{results.length} sections ready</span>
            <span className={`score-status ${unattendedReady ? "ready" : "blocked"}`}>
              {unattendedReady ? "Ready for unattended runs" : "Needs gates before unattended runs"}
            </span>
          </div>
        </div>
      </section>

      <section className="checker-body">
        <div className="wrap checker-layout">
          <form className="input-panel">
            <div className="editor-workspace">
              <label className="field editor-field">
                <div className="editor-top">
                  <div className="editor-title">
                    <span>Loop spec editor</span>
                    <span className="editor-meta">{wordCount} words · {spec.length} chars</span>
                  </div>
                  <div className="editor-toolbar">
                    <select
                      aria-label="Load from live loops"
                      value={selectedSlug}
                      onChange={(event) => setSelectedSlug(event.target.value)}
                    >
                      {loops.map((loop) => (
                        <option key={loop.slug} value={loop.slug}>
                          {loop.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="example-btn"
                      onClick={() => selectedLoop && loadExample(selectedLoop)}
                    >
                      Load
                    </button>
                    <button type="button" className="example-btn secondary" onClick={() => {
                      updateSpec(blankSpec);
                    }}>
                      Blank
                    </button>
                    <button type="button" className="example-btn secondary" onClick={copySpec} disabled={!spec.trim()}>
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <button type="button" className="example-btn secondary" onClick={() => {
                      updateSpec("");
                    }} disabled={!spec.trim()}>
                      Clear
                    </button>
                  </div>
                </div>
                <textarea
                  ref={textareaRef}
                  value={spec}
                  placeholder={liveExampleSpec}
                  onChange={(event) => {
                    updateSpec(event.target.value);
                  }}
                  rows={24}
                />
              </label>

              <aside className="editor-side">
                <div className="section-controls">
                  <div className="side-heading">
                    <h2>Edit sections</h2>
                    <span>{readyCount}/7 ready</span>
                  </div>
                  <div className="section-buttons">
                    {fieldOrder.map((key) => (
                      <button
                        key={key}
                        type="button"
                        className={`section-btn ${resultByKey[key].status}`}
                        onClick={() => focusOrInsertSection(key)}
                      >
                        <span>{initialFields[key].label}</span>
                        <strong>{resultByKey[key].score}</strong>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="result-block command-block">
                  <div className="result-heading">
                    <h2>Agent command</h2>
                    <button type="button" className="mini-btn" onClick={copyCommand} disabled={!generatedCommand}>
                      {commandCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className="target-toggle" aria-label="Command target">
                    {commandTargets.map((target) => (
                      <button
                        key={target.value}
                        type="button"
                        className={commandTarget === target.value ? "active" : ""}
                        onClick={() => setCommandTarget(target.value)}
                      >
                        {target.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="example-btn generate-btn"
                    onClick={() => setGeneratedCommand({ target: commandTarget, text: agentCommand })}
                  >
                    Generate command
                  </button>
                  <pre>{commandText}</pre>
                  {generatedCommandIsStale ? (
                    <span className="command-note">Spec or target changed. Generate again to refresh the command.</span>
                  ) : null}
                </div>
              </aside>
            </div>
          </form>

          <aside className="results-panel">
            <div className="result-block">
              <h2>Completeness</h2>
              <div className="checks">
                {results.map((result) => (
                  <div key={result.key} className="check-row">
                    <div>
                      <span className="check-name">{result.label}</span>
                      <span className={`check-summary ${result.status}`}>{result.summary}</span>
                    </div>
                    <strong>{result.score}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="result-block">
              <h2>Recommendations</h2>
              {missing.length ? (
                <ul className="recommendations">
                  {missing.map((result) => (
                    <li key={result.key}>{result.recommendation}</li>
                  ))}
                </ul>
              ) : (
                <p className="clear">All required loop sections are concrete enough for a first dry run.</p>
              )}
            </div>

            <div className="result-block">
              <h2>Relevant templates</h2>
              <div className="template-links">
                {relevantLoops.map((loop) => (
                  <div key={loop.slug} className="template-link">
                    <Link className="sec-link" href={`/loops/${loop.slug}`}>{loop.name}</Link>
                    <button type="button" className="mini-btn" onClick={() => loadExample(loop)}>
                      Load
                    </button>
                  </div>
                ))}
              </div>
              <Link className="sec-link all-link" href="/loops">Browse all loop templates -&gt;</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="generator-seo">
        <div className="wrap">
          <div className="seo-grid">
            <div className="seo-intro">
              <div className="eyebrow">Agent loop generator</div>
              <h2>Build an agent loop command from a real operating spec</h2>
              <p>
                This agent loop generator turns an editable loop template into a command an AI coding
                agent can run for one controlled cycle. It is built for agent loops that need more than a
                prompt: a clear trigger, a work discovery rule, a bounded action scope, a verifier,
                durable state, and a stop condition.
              </p>
              <p>
                Use it as an agent loop editor when drafting new loops, a readiness checker before
                automation, or a command generator when you need a structured instruction for Codex,
                Claude Code, Cursor, CI agents, SEO agents, data agents, and maintenance loops.
              </p>
            </div>
            <div className="seo-aside">
              <h2>Generated command includes</h2>
              <ul>
                <li>One-cycle execution guard for safer agent runs.</li>
                <li>Missing-section check before the agent changes files.</li>
                <li>Goal, Trigger, Discover, Act, Verify, Persist, and Exit fields.</li>
                <li>Generic, Codex, and Claude Code command modes.</li>
                <li>Final report requirements for changed files, verifier result, and persisted state.</li>
              </ul>
            </div>
          </div>

          <div className="seo-steps" aria-label="Agent loop generator sections">
            {fieldOrder.map((key) => (
              <div key={key} className="seo-step">
                <span>{initialFields[key].label}</span>
                <p>{initialFields[key].placeholder}</p>
              </div>
            ))}
          </div>

          <div className="seo-links">
            <div>
              <h2>Start from loop examples</h2>
              <p>
                Load an existing loop into the editor, adapt the spec, then generate the command beside
                the editor. The live templates use the same seven-section format as this generator.
              </p>
            </div>
            <div className="seo-link-actions">
              <Link className="btn primary" href="/loops">Browse loop templates</Link>
              <Link className="btn" href="/agent-loop-template">Read the loop template</Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .checker-hero {
          border-bottom: 1px solid var(--line);
          padding: 64px 0 56px;
        }
        .checker-hero-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 260px;
          gap: 42px;
          align-items: center;
        }
        .checker-sub {
          color: var(--ink-soft);
          max-width: 620px;
          font-size: 17px;
        }
        .score-panel {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 24px;
          display: grid;
          gap: 8px;
          box-shadow: var(--dial-shadow);
        }
        .score-label,
        .score-status,
        .check-summary,
        .mini-btn {
          font-family: var(--mono);
        }
        .score-label {
          color: var(--ink-faint);
          font-size: 11px;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .score-panel strong {
          color: var(--heading);
          font-size: 58px;
          line-height: 1;
        }
        .score-status {
          font-size: 12px;
          color: var(--failed);
        }
        .score-count {
          color: var(--ink-faint);
          font-family: var(--mono);
          font-size: 12px;
        }
        .score-status.ready {
          color: var(--run);
        }
        .checker-body {
          padding: 56px 0 76px;
        }
        .checker-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
          gap: 22px;
          align-items: start;
        }
        .input-panel,
        .results-panel,
        .result-block {
          display: grid;
          gap: 16px;
        }
        .editor-workspace {
          display: grid;
          grid-template-columns: minmax(720px, 1fr) minmax(240px, 300px);
          gap: 16px;
          align-items: start;
        }
        .editor-side {
          display: grid;
          gap: 14px;
          position: sticky;
          top: 18px;
        }
        .field {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 16px;
          display: grid;
          gap: 9px;
        }
        .field span,
        .check-name {
          font-weight: 700;
          color: var(--ink);
        }
        .editor-top {
          display: grid;
          grid-template-columns: minmax(170px, .5fr) minmax(0, 1fr);
          align-items: center;
          gap: 14px;
          border-bottom: 1px solid var(--line);
          padding-bottom: 12px;
        }
        .editor-title {
          display: grid;
          gap: 3px;
        }
        .editor-meta {
          color: var(--ink-faint);
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
        }
        .editor-toolbar {
          display: grid;
          grid-template-columns: minmax(200px, 1fr) repeat(4, auto);
          gap: 8px;
          align-items: center;
          justify-content: end;
        }
        textarea {
          width: 100%;
          resize: vertical;
          min-height: 640px;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--paper);
          color: var(--ink);
          padding: 12px;
          font: 13px/1.55 var(--mono);
        }
        textarea:focus {
          outline: 2px solid var(--run);
          outline-offset: 2px;
        }
        select {
          min-width: 0;
          width: 100%;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--paper);
          color: var(--ink);
          padding: 10px 12px;
          font: 13px/1.4 var(--mono);
        }
        select:focus {
          outline: 2px solid var(--run);
          outline-offset: 2px;
        }
        .section-controls {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 14px;
          display: grid;
          gap: 12px;
        }
        .side-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .side-heading h2 {
          font-size: 16px;
        }
        .side-heading span {
          color: var(--ink-faint);
          font-family: var(--mono);
          font-size: 11px;
        }
        .section-buttons {
          display: grid;
          gap: 8px;
        }
        .section-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--paper);
          color: var(--ink-soft);
          cursor: pointer;
          padding: 9px 10px;
          text-align: left;
        }
        .section-btn:hover {
          border-color: var(--run);
          color: var(--run);
        }
        .section-btn span,
        .section-btn strong {
          font-family: var(--mono);
          font-size: 11px;
        }
        .section-btn strong {
          color: var(--ink);
        }
        .section-btn.ready {
          border-color: color-mix(in srgb, var(--run) 42%, var(--line));
        }
        .section-btn.missing {
          border-color: color-mix(in srgb, var(--failed) 38%, var(--line));
        }
        .example-btn {
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--ink);
          color: var(--btn-primary-text);
          cursor: pointer;
          font: 12px/1.3 var(--mono);
          padding: 11px 13px;
        }
        .example-btn:hover {
          background: var(--run);
          border-color: var(--run);
          color: var(--btn-primary-hover-text);
        }
        .example-btn.secondary {
          background: var(--paper);
          color: var(--ink-soft);
        }
        .example-btn.secondary:hover {
          background: var(--surface);
          color: var(--run);
        }
        .example-btn:disabled {
          cursor: not-allowed;
          opacity: .45;
        }
        .example-btn:disabled:hover {
          background: var(--paper);
          border-color: var(--line);
          color: var(--ink-soft);
        }
        .result-block {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 18px;
        }
        .result-block h2 {
          font-size: 19px;
        }
        .result-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .command-block pre {
          max-height: 280px;
          overflow: auto;
          white-space: pre-wrap;
          word-break: break-word;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--paper);
          color: var(--ink);
          padding: 13px;
          font: 12px/1.55 var(--mono);
        }
        .generate-btn {
          width: 100%;
        }
        .target-toggle {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1px;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          overflow: hidden;
          background: var(--line);
        }
        .target-toggle button {
          border: 0;
          background: var(--paper);
          color: var(--ink-soft);
          cursor: pointer;
          font: 11px/1.25 var(--mono);
          padding: 9px 8px;
        }
        .target-toggle button:hover {
          color: var(--run);
        }
        .target-toggle button.active {
          background: var(--ink);
          color: var(--btn-primary-text);
        }
        .command-note {
          color: var(--failed);
          font-family: var(--mono);
          font-size: 11px;
        }
        .checks {
          display: grid;
          gap: 9px;
        }
        .check-row {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          border-top: 1px dashed var(--line);
          padding-top: 10px;
        }
        .check-row:first-child {
          border-top: 0;
          padding-top: 0;
        }
        .check-row div {
          display: grid;
          gap: 2px;
        }
        .check-summary {
          color: var(--ink-faint);
          font-size: 11px;
        }
        .check-summary.ready {
          color: var(--run);
        }
        .check-summary.missing {
          color: var(--failed);
        }
        .check-row strong {
          font-family: var(--mono);
          color: var(--ink);
          font-size: 18px;
        }
        .recommendations {
          display: grid;
          gap: 10px;
          padding-left: 18px;
          color: var(--ink-soft);
          font-size: 14px;
        }
        .clear {
          color: var(--run);
          font-size: 14px;
        }
        .template-links {
          display: grid;
          gap: 10px;
        }
        .template-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-top: 1px dashed var(--line);
          padding-top: 10px;
        }
        .template-link:first-child {
          border-top: 0;
          padding-top: 0;
        }
        .mini-btn {
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--paper);
          color: var(--ink-soft);
          cursor: pointer;
          font-size: 11px;
          padding: 5px 9px;
        }
        .mini-btn:hover {
          border-color: var(--run);
          color: var(--run);
        }
        .mini-btn:disabled {
          cursor: not-allowed;
          opacity: .45;
        }
        .mini-btn:disabled:hover {
          border-color: var(--line);
          color: var(--ink-soft);
        }
        .all-link {
          margin-top: 4px;
        }
        .generator-seo {
          border-top: 1px solid var(--line);
          padding: 72px 0 86px;
          background: color-mix(in srgb, var(--surface) 62%, transparent);
        }
        .seo-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
          gap: 44px;
          align-items: start;
        }
        .seo-intro h2,
        .seo-links h2 {
          font-size: clamp(28px, 3vw, 40px);
          line-height: 1.08;
          letter-spacing: -.018em;
          margin-bottom: 18px;
        }
        .seo-intro p,
        .seo-links p {
          color: var(--ink-soft);
          max-width: 760px;
          font-size: 16px;
          margin-top: 14px;
        }
        .seo-aside {
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--surface);
          padding: 22px;
          display: grid;
          gap: 14px;
        }
        .seo-aside h2 {
          font-size: 20px;
        }
        .seo-aside ul {
          display: grid;
          gap: 10px;
          padding-left: 18px;
          color: var(--ink-soft);
        }
        .seo-steps {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 1px;
          border: 1px solid var(--line);
          background: var(--line);
          margin-top: 44px;
        }
        .seo-step {
          min-height: 150px;
          background: var(--surface);
          padding: 16px;
          display: grid;
          align-content: start;
          gap: 10px;
        }
        .seo-step span {
          color: var(--run);
          font-family: var(--mono);
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .seo-step p {
          color: var(--ink-soft);
          font-size: 13px;
          line-height: 1.45;
        }
        .seo-links {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 28px;
          align-items: center;
          border-top: 1px solid var(--line);
          margin-top: 44px;
          padding-top: 34px;
        }
        .seo-link-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        @media (max-width: 1320px) {
          .editor-workspace {
            grid-template-columns: 1fr;
          }
          .editor-side {
            position: static;
          }
        }
        @media (max-width: 900px) {
          .checker-hero-grid,
          .checker-layout,
          .seo-grid,
          .seo-links {
            grid-template-columns: 1fr;
          }
          .seo-steps {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .seo-link-actions {
            justify-content: flex-start;
          }
          .editor-top {
            grid-template-columns: 1fr;
          }
          .editor-toolbar {
            justify-content: stretch;
          }
          .score-panel {
            max-width: 340px;
          }
        }
        @media (max-width: 620px) {
          .checker-hero {
            padding: 44px 0 38px;
          }
          .checker-body {
            padding: 44px 0 54px;
          }
          .score-panel strong {
            font-size: 46px;
          }
          .editor-top {
            align-items: start;
          }
          .editor-toolbar {
            grid-template-columns: 1fr 1fr;
          }
          .editor-toolbar select {
            grid-column: 1 / -1;
          }
          .seo-steps {
            grid-template-columns: 1fr;
          }
          .seo-step {
            min-height: auto;
          }
        }
      `}</style>
    </div>
  );
}
