# 调研与分发准备

## X.com Status 摘要

| 优先级 | 来源 | 影响信号 | 可抽象模式 | 候选 slug | 风险 |
| --- | --- | --- | --- | --- | --- |
| P0 | `https://x.com/dzhng/status/2063931263312892406` | 约 94.9K views | 显式 state、transition、observer、action、terminal state | `agent-state-machine-loop` | 容易停留在概念层，必须给出可执行 verifier |
| P0 | `https://x.com/odysseus0z/status/2063957851052347901` | 约 23.7K views | desired state、observed status、controller、actuator | `desired-state-controller-loop` | 自动 actuator 可能误改系统状态，必须有人类门禁 |
| P0 | `https://x.com/sora19ai/status/2037472269967192241` | 约 60.3K views | cron、`/loop`、`/schedule`、GitHub Actions 触发器选择 | `scheduled-claude-code-maintenance-loop` | runtime 选择容易过期，需要避免绝对化表述 |
| P1 | `https://x.com/adiix_official/status/2034730013283512381` | 约 11K views | 多 agent 内容流水线、质量分、相似度检查、定时队列、kill switch | `social-content-autopilot-loop`、`content-performance-feedback-loop` | 涉及自动发布，必须默认只 queue 不直接 post |
| P1 | `https://x.com/Av1dlive/status/2063593645404791277` | 约 2.1K views | dynamic multi-agent workflow | 页面段落或后续模板 | 影响信号较弱，先作为补充研究 |
| P1 | `https://x.com/tinkerersanky/status/2063904707345563648` | 互动不高但主题贴合 | repo inspection、`.loop/loop.yaml`、loop audit | `codex-loop-plugin-audit-loop`、`loop-yaml-bootstrap-loop` | 不能假设具体插件行为，只抽象配置/bootstrap 模式 |

所有 X.com 来源只作为 pattern seed。站内模板必须是原创七字段规格，不复制 status 原文。

## Awesome List 分类映射

| README 分类 | AgentLoopHub 用法 |
| --- | --- |
| Concepts & Guides | 支撑 `/what-is-loop-engineering` 和比较页 |
| Loop Patterns | 支撑 `/agent-loop-examples` 和 future pattern hub |
| Templates | 反向链接到 `/loops/<slug>` canonical 页面 |
| Runtimes & Harnesses | 支撑 `/claude-code-loops`、`/codex-loops` |
| Scheduling & Triggers | 支撑 trigger selection 内容 |
| Verification & Guardrails | 支撑 verifier 和 human gates 字段 |
| State & Memory | 支撑 persist 字段和 state-machine 模板 |
| Cost Control | 支撑 token cost 和 budget 字段 |

## Awesome List 候选条目

```md
- [CI failure fixer loop](https://www.agentloophub.com/loops/ci-failure-fixer-loop) - Repair one failed CI workflow per cycle with local reproduction and PR verification.
- [PR review loop](https://www.agentloophub.com/loops/pr-review-loop) - Review open PRs with severity-separated findings and persisted head-SHA state.
- [Stale PR cleanup loop](https://www.agentloophub.com/loops/stale-pr-cleanup-loop) - Label and comment on abandoned PRs without automatically closing them.
- [Release notes loop](https://www.agentloophub.com/loops/release-notes-loop) - Draft release notes from merged PRs with source-backed bullets.
- [Docs refresh loop](https://www.agentloophub.com/loops/docs-refresh-loop) - Update stale docs after product changes and verify snippets/build output.
- [Security dependency loop](https://www.agentloophub.com/loops/security-dependency-loop) - Fix one dependency advisory with minimal upgrade churn and audit verification.
- [Screenshot QA loop](https://www.agentloophub.com/loops/screenshot-qa-loop) - Catch blank states and layout regressions with Playwright screenshots.
- [Search Console striking-distance loop](https://www.agentloophub.com/loops/search-console-striking-distance-loop) - Queue page-two SEO opportunities from GSC query/page data.
- [Codex loop plugin audit loop](https://www.agentloophub.com/loops/codex-loop-plugin-audit-loop) - Audit a repo before enabling recurring Codex automation.
- [Agent state-machine loop](https://www.agentloophub.com/loops/agent-state-machine-loop) - Run agent work through explicit states, guarded transitions, and terminal outcomes.
- [Desired-state controller loop](https://www.agentloophub.com/loops/desired-state-controller-loop) - Reconcile observed state toward a declared spec with actuator guardrails.
- [Scheduled Claude Code maintenance loop](https://www.agentloophub.com/loops/scheduled-claude-code-maintenance-loop) - Choose between cron, session loops, schedules, and GitHub Actions for Claude Code maintenance.
- [Social content autopilot loop](https://www.agentloophub.com/loops/social-content-autopilot-loop) - Queue social drafts with quality scoring, similarity checks, and a kill switch.
- [Content performance feedback loop](https://www.agentloophub.com/loops/content-performance-feedback-loop) - Turn analytics and GSC data into measured content next actions.
```
