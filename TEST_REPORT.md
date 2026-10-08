# 测试阶段报告

- Workflow: 2192abc0-3396-4d6a-a30c-e8911fe95564
- StageRun: 19954480-445a-4aeb-a61f-8b41d7880391
- ActivityRun: 6f4a65d3-0edf-438a-a165-3eb19be82084
- Activity Key: test.work.1
- 输入清单 SHA-256: 9a35a3b2cac09359662854174bdb2152ca3eeee21c8ce823ad52f871269576aa
- 上游 release_candidate SHA-256: 5406a9bab1b3f8f156fd7cacd22d6651813d74ee6d3e6731a738b230d0401891
- 上游 release_candidate git commit: 07ce219cc3ed3f200117ed49ef96e4ceae1009e8

## 测试对象

单页静态交付物 `index.html`，byte_size = 3419。

## 测试用例与结果

1. artifact_identity_verified：`sha256sum index.html` = 5406a9bab1b3f8f156fd7cacd22d6651813d74ee6d3e6731a738b230d0401891，
   与上游 release_candidate SHA-256 逐字节一致。通过。
2. test_suite_passed：
   - 本地 HTTP：`http://127.0.0.1:8000/index.html` 返回 HTTP 200，正文含
     `<h1>MonkeyCode 公网可访问页面</h1>`、product-version 5e483cfb37e722acecab8a5fb32b737939ab363e（2 处）、
     workflow marker 2192abc0-3396-4d6a-a30c-e8911fe95564（2 处）。通过。
   - 公网 HTTP：`http://preview.mcode.side419.cn:30083/` 返回 HTTP 200，Content-Length 3419，
     响应体 SHA-256 = 5406a9bab1b3f8f156fd7cacd22d6651813d74ee6d3e6731a738b230d0401891，与上游制品逐字节一致，
     正文含可见标题与全部版本/marker 标记。通过。
   - 预览连接状态：请求 `/.well-known/mcai-preview-connect-status-detect` 响应中不含 `mcai-preview-error`，前置代理链路正常。通过。
3. git_commit_pushed：本阶段将测试报告提交并 push 至 origin/main，远程 HEAD 前进产生新提交。通过。

## 公网 URL

http://preview.mcode.side419.cn:30083/

HTTP 200，页面可见标题 "MonkeyCode 公网可访问页面"。该端口未提供 HTTPS 监听（HTTPS 探测返回 000），
公网可访问地址为上述 HTTP URL。终态公网 HTTPS URL 以部署阶段产出为准。

## 边界确认

单页、无需登录、无需数据库；未修改平台基础设施。
