import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { getDirname } from "../lib/paths.js";
import readConfig from "../lib/readConfig.js";

const __dirname = getDirname(import.meta.url);
const { apiKey, saltGroupId, thuwedGroupId } = readConfig();

const groups = [
  { id: saltGroupId, out: join(__dirname, "../..", "sources", "salts.csv") },
  {
    id: thuwedGroupId,
    out: join(__dirname, "../..", "sources", "thuweds.csv"),
  },
];

async function fetchGroup(groupId, apiKey) {
  const apiUrl = `https://dragcave.net/api/v2/group/${groupId}/dragons?limit=500`;
  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch group ${groupId}: ${res.status}`);
  }
  const data = await res.json();
  if (!data.dragons || typeof data.dragons !== "object") {
    throw new Error("API response missing dragons object");
  }
  // Output CSV: id,parent_f,parent_m,gender
  const rows = Object.values(data.dragons).map((dragon) =>
    [dragon.id, dragon.parent_f, dragon.parent_m, dragon.gender].join(","),
  );
  return rows.join("\n");
}

async function main() {
  for (const group of groups) {
    const csv = await fetchGroup(group.id, apiKey);
    writeFileSync(group.out, csv + "\n", "utf8");
    console.log(`Wrote ${group.out}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
