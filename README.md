# 俄罗斯方块 Web 小游戏（Tetris）

一个纯静态、零后端的俄罗斯方块小游戏，使用原生 JavaScript (ES Modules) + HTML5 Canvas 2D 实现，可选使用 Vite 提供开发服务器与构建。

## 运行方式

```bash
# 安装依赖（仅开发/构建需要）
npm install

# 启动开发服务器（默认 5173 端口）
npm run dev

# 构建生产产物到 dist/
npm run build

# 预览构建产物
npm run preview
```

### 纯静态回退（无 Node 环境时）

```bash
# 在仓库根目录直接提供静态文件服务
python3 -m http.server 8000
```

## 操作说明

| 动作 | 键位 |
|---|---|
| 左移 | `ArrowLeft` / `A` |
| 右移 | `ArrowRight` / `D` |
| 软降 | `ArrowDown` / `S` |
| 硬降 | `Space` |
| 旋转 | `ArrowUp` / `W` |
| 暂停/继续 | `P` |
| 重新开始 | `R` |

## 版本回读

页脚展示 `vX.Y.Z (sha)`，同时可通过 `window.__APP_VERSION__` 与 `public/version.json` 回读版本信息。

## 文档

- 需求基线：`.monkeycode/specs/2026-10-05-tetris-web-game/requirements.md`
- 技术设计：`.monkeycode/specs/2026-10-05-tetris-web-game/design.md`
