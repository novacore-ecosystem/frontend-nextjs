# Notifications

A shared, drawer-based notification bell for any NovaCore admin app: a bell trigger with an
unread badge, opening a `Sheet` (Drawer/Offcanvas) with a scrollable, paginated notification list.

```tsx
import { NotificationBell } from "@novacore/frontend-next-shadcn";
// or
import { NotificationBell } from "@novacore/frontend-next-shadcn/notifications";

<NotificationBell
  items={notifications}
  unreadCount={unreadCount}
  onMarkAsRead={(n) => markAsRead(n.id)}
  onMarkAllAsRead={markAllAsRead}
  onSelect={(n) => openDetail(n.id)}
/>
```

## Why a Drawer, not a Popover

A small popup runs out of room the moment a notification list needs more than a title and a
timestamp — richer content, filters, grouping. A `Sheet` has room to grow without a redesign.

## Data is the host application's responsibility

This component is deliberately **not** wired to any data source, pagination strategy, or
real-time transport — those are inherently application/backend-specific (see nova-wcm's own
`useNotificationBell`, which owns a SignalR hub subscription + `useInfiniteQuery` and passes the
resulting `items`/`unreadCount`/`hasMore`/etc. straight through as props). `NotificationBell` owns
exactly three things: the trigger, the drawer chrome (header, list, loading/error/empty states,
load-more), and rendering each item via the configurable content renderer below.

`onSelect` fires when a row is activated; what happens next (open a separate detail view, fetch
the full record, navigate) is entirely up to the host application. This module has no built-in
"detail" surface of its own — many real backends (nova-wcm's included) only return a notification's
full body on a per-item fetch, not in the list response, so baking a detail view into this
component would mean guessing at a data-fetching shape that varies per backend.

## Notification shape

```ts
export interface NotificationItem {
  id: string;
  title: string;
  /** Often absent on a list summary — many backends only populate this on a per-item detail fetch. */
  description?: string;
  createdAt: string;
  status: "read" | "unread";
  category?: string;
}
```

Map your own domain notification type onto this before passing it in — same pattern as
`PermissionRecord`/`SubjectOption` in the Access Control module. Use a generic subtype
(`NotificationBell<MyNotification>`) if you need extra fields inside a custom render component.

## Per-type/category rendering

`renderConfig` overrides how specific notifications render, keyed by `getRenderKey(notification)`
(defaults to `notification.category`):

```tsx
const renderConfig: NotificationRenderRegistry<OrderNotification> = {
  order: { description: OrderDescription },       // keep the default title, customize description only
  campaign: { title: null, description: CampaignCard }, // full redesign — CampaignCard renders everything
};

<NotificationBell items={items} unreadCount={unreadCount} renderConfig={renderConfig} />
```

- Omit an entry for a category entirely → both title and description use the built-in default.
- `title` omitted → default title text. `title: null` → no title div renders at all (for a
  category whose `description` component draws its own heading). `title: SomeComponent` → custom
  title content.
- `description` omitted → default description text (only rendered when
  `notification.description` is actually present — most list summaries won't have one, see above).
  A `description` component always fully replaces it.

Title and description are always two separate `div`s (see `NotificationItemContent`, exported
separately for reuse in your own detail view/toast/etc.) — never merged into one text node —
specifically so a custom `description` component can occupy the whole item when `title` is
suppressed, without fighting leftover title-div spacing.

## Leading icon

`renderIcon?: (notification) => ReactNode` is a single row-level slot (not part of `renderConfig`,
since unlike title/description this module has no default icon to fall back to) for a leading
visual, e.g. a per-category icon:

```tsx
<NotificationBell items={items} unreadCount={unreadCount} renderIcon={(n) => <CategoryIcon category={n.category} />} />
```

Omit it for no leading visual at all.

## `useNotifications` — the reference data-fetching implementation

`NotificationBell` still owns no data fetching itself (see above) — but if your backend matches
`@novacore/frontend-foundation`'s new `NotificationEndpoints`/`NotificationHub` contract,
`useNotifications` is a ready-made cursor-pagination + realtime-fallback hook that pairs with it
directly, built on the shared `HttpClient`:

```tsx
import { NotificationBell, useNotifications } from "@novacore/frontend-next-shadcn";

function AppNotificationBell({ httpClient, hub }: { httpClient: HttpClient; hub?: NotificationRealtimeHub }) {
  const notifications = useNotifications(httpClient, { hub, locale });

  return (
    <NotificationBell
      items={notifications.items}
      unreadCount={notifications.unreadCount}
      loading={notifications.loading}
      error={notifications.error}
      onRetry={notifications.refresh}
      hasMore={notifications.hasMore}
      loadingMore={notifications.loadingMore}
      onLoadMore={notifications.loadMore}
      onMarkAsRead={notifications.markAsRead}
      onMarkAllAsRead={notifications.markAllAsRead}
    />
  );
}
```

- **Cursor pagination**: `refresh()`/`loadMore()` drive `NotificationEndpoints.list`'s
  `{ cursor?, limit }` request / `CursorPaginatedResult` response directly — no page-number
  bookkeeping to reimplement per app.
- **`unreadCount`** is derived from the currently **loaded** `items` only (there is no dedicated
  unread-count endpoint in `NotificationEndpoints` today) — prefer a real backend total if/when
  one exists.
- **`markAsRead`/`markAllAsRead`** are optimistic (flip locally, then call the backend) and roll
  back on failure, surfacing the failure via `translateError()` in `error`.
- **Realtime fallback, by design**: `hub` (a `RealtimeClient.forHub(NotificationHub)` result) is
  optional and `undefined` by default. When it's omitted, this hook **never attempts any realtime
  call at all** — no retry loop against a connection that doesn't exist — and reports
  `realtimeAvailable: false`, so the host can render a distinct "real-time updates unavailable"
  state instead of silently behaving as if live delivery were working:

  ```tsx
  {!notifications.realtimeAvailable ? <span className="text-xs text-muted-foreground">Real-time updates unavailable</span> : null}
  ```

  When `hub` **is** supplied, the hook subscribes to `NotificationCreated` and prepends pushed
  notifications to `items` (de-duplicated by id).

See `@novacore/frontend-foundation`'s `docs`/doc comments for `NotificationEndpoints`/
`NotificationHub` for the backend-confirmation status of each endpoint (`list` targets the
already-confirmed `GET /notifications/mine`; `markAsRead`/`markAllAsRead` and the hub's name are
forward-looking, adjust them there if your backend differs).
