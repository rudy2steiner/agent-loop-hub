# 待办

## 内容模型
- [x] 为 loop 数据增加可选字段：`whenToUse`、`requiredTools`、`humanGates`、`failureModes`、`minimumVerifier`。
- [x] 保持现有 loop 对象在新增字段期间仍然有效。
- [x] 更新扩展后 loop schema 的 TypeScript 类型。

## 多 Agent 并行拆分
- [x] Agent A - 内容研究：复核 X.com status、awesome list 分类和外部资源，只产出候选模板摘要，不改代码。
- [x] Agent B - 模板数据：扩展 `lib/loops.ts` 类型和模板数据，负责新增 20+ loop 的核心执行字段和工程字段。
- [x] Agent C - SEO 页面：实现 `/agent-loop-template`、`/agent-loop-examples`、`/claude-code-loops`、`/codex-loops` 和两个比较页。
- [x] Agent D - 详情页体验：增强 `app/loops/[slug]/page.tsx`，加入使用场景、工具、门禁、失败模式、最小 verifier、复制和下载。
- [x] Agent E - 交互工具：实现单编辑器纯浏览器 Agent Loop Command Builder，并把推荐结果链接到相关模板。
- [x] Agent F - 分发同步：准备 `awesome-agent-loops` README 条目和贡献入口更新，保持只放短描述和 canonical 链接。
- [x] Main agent - 集成验证：合并各 agent 输出，解决冲突，检查 SDD 一致性，运行 build，检查 sitemap，打开 PR。
- [x] 并行约束：多个 agent 不得同时编辑同一个文件；如果必须改同一文件，先产出 patch plan，由 main agent 统一合并。
- [x] 并行约束：title、meta description、canonical、sitemap、robots 相关改动由 main agent 最终复核。

## 模板库
- [x] 把模板库从 6 个扩展到至少 20 个 loop 模板。
- [x] 增加 coding 工作流模板。
- [x] 增加 SEO/content 工作流模板。
- [x] 增加 data 和 ops 工作流模板。
- [x] 从 X.com 调研种子中选择可落地模板，并重写为原创 loop 规格。
- [x] 确认每个模板都有具体 verifier 和 exit condition。
- [x] 确认每个模板都有合理的 token-cost 估算。

## 第一批新增模板
- [x] 增加 `ci-failure-fixer-loop`。
- [x] 增加 `pr-review-loop`。
- [x] 增加 `stale-pr-cleanup-loop`。
- [x] 增加 `release-notes-loop`。
- [x] 增加 `changelog-drafting-loop`。
- [x] 增加 `docs-refresh-loop`。
- [x] 增加 `security-dependency-loop`。
- [x] 增加 `flaky-test-quarantine-loop`。
- [x] 增加 `screenshot-qa-loop`。
- [x] 增加 `broken-link-repair-loop`。
- [x] 增加 `search-console-striking-distance-loop`。
- [x] 增加 `landing-page-ab-copy-loop`。
- [x] 增加 `support-ticket-triage-loop`。
- [x] 增加 `issue-dedupe-loop`。
- [x] 增加 `codex-loop-plugin-audit-loop`。
- [x] 增加 `loop-yaml-bootstrap-loop`。
- [x] 增加 `agent-state-machine-loop`。
- [x] 增加 `desired-state-controller-loop`。
- [x] 增加 `scheduled-claude-code-maintenance-loop`。
- [x] 增加 `social-content-autopilot-loop`，并补齐限速、质量分、相似度检查、kill switch 和人工策略门禁。
- [x] 增加 `content-performance-feedback-loop`，并补齐指标采集、反馈写回、低质量退出和人工策略门禁。

## X.com Status 调研
- [x] 复核 `https://x.com/dzhng/status/2063931263312892406`，提炼 `agent-state-machine-loop` 的 state、transition、observer、action、terminal state。
- [x] 复核 `https://x.com/odysseus0z/status/2063957851052347901`，提炼 `desired-state-controller-loop` 的 desired state、observed status、controller、actuator。
- [x] 复核 `https://x.com/sora19ai/status/2037472269967192241`，提炼 `/claude-code-loops` 的 cron、`/loop`、`/schedule`、GitHub Actions 触发器选择。
- [x] 复核 `https://x.com/adiix_official/status/2034730013283512381`，提炼 social/content loop 的多 agent 分工、质量分、相似度检查、定时发布和 kill switch。
- [x] 复核 `https://x.com/Av1dlive/status/2063593645404791277`，提炼 dynamic multi-agent workflow 候选模板或页面段落。
- [x] 复核 `https://x.com/tinkerersanky/status/2063904707345563648`，提炼 Codex loop plugin audit 和 `.loop/loop.yaml` bootstrap 候选模板。
- [x] 为每条 X status 记录来源 URL、影响信号、可抽象模式、候选模板 slug 和风险。
- [x] 确认 X status 只作为 pattern seed，不复制原文到站内模板。

## 模板质量门禁
- [x] 每个新增模板必须定义唯一场景，避免和已有模板只做同义改写。
- [x] 每个新增模板必须填写 goal、trigger、discover、act、verify、persist、exit。
- [x] 每个新增模板必须补充 `tokensPerCycle`、`runtime`、`code`。
- [x] 每个新增模板尽量补充 `whenToUse`、`requiredTools`、`humanGates`、`failureModes`、`minimumVerifier`。
- [x] 每个 verifier 必须优先使用测试、build、lint、真实指标或可重复检查，不能只写“人工检查”。
- [x] 每个 exit condition 必须可判断，包括成功、升级、预算、最大轮数或失败退出。
- [x] 每段 runnable code 必须和 runtime 匹配。
- [x] 每个 token cost 必须是区间或保守估算。
- [x] 每个模板正文必须原创，不复制 awesome list、X status 或外部文章。

## SEO Landing Pages
- [x] 增加 `/agent-loop-template`。
- [x] 增加 `/agent-loop-examples`。
- [x] 增加 `/claude-code-loops`。
- [x] 增加 `/codex-loops`。
- [x] 增加 `/loop-engineering-vs-prompt-engineering`。
- [x] 增加 `/loop-engineering-vs-agentic-workflows`。
- [x] 为每个页面增加 page-level metadata 和 canonical URL。
- [x] 从 landing pages 内链到相关 loop 详情页。

## Loop 详情页
- [x] 在每个 loop 详情页展示使用场景。
- [x] 展示所需输入和工具。
- [x] 展示人工审批门禁。
- [x] 展示常见失败模式。
- [x] 展示最小可用 verifier。
- [x] 增加复制代码交互。
- [x] 为每个 loop 增加可下载 markdown 版本。

## 交互工具
- [x] 增加纯浏览器 Agent Loop Command Builder。
- [x] 对 goal、trigger、discover、act、verify、persist、exit 完整度打分。
- [x] checker 从当前 live loop 模板库加载示例，而不是使用硬编码示例文案。
- [x] 根据当前 spec 生成可复制 agent command。
- [x] 把缺失项展示为可执行建议。
- [x] 从 checker 链接到相关 loop 模板。

## GitHub Awesome List 分发
- [x] 把 `rudy2steiner/awesome-agent-loops` 的 README 分类映射为 AgentLoopHub 的 hub 页面和模板分类候选。
- [x] 把 X.com 调研种子转为 awesome list 候选条目，只保留链接和单句描述。
- [x] 为每个新增 AgentLoopHub 模板准备一行 awesome list 条目：名称、canonical 链接、单句描述。
- [x] 确认 awesome list 只做 curated discovery，不复制完整模板内容。
- [x] 更新 awesome list 的贡献路径，引导外部提交资源或 loop idea。
- [x] 确认 AgentLoopHub 页面引用外部资源时写成原创说明，并保留必要来源链接。

## 导航和发现
- [x] 在有价值的位置增加 runtime/category hub 链接。
- [x] 确保 sitemap 包含所有新增静态页和 loop 页。
- [x] 确保 robots 和 canonical 行为不变。
- [x] 仅在能提升发现效率且不增加杂乱时，才增加 footer 或 nav 链接。

## 验证
- [x] 运行项目 build。
- [x] 本地检查生成页面路由。
- [x] 检查 sitemap 输出。
- [x] 检查新增模板和 awesome list 条目的 canonical 链接对应关系。
- [x] 确认没有意外改动现有 title 或 meta description。
- [ ] 打开 feature branch PR。
