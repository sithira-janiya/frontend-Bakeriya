// Lists files in src/ that no other file imports.
// Run:  node find-unused.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve, dirname, extname, sep } from "node:path";

const SRC = resolve("src");
const EXTS = [".jsx", ".js", ".css"];
const files = [];

(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXTS.includes(extname(p))) files.push(p);
  }
})(SRC);

const fileSet = new Set(files.map((f) => f.toLowerCase()));
const imported = new Set();

// entry points are always "used"
for (const entry of ["main.jsx", "App.jsx", "index.css"]) {
  imported.add(join(SRC, entry).toLowerCase());
}

const importRegex =
  /(?:import\s[^'"]*|from\s*|import\s*\(\s*|@import\s*)["']((?:\.{1,2}\/)[^'"]+)["']/g;

for (const file of files) {
  const code = readFileSync(file, "utf8");
  for (const match of code.matchAll(importRegex)) {
    const raw = match[1];
    const base = resolve(dirname(file), raw);
    // try exact, then with extensions, then /index
    const candidates = [
      base,
      ...EXTS.map((e) => base + e),
      ...EXTS.map((e) => join(base, "index" + e)),
    ];
    for (const c of candidates) {
      if (fileSet.has(c.toLowerCase())) {
        imported.add(c.toLowerCase());
        break;
      }
    }
  }
}

const unused = files.filter((f) => !imported.has(f.toLowerCase()));

console.log("\n=== Files nothing imports ===");
if (unused.length === 0)
  console.log("(none — everything is imported somewhere)");
for (const f of unused) console.log("  " + f.replace(SRC + sep, "src" + sep));
console.log("\nNote: a file listed here can still be referenced in ways this");
console.log(
  "script can't see (dynamic import with a variable, HTML, configs).",
);
console.log("Always search the name in VS Code before deleting.\n");
