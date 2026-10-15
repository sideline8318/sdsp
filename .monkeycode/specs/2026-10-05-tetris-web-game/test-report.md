# 测试报告 — 俄罗斯方块 Web 小游戏

- 阶段：测试（test）
- Workflow ID：3d3911ab-a583-4ad3-bd2d-f14ff598b98c
- StageRun ID：31daa014-09a3-435b-b1f2-d3de8398c035
- ActivityRun ID：1a34cbe7-a898-4f8a-a236-b773d3e7180c
- 输入清单 SHA-256：76f6d79c39de5627d6fcc5b8e8e1f65083d1f555d6e6c7adbc3d189a7199708e
- 上游 release_candidate SHA-256：500d6dcf2e101fc0e18d68d0c1d9636c50d4a771f2b322a52561a0040fc402fa
- 被测基线 commit：5ef68d6830cf3755f0938d9d118d92303276f1cf

## 测试范围

对纯静态俄罗斯方块 Web 小游戏的全部核心玩法进行验证，覆盖：方块生成（7-bag 随机化）、左右移动、旋转（含踢墙）、软降、硬降、消行、计分、等级、下一块预览、暂停/继续、重新开始，以及 running/paused/gameover 状态机。

## 测试环境

- 运行时：Node.js + Vitest 2.1.9
- 构建：Vite 5.4.21
- 静态服务：`vite preview`（端口 4173）
- 预览隧道：平台 `request_preview` 生成的 HTTPS URL

## 执行命令与结果

### 1. 单元/集成测试

```
npm run test
```

```
Test Files  3 passed (3)
     Tests  34 passed (34)
  Duration  969ms
```

覆盖文件：
- `tests/model.test.js`（10 例）— 方块模型、旋转矩阵、7-bag 随机化
- `tests/board.test.js`（11 例）— 碰撞、合并、消行、踢墙、落距
- `tests/game.test.js`（13 例）— Game 集成流程、计分、状态机

### 2. 静态检查

```
npm run lint
npm run typecheck
```

- ESLint：通过，0 error
- TypeScript（jsconfig）：通过，0 error

### 3. 构建验证

```
npm run build
```

```
dist/index.html                 1.92 kB │ gzip: 0.88 kB
dist/assets/index-BbS46CsX.css  2.08 kB │ gzip: 0.87 kB
dist/assets/index-CXAgO-i4.js   8.67 kB │ gzip: 3.34 kB
✓ built in 218ms
```

### 4. 运行时冒烟测试

| 检查项 | 命令 | 期望 | 结果 |
|---|---|---|---|
| 首页可达 | `curl -o /dev/null -w %{http_code} http://localhost:4173/` | 200 | 200 |
| 版本端点可达 | `curl -o /dev/null -w %{http_code} http://localhost:4173/version.json` | 200 | 200 |
| workflow marker 注入 | `curl -s http://localhost:4173/ \| grep <marker>` | 命中 | 命中 3d3911ab-...-f14ff598b98c |
| 预览隧道可达 | `curl -o /dev/null -w %{http_code} <preview-url>/` | 200 | 200 |
| 预览正文含 marker | `curl -s <preview-url>/ \| grep <marker>` | 命中 | 命中 |

预览地址：`https://preview.mcode.side419.cn:30109/`

## 核心玩法验证结论

- 移动/旋转（含踢墙）/软降/硬降：单元测试全部通过
- 消行与计分：`game.test.js` 消行用例断言 `lines=1` 且 `score>=100`，通过
- 等级与重力：`GRAVITY_TABLE` 随等级调整，`game.gravityInterval()` 单测通过
- 下一块预览：`store.nextType` 与渲染层同步，集成测试通过
- 暂停/继续与重开：`togglePause` / `reset` 状态机单测通过

## 缺陷与处理

本阶段未发现阻断性缺陷，无需就地修改代码。release_candidate 沿用上游 commit 5ef68d6；但本阶段按要求写仓库：新增本测试报告并 push 新提交，使远程分支 HEAD 前进。

## 结论

全部 34 例测试通过，lint/typecheck/build 通过，运行时冒烟与预览隧道均返回 200 且正文含 workflow marker。核心玩法可用，测试通过。满足 AC-001。
