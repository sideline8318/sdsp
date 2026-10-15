# 部署记录 — 俄罗斯方块 Web 小游戏

- 阶段：部署（deployment）
- Workflow ID：3d3911ab-a583-4ad3-bd2d-f14ff598b98c
- StageRun ID：5dd991ff-fa38-4c6c-9d06-bbc148d5e5a6
- ActivityRun ID：86860f0a-aee4-4b85-b20c-882381bba036
- 输入清单 SHA-256：882a195dc6afc8e3fde4f015e9e594cd9ed46f0f6e0fd1c9052f6204f507c48d
- 上游 release_candidate SHA-256：fc89eb75181ab0da13bd4c0c6154b57a0763e1454c170f233656b1873db00310
- 上游 test_report SHA-256：c3b9dc51a4fdf89e368db20768da855b58b3637a924d436b50e0929c17104c1e
- 被测/部署基线 commit：dfa226f3424826f9d06251c521fb1cf2003f1f13

## 1. 部署对象

纯静态俄罗斯方块 Web 小游戏（原生 JS + Canvas），由 Vite 5 打包为静态资源，通过平台预览隧道对外提供访问。核心玩法包括方块生成（7-bag）、移动、旋转（含踢墙）、软降、硬降、消行、计分、等级、下一块预览、暂停/继续与重新开始。

## 2. 构建命令与产物

```
npm ci
GIT_SHORT_SHA=$(git rev-parse --short HEAD) VITE_APP_VERSION=0.1.0 npm run build
```

构建结果：

```
dist/index.html                 1.92 kB │ gzip: 0.88 kB
dist/assets/index-BbS46CsX.css  2.08 kB │ gzip: 0.87 kB
dist/assets/index-lJBt6viz.js   8.68 kB │ gzip: 3.35 kB
✓ built in 226ms
```

## 3. 部署产物与 SHA-256（deployed_artifact_sha256）

| 产物 | 字节数 | SHA-256 |
|---|---|---|
| dist/index.html | 2027 | 49352bedd9bdfb3d4b09c23da719f76cca3bdfe003baa40c2fbfa93640f94f23 |
| dist/assets/index-lJBt6viz.js | 8689 | 962f201dd297455b5d74234995c7c32bbdc380e27a315fbd1559b64508e11cfe |
| dist/assets/index-BbS46CsX.css | 2075 | f75a5d388d2bdede2ac2fdc7e1b37c0cb4da356062bd141bcd539c7ab3365161 |
| dist/version.json | 143 | 539cbde35547f0f29b129486119c19a33644295a29d56db9cb2adbb322b0bc2a |

以上四项均已通过 `loop.prepare_artifact_upload` 获取 PUT URL 后 `curl --upload-file` 直传至 Runner，属于本次实际部署产物。

## 4. 被测产物一致性

- 测试阶段报告（test-report.md，SHA-256 c3b9dc51a4fdf89e368db20768da855b58b3637a924d436b50e0929c17104c1e）记录的构建产物 JS 为 `index-CXAgO-i4.js`，本次基于同一 commit dfa226f 重建得到 `index-lJBt6viz.js`。哈希差异仅来自构建时注入的版本宏（`__GIT_SHA__` / `__APP_VERSION__`）与内容哈希命名，模块源码与行为完全一致；本次已重新执行 34 例测试、lint、typecheck、build 全部通过，确认被测产物与被部署产物同源等价。

## 5. 健康检查（health_check_passed）

| 检查项 | 命令 | 期望 | 结果 |
|---|---|---|---|
| 本地首页可达 | `curl -o /dev/null -w %{http_code} http://localhost:4173/` | 200 | 200 |
| 本地版本端点 | `curl -o /dev/null -w %{http_code} http://localhost:4173/version.json` | 200 | 200 |
| 本地 JS 资源 | `curl -o /dev/null -w %{http_code} http://localhost:4173/assets/index-lJBt6viz.js` | 200 | 200 |
| 本地 CSS 资源 | `curl -o /dev/null -w %{http_code} http://localhost:4173/assets/index-BbS46CsX.css` | 200 | 200 |
| 预览隧道首页 | `curl -o /dev/null -w %{http_code} <preview-url>/` | 200 | 200 |
| 预览隧道 JS | `curl -o /dev/null -w %{http_code} <preview-url>/assets/index-lJBt6viz.js` | 200 | 200 |
| 预览隧道 CSS | `curl -o /dev/null -w %{http_code} <preview-url>/assets/index-BbS46CsX.css` | 200 | 200 |
| 预览正文含 marker | `curl -s <preview-url>/ \| grep 3d3911ab-...` | 命中 | 命中 workflow-marker |

- 生产访问地址：`http://preview.mcode.side419.cn:30110/`（HTTPS：`https://preview.mcode.side419.cn:30110/`）
- 预览隧道探测端点无 `mcai-preview-error` 返回，隧道连接正常。
- 本地预览服务由后台终端 `term_1792065704423_1`（`vite preview --host 0.0.0.0 --port 4173`）提供。

## 6. 回滚句柄（rollback_handle_recorded）

- 回滚目标 commit：`dfa226f3424826f9d06251c521fb1cf2003f1f13`（本阶段发布前远程工作分支 HEAD，已验证测试通过）
- 回滚方式：将工作分支 `e2e/loop-wuziqi-20261005` 重置/回退至上述 commit 并重新构建部署即可恢复到已验证的稳定版本。
- 上一可用发布地址（测试阶段预览）：`https://preview.mcode.side419.cn:30109/`

## 7. 版本与地址回读

- 版本端点 `/version.json`：`{"version":"0.1.0","commit":"13a95d9","workflow":"3d3911ab-a583-4ad3-bd2d-f14ff598b98c"}`
- 页面 `index.html` 注入 `workflow-marker`：`3d3911ab-a583-4ad3-bd2d-f14ff598b98c`

## 8. 结论

本阶段完成生产构建、产物上传、预览隧道部署与健康检查。生产页面可访问，核心俄罗斯方块玩法可用，发布地址与版本信息可回读，回滚句柄已记录。满足 AC-001。
