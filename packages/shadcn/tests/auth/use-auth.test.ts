import { act, renderHook } from "@testing-library/react";
import {
  AuthEndpoints,
  HttpError,
  HttpErrorKinds,
  UserEndpoints,
  type AuthSession,
  type EndpointDefinition,
  type HttpClient,
  type UserProfile,
} from "@novacore/frontend-foundation";
import { describe, expect, it, vi } from "vitest";
import { useAuth } from "../../src/components/auth/use-auth";

const USER: UserProfile = { id: "u1", displayName: "Ann" };
const SESSION: AuthSession = { user: USER };

/**
 * Routes by endpoint identity — `login`/`refreshToken` internally make two calls
 * (`AuthEndpoints.login`/`refreshToken`, then `UserEndpoints.getMe` to build the session, since
 * the backend never returns a bearer token — see `use-auth.ts`'s module doc comment), so a purely
 * positional mock queue would be order-fragile.
 */
function createMockHttpClient(overrides: {
  login?: () => unknown;
  logout?: () => unknown;
  refreshToken?: () => unknown;
  getMe?: () => unknown;
  forgotPassword?: () => unknown;
  resendEmail?: () => unknown;
  register?: () => unknown;
} = {}): HttpClient {
  const execute = vi.fn((def: EndpointDefinition<unknown, unknown>) => {
    if (def === AuthEndpoints.login) return resolveOrDefault(overrides.login, { version: null });
    if (def === AuthEndpoints.logout) return resolveOrDefault(overrides.logout, undefined);
    if (def === AuthEndpoints.refreshToken) return resolveOrDefault(overrides.refreshToken, { version: null });
    if (def === UserEndpoints.getMe) return resolveOrDefault(overrides.getMe, USER);
    if (def === AuthEndpoints.forgotPassword) return resolveOrDefault(overrides.forgotPassword, undefined);
    if (def === AuthEndpoints.resendEmail) return resolveOrDefault(overrides.resendEmail, undefined);
    if (def === AuthEndpoints.register) return resolveOrDefault(overrides.register, undefined);
    return Promise.reject(new Error(`Unexpected endpoint in test: ${String(def)}`));
  });
  return { execute } as unknown as HttpClient;
}

function resolveOrDefault(override: (() => unknown) | undefined, fallback: unknown) {
  return Promise.resolve(override ? override() : fallback);
}

describe("useAuth", () => {
  it("login: on success fetches the profile (no bearer token in the response), stores the session, and notifies onSessionChange", async () => {
    const httpClient = createMockHttpClient();
    const onSessionChange = vi.fn();
    const onBootstrapVersion = vi.fn();
    const { result } = renderHook(() => useAuth(httpClient, { onSessionChange, onBootstrapVersion }));

    let response: AuthSession | null = null;
    await act(async () => {
      response = await result.current.login({ email: "a@b.com", password: "x" });
    });

    expect(httpClient.execute).toHaveBeenCalledWith(AuthEndpoints.login, { email: "a@b.com", password: "x" });
    expect(httpClient.execute).toHaveBeenCalledWith(UserEndpoints.getMe);
    expect(response).toEqual(SESSION);
    expect(result.current.session).toEqual(SESSION);
    expect(onSessionChange).toHaveBeenCalledWith(SESSION);
    expect(onBootstrapVersion).toHaveBeenCalledWith(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("login: on failure resolves null and sets a translateError()-resolved message, never a raw code", async () => {
    const httpClient = createMockHttpClient({
      login: () => {
        throw new HttpError({ kind: HttpErrorKinds.Api, status: 401, code: "300", message: "raw backend text" });
      },
    });
    const { result } = renderHook(() => useAuth(httpClient));

    let response: AuthSession | null = SESSION;
    await act(async () => {
      response = await result.current.login({ email: "a@b.com", password: "wrong" });
    });

    expect(response).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.error).toBe("Invalid credentials");
    expect(result.current.error).not.toContain("300");
  });

  it("logout: takes no request (the refresh-token cookie is sent automatically), clears the session, and resolves true", async () => {
    const httpClient = createMockHttpClient();
    const { result } = renderHook(() => useAuth(httpClient));

    await act(async () => {
      await result.current.login({ email: "a@b.com", password: "x" });
    });
    expect(result.current.session).toEqual(SESSION);

    let ok = false;
    await act(async () => {
      ok = await result.current.logout();
    });

    expect(ok).toBe(true);
    expect(result.current.session).toBeNull();
    expect(httpClient.execute).toHaveBeenLastCalledWith(AuthEndpoints.logout);
  });

  it("forgotPassword/resendEmail/register resolve booleans without ever throwing out of the hook (the backend issues no session on register)", async () => {
    const httpClient = createMockHttpClient();
    const { result } = renderHook(() => useAuth(httpClient));

    let forgotOk = false;
    await act(async () => {
      forgotOk = await result.current.forgotPassword({ email: "a@b.com" });
    });
    expect(forgotOk).toBe(true);
    expect(httpClient.execute).toHaveBeenLastCalledWith(AuthEndpoints.forgotPassword, { email: "a@b.com" });

    let resendOk = false;
    await act(async () => {
      resendOk = await result.current.resendEmail({ email: "a@b.com", purpose: "EmailVerification" });
    });
    expect(resendOk).toBe(true);

    let registerOk = false;
    await act(async () => {
      registerOk = await result.current.register({
        email: "a@b.com",
        password: "x",
        firstName: "Ann",
        lastName: "Lee",
        phoneNumber: "+10000000000",
      });
    });
    expect(registerOk).toBe(true);
    expect(result.current.session).toBeNull();
  });

  it("clearError resets error back to null", async () => {
    const httpClient = createMockHttpClient({
      forgotPassword: () => {
        throw new HttpError({ kind: HttpErrorKinds.Api, status: 400, message: "bad" });
      },
    });
    const { result } = renderHook(() => useAuth(httpClient));

    await act(async () => {
      await result.current.forgotPassword({ email: "a@b.com" });
    });
    expect(result.current.error).not.toBeNull();

    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });
});
