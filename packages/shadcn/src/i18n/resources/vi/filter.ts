import type { filter as enFilter } from "../en/filter";

/** Vietnamese translation of `resources/en/filter.ts`. Kept shape-complete via `satisfies typeof enFilter`. */
export const filter = {
  trigger: "Bộ lọc",
  title: "Bộ lọc nâng cao",
  description: "Kết hợp các điều kiện để thu hẹp kết quả.",
  noConditions: "Chưa có điều kiện nào.",
  addCondition: "Thêm điều kiện",
  booleanTrue: "Đúng",
  booleanFalse: "Sai",
  operators: {
    eq: "bằng",
    ne: "khác",
    gt: "lớn hơn",
    gte: "lớn hơn hoặc bằng",
    lt: "nhỏ hơn",
    lte: "nhỏ hơn hoặc bằng",
    c: "chứa",
    sw: "bắt đầu bằng",
    ew: "kết thúc bằng",
    in: "trong",
    nin: "không trong",
    between: "trong khoảng",
    null: "rỗng",
    notnull: "không rỗng",
  },
} as const satisfies typeof enFilter;
