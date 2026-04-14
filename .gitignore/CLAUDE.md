# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 项目概览

泪叶丝 (LAYYES) 的静态博客网站，基于 [Docsify](https://docsify.js.org/) 构建，托管在 GitHub Pages 的 `layyes.com` 上。无需构建步骤 — 所有内容由 Docsify 在客户端渲染。

## 本地开发

要在本地预览，使用任意静态文件服务器提供仓库根目录，例如：

```bash
npx serve .
# 或
python -m http.server 3000
```

没有 build、lint 或 test 命令。

## 项目结构

- `index.html` — 入口文件；包含所有 Docsify 配置（`window.$docsify`）、inline CSS 和 busuanzi 访问计数脚本
- `_coverpage.md` — 封面页内容；包含 busuanzi 计数器 HTML（`#busuanzi_value_site_pv`、`#busuanzi_value_site_uv`）
- `_sidebar.md` — 全局侧边栏导航（所有子目录通过 `alias` 配置复用）
- `README.md` — 封面后显示的首页内容
- 内容页面与 `_sidebar.md` 条目并行放置（例如 `Network/路由器.md`）

## 关键行为

- **Busuanzi 计数器**：通过 `sessionStorage`（`busuanzi_locked`）每个会话加载一次。使用 `/^\d+$/` 验证数据，最多重试 10 秒后超时。
- **侧边栏别名**：`'/.*/_sidebar.md': '/_sidebar.md'` 强制所有路由使用根侧边栏。
- **封面可见性**：`index.html` 中的 Docsify 插件在导航回 `/` 时重新显示封面。
## 当前需求

我需要重新设计博客的访客记录模块，要求如下：
- **重新设计代码逻辑**：将现在的访客记录和总访问量删除，重新设计。
- **视觉风格**：极简、半透明背景、位置和删除之前的位置一样。
- **功能**：显示总访问量和访客人数，数据通过 busuanzi 获取。
- **布局规范**：1.手机端访问时必须保持居中且不遮挡正文。2.字体颜色需适配 Docsify 的深色/浅色模式切换。