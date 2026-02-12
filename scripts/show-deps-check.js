import fs from "node:fs";
import path from "node:path";

const CHECK_FILE = path.resolve(".deps-check");
const MAX_DAYS = 90;

if (fs.existsSync(CHECK_FILE)) {
  const content = fs.readFileSync(CHECK_FILE, "utf8").trim();
  const date = new Date(content);

  if (Number.isNaN(date.getTime())) {
    console.warn(`.deps-check is malformed.`);
  } else {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays > MAX_DAYS) {
      console.error(`
        
      Last dependency check was over ${MAX_DAYS} days ago (${date.toLocaleDateString()}). Please run "pnpm deps:check".
      
      `);
    } else {
      console.warn(`
        
      Last dependency check: ${date.toLocaleString()}
        
      `);
    }
  }
} else {
  console.warn(`
    
  No .deps-check file found. Run "pnpm deps:check"
    
  `);
}
