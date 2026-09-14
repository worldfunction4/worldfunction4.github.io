import { navbar } from "vuepress-theme-hope";

export const Navbar = navbar([
  {
    text: "知识库",
    children: [
      { text: "知识库总览", link: "/knowledge-base/" },
      { text: "C / C++", link: "/category/c和c__/" },
      { text: "Python", link: "/category/python/" },
      { text: "计算机网络", link: "/category/计算机网络/" },
      { text: "Linux", link: "/category/linux/" },
      { text: "数据结构与算法", link: "/category/数据结构与算法/" },
      { text: "Leetcode", link: "/category/leetcode/" },
      { text: "踩坑记录", link: "/category/遇到的一些问题/" },
    ],
  },
  {
    text: "网络技术",
    children: [
      { text: "路由器", link: "/Network/路由器.html" },
      { text: "交换机", link: "/Network/交换机.html" },
      { text: "计算机概述", link: "/Network/基础知识/计算机概述.html" },
      { text: "数据通信", link: "/Network/基础知识/数据通信.html" },
      { text: "CSMA/CD", link: "/Network/基础知识/CSMA_CD.html" },
      { text: "eNSP 安装", link: "/Network/eNSP/安装eNSP.html" },
    ],
  },
  {
    text: "实验",
    children: [
      { text: "eNSP 实验", link: "/eNSP实验/基础实验.html" },
      { text: "AstrBot 识图", link: "/about_bot/本地部署LLM实现识图功能.html" },
    ],
  },
  {
    text: "语言",
    children: [
      { text: "Python", link: "/category/python/" },
      { text: "C / C++", link: "/category/c和c__/" },
    ],
  },
  { text: "随笔", link: "/start.html" },
  { text: "分类", link: "/category/" },
  { text: "标签", link: "/tag/" },
  { text: "时间轴", link: "/timeline/" },
]);
