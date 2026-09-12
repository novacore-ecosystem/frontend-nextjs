import { act, renderHook } from "@testing-library/react";
import { AuthEndpoints, HttpError, HttpErrorKinds, type AuthSession, type HttpClient } from "@novacore/frontend-foundation";
import { describe, expect, it, vi } from "vitest";
import { useAuth } from "../../src/components/auth/use-auth";

function createMockHttpClient(execute: ReturnType<typeof vi.fn>): HttpClient {
  return { execute } as unknown as HttpClient;
}

const SESSION: AuthSession = { accessToken: "access-1", refreshToken: "refresh-1" };

describe("useAuth", () => {
  it("login: on success stores the session and notifies onSessionChange", async () => {
    const execute = vi.fn().mockResolvedValue(SESSION);
    const httpClient = createMockHttpClient(execute);
    const onSessionChange = vi.fn();
    const { result } = renderHook(() => useAuth(httpClient, { onSessionChange }));

    let response: AuthSession | null = null;
    await act(async () => {
      response = await result.current.login({ usernameOrEmail: "a@b.com", password: "x" });
    });

    expect(execute).toHaveBeenCalledWith(AuthEndpoints.login, { usernameOrEmail: "a@b.com", password: "x" });
    expect(response).toEqual(SESSION);
    expect(result.current.session).toEqual(SESSION);
    expect(onSessionChange).toHaveBeenCalledWith(SESSION);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("login: on failure resolves null and sets a translateError()-resolved message, never a raw code", async () => {
    const execute = vi
      .fn()
      .mockRejectedValue(new HttpError({ kind: HttpErrorKinds.Api, status: 401, code: "300", message: "raw backend text" }));
    const httpClient = createMockHttpClient(execute);
    const { result } = renderHook(() => useAuth(httpClient));

    let response: AuthSession | null = SESSION;
    await act(async () => {
      response = await result.current.login({ usernameOrEmail: "a@b.com", password: "wrong" });
    });

    expect(response).toBeNull();
    expect(result.current.session).toBeNull();
    expect(result.current.error).toBe("Invalid credentials");
    expect(result.current.error).not.toContain("300");
  });

  it("logout: sends the current session's refreshToken, clears the session, and resolves true", async () => {
    const execute = vi.fn().mockResolvedValue(SESSION);
    const httpClient = createMockHttpClient(execute);
    const { result } = renderHook(() => useAuth(httpClient));

    await act(async () => {
      await result.current.login({ usernameOrEmail: "a@b.com", password: "x" });
    });
    expect(result.current.session).toEqual(SESSION);

    execute.mockResolvedValueOnce(undefined);
    let ok = false;
    await act(async () => {
      ok = await result.current.logout();
    });

    expect(ok).toBe(true);
    expect(result.current.session).toBeNull();
    expect(execute).toHaveBeenLastCalledWith(AuthEndpoints.logout, { refreshToken: "refresh-1" });
  });

  it("forgotPassword/resendEmail/register resolve booleans (or the response) without ever throwing out of the hook", async () => {
    const execute = vi.fn().mockResolvedValue(undefined);
    const httpClient = createMockHttpClient(execute);
    const { result } = renderHook(() => useAuth(httpClient));

    let forgotOk = false;
    await act(async () => {
      forgotOk = await result.current.forgotPassword({ email: "a@b.com" });
    });
    expect(forgotOk).toBe(true);
    expect(execute).toHaveBeenLastCalledWith(AuthEndpoints.forgotPassword, { email: "a@b.com" });

    let resendOk = false;
    await act(async () => {
      resendOk = await result.current.resendEmail({ email: "a@b.com" });
    });
    expect(resendOk).toBe(true);

    execute.mockResolvedValueOnce({ id: "u1", email: "a@b.com" });
    let registerResult;
    await act(async () => {
      registerResult = await result.current.register({ email: "a@b.com", password: "x" });
    });
    expect(registerResult).toEqual({ id: "u1", email: "a@b.com" });
  });

  it("clearError resets error back to null", async () => {
    const execute = vi.fn().mockRejectedValue(new HttpError({ kind: HttpErrorKinds.Api, status: 400, message: "bad" }));
    const httpClient = createMockHttpClient(execute);
    const { result } = renderHook(() => useAuth(httpClient));

    await act(async () => {
      await result.current.forgotPassword({ email: "a@b.com" });
    });
    expect(result.current.error).not.toBeNull();

    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });
});
