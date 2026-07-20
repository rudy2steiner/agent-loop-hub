# loop-template-library 规格

## ADDED Requirements

### Requirement: 模板库必须扩展到至少 20 个可索引 loop
AgentLoopHub SHALL expose at least 20 loop templates as indexable detail pages.

#### Scenario: 新增模板被发布
- **WHEN** `lib/loops.ts` 包含新增 loop 对象
- **THEN** 每个 loop SHALL 通过 `app/loops/[slug]/page.tsx` 生成详情页
- **AND** 每个详情页 SHALL 有稳定 slug
- **AND** sitemap SHALL 包含该详情页 URL

### Requirement: 每个模板必须保留七字段标准
Every loop template SHALL include the seven required loop fields: goal, trigger, discover, act, verify, persist, and exit.

#### Scenario: 模板被渲染
- **WHEN** 用户打开任意 loop 详情页
- **THEN** 页面 SHALL 展示 goal、trigger、discover、act、verify、persist、exit
- **AND** verify 字段 SHALL 被明确标出
- **AND** exit 字段 SHALL 描述可判断的停止或升级条件

### Requirement: 每个模板必须包含工程执行字段
Every loop template SHALL include runtime, runnable code, and token cost.

#### Scenario: 工程师复制模板
- **WHEN** 用户查看 loop 详情页
- **THEN** 页面 SHALL 展示 runtime
- **AND** 页面 SHALL 展示 runnable code
- **AND** 页面 SHALL 展示 tokens per cycle 或保守 token cost 区间

### Requirement: 新增增强字段必须向后兼容
The expanded loop schema SHALL support optional engineering fields without breaking existing templates.

#### Scenario: 老模板缺少增强字段
- **WHEN** loop 对象没有 `whenToUse`、`requiredTools`、`humanGates`、`failureModes` 或 `minimumVerifier`
- **THEN** 页面 SHALL 继续正常渲染
- **AND** 不得显示空白模块或 undefined 文本

#### Scenario: 新模板包含增强字段
- **WHEN** loop 对象包含增强字段
- **THEN** 详情页 SHALL 展示使用场景、所需工具、人工门禁、失败模式和最小 verifier

### Requirement: X.com 和 awesome list 只能作为 pattern seed
External sources SHALL be transformed into original AgentLoopHub templates before publication.

#### Scenario: 从 X.com status 生成模板
- **WHEN** 模板候选来自 X.com status
- **THEN** 站内正文 SHALL 使用原创七字段规格
- **AND** 不得复制 status 原文作为模板正文
- **AND** 模板 SHALL 补齐 verifier、persist、exit、token cost 和 human gate

#### Scenario: 从 awesome list 生成模板
- **WHEN** 模板候选来自 `awesome-agent-loops`
- **THEN** AgentLoopHub SHALL publish the full runnable template
- **AND** awesome list SHALL only keep short description and canonical link
