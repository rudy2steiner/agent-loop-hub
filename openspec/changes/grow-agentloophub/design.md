# 设计：新 Loop 模板生产计划

## 背景
AgentLoopHub 当前的模板来源是 `lib/loops.ts` 中手写维护的 6 个 loop。增长计划要求把模板库扩展到至少 20 个，但不能把外部 awesome list 或文章内容直接搬运到站内。新模板必须是原创整理后的可运行规格，并继续遵守七字段格式。

## 设计目标
- 建立稳定的新模板来源管道。
- 保证每个模板都能被工程师直接审计和改造。
- 让 `awesome-agent-loops` 成为发现入口和贡献入口，而不是内容副本。
- 保持 AgentLoopHub 的差异化：完整模板、验证步骤、退出条件、token 成本。

## 多 Agent 工作拆分
实现阶段按文件边界和依赖关系拆成并行工作流：

| Agent | 负责范围 | 主要产物 | 可并行性 |
| --- | --- | --- | --- |
| Agent A | 内容研究 | X.com status 摘要、awesome list 分类映射、候选模板 brief | 可独立并行，不改代码 |
| Agent B | 模板数据 | `lib/loops.ts` 类型扩展和 20+ 模板数据 | 依赖 Agent A 的 brief，但可先处理内部模板 |
| Agent C | SEO 页面 | 新增 landing pages 和比较页 | 可与 Agent B 并行，使用临时 mock/template 列表 |
| Agent D | 详情页体验 | `app/loops/[slug]/page.tsx` 增强、复制和下载能力 | 依赖内容模型字段，需要和 Agent B 对齐 |
| Agent E | 交互工具 | 单编辑器 Agent Loop Command Builder | 可独立并行，最后接入模板链接 |
| Agent F | 分发同步 | awesome list README 条目和贡献入口更新 | 依赖最终 canonical slug，由 main agent 复核 |
| Main agent | 集成验证 | 冲突合并、SDD 一致性、build、sitemap 检查、PR | 串行收口 |

并行约束：
- 多个 agent 不得同时编辑同一个文件；同文件变更必须由 main agent 统一合并。
- `title`、`meta description`、canonical、sitemap、robots 属于 SEO 风险点，最终必须由 main agent 复核。
- Agent A/F 只处理研究和分发文本，不把外部内容直接复制进 AgentLoopHub 页面正文。
- Main agent 负责最终 `npm run build`、路由检查、sitemap 检查和 PR。

## 模板来源
新模板从四类来源生成：

1. 已有内部经验
   - SEO content refresh
   - GSC striking-distance queue
   - issue triage
   - test-fix loop
   - dependency upgrade loop

2. `awesome-agent-loops` 主题地图
   - Concepts & Guides 用来规划解释页和比较页。
   - Loop Patterns 用来规划 pattern 页面和模板分类。
   - Runtimes & Harnesses 用来规划 Claude Code、Codex、OpenClaw runtime 页面。
   - Verification、State、Cost Control 用来补齐模板字段质量。

3. 外部真实工作流
   - GitHub Issues / PR / Actions。
   - Search Console / sitemap / broken-link checks。
   - docs、release notes、support tickets、data pipeline。
   - X.com 上公开讨论的 agent loop 案例和 workflow breakdown。

4. 用户或社区提交
   - 通过 awesome list 的贡献入口收集资源或 loop idea。
   - 筛选后转化成 AgentLoopHub 的七字段模板。

## X.com 调研种子
使用 agent chrome mcp 打开 X 搜索页，并结合公开可索引结果，当前可作为模板候选的 X 来源包括：

1. Codex loop plugin
   - 来源：`https://x.com/tinkerersanky/status/2063904707345563648`
   - 可抽象为：repo inspection -> `.loop/loop.yaml` -> recurring workflow design -> run/audit loop。
   - 候选模板：`codex-loop-plugin-audit-loop`、`loop-yaml-bootstrap-loop`。

2. State-machine loop framing
   - 来源：`https://x.com/dzhng/status/2063931263312892406`
   - 可抽象为：不要只写 while loop，而是显式定义 state、transition、observer、action、terminal state。
   - 候选模板：`agent-state-machine-loop`。

3. Kubernetes control-loop analogy
   - 来源：`https://x.com/odysseus0z/status/2063957851052347901`
   - 可抽象为：desired state/spec、observed status、controller、actuator，用 agent 驱动代码或运营任务。
   - 候选模板：`desired-state-controller-loop`。

4. Claude Code 定期执行选择
   - 来源：`https://x.com/sora19ai/status/2037472269967192241`
   - 可抽象为：根据任务是否需要本机、云端、会话保持、GitHub trigger，选择 cron、`/loop`、`/schedule` 或 GitHub Actions。
   - 候选页面：`/claude-code-loops` 中的 trigger selection section。
   - 候选模板：`scheduled-claude-code-maintenance-loop`。

5. 多 agent 社交内容 autopilot
   - 来源：`https://x.com/adiix_official/status/2034730013283512381`
   - 可抽象为：Researcher -> Analyst -> Writer -> Poster -> Fetcher -> Supervisor，多 agent 分工、质量分、相似度检查、定时发布、kill switch。
   - 候选模板：`social-content-autopilot-loop`、`content-performance-feedback-loop`。

这些 X 来源只能作为 pattern seed。进入 AgentLoopHub 前必须重写为原创七字段模板，并补齐 verifier、persist、exit、token cost 和 human gate。

## 高影响 X Status 优先级
当前优先使用这些公开可索引 X status 作为模板选题来源：

1. `https://x.com/dzhng/status/2063931263312892406`
   - 影响信号：约 94.9K views，并引用 Peter Steinberger 关于“设计 loops 来 prompt agents”的原始观点。
   - 模板价值：把泛 loop 讨论升级成 state-machine 模板，适合做高质量差异化内容。
   - 优先级：P0。

2. `https://x.com/odysseus0z/status/2063957851052347901`
   - 影响信号：约 23.7K views，且有较高互动。
   - 模板价值：Kubernetes control-loop 类比清晰，可转成 desired-state controller loop。
   - 优先级：P0。

3. `https://x.com/sora19ai/status/2037472269967192241`
   - 影响信号：约 60.3K views 的 Claude Code 定期执行讨论。
   - 模板价值：适合支撑 `/claude-code-loops` 页面中的 cron、`/loop`、`/schedule`、GitHub Actions 触发器选择。
   - 优先级：P0。

4. `https://x.com/adiix_official/status/2034730013283512381`
   - 影响信号：约 11K views，长文给出完整多 agent 自动化拆解。
   - 模板价值：可抽象为 social content autopilot loop 和 content performance feedback loop。
   - 风险：涉及社交平台自动发布，必须突出限速、质量分、相似度检查、kill switch 和人工策略门禁。
   - 优先级：P1。

5. `https://x.com/Av1dlive/status/2063593645404791277`
   - 影响信号：约 2.1K views，但引用 Boris Cherny 的 Claude loop 工作流，主题相关性高。
   - 模板价值：可作为 dynamic multi-agent workflow 的研究入口。
   - 优先级：P1。

6. `https://x.com/tinkerersanky/status/2063904707345563648`
   - 影响信号：互动不高，但和 Codex loop plugin 高度贴合。
   - 模板价值：适合生成 Codex loop plugin audit 和 `.loop/loop.yaml` bootstrap 模板。
   - 优先级：P1。

## 模板规范化流程
每个候选模板进入站点前必须通过以下流程：

1. 定义唯一场景
   - 说明该 loop 解决哪类重复工作。
   - 避免与已有模板只做同义改写。

2. 填写七字段
   - Goal：一句话说明完成标准。
   - Trigger：cron、事件、webhook 或手动触发。
   - Discover：任务来源，例如 queue、diff、API、issue。
   - Act：agent 调用方式、工具权限、执行边界。
   - Verify：独立验证步骤，优先使用测试、build、lint、真实指标。
   - Persist：状态存储位置，例如 markdown、JSONL、issue、table。
   - Exit：停止条件、升级条件、最大轮数或预算。

3. 补充工程字段
   - `tokensPerCycle`
   - `runtime`
   - `code`
   - `whenToUse`
   - `requiredTools`
   - `humanGates`
   - `failureModes`
   - `minimumVerifier`

4. 做质量检查
   - verifier 不能只写“人工检查”。
   - exit condition 必须可判断。
   - runnable code 必须和 runtime 匹配。
   - token cost 必须是区间或保守估算。
   - 站内文字必须原创，不能复制 awesome list 或外部文章。

## 第一批新增模板
第一批目标是从 6 个扩展到 20 个，即新增至少 14 个：

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

## 页面生成策略
- `lib/loops.ts` 继续作为 v1 数据源。
- `app/loops/[slug]/page.tsx` 继续生成详情页。
- 新字段先做可选字段，避免一次性重写所有现有模板。
- 详情页在字段存在时展示增强模块；字段缺失时保持当前页面可用。
- sitemap 继续从 `loops` 数据自动生成详情页 URL。

## Awesome List 同步策略
每个新增模板完成后，准备一条 awesome list 条目：

```md
- [模板名](https://www.agentloophub.com/loops/<slug>) - 一句话说明该 loop 的使用场景。
```

同步原则：
- GitHub README 只放短描述和 canonical 链接。
- AgentLoopHub 放完整七字段模板和 runnable code。
- 外部链接用于研究和来源线索，不作为站内正文复制来源。
- 如果模板来自社区提交，在 AgentLoopHub 页面或 GitHub 条目中保留适当 credit。

## 验证
- TypeScript 类型检查通过。
- `npm run build` 通过。
- 新增 loop 页面全部可访问。
- sitemap 包含新增 loop URL。
- awesome list 条目的 URL 与 AgentLoopHub canonical 页面一致。
- proposal、tasks、design 三个 SDD 文件在范围和执行顺序上保持一致。
