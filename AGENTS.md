# AGENTS.md - AgentLoopHub Instructions

Use this repo as the AgentLoopHub website project. Preserve user changes and keep
edits scoped to the requested proposal, content, or site behavior.

## Project Context

- Stack: Next.js App Router, TypeScript, React.
- Loop templates live in `lib/loops.ts`.
- Generated loop detail pages live under `app/loops/[slug]`.
- OpenSpec/SDD changes live under `openspec/changes/<change-id>/`.

## SDD / OpenSpec Rules

- Write SDD/OpenSpec proposal and task files in Chinese by default.
- For any SDD/OpenSpec change, check all files in the same change directory for
  consistency: scope, goals, non-goals, task checklist, and verification steps
  must describe the same plan.
- Keep `proposal.md` focused on intent, scope, risks, and rollout.
- Keep `tasks.md` as an executable checklist that maps directly to the proposal.

## Execution Rules

- Do not change website titles or meta descriptions unless explicitly requested.
- For substantial tasks, split work into independent subtasks and run them in
  parallel with multi-agent workers when safe; keep final integration, review,
  and verification in the main agent.
- Preserve the seven-field loop format: goal, trigger, discover, act, verify,
  persist, exit, plus token cost.
- Run `npm run build` before implementation PRs. Documentation-only SDD changes
  do not require a build.
- Stage explicit file paths only. Never use `git add -A`.
