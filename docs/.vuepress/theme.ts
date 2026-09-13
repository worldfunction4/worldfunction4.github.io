import { hopeTheme } from "vuepress-theme-hope";

export default hopeTheme(
  {
    // 站点部署域名（feed / seo / sitemap 会用到）
    hostname: "https://layyes.com",

    author: {
      name: "泪叶丝",
      url: "https://layyes.com",
    },

    // 导航栏（GitHub 图标由下方 repo 选项自动生成）
    navbar: [
      { text: "首页", link: "/" },
      { text: "随笔", link: "/start.html" },
      { text: "知识库", link: "/knowledge-base/" },
      { text: "网络技术", link: "/Network/" },
      { text: "分类", link: "/category/" },
      { text: "标签", link: "/tag/" },
      { text: "时间轴", link: "/timeline/" },
    ],

    // 仓库链接，导航栏会展示 GitHub 图标
    repo: "worldfunction4/worldfunction4.github.io",

    // 按目录结构自动生成分组侧边栏，无需手写清单
    sidebar: "structure",

    // 深色模式："switch" 在浅色 / 深色 / 自动之间切换（默认行为）
    darkmode: "switch",

    // 页脚
    footer: "© 2026 泪叶丝",
    displayFooter: true,

    // 文章信息：作者、日期、字数、阅读时长、分类、标签
    pageInfo: ["Author", "Date", "Word", "ReadingTime", "Category", "Tag"],

    // 博主信息与文章列表选项
    blog: {
      name: "泪叶丝",
      description: "探索网络技术, 记录生活点滴, 分享有趣思考",
      medias: {
        GitHub: "https://github.com/worldfunction4/worldfunction4.github.io",
      },
      // 首页文章列表每页数量（默认 10）
      articlePerPage: 10,
      // 文章列表中展示的文章信息
      articleInfo: ["Author", "Original", "Date", "Word", "ReadingTime", "Category", "Tag"],
    },

    plugins: {
      // 博客功能：开启后自动生成 /category/ /tag/ /timeline/ /article/ 聚合页
      blog: true,

      // 搜索插件，默认热键即 Ctrl+K（以及 Ctrl+/），indexContent 索引正文内容
      slimsearch: {
        indexContent: true,
      },

      // Feed 生成：输出 atom.xml（hostname 取主题根级的 hostname）
      feed: {
        atom: true,
      },
    },
  },
  {
    // 允许在 client.ts 中覆盖布局并通过
    // "vuepress-theme-hope/components/*" 子路径导入主题组件
    custom: true,
  },
);
