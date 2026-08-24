import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getDirname } from "./paths.js";

const __dirname = getDirname(import.meta.url);
const partialsDir = join(__dirname, "../../templates/partials");

export function replacePartials(content) {
  for (const file of readdirSync(partialsDir)) {
    const name = file.replace(/\.html$/, "");
    const placeholder = `%${name.toUpperCase()}%`;
    const partial = readFileSync(join(partialsDir, file), "utf8").trim();
    content = content.replaceAll(placeholder, partial);
  }
  return content;
}
