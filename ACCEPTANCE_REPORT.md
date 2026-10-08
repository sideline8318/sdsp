# 验收阶段报告

- Workflow: 2192abc0-3396-4d6a-a30c-e8911fe95564
- StageRun: 2bf68cea-5c53-473e-a9b6-25082be061c8
- ActivityRun: fc8a0f21-0bbd-46c3-b4a4-eb40a66aa445
- Activity Key: acceptance.work.1
- 输入清单 SHA-256: 804e81183e7a8aeea383e799c5be1f40ba8465b2b96bbada2fb6ddfe42300e5a
- 上游 deployment_record SHA-256: d736bdd1df330b5f2354a5f93df1b0525834750d4e5b4e7eb4f8ebb3d668f84a
- 上游 release_candidate SHA-256: 5406a9bab1b3f8f156fd7cacd22d6651813d74ee6d3e6731a738b230d0401891

## 验收对象

单页静态交付物 `dist/index.html`，byte_size = 3419，
SHA-256 = 5406a9bab1b3f8f156fd7cacd22d6651813d74ee6d3e6731a738b230d0401891。
`index.html` 与 `dist/index.html` 逐字节一致，release_candidate 谱系连续，本阶段未修改交付物内容。

## 验收环境

- 生产 MonkeyCode 版本：5e483cfb37e722acecab8a5fb32b737939ab363e（页面正文绑定 2 处）。
- 运行时：`python3 --version` = Python 3.11.2。
- 静态服务器：`python3 -m http.server 8000 --bind 0.0.0.0`，工作目录 `/workspace/dist`，
  后台终端 term_1791477979167_1（PID 71）。
- 公网入口：平台 `request_preview` 暴露端口 8000，得到
  `http://preview.mcode.side419.cn:30087/`。

## 验收准则逐条结论

### AC-001（公网浏览器可打开最终 URL，HTTP 成功且页面有可见标题）

通过。公网地址 `http://preview.mcode.side419.cn:30087/` 返回 HTTP 200，
size = 3419，响应体 SHA-256 = 5406a9bab1b3f8f156fd7cacd22d6651813d74ee6d3e6731a738b230d0401891，
与磁盘制品逐字节一致；正文含可见标题 `<h1>MonkeyCode 公网可访问页面</h1>`。

### AC-002（旅程绑定当前生产版本 5e483cfb37e722acecab8a5fb32b737939ab363e）

通过。公网响应体正文中 product-version 标记
`5e483cfb37e722acecab8a5fb32b737939ab363e` 出现 2 处，
workflow marker `2192abc0-3396-4d6a-a30c-e8911fe95564` 出现 2 处，
交付物与当前生产版本一致。

### AC-003（同一 Workflow 七阶段可回查，终态给出公网 URL）

通过。Workflow 2192abc0-3396-4d6a-a30c-e8911fe95564 的需求、设计、
开发、测试、部署、验收阶段制品均以 SHA-256 谱系可回查；终态公网入口为
`http://preview.mcode.side419.cn:30087/`。

## 公网 URL 验证细节

1. 本地健康检查：`http://127.0.0.1:8000/index.html` 返回 HTTP 200，size 3419。通过。
2. 公网访问：`http://preview.mcode.side419.cn:30087/` 返回 HTTP 200，size 3419，
   响应体 SHA-256 与 release_candidate 逐字节一致。通过。
3. 预览连接状态：`/.well-known/mcai-preview-connect-status-detect` 返回 404，
   该 404 由被测静态服务器（python http.server）对未知路径的缺省响应产生，
   响应体中不含 `mcai-preview-error`，说明前置代理链路正常转发。通过。
4. HTTPS 探测：`https://preview.mcode.side419.cn:30087/` 返回 000（exit 35），
   当前平台预览隧道为 HTTP 入口，未终结 TLS；对业务方开放的公网地址以平台预览入口为准。

## 边界确认

- 单页静态页面；无需登录；无需数据库。
- 未修改平台基础设施。
- 交付物内容自开发阶段起未变更，SHA-256 保持 5406a9ba...。

## 最终交付

公网访问地址：`http://preview.mcode.side419.cn:30087/`

HTTP 200，页面可见标题 "MonkeyCode 公网可访问页面"，
绑定生产版本 5e483cfb37e722acecab8a5fb32b737939ab363e。
