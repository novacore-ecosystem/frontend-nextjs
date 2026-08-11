import { defineConfig } from "tsup";

export default defineConfig({
  // `bundle: false` transpiles each source file 1:1 into dist instead of
  // merging modules into shared chunks. That preserves the "use client"
  // directive on exactly the files that need it, so importing a
  // server-safe component (Card, PageHeader, ...) never drags the whole
  // package into the client boundary — bundling would otherwise merge
  // client- and server-safe modules into the same output chunk.
  entry: ["src/**/*.{ts,tsx}"],
  bundle: false,
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  external: ["react", "react-dom", "next"],
});
