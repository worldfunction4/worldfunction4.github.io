---
title: 博客搭建记录
date: 2026-04-12
category:
  - 随笔
---
# 博客搭建记录

## 项目初衷

最初是想利用 GitHub Pages 搭建个人博客，虽然可以用其他平台来写，但就是有点想试试折腾一下。想到自己最近学习的过程，突然觉得也许博客也挺有必要的，于是先用 Docsify 和 GitHub Pages 搭了一个很简单的站点。当时要写什么还真没经验，想到什么写什么好了（话说真的会有人看这种半吊子的东西吗 233）。打算用来记录学习过程中遇到的问题、技术总结和个人思考：Markdown 写起来轻松，Docsify 也能很快变成一个能看的网站。

> 2026 年 9 月补记：站点已经从 Docsify 迁到 VuePress。下面会把换栈的原因和现在的技术栈写清楚，开头这段初衷还是当时的想法，就不改成「一开始就用 VuePress」了。

## 为什么换掉 Docsify

Docsify 的好处很直接：**不用构建**，Markdown 扔上去就能看。笔记少的时候这很舒服。

后来文章慢慢多了，问题也跟着来了：

- 它是浏览器里现拉 Markdown 再渲染的，没有真正的文章列表、分类、标签、时间轴
- 搜索、RSS、SEO 都比较勉强
- 首页想做成「博客」而不是「一份文档说明书」，Docsify 就有点拧巴

所以才迁到 [VuePress 2](https://vuepress.vuejs.org/zh/) + [vuepress-theme-hope](https://theme-hope.vuejs.press/zh/)。首页布局参考了 [233 的 DailyNotes](https://233official.github.io/dailynotes/)，内容还是自己的笔记。

换栈之后要多一步构建，但换来的是能当博客用的导航、归档和搜索。对我来说还是划算的——毕竟我更想把时间花在写笔记上，而不是自己从零搓一套站点。

## 现在用到的技术栈

### 核心

- **VuePress 2** — 把 `docs/` 里的 Markdown 构建成静态站点
- **vuepress-theme-hope** — 博客主题：首页、分类、标签、时间轴、侧边栏
- **Vite** — VuePress 的打包器
- **GitHub Pages** — 托管，自定义域名 `layyes.com`
- **GitHub Actions** — 推到 `main` 后自动 `pnpm docs:build` 再发布

### 站点功能

- **Markdown** — 正文还是 Markdown，写笔记的方式没变
- **slimsearch** — 搜索正文（`Ctrl + K`）
- **Atom Feed** — 给想订阅的人留一个 `/atom.xml`
- **百度统计** — 看真实访问；首页左下角还有一个本机 `localStorage` 到访次数，纯属弄着玩，没上数据库（给自己加数据库感觉有点本末倒置了）

当然以上涉及的代码大多还是 **AI 帮忙写的**，我会改、会调，但主逻辑确实不是我一行行手搓的。换成 VuePress 之后更是这样：主题把博客该有的壳做好了，我负责填内容和改自己在意的布局。

## 和Docsify的区别

和 Docsify 最大的差别是：**先构建，再发布**。

1. 源文件都在 `docs/` 里，主题配置在 `docs/.vuepress/`
2. 本地预览：`pnpm docs:dev`
3. 构建：`pnpm docs:build`，输出到 `docs/.vuepress/dist`
4. GitHub Actions 在推送到 `main` 后执行构建，再把产物发到 GitHub Pages

VuePress 会在构建时把 Markdown 编成页面，所以分类、标签、时间轴这些聚合页是生成出来的，不用再手写一份目录。侧边栏按目录结构自动出，新增一篇笔记时，主要就是在对应文件夹里加 `.md`。

## 部署方式

1. 仓库：`worldfunction4/worldfunction4.github.io`
2. 自定义域名：`layyes.com`（`docs/.vuepress/public/CNAME`）
3. 工作流：`.github/workflows/docs.yml`，推 `main` 即构建发布

不再是「把 Markdown 和 `index.html` 直接推进去就上线」。现在必须过一遍构建；换来的是能搜索、能归档、打开页面也不用再等客户端去拉每一篇 Markdown。

## 碎碎念

虽然这个博客是用来记录学习过程的，但我也希望它能成为一个有用的资源库，尤其是对那些和我一样在学习过程中遇到各种问题的人。无论是网络技术、编程语言还是其他领域，我都会尽量把自己学到的东西整理成能看懂的文章：一方面当笔记，顺便练练写作；另一方面虽然概率不大，但如果真能帮到别人，那就是我最大的荣幸。也欢迎建议和反馈。
