# agent-loop-hub

The loop engineering reference — agentloophub.com

## Stack
Next.js (App Router) + TypeScript. No database in v1: loop templates live in `lib/loops.ts` and pages are statically generated.

## Run
```bash
npm install
npm run dev
```
## Claude code 
```
claude --dangerously-skip-permissions
```

## Add a loop
Append an object to `lib/loops.ts` following the seven-field schema (goal, trigger, discover, act, verify, persist, exit) plus tokensPerCycle, runtime and code. The detail page, sitemap and JSON-LD are generated automatically.

## Structure
- `app/page.tsx` — homepage (hero with animated loop dial, featured templates, format spec)
- `app/loops` — library index with category filter
- `app/loops/[slug]` — template detail: spec table + runnable code + HowTo JSON-LD
- `app/what-is-loop-engineering` — pillar explainer page
- `components/LoopDial.tsx` — the animated five-phase dial (client component)
