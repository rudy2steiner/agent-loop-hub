# 把 AgentLoopHub 增长为可运行 Agent Loop 模板库

## 摘要
把 AgentLoopHub 从一个小型概念站扩展为“可运行 agent loop 模板”的参考库。站点应通过具体、可复制、有验证步骤和成本说明的模板，覆盖 `agent loop`、`Codex loops`、`Claude Code loops`、`loop engineering examples`、`agentic workflow templates` 等长尾搜索需求。

## 问题
当前站点具备基础可抓取性和清晰概念，但内容面太薄：

- 模板库目前只有 6 个 loop。
- 解释页会直接竞争多个偏定义型的 loop engineering 站点。
- Search Console 目前几乎没有可用查询数据，短期增长需要靠规划长尾覆盖。
- 站点还没有交互工具或可下载产物，缺少自然获取外链的资产。
- `rudy2steiner/awesome-agent-loops` 已经链接到 AgentLoopHub，但目前还没有被系统化用作内容入口、主题地图和分发渠道。

## 目标
- 第一阶段把 loop 模板从 6 个扩展到至少 20 个有用模板。
- 增加面向高意图入口的 SEO 页面：agent loop 模板、示例、Claude Code loops、Codex loops。
- 让每个 loop 详情页更可执行：使用场景、失败模式、所需工具、人工门禁、可复制代码。
- 增加一个实用工具：Agent Loop Command Builder，用于提高复访和外链价值。
- 保留现有七字段标准：goal、trigger、discover、act、verify、persist、exit，加 token cost。
- 把 `awesome-agent-loops` 用作外部发现入口和资源采集入口：GitHub 负责 curated list，AgentLoopHub 负责完整可运行模板。
- 使用 X.com 上公开讨论的 loop engineering、Claude Code、Codex workflow 作为 pattern seed，但进入站内前必须重写为原创七字段模板。

## 非目标
- 不把站点改成泛 AI agents 博客。
- 不在本提案中改动现有 title 或 meta description；如需改动，应单独做 SEO 审查。
- 不增加账号、支付或后端持久化。
- 不删除当前 loop 格式和已有页面。

## 范围

### 内容扩展
增加面向真实重复工作流的 loop 模板：

- CI failure fixer loop
- PR review loop
- stale PR cleanup loop
- release notes loop
- changelog drafting loop
- docs refresh loop
- security dependency loop
- flaky test quarantine loop
- screenshot QA loop
- broken-link repair loop
- Search Console striking-distance loop
- landing-page A/B copy loop
- support-ticket triage loop
- issue dedupe loop
- Codex loop plugin audit loop
- agent state-machine loop
- desired-state controller loop
- scheduled Claude Code maintenance loop
- social content autopilot loop
- content performance feedback loop

### SEO 页面
增加直接承接搜索意图的可索引页面：

- `/agent-loop-template`
- `/agent-loop-examples`
- `/claude-code-loops`
- `/codex-loops`
- `/loop-engineering-vs-prompt-engineering`
- `/loop-engineering-vs-agentic-workflows`

### Loop 详情页增强
为生成的详情页增加：

- 什么时候使用该 loop
- 所需输入和工具
- 人工审批点
- 常见失败模式
- 最小可用 verifier
- runnable code 复制按钮
- 可下载 markdown 版本

### 交互工具
构建一个纯浏览器的 Agent Loop Command Builder：

- 用户把完整 loop spec 粘贴进一个编辑器。
- 工具解析与现有 loop 模型一致的 goal、trigger、discover、act、verify、persist、exit。
- 工具可以从当前 `lib/loops.ts` 模板库选择任一 live loop，自动填充编辑器。
- 工具返回 readiness score 和缺失项。
- 工具根据当前 spec 生成可复制的 agent command，用于执行一个受控 loop cycle。
- 不需要后端或账号。

### GitHub Awesome List 分发
把 `https://github.com/rudy2steiner/awesome-agent-loops` 作为分发和选题管道，而不是复制成站内内容：

- README 继续作为 discovery 页面，链接到 AgentLoopHub 的完整模板。
- README 的分类结构用于规划 AgentLoopHub 的 hub 页面和模板分类。
- 每个新增 AgentLoopHub 模板，在 awesome list 中增加一行短描述和 canonical 链接。
- awesome list 的外部链接只作为研究和来源线索；AgentLoopHub 页面必须写成原创模板和原创说明。
- 通过贡献说明引导外部用户提交资源，筛选后转化成七字段模板。

### agentloophub.com 待办映射
本提案覆盖 `seo-ops/domains/agentloophub.com/todo.md` 中的全部站点级待办：

- 已完成：GSC service account 已加入 `sc-domain:agentloophub.com`，后续可用 Search Console 验证 impressions。
- 扩展 `lib/loops.ts`：从 6 个模板扩展到至少 20 个模板。
- 增加入口页：`/agent-loop-template`、`/agent-loop-examples`、`/claude-code-loops`、`/codex-loops`。
- 增加比较页：loop engineering vs prompt engineering、loop engineering vs agentic workflows。
- 增强模板详情页：增加代码复制或 markdown 下载。
- 增加工具页：Agent Loop Command Builder。
- 强化内链：从概念页、入口页和模板页互相链接。
- PR 规则：实现阶段必须先 build，再开 feature branch PR。

### 多 Agent 执行方式
实现阶段按独立文件边界拆给多个 agent 并行推进：内容研究、模板数据、SEO 页面、详情页体验、交互工具、awesome list 分发各自独立产出。Main agent 负责最终集成、冲突处理、SEO 风险点复核、build、sitemap 检查和 PR。

## 成功指标
- 至少 20 个 loop 详情页可索引。
- sitemap 包含所有新增页面。
- 每个新增页面有 canonical metadata。
- 每个 loop 详情页都能回链到相关 category/runtime hub。
- Search Console 开始出现至少 10 个非品牌查询的 impressions。
- 站点至少有一个可分享的实用工具页，而不只是静态内容。
- `awesome-agent-loops` 中新增模板条目能稳定回链到 AgentLoopHub 对应 canonical 页面。

## 风险
- 如果模板示例太泛，新增模板页可能变成 thin content。
- Codex 或 Claude Code 命令变化较快，runtime-specific 页面可能过期。
- 工具页如果没有导回模板库，可能分散站点主题。
- 如果把 awesome list 内容直接搬运到站内，会削弱 AgentLoopHub 的差异化并产生重复内容风险。

## 上线顺序
1. 增加更丰富的 loop 页面所需数据字段。
2. 把 `lib/loops.ts` 扩展到第一批 20 个模板。
3. 增加 SEO landing pages 和内部链接。
4. 改进详情页布局，加入复制和下载能力。
5. 增加 Agent Loop Command Builder。
6. 同步 `awesome-agent-loops` 的 README 链接和贡献入口。
7. 构建项目，检查 sitemap 输出，并打开 PR。
