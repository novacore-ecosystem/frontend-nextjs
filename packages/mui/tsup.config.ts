import { defineConfig } from "tsup";

export default defineConfig({
  // `bundle: false` transpiles each source file 1:1 into dist instead of
  // merging modules into shared chunks. esbuild strips the "use client"
  // directive during bundling/code-splitting (it's not part of the
  // ECMAScript spec), so bundling would silently break RSC boundaries.
  // With bundle:false the directive survives per-file naturally, so
  // server-safe components (Container, Heading, Card, ...) never drag the
  // whole package into the client boundary. See @novacore/frontend-next-shadcn
  // for the same lesson (bug-001 in that package's buglog).
  entry: ["src/**/*.{ts,tsx}"],
  bundle: false,
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  external: ["react", "react-dom", "next"],
});
