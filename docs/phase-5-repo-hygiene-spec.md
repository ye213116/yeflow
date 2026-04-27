# Phase 5 Repo Hygiene Spec

## 1. 目标与范围

本阶段目标是做一次**工程收口与仓库卫生整理**，把当前已经完成的 Phase 0-4 从“能开发、能演示”收口到“更适合继续协作开发”。

本阶段只处理以下范围：

- 清理不应纳入版本库的本地运行产物
- 调整 `.gitignore`
- 对齐 README 中的仓库初始化和本地运行说明
- 视情况做少量前后端文案收口，保证新 clone 仓库后更容易上手

本阶段默认不新增任何业务能力，不改工作流模型，不扩展运行时能力。

## 2. 数据表 / 状态变更

本阶段默认**不新增表结构、不修改状态机**。

涉及的数据处理仅限于：

- 将本地 H2 运行数据库文件从版本控制中移除
- 保留数据库生成机制本身，不改 `workflow`、`workflow_node`、`workflow_run`、`workflow_run_step` 的结构定义

如果需要支持本地首次启动自动生成数据目录，只通过 `.gitignore` 和文档说明处理，不引入迁移脚本。

## 3. 涉及修改的文件列表

预计修改文件如下：

- `.gitignore`
- `README.md`
- `docs/phase-5-repo-hygiene-spec.md`

预计可能修改的少量实现文件：

- `web/src/App.tsx`
- `web/src/pages/WorkflowEditorPage.tsx`
- `web/src/pages/RunDetailPage.tsx`
- `api/src/main/java/com/paiagent/api/controller/ApiExceptionHandler.java`

预计会从版本控制中移除的本地运行产物：

- `api/data/paiagent-db.mv.db`
- `api/data/paiagent-db.trace.db`

本阶段默认不修改：

- `api/src/main/java/com/paiagent/api/service/*`
- `api/src/main/java/com/paiagent/api/provider/*`
- `web/src/api/*`
- `web/src/types/*`

## 4. 核心逻辑思路

### 4.1 仓库卫生整理

- 将 H2 生成的本地数据库文件加入 `.gitignore`
- 将已被提交的本地数据库文件从 Git 跟踪中移除，但不删除开发者本地文件本身
- 保持 `api/data/` 作为本地运行时目录约定，不引入额外脚本

### 4.2 文档对齐

- 在 `README.md` 中补充“首次 clone 后如何启动”的明确步骤
- 明确说明数据库文件是本地产物，不应提交
- 保持 README 内容只描述当前已经实现的能力，不写未来态

### 4.3 体验收口

- 如果存在明显影响演示或新开发者理解的前后端提示文案，再做少量收口
- 只处理“读起来容易误解”的提示，不做 UI 结构变化

### 4.4 为什么本阶段要先做

- 当前仓库已经完成 Phase 0-4 主链路，但把本地数据库文件纳入版本库，会导致后续协作时出现脏数据、误冲突和错误认知
- 在真实接入 Provider 前先把仓库基础卫生处理好，可以避免后面一边扩功能、一边补基础清理，增加返工概率

## 5. 风险点

- 如果直接删除本地数据文件而没有解释清楚，容易让开发者误以为项目缺少必要数据资产
- 如果顺手开始做数据库初始化脚本、测试基建或大规模文档重写，会超出本阶段授权范围
- 如果把 `.gitignore` 改得过宽，可能误伤后续真正需要纳入版本库的文件

## 6. 验证方式

本阶段完成后，建议执行以下验证：

后端最小验证：

```bash
cd api
./mvnw -q -DskipTests compile
```

前端最小验证：

```bash
cd web
pnpm build
```

Git 侧验证：

```bash
git status
```

预期现象：

- 本地数据库文件不再被 Git 跟踪
- `.gitignore` 能正确忽略 H2 产物
- README 能清楚说明初始化与运行步骤
- 前后端最小构建仍然通过

## 7. 本阶段不做什么

- 不接真实 LLM / TTS Provider
- 不新增节点类型
- 不修改工作流定义模型
- 不修改运行时状态机
- 不引入测试框架重构
- 不做拖拽画布
- 不做全局状态管理升级
- 不做部署脚本或 CI 流水线搭建

## 当前 worktree / 当前主题 / 不涉及范围

- 当前 worktree：`/home/zyh/yeflow-worktrees/phase-5-repo-hygiene`
- 当前分支：`feature/phase-5-repo-hygiene`
- 当前主题：`phase-5-repo-hygiene`
- 不涉及范围：Provider 真接入、运行能力扩展、前端结构升级、测试体系补齐
