import type { filter as enFilter } from "../en/filter";

/** Simplified Chinese translation of `resources/en/filter.ts`. Kept shape-complete via `satisfies typeof enFilter`. */
export const filter = {
  trigger: "筛选",
  title: "高级筛选",
  description: "组合多个条件以缩小结果范围。",
  noConditions: "暂无条件。",
  addCondition: "添加条件",
  booleanTrue: "是",
  booleanFalse: "否",
  operators: {
    eq: "等于",
    ne: "不等于",
    gt: "大于",
    gte: "大于或等于",
    lt: "小于",
    lte: "小于或等于",
    c: "包含",
    sw: "开头是",
    ew: "结尾是",
    in: "属于",
    nin: "不属于",
    between: "介于",
    null: "为空",
    notnull: "不为空",
  },
} as const satisfies typeof enFilter;
