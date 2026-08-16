import { act, render, renderHook, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { I18nProvider, useTranslation } from "../../src/i18n";

function wrapper(props: Omit<React.ComponentProps<typeof I18nProvider>, "children">) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <I18nProvider {...props}>{children}</I18nProvider>;
  };
}

describe("useTranslation without a mounted I18nProvider", () => {
  it("resolves this package's own built-in English translation with zero setup", () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t("filter.addCondition")).toBe("Add condition");
    expect(result.current.locale).toBe("en");
  });
});

describe("I18nProvider — application translation merge", () => {
  it("resolves a built-in key when the application dictionary doesn't define it", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper({ locale: "en", translations: { en: { tenant: { create: "Create tenant" } } } }),
    });
    expect(result.current.t("filter.addCondition")).toBe("Add condition");
  });

  it("resolves an application-only (business) key not present in the built-in dictionary", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper({ locale: "en", translations: { en: { tenant: { create: "Create tenant" } } } }),
    });
    expect(result.current.t("tenant.create")).toBe("Create tenant");
  });

  it("an application translation overrides the built-in default for the same key", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper({ locale: "en", translations: { en: { common: { actions: { apply: "Apply Filter" } } } } }),
    });
    expect(result.current.t("common.actions.apply")).toBe("Apply Filter");
    // A sibling key not touched by the override still resolves to the built-in default.
    expect(result.current.t("common.actions.cancel")).toBe("Cancel");
  });

  it("a missing application key for a locale falls back to the built-in translation", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper({ locale: "vi", translations: { vi: { tenant: { create: "Tạo mới đơn vị thuê" } } } }),
    });
    expect(result.current.t("filter.title")).toBe("Bộ lọc nâng cao");
  });
});

describe("I18nProvider — tenant override precedence", () => {
  it("a tenant override wins over both the application translation and the built-in default", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper({
        locale: "en",
        translations: { en: { common: { actions: { apply: "Apply Filter" } } } },
        tenantTranslations: { en: { common: { actions: { apply: "Apply Changes" } } } },
      }),
    });
    expect(result.current.t("common.actions.apply")).toBe("Apply Changes");
  });
});

describe("I18nProvider — locale switching", () => {
  it("setLocale updates every subsequent t() call reactively", () => {
    function Probe() {
      const { t, locale, setLocale } = useTranslation();
      return (
        <div>
          <span data-testid="locale">{locale}</span>
          <span data-testid="label">{t("filter.trigger")}</span>
          <button onClick={() => setLocale("vi")}>switch</button>
        </div>
      );
    }
    render(
      <I18nProvider defaultLocale="en">
        <Probe />
      </I18nProvider>,
    );
    expect(screen.getByTestId("locale").textContent).toBe("en");
    expect(screen.getByTestId("label").textContent).toBe("Filter");

    act(() => screen.getByRole("button").click());

    expect(screen.getByTestId("locale").textContent).toBe("vi");
    expect(screen.getByTestId("label").textContent).toBe("Bộ lọc");
  });

  it("resolves correctly for en, vi, and zh-CN", () => {
    for (const [locale, expected] of [
      ["en", "Filter"],
      ["vi", "Bộ lọc"],
      ["zh-CN", "筛选"],
    ] as const) {
      const { result } = renderHook(() => useTranslation(), { wrapper: wrapper({ locale }) });
      expect(result.current.t("filter.trigger")).toBe(expected);
    }
  });
});

describe("I18nProvider — fallback locale", () => {
  it("falls back to fallbackLocale when a key is missing entirely for the active locale's application dictionary and the built-in default also lacks it", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: wrapper({
        locale: "vi",
        fallbackLocale: "en",
        translations: { en: { tenant: { create: "Create tenant" } } },
      }),
    });
    // "tenant.create" only exists in the English application dictionary — vi has no
    // application/tenant/built-in entry for it, so it must fall back to en.
    expect(result.current.t("tenant.create")).toBe("Create tenant");
  });
});

describe("I18nProvider — interpolation", () => {
  it("substitutes {{placeholder}} values in pagination.showing", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper: wrapper({ locale: "en" }) });
    expect(result.current.t("pagination.showing", { from: 1, to: 10, total: 42 })).toBe("Showing 1–10 of 42");
  });
});

describe("I18nProvider — missing-key behavior", () => {
  it("returns the raw key by default so a missing translation is visible but non-fatal", () => {
    const { result } = renderHook(() => useTranslation(), { wrapper: wrapper({ locale: "en" }) });
    expect(result.current.t("does.not.exist")).toBe("does.not.exist");
  });
});
