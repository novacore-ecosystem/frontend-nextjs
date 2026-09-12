import type { notifications as enNotifications } from "../en/notifications";

/** Simplified Chinese translation of `resources/en/notifications.ts`. Kept shape-complete via `satisfies typeof enNotifications`. */
export const notifications = {
  title: "通知",
  triggerLabel: "通知",
  markAllRead: "全部标记为已读",
  markAsRead: "标记为已读",
  empty: "暂无通知",
  error: "无法加载通知",
  loadMore: "加载更多",
} as const satisfies typeof enNotifications;
