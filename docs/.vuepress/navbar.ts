import { navbar } from "vuepress-theme-hope";

const KB = "/knowledge-base/knowledge/";

export const Navbar = navbar([
  { text: "AI", link: "/ai/" },
  {
    text: "计算机网络",
    children: [
      { text: "基础知识", link: `${KB}计算机网络/基础知识/计算机概述.html` },
      { text: "协议与设备", link: `${KB}计算机网络/` },
      { text: "eNSP", link: "/Network/eNSP/安装eNSP.html" },
    ],
  },
  {
    text: "语言",
    children: [
      { text: "C / C++", link: `${KB}C和C__/` },
      { text: "Qt", link: `${KB}Qt框架/` },
      { text: "Python", link: `${KB}Python/` },
    ],
  },
  {
    text: "操作系统",
    children: [{ text: "Linux", link: `${KB}Linux/` }],
  },
  {
    text: "数据结构与算法",
    children: [
      { text: "数据结构", link: `${KB}数据结构与算法/` },
      { text: "算法", link: `${KB}数据结构与算法/时间复杂度O(n).html` },
      { text: "Leetcode", link: `${KB}Leetcode/` },
    ],
  },
  {
    text: "笔记",
    children: [
      { text: "踩坑", link: `${KB}遇到的一些问题/` },
      { text: "Git", link: `${KB}Git/` },
      { text: "随笔", link: `${KB}study_feel/` },
      { text: "经验", link: `${KB}关于经验/` },
      { text: "专业术语", link: `${KB}专业术语/` },
      { text: "数据库", link: `${KB}数据库/` },
      { text: "Mermaid", link: `${KB}Mermaid/` },
      { text: "English", link: `${KB}English/` },
      { text: "杂项", link: `${KB}杂项/` },
      { text: "想到的问题", link: `${KB}想到的问题/` },
      { text: "全部笔记目录", link: "/knowledge-base/" },
    ],
  },
]);
