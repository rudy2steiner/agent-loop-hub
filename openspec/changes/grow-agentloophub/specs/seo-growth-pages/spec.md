# seo-growth-pages 规格

## ADDED Requirements

### Requirement: 站点必须增加高意图 SEO 入口页
AgentLoopHub SHALL add indexable landing pages for high-intent search entry points.

#### Scenario: 用户访问模板入口页
- **WHEN** 用户访问 `/agent-loop-template`
- **THEN** 页面 SHALL 解释七字段模板格式
- **AND** 页面 SHALL 链接到相关 loop 详情页
- **AND** 页面 SHALL 有自指 canonical

#### Scenario: 用户访问示例入口页
- **WHEN** 用户访问 `/agent-loop-examples`
- **THEN** 页面 SHALL 按场景展示多个 loop examples
- **AND** 每个 example SHALL 链接到完整模板详情页

#### Scenario: 用户访问 runtime 入口页
- **WHEN** 用户访问 `/claude-code-loops` 或 `/codex-loops`
- **THEN** 页面 SHALL 解释该 runtime 下的触发方式、工具权限和验证方式
- **AND** 页面 SHALL 链接到 runtime 匹配的 loop 模板

### Requirement: 站点必须增加比较页
AgentLoopHub SHALL add comparison pages that explain loop engineering relative to adjacent concepts.

#### Scenario: 用户访问 prompt engineering 比较页
- **WHEN** 用户访问 `/loop-engineering-vs-prompt-engineering`
- **THEN** 页面 SHALL 比较单次 prompt 和可重复 loop 的差异
- **AND** 页面 SHALL 把读者导向可运行模板

#### Scenario: 用户访问 agentic workflows 比较页
- **WHEN** 用户访问 `/loop-engineering-vs-agentic-workflows`
- **THEN** 页面 SHALL 说明 loop engineering 与 agentic workflow 的关系
- **AND** 页面 SHALL 链接到具体 workflow loop 模板

### Requirement: 新页面必须保留 SEO 基础设施
Every new SEO page SHALL have metadata, canonical URL, and sitemap inclusion.

#### Scenario: 新页面上线
- **WHEN** 新增 landing page 或 comparison page
- **THEN** 页面 SHALL 定义 page-level metadata
- **AND** 页面 SHALL 定义 canonical URL
- **AND** sitemap SHALL include the page URL
- **AND** robots behavior SHALL remain allowlisted

### Requirement: 不得意外改动现有 title 或 meta description
The change SHALL NOT modify existing website titles or meta descriptions unless explicitly approved.

#### Scenario: PR 审查 SEO diff
- **WHEN** main agent 做最终 review
- **THEN** SHALL 检查现有 title 和 meta description 是否被意外改动
- **AND** 如有改动 SHALL 单独说明并要求显式批准
