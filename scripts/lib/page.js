import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { getDirname } from "./paths.js";
import { copyAssets } from "./copyAssets.js";
import { replaceAssetVersion } from "./assetVersion.js";
import { replacePartials } from "./partials.js";

const __dirname = getDirname(import.meta.url);
const templatesDir = join(__dirname, "../../templates");
const buildDir = join(__dirname, "../../build");

export function page(
  template,
  {
    root = "./",
    title = "",
    head = "",
    replace = {},
    out = template,
  } = {},
) {
  const fragmentPath = join(templatesDir, template, "index.html");
  const flatPath = join(templatesDir, `${template}.html`);
  let fragment = readFileSync(
    existsSync(fragmentPath) ? fragmentPath : flatPath,
    "utf8",
  ).trim();
  for (const [key, value] of Object.entries(replace)) {
    fragment = fragment.replaceAll(`%${key}%`, value);
  }

  const layout = readFileSync(
    join(templatesDir, "partials", "layout.html"),
    "utf8",
  );
  let output = layout.replace("%CONTENT%", fragment);
  output = replacePartials(output, { ROOT: root, TITLE: title, HEAD: head });
  output = replaceAssetVersion(output);

  const outputDir = join(buildDir, out);
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, "index.html"), output, "utf8");
  copyAssets();

  return output;
}
