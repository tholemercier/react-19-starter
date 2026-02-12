import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const CHECK_FILE = path.resolve(".deps-check");

console.warn(`

`);

// Run npm outdated
spawnSync("npm outdated", {
  encoding: "utf8",
  shell: true, // important for PATH resolution
  stdio: "inherit",
});

const now = new Date();
fs.writeFileSync(CHECK_FILE, now.toISOString());
console.warn(`
  
Saved dependency check date to .deps-check: ${now.toISOString()}
  
`);
