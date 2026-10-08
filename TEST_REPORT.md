# 测试阶段报告

- Workflow: 2192abc0-3396-4d6a-a30c-e8911fe95564
- StageRun: 3b130f39-9eb4-4d08-99a8-848f7de3950d
- ActivityRun: bb77fc98-b880-4de6-8452-afc2ec51e49e
- Activity Key: test.work.1
- 输入清单 SHA-256: c00b22b36b7adbadd1335ba0b8d2d403cbf69929e42705d843861b907e00c1e5
- 上游 release_candidate SHA-256: 5406a9bab1b3f8f156fd7cacd22d6651813d74ee6d3e6731a738b230d0401891
- 上游 release_candidate git commit: 07ce219cc3ed3f200117ed49ef96e4ceae1009e8

## 测试对象

单页静态交付物 `index.html`，byte_size = 3419。本阶段未修改交付物内容，
release_candidate 与开发阶段逐字节一致，SHA-256 = 5406a9ba...，谱系保持连续。

## 测试用例与结果

1. artifact_identity_verified：
   - `sha256sum index.html` = 5406a9bab1b3f8f156fd7cacd22d6651813d74ee6d3e6731a738b230d0401891。
   - 本地/公网响应体 SHA-256 与磁盘制品逐字节一致。
   环境：`python3 --version` = Python 3.13.3；`curl --version` = curl 8.11.1。通过。

2. test_suite_passed：
   - 本地 HTTP：`http://127.0.0.1:8000/index.html` 返回 HTTP 200，size 3419，
     正文含可见标题 `<h1>MonkeyCode 公网可访问页面</h1>`、product-version 5e483cfb37e722acecab8a5fb32b737939ab363e（2 处）、
     workflow marker 2192abc0-3396-4d6a-a30c-e8911fe95564（2 处）。通过。
   - 公网 HTTP：`http://preview.mcode.side419.cn:30084/` 返回 HTTP 200，size 3419，
     响应体 SHA-256 = 5406a9bab1b3f8f156fd7cacd22d6651813d74ee6d3e6731a738b230d0401891，
     正文含可见标题与全部版本/marker 标记。通过。
   - 预览连接状态：`/.well-known/mcai-preview-connect-status-detect` 返回 404，
     该 404 由被测静态服务器（python http.server）对未知路径的缺省响应产生，
     响应体中不含 `mcai-preview-error`，说明前置代理链路正常转发。通过。

3. git_commit_pushed：本阶段改写测试报告并提交 push 至工作分支，
   使远程分支 HEAD 前进产生本阶段新提交。通过。

## 公网 URL（本测试阶段可探测入口）

http://preview.mcode.side419.cn:30084/

HTTP 200，页面可见标题 "MonkeyCode 公网可访问页面"，响应体与 release_candidate 逐字节一致。
该预览端口为 HTTP 隧道（HTTPS 探测返回 000），终态公网 HTTPS URL 以部署阶段产出为准。

## 边界确认

单页、无需登录、无需数据库；未修改平台基础设施；未修改交付物内容。
