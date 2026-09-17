import { describe, expect, it } from "vitest";
import {
  BOOTSTRAP_VERSION_COOKIE_NAME,
  clearBootstrapVersionCookie,
  parseBootstrapVersionCookie,
  writeBootstrapVersionCookie,
} from "../../src/lib/bootstrap-marker-cookie";

function readCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`))
    ?.split("=")[1];
}

describe("parseBootstrapVersionCookie", () => {
  it("returns null for absent/empty values", () => {
    expect(parseBootstrapVersionCookie(undefined)).toBeNull();
    expect(parseBootstrapVersionCookie(null)).toBeNull();
    expect(parseBootstrapVersionCookie("")).toBeNull();
  });

  it("returns null for a non-numeric value", () => {
    expect(parseBootstrapVersionCookie("not-a-number")).toBeNull();
  });

  it("parses a valid numeric value", () => {
    expect(parseBootstrapVersionCookie("3")).toBe(3);
  });
});

describe("writeBootstrapVersionCookie / clearBootstrapVersionCookie", () => {
  it("writes a readable cookie with the given version", () => {
    writeBootstrapVersionCookie(5);
    expect(readCookie(BOOTSTRAP_VERSION_COOKIE_NAME)).toBe("5");
  });

  it("clears the cookie", () => {
    writeBootstrapVersionCookie(5);
    clearBootstrapVersionCookie();
    expect(parseBootstrapVersionCookie(readCookie(BOOTSTRAP_VERSION_COOKIE_NAME))).toBeNull();
  });
});
