import { navbar } from "vuepress-theme-hope";

export const Navbar = navbar([
  {
    text: "AI",
    children: [
      { text: "专栏总览", link: "/ai/" },
      { text: "分类", link: "/category/ai/" },
      { text: "AI 编程", link: "/knowledge-base/knowledge/Python/AI编程.html" },
      { text: "AstrBot 识图", link: "/about_bot/本地部署LLM实现识图功能.html" },
    ],
  },
  { text: "计算机网络", link: "/category/计算机网络/" },
  { text: "C / C++", link: "/category/c和c__/" },
  { text: "Python", link: "/category/python/" },
  { text: "Linux", link: "/category/linux/" },
  { text: "算法", link: "/category/算法/" },
  { text: "踩坑", link: "/category/踩坑/" },
  { text: "随笔", link: "/category/随笔/" },
  { text: "分类", link: "/category/" },
  { text: "标签", link: "/tag/" },
  { text: "时间轴", link: "/timeline/" },
]);
