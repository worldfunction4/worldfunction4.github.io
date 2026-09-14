# LAYYES · 泪叶丝的学习随笔

个人博客：[layyes.com](https://layyes.com)

记录网络技术、编程笔记和踩坑过程。更长的搭建经过见站点内 [博客搭建记录](https://layyes.com/start.html)。

## 技术栈

| 层级 | 选型 |
|------|------|
| 静态站点 | [VuePress 2](https://vuepress.vuejs.org/zh/) |
| 主题 | [vuepress-theme-hope](https://theme-hope.vuejs.press/zh/) |
| 打包 | Vite（`@vuepress/bundler-vite`） |
| 包管理 | pnpm |
| 图表 | Mermaid |
| 托管 | GitHub Pages（自定义域名 `layyes.com`） |
| CI | GitHub Actions：推送 `main` 后构建并发布 |

站点功能还包括分类 / 标签 / 时间轴、slimsearch 搜索、Atom Feed、百度统计。

## 本地开发

```bash
pnpm install
pnpm docs:dev
```

浏览器打开终端提示的本地地址（默认 `http://localhost:8080/`）。

```bash
pnpm docs:build   # 输出到 docs/.vuepress/dist
```

## 目录结构

```
docs/                 # 文章与站点内容（Markdown）
docs/.vuepress/       # 主题、布局、样式、静态资源
.github/workflows/    # GitHub Pages 部署工作流
```

新增笔记：在 `docs/` 对应目录下加 `.md`（带 frontmatter），侧边栏会按目录结构自动生成。

## 部署

推送到 `main` 即可。工作流见 `.github/workflows/docs.yml`：`pnpm docs:build` → 上传 `docs/.vuepress/dist` → GitHub Pages。
