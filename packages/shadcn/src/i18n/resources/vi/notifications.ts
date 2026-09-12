import type { notifications as enNotifications } from "../en/notifications";

/** Vietnamese translation of `resources/en/notifications.ts`. Kept shape-complete via `satisfies typeof enNotifications`. */
export const notifications = {
  title: "Thông báo",
  triggerLabel: "Thông báo",
  markAllRead: "Đánh dấu đã đọc tất cả",
  markAsRead: "Đánh dấu đã đọc",
  empty: "Chưa có thông báo nào",
  error: "Không thể tải thông báo",
  loadMore: "Tải thêm",
} as const satisfies typeof enNotifications;
