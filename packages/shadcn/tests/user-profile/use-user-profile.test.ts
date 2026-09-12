import { act, renderHook, waitFor } from "@testing-library/react";
import { HttpError, HttpErrorKinds, UserEndpoints, type HttpClient, type UserProfile } from "@novacore/frontend-foundation";
import { describe, expect, it, vi } from "vitest";
import { useUserProfile } from "../../src/components/user-profile/use-user-profile";

function createMockHttpClient(execute: ReturnType<typeof vi.fn>): HttpClient {
  return { execute } as unknown as HttpClient;
}

const PROFILE: UserProfile = { id: "u1", displayName: "Jane Doe", email: "jane@example.com" };

describe("useUserProfile", () => {
  it("auto-loads the current profile on mount (UserEndpoints.getMe)", async () => {
    const execute = vi.fn().mockResolvedValue(PROFILE);
    const httpClient = createMockHttpClient(execute);
    const { result } = renderHook(() => useUserProfile(httpClient));

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(execute).toHaveBeenCalledWith(UserEndpoints.getMe);
    expect(result.current.profile).toEqual(PROFILE);
    expect(result.current.error).toBeNull();
  });

  it("autoLoad: false skips the mount fetch until refresh() is called explicitly", async () => {
    const execute = vi.fn().mockResolvedValue(PROFILE);
    const httpClient = createMockHttpClient(execute);
    const { result } = renderHook(() => useUserProfile(httpClient, { autoLoad: false }));

    expect(result.current.loading).toBe(false);
    expect(execute).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.refresh();
    });
    expect(result.current.profile).toEqual(PROFILE);
  });

  it("updateProfile sends the patch and updates `profile` with the response", async () => {
    const execute = vi.fn().mockResolvedValue(PROFILE);
    const httpClient = createMockHttpClient(execute);
    const { result } = renderHook(() => useUserProfile(httpClient));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const updated: UserProfile = { ...PROFILE, displayName: "Jane R. Doe" };
    execute.mockResolvedValueOnce(updated);
    await act(async () => {
      await result.current.updateProfile({ displayName: "Jane R. Doe" });
    });

    expect(execute).toHaveBeenLastCalledWith(UserEndpoints.updateProfile, { displayName: "Jane R. Doe" });
    expect(result.current.profile).toEqual(updated);
  });

  it("loadDetail defaults to the currently loaded profile's id when none is supplied", async () => {
    const execute = vi.fn().mockResolvedValue(PROFILE);
    const httpClient = createMockHttpClient(execute);
    const { result } = renderHook(() => useUserProfile(httpClient));
    await waitFor(() => expect(result.current.loading).toBe(false));

    execute.mockResolvedValueOnce({ ...PROFILE, fields: [{ label: "Department", value: "Sales" }] });
    await act(async () => {
      await result.current.loadDetail();
    });

    expect(execute).toHaveBeenLastCalledWith(UserEndpoints.getById, { id: "u1" });
    expect(result.current.detail?.fields).toEqual([{ label: "Department", value: "Sales" }]);
  });

  it("resolves a failure into a localized `error`, never a raw code, and leaves `profile` untouched", async () => {
    const execute = vi
      .fn()
      .mockResolvedValueOnce(PROFILE)
      .mockRejectedValueOnce(new HttpError({ kind: HttpErrorKinds.Api, status: 404, code: "700", message: "raw" }));
    const httpClient = createMockHttpClient(execute);
    const { result } = renderHook(() => useUserProfile(httpClient));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.loadDetail("missing-user");
    });

    expect(result.current.error).toBe("User not found");
    expect(result.current.profile).toEqual(PROFILE);
  });
});
