import { hopeTheme } from "vuepress-theme-hope";

import { Navbar } from "./navbar.js";

export default hopeTheme(
  {
    // 站点部署域名（feed / seo / sitemap 会用到）
    hostname: "https://layyes.com",

    author: {
      name: "泪叶丝",
      url: "https://layyes.com",
    },

    favicon: "/avatar.jpg",
    logo: "/avatar.jpg",

    // 导航栏（GitHub 图标由下方 repo 选项自动生成）
    navbar: Navbar,

    // 仓库链接，导航栏会展示 GitHub 图标
    repo: "worldfunction4/worldfunction4.github.io",

    // "编辑此页"链接（默认开启）：源文件在仓库的 docs/ 目录下，
    // docsDir 缺省为空会导致 GitHub 编辑链接缺少前缀而 404
    docsRepo: "worldfunction4/worldfunction4.github.io",
    docsBranch: "main",
    docsDir: "docs",

    // 按目录结构自动生成分组侧边栏，无需手写清单
    sidebar: "structure",

    // 深色模式："switch" 在浅色 / 深色 / 自动之间切换（默认行为）
    darkmode: "switch",

    // 外观面板中的主题色选择器、全屏按钮（对齐参考站顶栏）
    themeColor: true,
    fullscreen: true,

    markdown: {
      mermaid: true,
    },

    // 页脚
    footer: "© 2026 泪叶丝",
    displayFooter: true,

    // 文章信息：作者、日期、字数、阅读时长、分类、标签
    pageInfo: ["Author", "Date", "Word", "ReadingTime", "Category", "Tag"],

    // 博主信息与文章列表选项
    blog: {
      name: "泪叶丝",
      avatar: "/avatar.jpg",
      description: "探索网络技术, 记录生活点滴, 分享有趣思考",
      intro: "/start.html",
      medias: {
        GitHub: "https://github.com/worldfunction4/worldfunction4.github.io",
        Rss: "https://layyes.com/atom.xml",
      },
      // 首页文章列表每页数量（默认 10）
      articlePerPage: 10,
      // 文章列表中展示的文章信息
      articleInfo: ["Author", "Original", "Date", "Word", "ReadingTime", "Category", "Tag"],
    },

    plugins: {
      // 博客功能：开启后自动生成 /category/ /tag/ /timeline/ /article/ 聚合页
      blog: true,

      icon: {
        assets: "fontawesome-with-brands",
      },

      // 搜索插件，默认热键即 Ctrl+K（以及 Ctrl+/），indexContent 索引正文内容
      slimsearch: {
        indexContent: true,
      },

      // Feed 生成：输出 atom.xml（hostname 取主题根级的 hostname）
      feed: {
        atom: true,
        getter: {
          // VuePress 会把路径里的 `+` slug 成 `_`（如 C和C++ → C和C__），
          // 但 feed 渲染不走路由解析，这里手工重写含 `+` 的站内链接，避免 RSS 死链
          content: (page) =>
            page.content.replace(
              /href="\/[^"]*"/g,
              (m) =>
                m.includes("+")
                  ? m.split("/").map((seg) => (seg.includes("+") ? seg.replaceAll("+", "_") : seg)).join("/")
                  : m,
            ),
        },
      },
    },
  },
  {
    // 允许在 layouts 中覆盖 Blog 并通过
    // "vuepress-theme-hope/blog" 子路径导入主题组件
    custom: true,
  },
);
