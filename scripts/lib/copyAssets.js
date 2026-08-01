import { copyFileSync, cpSync } from "node:fs";
import path from "node:path";

export function copyAssets() {
  // copy the css directory from templates to build directory
  const sourceDir = path.join(import.meta.dirname, "../../templates/css");
  const destDir = path.join(import.meta.dirname, "../../build/css");
  cpSync(sourceDir, destDir, { recursive: true });
}
