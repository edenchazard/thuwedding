import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getDirname } from "../lib/paths.js";

const __dirname = getDirname(import.meta.url);
const mineCsvPath = join(__dirname, "../..", "sources", "thuweds.csv");
const tjCsvPath = join(__dirname, "../..", "sources", "tj-pairings.csv");
const templatePath = join(__dirname, "../../templates/thuweds", "missing.html");
const outPath = join(__dirname, "../..", "artifacts", "missing.html");

function getMinePairs() {
  const lines = readFileSync(mineCsvPath, "utf8")
    .split(/\r?\n/)
    .filter(Boolean);
  // Return array of [col2, col3] pairs, skip gender column if present
  return lines.map((line) => {
    const cols = line.split(",");
    return [cols[1], cols[2]];
  });
}

function getTJPairs() {
  const lines = readFileSync(tjCsvPath, "utf8").split(/\r?\n/).filter(Boolean);
  return lines.map((line) => {
    const [a, b] = line.split(",");
    return [a, b];
  });
}

function findMissingPairs(minePairs, pairs) {
  const mineSet = new Set(minePairs.map(([f, m]) => `${f};${m}`));
  return pairs.filter(([f, m]) => !mineSet.has(`${f};${m}`));
}

function renderRows(missingPairs) {
  return missingPairs
    .map(
      ([f, m]) => `
    <tr>
      <td>
        <a href="https://dragcave.net/view/${f}" target="_blank" rel="noopener noreferrer">
          <img src="https://dragcave.net/image/${f}.gif" />
        </a>
        <i>(${f})</i>
      </td>
      <td>
        <a href="https://dragcave.net/view/${m}" target="_blank" rel="noopener noreferrer">
          <img src="https://dragcave.net/image/${m}.gif" />
        </a>
        <i>(${m})</i>
      </td>
    </tr>`,
    )
    .join("\n");
}

(() => {
  try {
    const minePairs = getMinePairs();
    const tjPairs = getTJPairs();
    const missing = findMissingPairs(minePairs, tjPairs);
    const template = readFileSync(templatePath, "utf8");
    const rows = renderRows(missing);
    const output = template.replace("%REPLACE%", rows);
    writeFileSync(outPath, output, "utf8");
    console.log(
      `Wrote artifacts/missing.html (${missing.length} missing pairs)`,
    );
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();
