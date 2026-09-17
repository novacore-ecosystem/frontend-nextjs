import { describe, expect, it } from "vitest";
import { shouldFetchBootstrapOnServer } from "../../src/lib/bootstrap-ssr";

describe("shouldFetchBootstrapOnServer", () => {
  it("always fetches for a guest, regardless of a cached version", () => {
    expect(shouldFetchBootstrapOnServer({ isGuest: true, cachedBootstrapVersion: null })).toBe(true);
    expect(shouldFetchBootstrapOnServer({ isGuest: true, cachedBootstrapVersion: 3 })).toBe(true);
  });

  it("fetches for an authenticated user with a cache miss", () => {
    expect(shouldFetchBootstrapOnServer({ isGuest: false, cachedBootstrapVersion: null })).toBe(true);
  });

  it("skips the fetch for an authenticated user with a cache hit", () => {
    expect(shouldFetchBootstrapOnServer({ isGuest: false, cachedBootstrapVersion: 3 })).toBe(false);
  });
});
