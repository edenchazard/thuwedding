import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { getDirname } from "../lib/paths.js";
import { copyAssets } from "../lib/copyAssets.js";
import { replaceAssetVersion } from "../lib/assetVersion.js";
import { replacePartials } from "../lib/partials.js";

const __dirname = getDirname(import.meta.url);
const mineCsvPath = join(__dirname, "../..", "sources", "thuweds.csv");
const tjCsvPath = join(__dirname, "../..", "sources", "tj-pairings.csv");

const directory = "/thuweds/missing";
const outputDir = join(__dirname, "../../build", directory);
const templateDir = join(__dirname, "../../templates", directory);

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
        <a href="https://dragcave.net/lineage/${f}" target="_blank" rel="noopener noreferrer">
          <img src="https://dragcave.net/image/${f}.gif" />
        </a>
        <i>(${f})</i>
      </td>
      <td>
        <a href="https://dragcave.net/lineage/${m}" target="_blank" rel="noopener noreferrer">
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
    const template = readFileSync(join(templateDir, "index.html"), "utf8");
    const rows = renderRows(missing);
    const output = replacePartials(
      replaceAssetVersion(template).replace("%REPLACE%", rows),
    );
    rmSync(outputDir, { recursive: true, force: true });
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(join(outputDir, "index.html"), output, "utf8");
    copyAssets();
    console.log(`${directory}/index.html: ${missing.length} missing pairs`);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();
