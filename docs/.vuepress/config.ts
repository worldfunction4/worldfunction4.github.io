import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  lang: "zh-CN",
  title: "泪叶丝",
  description: "探索网络技术, 记录生活点滴, 分享有趣思考",

  // 部署在 https://layyes.com 根路径
  base: "/",

  head: [
    // 移动端浏览器主题色
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    // 百度统计站点 9b88f8eece2f9ad20b8f6621817311ca
    // vuepress-theme-hope v2 没有 provider/id 形式的统计配置键，
    // 官方做法是通过 head 注入统计脚本（hm.baidu.com）
    [
      "script",
      {
        async: "",
        src: "https://hm.baidu.com/hm.js?9b88f8eece2f9ad20b8f6621817311ca",
      },
    ],
  ],

  // VuePress 2 rc 版必须在站点配置中显式指定 bundler
  bundler: viteBundler(),

  theme,
});
