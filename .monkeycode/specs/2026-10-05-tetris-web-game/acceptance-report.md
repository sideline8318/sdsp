# 验收报告 — 俄罗斯方块 Web 小游戏

- 阶段：验收（acceptance）
- Workflow ID：3d3911ab-a583-4ad3-bd2d-f14ff598b98c
- StageRun ID：bd62c686-7dc8-48ca-8ceb-69118e818836
- ActivityRun ID：b83fe476-510c-45f9-b1d7-c507dc2e218b
- 输入清单 SHA-256：7e2cc7836c76be2cdf6458e8f23ee720995acb017f1819866ff35a499a2646c3
- 上游 release_candidate SHA-256：8b7399c87402e97793c8567a837dda28031efee4b66d43160bc33c674edf79a2
- 上游 deployment_record SHA-256：af40925f951c2d97f32d032a60ad490c16ac37b1d031ea046cdedae01a8eec9e
- 发布候选 commit：7532be241264c839a1fd0bdfab3c1112523001c6

## 1. 验收目标

验证七阶段流程完成、生产页面可访问、核心俄罗斯方块玩法可用、发布地址与版本可回读，对应验收准则 AC-001。

## 2. 验收环境绑定（release_environment_bound）

| 项 | 值 |
|---|---|
| 工作分支 | e2e/loop-wuziqi-20261005 |
| 发布候选 commit | 7532be241264c839a1fd0bdfab3c1112523001c6 |
| 生产访问地址 | http://preview.mcode.side419.cn:30114/ |
| HTTPS 访问地址 | https://preview.mcode.side419.cn:30114/ |
| 本地预览服务 | vite preview --host 0.0.0.0 --port 4173 |
| 平台预览端口 | 4173 → 30114 |

## 3. 验收检查结果

### 3.1 生产页面可访问

| 检查项 | 命令 | 期望 | 结果 |
|---|---|---|---|
| 本地首页 | `curl -o /dev/null -w %{http_code} http://localhost:4173/` | 200 | 200 |
| 隧道首页 | `curl -o /dev/null -w %{http_code} <preview>/` | 200 | 200 |
| 本地版本端点 | `curl -o /dev/null -w %{http_code} http://localhost:4173/version.json` | 200 | 200 |
| 隧道 JS 资源 | `curl -o /dev/null -w %{http_code} <preview>/assets/index-C4txaew0.js` | 200 | 200 |
| 隧道 CSS 资源 | `curl -o /dev/null -w %{http_code} <preview>/assets/index-BbS46CsX.css` | 200 | 200 |

### 3.2 发布地址与版本可回读

- 页面注入 workflow marker：`3d3911ab-a583-4ad3-bd2d-f14ff598b98c`（隧道正文命中）
- 版本端点 `/version.json` 回读：`{"version":"0.1.0","commit":"13a95d9","workflow":"3d3911ab-a583-4ad3-bd2d-f14ff598b98c"}`
- 隧道探测正文无 `mcai-preview-error` 标记，隧道连接健康

### 3.3 核心玩法可用

在发布候选 commit 上重新执行验证：

| 项 | 命令 | 结果 |
|---|---|---|
| 单元/集成测试 | `npm run test` | 34 passed (3 files) |
| 静态检查 | `npm run lint` | 通过，无告警 |
| 类型检查 | `npm run typecheck` | 通过 |
| 生产构建 | `npm run build` | 成功，产出 dist/ |

测试覆盖核心玩法：reset 运行态与空棋盘、左右移动、软/硬降与计分、消行与等级、暂停/恢复状态机、暂停时输入失效、重新开始复位、出生碰撞 gameover、tick 自然下落、坐标契约。核心玩法在功能层面被证明可用。

## 4. 交付链路完整性

- 需求：`.monkeycode/specs/2026-10-05-tetris-web-game/requirements.md`
- 设计：`.monkeycode/specs/2026-10-05-tetris-web-game/design.md`
- 测试报告：`.monkeycode/specs/2026-10-05-tetris-web-game/test-report.md`
- 部署记录：`.monkeycode/specs/2026-10-05-tetris-web-game/deployment-record.md`
- 验收报告：本文件
- 七阶段（需求 → 设计 → 开发 → 测试 → 部署 → 验收）链路闭环，各阶段产物哈希链完整。

## 5. 缺陷与就地修复

验收过程未发现阻断性缺陷；发布候选 commit 7532be2 页面可访问、玩法可用、版本可回读，无需就地修改代码。本次验收提交仅新增本报告，release_candidate 沿用上游已部署候选以维持交付一致性。

## 6. 结论

AC-001 全部满足：七阶段流程完成，生产页面可访问，核心俄罗斯方块玩法可用，发布地址和版本可回读。验收通过。
