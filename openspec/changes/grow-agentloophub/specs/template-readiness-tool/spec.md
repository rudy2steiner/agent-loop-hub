# template-readiness-tool 规格

## ADDED Requirements

### Requirement: 站点必须提供纯浏览器 Agent Loop Command Builder
AgentLoopHub SHALL provide a client-side Agent Loop Command Builder that evaluates whether a proposed loop is ready to run.

#### Scenario: 用户填写 loop 设计
- **WHEN** 用户把完整 loop spec 粘贴到一个编辑器
- **THEN** 工具 SHALL 返回 readiness score
- **AND** 工具 SHALL 检查与现有 loop 模型一致的 goal、trigger、discover、act、verify、persist、exit
- **AND** 工具 SHALL 列出缺失项
- **AND** 工具 SHALL 不要求账号或后端 API

### Requirement: Agent Loop Command Builder 必须输出可执行建议
The Agent Loop Command Builder SHALL convert missing fields into actionable recommendations.

#### Scenario: 缺少 verifier
- **WHEN** 用户没有提供 verifier
- **THEN** 工具 SHALL 提示添加测试、build、lint、真实指标或可重复检查
- **AND** 工具 SHALL 降低 readiness score

#### Scenario: 缺少 exit condition
- **WHEN** 用户没有提供 exit condition
- **THEN** 工具 SHALL 提示添加成功、失败、预算、最大轮数或人工升级条件
- **AND** 工具 SHALL 标记该 loop 不适合无人值守运行

### Requirement: Agent Loop Command Builder 必须导流到模板库
The Agent Loop Command Builder SHALL link users to relevant templates.

#### Scenario: 用户完成检查
- **WHEN** 工具生成结果
- **THEN** 工具 SHALL 推荐相关 loop 模板
- **AND** 推荐链接 SHALL 指向 AgentLoopHub canonical loop pages

### Requirement: Agent Loop Command Builder 必须能加载现有模板
The Agent Loop Command Builder SHALL load examples from the live loop library instead of hardcoded sample copy.

#### Scenario: 用户选择现有 loop 模板
- **WHEN** 用户在 checker 中选择一个 live loop 并点击加载
- **THEN** 工具 SHALL 使用当前 `lib/loops.ts` 数据生成完整 loop spec
- **AND** 编辑器 SHALL 显示该 loop 的 goal、trigger、discover、act、verify、persist、exit
- **AND** readiness score SHALL 基于加载后的 spec 自动更新

### Requirement: Agent Loop Command Builder 必须生成可复制 agent command
The Agent Loop Command Builder SHALL generate a command from the current loop spec.

#### Scenario: 用户编辑或加载 loop spec
- **WHEN** 当前 spec 包含七字段内容
- **THEN** 工具 SHALL 生成一个用于 agent 的 copyable command
- **AND** command SHALL 要求 agent 只执行一个受控 cycle
- **AND** command SHALL 包含缺失字段检查、discover、act、verify、persist 和 exit 规则
