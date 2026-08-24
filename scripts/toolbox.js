import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { getDirname } from "./lib/paths.js";
import { copyAssets } from "./lib/copyAssets.js";
import { replaceAssetVersion } from "./lib/assetVersion.js";
import { replacePartials } from "./lib/partials.js";

const __dirname = getDirname(import.meta.url);
const directory = "/";
const outputDir = join(__dirname, "..", "build");
const templatePath = join(__dirname, "..", "templates", "index.html");

(() => {
  try {
    const template = readFileSync(templatePath, "utf8");
    const output = replacePartials(replaceAssetVersion(template), {
      ROOT: "./",
    });
    rmSync(join(outputDir, "index.html"), { force: true });
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(join(outputDir, "index.html"), output, "utf8");
    copyAssets();
    console.log(`${directory}index.html: toolbox`);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();
