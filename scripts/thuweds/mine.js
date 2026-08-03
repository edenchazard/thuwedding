import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { getDirname } from "../lib/paths.js";
import { copyAssets } from "../lib/copyAssets.js";
import { replaceAssetVersion } from "../lib/assetVersion.js";

const __dirname = getDirname(import.meta.url);
const csvPath = join(__dirname, "../..", "sources", "thuweds.csv");
const csvContent = readFileSync(csvPath, "utf8");

const rows = csvContent.trim().split("\n");

const table = rows
  .map((line) => {
    const [code, parentF, parentM, gender] = line.split(",");

    return `<tr>
      <td>
        <a href="https://dragcave.net/lineage/${code}" target="_blank" rel="noopener noreferrer">
          <img src="https://dragcave.net/image/${code}.gif" />
        </a>
        <i>(${code})</i>
        <br />
        ${gender ? `(${gender})` : ""}
      </td>
      <td>
        <a href="https://dragcave.net/lineage/${parentF}" target="_blank" rel="noopener noreferrer">
          <img src="https://dragcave.net/image/${parentF}.gif" />
        </a>
        <i>(${parentF})</i>
      </td>
      <td>
        <a href="https://dragcave.net/lineage/${parentM}" target="_blank" rel="noopener noreferrer">
          <img src="https://dragcave.net/image/${parentM}.gif" />
        </a>
        <i>(${parentM})</i>
      </td> 
    </tr>`;
  })
  .join("\n");

const directory = "/thuweds/mine";
const outputDir = join(__dirname, "../../build", directory);
const templateDir = join(__dirname, "../../templates", directory);

const content = replaceAssetVersion(
  readFileSync(join(templateDir, "index.html"), "utf8"),
).replace("%REPLACE%", table);

rmSync(outputDir, { recursive: true, force: true });

mkdirSync(outputDir, { recursive: true });

writeFileSync(join(outputDir, "index.html"), content, "utf8");

copyAssets();

console.log(`${directory}/index.html: ${rows.length} pairs`);
