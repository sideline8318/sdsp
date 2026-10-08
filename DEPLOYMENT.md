# 部署阶段记录

- Workflow: 2192abc0-3396-4d6a-a30c-e8911fe95564
- StageRun: cfccc9f3-8e5b-4c27-8143-e13cca58c53c
- ActivityRun: 1f05d178-0e36-4402-8bb2-e977cfcdec3e
- Activity Key: deployment.work.1
- 输入清单 SHA-256: 68fd7c79717ec1469d338a838bec9514b2ae549f538e7e00264d29948053fa9b
- 上游 release_candidate SHA-256: 5406a9bab1b3f8f156fd7cacd22d6651813d74ee6d3e6731a738b230d0401891
- 上游 release_candidate git commit: ae723172f45cb366fad769f2d3abe099feca350b

## 部署对象

单页静态交付物 `index.html`，byte_size = 3419，
SHA-256 = 5406a9bab1b3f8f156fd7cacd22d6651813d74ee6d3e6731a738b230d0401891。
部署产物目录 `dist/`，`dist/index.html` 与 release_candidate 逐字节一致。

## 部署方式

- 类型：静态网站（静态 HTML）。
- 服务器：`python3 -m http.server 8000 --bind 0.0.0.0`，由后台终端 term_1791473014974_1 承载。
- 预览入口：通过平台 `request_preview` 暴露公网隧道。
- 边界：单页、无需登录、无需数据库；未修改平台基础设施。

## 部署验证

1. health_check_passed：
   - 本地 `http://127.0.0.1:8000/index.html` 返回 HTTP 200。
   - 公网 `http://preview.mcode.side419.cn:30085/` 返回 HTTP 200，size 3419。
   - 预览健康检查端点 `/.well-known/mcai-preview-connect-status-detect` 响应体不含
     `mcai-preview-error`，前置代理链路正常转发。
2. tested_artifact_digest_matched：
   - 公网响应体 SHA-256 = 5406a9bab1b3f8f156fd7cacd22d6651813d74ee6d3e6731a738b230d0401891，
     与磁盘制品 `dist/index.html` 逐字节一致。
   - 正文含可见标题 `<h1>MonkeyCode 公网可访问页面</h1>`、product-version
     5e483cfb37e722acecab8a5fb32b737939ab363e 与 workflow marker
     2192abc0-3396-4d6a-a30c-e8911fe95564。
3. rollback_handle_recorded：
   - 回滚句柄 = 上游稳定提交 ae723172f45cb366fad769f2d3abe099feca350b。
   - 回滚方式：`git reset --hard ae723172f45cb366fad769f2d3abe099feca350b` 后重新 `git push`，
     或停用后台终端 term_1791473014974_1 并重新发布上一候选。
4. git_commit_pushed：本阶段提交部署记录并 push 至工作分支 `main`，
   使远程 HEAD 前进产生本阶段新提交。

## 公网访问入口

http://preview.mcode.side419.cn:30085/

HTTP 200，页面可见标题 "MonkeyCode 公网可访问页面"，响应体与 release_candidate 逐字节一致。
说明：当前平台预览隧道为 HTTP 入口，HTTPS 探测返回 000（隧道未终结 TLS）；
最终对业务方开放的公网地址以平台预览入口为准，页面本身与生产版本 5e483cfb 绑定。
