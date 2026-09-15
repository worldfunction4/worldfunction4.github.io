import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { sidebar } from "vuepress-theme-hope";

const docsRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");

/** 某目录下的 Markdown 页（不含 README），按文件名排序 */
const pages = (relativeDir: string) => {
  const dir = join(docsRoot, relativeDir);
  const urlBase = `/${relativeDir.replaceAll("\\", "/")}/`;

  return readdirSync(dir)
    .filter((name) => name.endsWith(".md") && name.toLowerCase() !== "readme.md")
    .sort((a, b) => a.localeCompare(b, "zh-CN"))
    .map((name) => `${urlBase}${name}`);
};

const cppNotes = pages("knowledge-base/knowledge/C和C++");

export const Sidebar = sidebar({
  "/knowledge-base/knowledge/C和C__/": cppNotes,
  "/knowledge-base/knowledge/C和C++/": cppNotes,

  "/knowledge-base/knowledge/Python/": "structure",
  "/knowledge-base/knowledge/Linux/": "structure",
  "/knowledge-base/knowledge/Leetcode/": "structure",
  "/knowledge-base/knowledge/数据结构与算法/": "structure",
  "/knowledge-base/knowledge/遇到的一些问题/": "structure",
  "/knowledge-base/knowledge/专业术语/": "structure",
  "/knowledge-base/knowledge/agent/": "structure",
  "/knowledge-base/knowledge/study_feel/": "structure",
  "/knowledge-base/knowledge/关于物理设备/": "structure",

  "/knowledge-base/knowledge/计算机网络/基础知识/": "structure",
  "/knowledge-base/knowledge/计算机网络/局域网/": "structure",
  "/knowledge-base/knowledge/计算机网络/网络安全/": "structure",
  "/knowledge-base/knowledge/计算机网络/面试/": "structure",
  "/knowledge-base/knowledge/计算机网络/": "structure",

  "/Network/eNSP/": "structure",
  "/Network/基础知识/": "structure",
  "/Network/": "structure",
  "/eNSP实验/": "structure",
  "/about_bot/": "structure",
  "/ai/": "structure",
  "/杂谈/": "structure",
  "/knowledge-base/": false,
});
