# distribution-pipeline 规格

## ADDED Requirements

### Requirement: awesome-agent-loops 必须作为分发和选题管道
The `rudy2steiner/awesome-agent-loops` repository SHALL act as curated discovery and intake, while AgentLoopHub remains the canonical template library.

#### Scenario: 新模板发布
- **WHEN** AgentLoopHub 发布一个新模板
- **THEN** SHALL 准备一条 awesome list 条目
- **AND** 条目 SHALL 包含名称、canonical URL 和单句描述
- **AND** 条目 SHALL NOT 包含完整模板正文

### Requirement: awesome list 分类必须反哺站内结构
The awesome list README categories SHALL inform AgentLoopHub hub pages and template categories.

#### Scenario: 规划新增 hub 页面
- **WHEN** README 中存在 Concepts、Loop Patterns、Runtimes、Verification、State 或 Cost Control 分类
- **THEN** SHALL 评估是否转化为 AgentLoopHub hub 页面或模板分类

### Requirement: 外部来源必须保留来源线索但不复制内容
External links SHALL be treated as research sources, not copied body content.

#### Scenario: 页面引用外部资源
- **WHEN** AgentLoopHub 页面使用 X.com、GitHub 或文章作为来源线索
- **THEN** 页面 SHALL 使用原创说明
- **AND** 在必要时 SHALL 保留来源链接或 credit

### Requirement: 贡献路径必须导入模板生产流程
Community submissions SHALL be routed into the seven-field template normalization workflow.

#### Scenario: 用户提交 loop idea
- **WHEN** 用户通过 awesome list 提交资源或 idea
- **THEN** 维护者 SHALL 筛选该资源
- **AND** 合格资源 SHALL 被转化为原创七字段模板候选
