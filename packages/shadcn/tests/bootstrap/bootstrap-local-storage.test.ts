import { beforeEach, describe, expect, it } from "vitest";
import { createLocalStorageBootstrapStorage } from "../../src/lib/bootstrap-local-storage";

interface TestBootstrap {
  version: number;
  label: string;
}

describe("createLocalStorageBootstrapStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns null when nothing has been persisted", () => {
    const storage = createLocalStorageBootstrapStorage<TestBootstrap>();
    expect(storage.get()).toBeNull();
  });

  it("round-trips a persisted value", () => {
    const storage = createLocalStorageBootstrapStorage<TestBootstrap>();
    storage.set({ version: 2, label: "acme" });
    expect(storage.get()).toEqual({ version: 2, label: "acme" });
  });

  it("clears the persisted value", () => {
    const storage = createLocalStorageBootstrapStorage<TestBootstrap>();
    storage.set({ version: 2, label: "acme" });
    storage.clear();
    expect(storage.get()).toBeNull();
  });

  it("keeps separately-keyed storages independent", () => {
    const a = createLocalStorageBootstrapStorage<TestBootstrap>("app-a");
    const b = createLocalStorageBootstrapStorage<TestBootstrap>("app-b");
    a.set({ version: 1, label: "a" });
    expect(b.get()).toBeNull();
  });
});
