import { sidebar } from "vuepress-theme-hope";

// 知识库每个顶层目录各自一套侧栏，按目录结构自动生成（子目录会成为可折叠分组）。
// 目录顺序 / 标题来自各目录 README.md；笔记顺序可用 front matter 的 order 调整。
const KB = "/knowledge-base/knowledge/";
const kbFolders = [
  "C和C++", "C和C__", // VuePress 会把 + 转成 _，两种写法都挂上
  "Qt框架", "Python", "Linux", "Leetcode", "数据结构与算法", "计算机网络",
  "遇到的一些问题", "专业术语", "agent", "study_feel", "关于物理设备", "关于经验",
  "Mermaid", "数据库", "English", "杂项", "想到的问题", "Git",
];

export const Sidebar = sidebar({
  ...Object.fromEntries(kbFolders.map((f) => [`${KB}${f}/`, "structure" as const])),

  "/Network/eNSP/": "structure",
  "/Network/基础知识/": "structure",
  "/Network/": "structure",
  "/eNSP实验/": "structure",
  "/about_bot/": "structure",
  "/ai/": "structure",
  "/杂谈/": "structure",
  "/knowledge-base/": false,
});
