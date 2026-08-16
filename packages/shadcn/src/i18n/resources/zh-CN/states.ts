import type { states as enStates } from "../en/states";

/** Simplified Chinese translation of `resources/en/states.ts`. Kept shape-complete via `satisfies typeof enStates`. */
export const states = {
  emptyTitle: "暂无内容",
  loading: "加载中…",
  errorTitle: "出错了",
  retry: "重试",
} as const satisfies typeof enStates;
