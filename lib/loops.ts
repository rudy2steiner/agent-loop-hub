export type LoopCategory = "coding" | "content" | "data" | "ops";

export interface Loop {
  slug: string;
  name: string;
  category: LoopCategory;
  goal: string;
  trigger: string;
  discover: string;
  act: string;
  verify: string;
  persist: string;
  exit: string;
  tokensPerCycle: string;
  runtime: "claude-code" | "codex" | "openclaw" | "any";
  runs: string;
  code: string;
}

export const loops: Loop[] = [
  {
    slug: "content-refresh-loop",
    name: "Content refresh loop",
    category: "content",
    goal: "Pages that lost rank in Search Console are rewritten and re-indexed.",
    trigger: "0 3 * * *",
    discover: "Pull GSC pages whose average position dropped more than 3 in 14 days.",
    act: "Rewrite the page: refresh facts, tighten intro, add missing entities; open a PR.",
    verify: "Meta intact, internal links intact, diff over 25%, build passes.",
    persist: "state.md tracks page, last refresh date, position history.",
    exit: "Queue empty, or a page refreshed twice without rank recovery (escalate to human).",
    tokensPerCycle: "~41k",
    runtime: "claude-code",
    runs: "1.2k runs",
    code: `# crontab
0 3 * * * cd ~/site && claude -p "$(cat loops/content-refresh.md)" --allowedTools "Bash,Edit,Write"`,
  },
  {
    slug: "test-fix-loop",
    name: "Test-fix loop",
    category: "coding",
    goal: "The full test suite passes twice in a row.",
    trigger: "on push",
    discover: "Run the suite; collect every failing test with stack traces.",
    act: "Hand each failure to a subagent scoped to the failing module.",
    verify: "pytest exit 0, twice consecutively (guards against flakes).",
    persist: "Failures log appended to .loop/failures.jsonl for flake analysis.",
    exit: "Two consecutive green runs, or 10 cycles (then open an issue).",
    tokensPerCycle: "~18k",
    runtime: "claude-code",
    runs: "4.7k runs",
    code: `/goal all tests pass and lint is clean -- run the suite, fix the first failure, repeat; stop after 10 turns`,
  },
  {
    slug: "keyword-discovery-loop",
    name: "Keyword discovery loop",
    category: "content",
    goal: "The content queue always holds at least 10 briefed keywords with search demand.",
    trigger: "0 6 * * 1",
    discover: "Diff GSC impression queries against existing pages; crawl competitor sitemaps for gaps.",
    act: "Cluster gaps, score by impressions x absence, draft a one-paragraph brief each.",
    verify: "Each brief has volume evidence and no duplicate against existing slugs.",
    persist: "Briefs appended to queue.md with score and source query.",
    exit: "At least 5 new briefs queued, or no gaps above threshold.",
    tokensPerCycle: "~9k",
    runtime: "any",
    runs: "860 runs",
    code: `0 6 * * 1 cd ~/site && claude -p "$(cat loops/keyword-discovery.md)" --allowedTools "Bash,WebFetch,Write"`,
  },
  {
    slug: "dependency-upgrade-loop",
    name: "Dependency upgrade loop",
    category: "coding",
    goal: "All dependencies are within one minor version of latest, with green CI.",
    trigger: "0 4 * * 6",
    discover: "npm outdated / pip list --outdated; pick the single oldest package.",
    act: "Bump it, run tests, fix breakage within the diff budget.",
    verify: "CI passes and lockfile diff touches only the bumped package tree.",
    persist: "upgrade-log.md records package, from-to, breakage notes.",
    exit: "One package per cycle; loop exits when nothing is outdated.",
    tokensPerCycle: "~22k",
    runtime: "claude-code",
    runs: "2.1k runs",
    code: "/goal `npm outdated` reports zero packages -- bump one package per turn, keep CI green; stop after 8 turns",
  },
  {
    slug: "scrape-validate-loop",
    name: "Scrape-and-validate loop",
    category: "data",
    goal: "Every source is scraped, validated against schema, and loaded.",
    trigger: "*/30 * * * *",
    discover: "Sources list with last-success timestamps; pick stale ones.",
    act: "Fetch, parse, normalize; retry failures with exponential backoff.",
    verify: "Schema validation pass rate at least 98%; row counts within expected band.",
    persist: "Source state table: last_run, last_success, consecutive_failures.",
    exit: "All sources fresh, or a source fails 3x (quarantine and alert).",
    tokensPerCycle: "~6k",
    runtime: "any",
    runs: "9.3k runs",
    code: `*/30 * * * * cd ~/pipeline && claude -p "$(cat loops/scrape-validate.md)" --allowedTools "Bash,Write"`,
  },
  {
    slug: "issue-triage-loop",
    name: "Issue triage loop",
    category: "ops",
    goal: "No issue sits unlabeled for more than 15 minutes during work hours.",
    trigger: "*/15 * * * *",
    discover: "gh issue list with empty label filter, state open.",
    act: "Label by area and priority, dedupe against existing issues, post a one-line summary.",
    verify: "Human spot-checks 1 in 20; mislabel rate must stay under 10%.",
    persist: "Triage decisions appended to .loop/triage.jsonl for calibration.",
    exit: "Queue empty each cycle; loop itself runs indefinitely on cron.",
    tokensPerCycle: "~4k",
    runtime: "claude-code",
    runs: "3.5k runs",
    code: "/schedule every 15 minutes, label new unlabeled issues by area and priority, dedupe, and post a one-line summary on each",
  }
];

export const categories: { id: LoopCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "coding", label: "Coding" },
  { id: "content", label: "Content / SEO" },
  { id: "data", label: "Data" },
  { id: "ops", label: "Ops" },
];

export function getLoop(slug: string) {
  return loops.find((l) => l.slug === slug);
}
