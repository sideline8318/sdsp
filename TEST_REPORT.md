# 测试阶段报告

- Workflow: 2192abc0-3396-4d6a-a30c-e8911fe95564
- StageRun: 7c96b22b-ff70-48f4-82c7-3bb57aca33d1
- ActivityRun: fd22829e-f1aa-4532-bf4a-8609faf7a4b1
- Activity Key: test.work.1
- 输入清单 SHA-256: b25d77fad01079e9bc8b77a487db551215197c3a95707ff44a51d1adfaf93406
- 上游 release_candidate SHA-256: 5406a9bab1b3f8f156fd7cacd22d6651813d74ee6d3e6731a738b230d0401891
- 上游 release_candidate git commit: 07ce219cc3ed3f200117ed49ef96e4ceae1009e8

## 测试对象

单页静态交付物 `index.html`，byte_size = 3419。

## 测试用例与结果

1. artifact_identity_verified：`sha256sum index.html` = 5406a9bab1b3f8f156fd7cacd22d6651813d74ee6d3e6731a738b230d0401891，与上游 release_candidate SHA-256 逐字节一致。通过。
2. test_suite_passed：
   - 本地 HTTP：`http://127.0.0.1:8099/` 返回 HTTP 200，正文含 `<h1>MonkeyCode 公网可访问页面</h1>`、product-version 5e483cfb37e722acecab8a5fb32b737939ab363e（2 处）、workflow marker 2192abc0-3396-4d6a-a30c-e8911fe95564（2 处）。通过。
   - 公网 HTTP：`http://preview.mcode.side419.cn:30082/` 返回 HTTP 200，Content-Length 3419，正文含可见标题与全部版本/marker 标记。通过。
3. git_commit_pushed：本阶段将测试报告提交并 push 至 origin/main，远程 HEAD 前进产生新提交。通过。

## 公网 URL

http://preview.mcode.side419.cn:30082/

HTTP 200，页面可见标题 "MonkeyCode 公网可访问页面"。该端口未提供 HTTPS 监听（HTTPS 探测返回 000），公网可访问地址为上述 HTTP URL。

## 边界确认

单页、无需登录、无需数据库；未修改平台基础设施。
