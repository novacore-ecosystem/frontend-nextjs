import { describe, expect, it } from "vitest";
import { buildInitialAuthState } from "../../src/lib/initial-auth-state";

function makeJwt(payload: Record<string, unknown>): string {
  const base64url = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `${base64url({ alg: "HS256", typ: "JWT" })}.${base64url(payload)}.signature`;
}

describe("buildInitialAuthState", () => {
  it("is a guest (no refresh needed) when neither cookie is present", () => {
    const state = buildInitialAuthState({});
    expect(state).toEqual({ hasAccessToken: false, hasRefreshToken: false, needsRefresh: false });
  });

  it("needs refresh when only the refresh token is present", () => {
    const state = buildInitialAuthState({ refreshToken: "rt" });
    expect(state).toEqual({ hasAccessToken: false, hasRefreshToken: true, needsRefresh: true });
  });

  it("does not need refresh for a valid, unexpired access token", () => {
    const token = makeJwt({ exp: Math.floor(Date.now() / 1000) + 600 });
    const state = buildInitialAuthState({ accessToken: token, refreshToken: "rt" });
    expect(state).toEqual({ hasAccessToken: true, hasRefreshToken: true, needsRefresh: false });
  });

  it("needs refresh when the access token is expired", () => {
    const token = makeJwt({ exp: Math.floor(Date.now() / 1000) - 60 });
    const state = buildInitialAuthState({ accessToken: token, refreshToken: "rt" });
    expect(state.needsRefresh).toBe(true);
  });

  it("needs refresh when the access token is malformed", () => {
    const state = buildInitialAuthState({ accessToken: "not-a-jwt" });
    expect(state.needsRefresh).toBe(true);
  });

  it("needs refresh when the access token has no exp claim", () => {
    const token = makeJwt({ sub: "user-1" });
    const state = buildInitialAuthState({ accessToken: token });
    expect(state.needsRefresh).toBe(true);
  });
});
