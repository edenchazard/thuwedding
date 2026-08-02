import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getDirname } from "../lib/paths.js";
import { copyAssets } from "../lib/copyAssets.js";

const __dirname = getDirname(import.meta.url);
const csvPath = join(__dirname, "../..", "sources", "salts.csv");
const csvContent = readFileSync(csvPath, "utf8");

const rows = csvContent
  .trim()
  .split("\n")
  .map((line) => {
    const [code, parentF, parentM, gender] = line.split(",");
    return `
  <tr>
    <td>
      <a href="https://dragcave.net/lineage/${code}" target="_blank" rel="noopener noreferrer">
        <img src="https://dragcave.net/image/${code}.gif" />
      </a>
      <i>(${code})</i> <br />
      ${gender ? `(${gender})` : ""}
    </td>
    <td>
      ${
        parentF
          ? `
      <a href="https://dragcave.net/lineage/${parentF}" target="_blank" rel="noopener noreferrer">
        <img src="https://dragcave.net/image/${parentF}.gif" />
      </a>
      <i>(${parentF})</i>`
          : ""
      }
    </td>
    <td>
      ${
        parentM
          ? `
      <a href="https://dragcave.net/lineage/${parentM}" target="_blank" rel="noopener noreferrer">
        <img src="https://dragcave.net/image/${parentM}.gif" />
      </a>
      <i>(${parentM})</i>`
          : ""
      }
    </td>
  </tr>`;
  })
  .join("\n");

const templatePath = join(__dirname, "../../templates/salts", "mine.html");
let template = readFileSync(templatePath, "utf8");
const output = template.replace("%REPLACE%", rows);
const outPath = join(__dirname, "../..", "build", "salts.html");
writeFileSync(outPath, output, "utf8");
copyAssets();
console.log("Wrote build/salts.html");
