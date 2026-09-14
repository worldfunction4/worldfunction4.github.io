import { defineClientConfig, useRoute } from "vuepress/client";
import { defineComponent, h, onMounted, ref } from "vue";

import HomeBlogLayout from "./layouts/HomeBlogLayout.vue";

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
