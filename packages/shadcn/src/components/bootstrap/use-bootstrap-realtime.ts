"use client";

import type {
  BootstrapHubEvents,
  BootstrapRefreshCoordinator,
  TypedRealtimeHub,
  VersionedBootstrap,
} from "@novacore/frontend-foundation";
import * as React from "react";

/** What `RealtimeClient.forHub(BootstrapHub)` (`@novacore/frontend-foundation`) returns — pass that value as `UseBootstrapRealtimeOptions.hub`. Same connection `useNotifications`'s `hub` option binds to (`NotificationHub`) — one Global Hub connection, multiple typed event slices. */
export type BootstrapRealtimeHub = TypedRealtimeHub<BootstrapHubEvents, Record<string, never>>;

export interface UseBootstrapRealtimeOptions<T extends VersionedBootstrap> {
  /**
   * A hub bound via `RealtimeClient.forHub(BootstrapHub)`. Omit when the host application hasn't
   * established a Global Hub connection (yet, or ever) — this hook then does nothing, relying
   * entirely on the login/refresh response's `version` field and the initial SSR fetch to stay in
   * sync (no live push, but still correct on next navigation/refresh).
   */
  hub?: BootstrapRealtimeHub;
  coordinator: BootstrapRefreshCoordinator<T>;
}

/**
 * Wires a live `BootstrapHub` connection to the shared `refreshBootstrap()` contract
 * (`BootstrapRefreshCoordinator`, `@novacore/frontend-foundation`) — the mechanism that catches a
 * tenant Bootstrap change while this client was briefly disconnected (still-valid access token,
 * so no refresh happened either) or while actively connected. On `BootstrapVersionChanged`, calls
 * `coordinator.refreshBootstrap(version)`, which itself no-ops if already on that version.
 */
export function useBootstrapRealtime<T extends VersionedBootstrap>(options: UseBootstrapRealtimeOptions<T>): void {
  const { hub, coordinator } = options;

  React.useEffect(() => {
    if (!hub) return;
    return hub.subscribe("BootstrapVersionChanged", (version) => {
      void coordinator.refreshBootstrap(version);
    });
  }, [hub, coordinator]);
}
