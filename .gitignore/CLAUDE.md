# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

泪叶丝 (LAYYES) 的个人博客，基于 [Docsify](https://docsify.js.org/) 构建，托管在 GitHub Pages（自定义域名 `layyes.com`）。**无构建步骤** — Docsify 在客户端实时将 Markdown 渲染为 HTML，直接 push 即发布。

## 本地开发

没有 build、lint 或 test 命令。本地预览用任意静态文件服务器：

```bash
npx serve .
# 或
python -m http.server 3000
```

部署：push 到 `main` 分支后，`.github/workflows/static.yml` 中的 GitHub Actions 自动发布到 GitHub Pages。

## 架构

站点核心逻辑集中在三个文件：

- **`index.html`** — 唯一入口。包含所有自定义 CSS（`<style>` 块）、Docsify 配置对象 `window.$docsify`、访客统计 JS。外部依赖仅 Docsify 本体和 zoom-image 插件，均从 jsDelivr CDN 加载。
- **`_sidebar.md`** — 定义全局侧边栏导航树。所有子目录侧边栏请求通过 `alias: { '/.*/_sidebar.md': '/_sidebar.md' }` 统一指向此文件。
- **`_coverpage.md`** — 首页封面内容（标语、按钮、访客统计 HTML 占位符）。

内容目录（Markdown 文件与 `_sidebar.md` 中的链接路径对应）：

| 目录 | 内容 |
|------|------|
| `Network/` | 路由器、交换机配置笔记；eNSP 安装 |
| `eNSP实验/` | eNSP 基础实验 |
| `study_feel/` | Git 踩坑实践 |
| `study_road/` | 计算机网络概述 |
| `assets/` | 图片资源（背景图、文章图） |

## 关键行为

### 访客统计
纯本地实现，无任何外部分析服务：
- `localStorage['layyes_pv']` / `localStorage['layyes_uv']` — 持久化的 PV 和 UV 计数
- `sessionStorage['layyes_visited']` — 标记当前会话是否已计入 UV
- 全局变量 `window._bszPV` / `window._bszUV` — 连接初始化脚本与 Docsify 插件
- DOM ID `busuanzi_value_site_pv` / `busuanzi_value_site_uv` — 路由切换时更新显示
- `.cover-stats` 默认 `display:none`，Docsify 的 `doneEach` 钩子仅在路由为 `/` 或 `/README` 时添加 `.visible` 类使其显示（左下角 fixed 定位，手机端水平居中）

### 侧边栏
`alias: { '/.*/_sidebar.md': '/_sidebar.md' }` 强制所有子路由使用根目录的 `_sidebar.md`，无需在子目录下单独创建侧边栏文件。

### 封面
`onlyCover: false` — 封面显示后可向下滚动进入正文；`subMaxLevel: 3` — 自动从 Markdown 标题生成页内目录。

## 新增博客内容

1. 在对应目录（`Network/`、`study_feel/` 等）新建 `.md` 文件
2. 在 `_sidebar.md` 中添加链接 — 路径**不带** `.md` 扩展名（Docsify 约定）
3. 图片放在 `assets/` 目录下并在 Markdown 中引用
