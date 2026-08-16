import type { columns as enColumns } from "../en/columns";

/** Simplified Chinese translation of `resources/en/columns.ts`. Kept shape-complete via `satisfies typeof enColumns`. */
export const columns = {
  trigger: "列",
  title: "显示列",
  clear: "清除",
} as const satisfies typeof enColumns;
