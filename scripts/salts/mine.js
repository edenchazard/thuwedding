import { readFileSync } from "node:fs";
import { join } from "node:path";
import { getDirname } from "../lib/paths.js";
import { page } from "../lib/page.js";

const __dirname = getDirname(import.meta.url);
const csvPath = join(__dirname, "../..", "sources", "salts.csv");

const rows = readFileSync(csvPath, "utf8").trim().split("\n");

const table = rows
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

page("salts/mine", {
  root: "../../",
  title: "2G Salts",
  replace: { REPLACE: table },
});

console.log(`/salts/mine/index.html: (${rows.length} rows)`);
