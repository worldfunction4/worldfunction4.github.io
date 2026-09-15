import { navbar } from "vuepress-theme-hope";

export const Navbar = navbar([
  { text: "AI", link: "/ai/" },
  {
    text: "计算机网络",
    children: [
      {
        text: "基础知识",
        link: "/knowledge-base/knowledge/计算机网络/基础知识/计算机概述.html",
      },
      {
        text: "协议与设备",
        link: "/knowledge-base/knowledge/计算机网络/OSPF.html",
      },
      { text: "eNSP", link: "/Network/eNSP/安装eNSP.html" },
    ],
  },
  {
    text: "语言",
    children: [
      { text: "C / C++", link: "/knowledge-base/knowledge/C和C__/" },
      { text: "Python", link: "/knowledge-base/knowledge/Python/" },
    ],
  },
  {
    text: "操作系统",
    children: [{ text: "Linux", link: "/knowledge-base/knowledge/Linux/" }],
  },
  {
    text: "数据结构与算法",
    children: [
      {
        text: "数据结构",
        link: "/knowledge-base/knowledge/数据结构与算法/",
      },
      {
        text: "算法",
        link: "/knowledge-base/knowledge/数据结构与算法/时间复杂度O(n).html",
      },
      { text: "Leetcode", link: "/knowledge-base/knowledge/Leetcode/" },
    ],
  },
  {
    text: "笔记",
    children: [
      { text: "踩坑", link: "/knowledge-base/knowledge/遇到的一些问题/" },
      { text: "随笔", link: "/杂谈/关于上传到自己的远程仓库.html" },
    ],
  },
]);
