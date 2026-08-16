import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { AdvancedFilter, type FilterFieldConfig } from "../../src/components/composed/advanced-filter";
import { Pagination } from "../../src/components/composed/pagination";
import { EmptyState } from "../../src/components/admin/states";
import { RelativeTime } from "../../src/components/admin/relative-time";
import { I18nProvider } from "../../src/i18n";

const FIELDS: FilterFieldConfig[] = [{ field: "name", label: "Name", type: "string", operators: ["eq"] }];

describe("components render translated text, not raw keys, with no provider mounted", () => {
  it("AdvancedFilter's trigger uses the built-in default label", () => {
    render(<AdvancedFilter fields={FIELDS} value={[]} onApply={() => {}} />);
    expect(screen.getByRole("button", { name: "Filter" })).toBeInTheDocument();
    expect(screen.queryByText(/filter\.trigger/)).not.toBeInTheDocument();
  });

  it("Pagination's range label is interpolated, not a raw key", () => {
    render(<Pagination pageNumber={1} pageSize={10} totalRows={42} onPaginationChange={() => {}} />);
    expect(screen.getByText("Showing 1–10 of 42")).toBeInTheDocument();
    expect(screen.queryByText(/pagination\.showing/)).not.toBeInTheDocument();
  });

  it("EmptyState falls back to the built-in title when none is supplied", () => {
    render(<EmptyState />);
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
  });
});

describe("components pick up an I18nProvider's locale reactively", () => {
  it("AdvancedFilter's trigger switches to Vietnamese under a vi I18nProvider", () => {
    render(
      <I18nProvider locale="vi">
        <AdvancedFilter fields={FIELDS} value={[]} onApply={() => {}} />
      </I18nProvider>,
    );
    expect(screen.getByRole("button", { name: "Bộ lọc" })).toBeInTheDocument();
  });

  it("an explicit triggerLabel override still wins over the translated default", () => {
    render(
      <I18nProvider locale="vi">
        <AdvancedFilter fields={FIELDS} value={[]} onApply={() => {}} triggerLabel="Custom" />
      </I18nProvider>,
    );
    expect(screen.getByRole("button", { name: "Custom" })).toBeInTheDocument();
  });
});

describe("RelativeTime uses Intl.RelativeTimeFormat with the active locale", () => {
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

  it("renders English relative text by default", () => {
    render(<RelativeTime date={twoMinutesAgo} />);
    expect(screen.getByText(/minutes? ago/)).toBeInTheDocument();
  });

  it("auto-follows the I18nProvider's locale (vi) when no explicit locale prop is passed", () => {
    render(
      <I18nProvider locale="vi">
        <RelativeTime date={twoMinutesAgo} />
      </I18nProvider>,
    );
    expect(screen.getByText(/phút trước/)).toBeInTheDocument();
  });

  it("auto-follows the I18nProvider's locale (zh-CN) when no explicit locale prop is passed", () => {
    render(
      <I18nProvider locale="zh-CN">
        <RelativeTime date={twoMinutesAgo} />
      </I18nProvider>,
    );
    expect(screen.getByText(/分钟前/)).toBeInTheDocument();
  });

  it("an explicit locale prop overrides the provider's locale", () => {
    render(
      <I18nProvider locale="vi">
        <RelativeTime date={twoMinutesAgo} locale="en" />
      </I18nProvider>,
    );
    expect(screen.getByText(/minutes? ago/)).toBeInTheDocument();
  });
});
