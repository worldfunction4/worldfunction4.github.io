# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此仓库中工作时提供指导。

## 项目概览

泪叶丝 (LAYYES) 的静态博客网站，基于 [Docsify](https://docsify.js.org/) 构建，托管在 GitHub Pages 的 `layyes.com` 上。无需构建步骤 — 所有内容由 Docsify 在客户端渲染。

## 技术栈

### 核心框架
- **Docsify** - 一个轻量级的文档生成框架，无需构建过程，直接将 Markdown 文件转换为网站
- **GitHub Pages** - 免费的静态网站托管平台，支持自定义域名
- **Vue.js 主题** - 使用 Docsify 官方的 Vue 主题样式

### 前端技术
- **HTML5 + CSS3** - 自定义样式，包括毛玻璃效果、响应式布局
- **JavaScript** - 访问统计、暗黑模式支持等交互功能
- **Markdown** - 所有内容以 Markdown 格式编写

## 核心原理
- **Docsify** 通过监听 URL 的 hash 变化来动态加载对应的 Markdown 文件，并将其解析为 HTML 显示在页面上。它不需要预先构建静态文件，而是实时渲染内容。
- **GitHub Pages** 直接托管静态文件，用户访问时由 GitHub 的服务器提供 HTML、CSS 和 JavaScript 文件，完全不需要后端处理。

### 数据流工作流程

1. **初始化阶段**
   - `index.html` 加载 Docsify 脚本和 Vue 主题式样表
   - 配置 `window.$docsify` 对象（主题、插件等）

2. **路由与内容加载**
   - 用户访问不同路径时，Docsify 动态加载对应的 Markdown 文件
   - 无需服务器处理，完全客户端渲染

3. **内容渲染**
   - Markdown 被解析为 HTML
   - 应用自定义 CSS 样式（背景图、圆角、透明度等）
   - 插件处理特殊功能（目录、代码高亮、统计等）

4. **访问统计**
   - 使用浏览器 `localStorage` 和 `sessionStorage` 记录访问
   - 区分总访问数 (PV) 和独立访客数 (UV)
   - 数据完全存储在用户本地，无后端依赖

## 部署方式

### GitHub Pages 托管
1. 仓库配置：`Settings -> Pages -> Source: Deploy from a branch -> main`
2. CNAME 配置：配置自定义域名 `layyes.com`
3. 自动更新：每次 push 到 main 分支自动发布

### 核心特性
-  **零配置部署** - 直接 push Markdown 和 HTML 即可上线
-  **超快速度** - 纯静态文件，无数据库查询
-  **响应式设计** - 在手机/平板上自动适配
-  **美化外观** - 背景图片、玻璃态效果、深色模式支持
-  **访问追踪** - 本地 localStorage 统计，隐私友好

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

