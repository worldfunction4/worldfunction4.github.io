import { AutoLink, defineClientConfig, usePageFrontmatter, useRoute } from "vuepress/client";
import { computed, defineComponent, h, onMounted, ref } from "vue";

import { Blog } from "vuepress-theme-hope/blog";
// theme.ts 中通过 behavior 选项 custom: true 启用了 hope-custom 解析条件，
// 以下子路径在运行时会解析为主题的真实客户端组件。
// TypeScript 默认不会带 hope-custom 条件（编辑器可能提示类型缺失），构建不受影响。
// @ts-ignore
import ProjectPanel from "vuepress-theme-hope/components/blog/ProjectPanel";
// @ts-ignore
import DropTransition from "vuepress-theme-hope/components/transitions/DropTransition";

/**
 * 首页 hero 区下方的动作按钮：开始阅读 / GitHub
 * 仅在博客首页渲染
 */
const HomeHeroActions = defineComponent({
  name: "HomeHeroActions",

  setup() {
    return () =>
      h("div", { class: "self-hero-actions" }, [
        h(AutoLink, {
          class: "self-hero-action primary",
          config: { link: "/start.html", text: "开始阅读" },
        }),
        h(AutoLink, {
          class: "self-hero-action",
          config: {
            link: "https://github.com/worldfunction4/worldfunction4.github.io",
            text: "GitHub",
            target: "_blank",
          },
        }),
      ]);
  },
});

interface ProjectOption {
  name: string;
  desc?: string;
  link: string;
  icon?: string;
  background?: string;
}

/**
 * 文章列表上方的“最近更新”标题，同时保留 frontmatter 中的
 * projects 精选卡片（BlogHome 中 articlesBefore 插槽会覆盖默认的
 * ProjectPanel 渲染，因此在这里一并渲染）。仅在博客首页渲染。
 */
const HomeArticlesHead = defineComponent({
  name: "HomeArticlesHead",

  setup() {
    const frontmatter = usePageFrontmatter<{ projects?: ProjectOption[] }>();
    const projects = computed(() => frontmatter.value.projects ?? []);

    return () => [
      projects.value.length > 0
        ? h(DropTransition, { appear: true, delay: 0.16 }, () =>
            h(ProjectPanel, { items: projects.value }),
          )
        : null,
      h("h2", { id: "recent-updates", class: "self-articles-title" }, "最近更新"),
    ];
  },
});

/**
 * 覆盖 Blog 布局：仅在首页注入 hero 按钮 与 文章列表标题
 * （仿 233Official/dailynotes 的 HomeBlogLayout 模式）
 */
const HomeBlogLayout = defineComponent({
  name: "HomeBlogLayout",

  setup() {
    const frontmatter = usePageFrontmatter<{ home?: boolean }>();

    return () =>
      frontmatter.value.home
        ? h(Blog, null, {
            heroAfter: () => h(HomeHeroActions),
            articlesBefore: () => h(HomeArticlesHead),
          })
        : h(Blog);
  },
});

/**
 * 本机到访次数徽章：
 * 每次整页加载（应用挂载）时从 localStorage 读取 layyes_self_visits 并 +1 写回，
 * 仅在首页左下角显示，路由切换时隐藏（与旧站 Docsify 的计数逻辑保持一致）
 */
const SelfVisitBadge = defineComponent({
  name: "SelfVisitBadge",

  setup() {
    const count = ref(0);
    const route = useRoute();

    onMounted(() => {
      const STORAGE_KEY = "layyes_self_visits";
      const prev = Number.parseInt(window.localStorage.getItem(STORAGE_KEY) ?? "0", 10);

      count.value = (Number.isNaN(prev) ? 0 : prev) + 1;
      window.localStorage.setItem(STORAGE_KEY, String(count.value));
    });

    return () =>
      route.path === "/" && count.value > 0
        ? h(
            "div",
            {
              class: "self-visit-badge",
              role: "status",
              "aria-live": "polite",
            },
            `👁️ 你已到访 ${count.value} 次`,
          )
        : null;
  },
});

export default defineClientConfig({
  layouts: {
    Blog: HomeBlogLayout,
  },

  rootComponents: [SelfVisitBadge],
});
