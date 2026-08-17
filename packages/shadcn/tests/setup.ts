import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement scrollIntoView, but Radix Select/Tooltip/Dropdown call it internally
// when highlighting an item — without a stub, any test that opens one of those crashes with
// "scrollIntoView is not a function" deep inside a Radix effect, not in the test's own code.
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
