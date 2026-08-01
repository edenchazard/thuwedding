import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getDirname } from "../lib/paths.js";

const __dirname = getDirname(import.meta.url);
const csvPath = join(__dirname, "../..", "sources", "salts.csv");
const csvContent = readFileSync(csvPath, "utf8");

const rows = csvContent
  .trim()
  .split("\n")
  .map((line) => {
    const [code, parentF, parentM, gender] = line.split(",");
    return `<tr>\n      <td>\n        <a href=\"https://dragcave.net/view/${code}\" target=\"_blank\" rel=\"noopener noreferrer\">\n          <img src=\"https://dragcave.net/image/${code}.gif\" />\n        </a>\n        <i>(${code})</i>\n      </td>\n      <td>\n        ${parentF ? `<a href=\"https://dragcave.net/view/${parentF}\" target=\"_blank\" rel=\"noopener noreferrer\">\n          <img src=\"https://dragcave.net/image/${parentF}.gif\" />\n        </a>\n        <i>(${parentF})</i>` : ""}\n      </td>\n      <td>\n        ${parentM ? `<a href=\"https://dragcave.net/view/${parentM}\" target=\"_blank\" rel=\"noopener noreferrer\">\n          <img src=\"https://dragcave.net/image/${parentM}.gif\" />\n        </a>\n        <i>(${parentM})</i>` : ""}\n      </td>\n      <td>${gender ? gender : ""}</td>\n    </tr>`;
  })
  .join("\n");

const templatePath = join(__dirname, "../../templates/salts", "mine.html");
let template = readFileSync(templatePath, "utf8");
const output = template.replace("%REPLACE%", rows);
const outPath = join(__dirname, "../..", "artifacts", "salts.html");
writeFileSync(outPath, output, "utf8");
console.log("Wrote artifacts/salts.html");
