# multi-agent-delivery 规格

## ADDED Requirements

### Requirement: 复杂实现必须拆分为多 agent 并行任务
Substantial implementation work SHALL be split into independent multi-agent tasks when safe.

#### Scenario: 实现增长计划
- **WHEN** 开始实现本 change
- **THEN** SHALL 按内容研究、模板数据、SEO 页面、详情页体验、交互工具、分发同步和集成验证拆分任务
- **AND** 可独立文件边界的任务 SHALL 并行执行

### Requirement: 每个 agent 必须有明确产物和边界
Each worker agent SHALL have a clear output and editing boundary.

#### Scenario: 分配 worker agent
- **WHEN** main agent 分配子任务
- **THEN** SHALL 指定 agent 的负责范围、主要产物、可编辑文件和禁止改动范围
- **AND** 研究型 agent SHALL 不直接改代码

### Requirement: 同文件变更必须由 main agent 合并
Multiple worker agents SHALL NOT edit the same file concurrently.

#### Scenario: 两个任务需要修改同一文件
- **WHEN** 多个 agent 都需要修改同一文件
- **THEN** worker agent SHALL 产出 patch plan 或内容草稿
- **AND** main agent SHALL 统一合并最终文件

### Requirement: SEO 风险点必须由 main agent 最终复核
The main agent SHALL review SEO-sensitive changes before PR.

#### Scenario: 准备打开 PR
- **WHEN** 实现阶段完成
- **THEN** main agent SHALL 检查 title、meta description、canonical、sitemap 和 robots 相关 diff
- **AND** main agent SHALL 运行 build
- **AND** main agent SHALL 检查 sitemap 输出
- **AND** main agent SHALL 打开 feature branch PR
