// tsup/esbuild strips the "use client" directive during bundling (it isn't
// part of the ECMAScript spec, so esbuild treats it as a dead no-op string
// expression). This script restores it on every compiled chunk that
// actually originated from a source file marked "use client", using each
// chunk's sourcemap to trace back to its real source files. Chunks that
// only contain server-safe components are left untouched, so importing
// this package does not force a consumer's whole module graph client-side.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");
const srcDir = join(packageRoot, "src");
const distDir = join(packageRoot, "dist");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const clientSourceFiles = new Set(
  walk(srcDir)
    .filter((file) => /\.(ts|tsx)$/.test(file))
    .filter((file) => {
      const content = readFileSync(file, "utf8").trimStart();
      return content.startsWith('"use client"') || content.startsWith("'use client'");
    }),
);

if (clientSourceFiles.size === 0) {
  console.warn("[postbuild-use-client] No \"use client\" source files found — check src/ scanning.");
}

let patched = 0;
for (const jsFile of walk(distDir).filter((f) => f.endsWith(".js"))) {
  const mapFile = `${jsFile}.map`;
  let map;
  try {
    map = JSON.parse(readFileSync(mapFile, "utf8"));
  } catch {
    continue;
  }

  const isClientChunk = (map.sources ?? []).some((source) => {
    const absolute = resolve(dirname(jsFile), source);
    return clientSourceFiles.has(absolute);
  });

  if (!isClientChunk) continue;

  const content = readFileSync(jsFile, "utf8");
  if (content.startsWith('"use client"')) continue;

  writeFileSync(jsFile, `"use client";\n${content}`);
  patched += 1;
}

console.log(`[postbuild-use-client] Patched ${patched} compiled chunk(s) with "use client".`);
