import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { getDirname } from '../lib/paths.js';

const __dirname = getDirname(import.meta.url);
const csvPath = join(__dirname, '../..', 'sources', 'thuweds.csv');
const csvContent = readFileSync(csvPath, 'utf8');

const rows = csvContent
  .trim()
  .split('\n')
  .map(line => {
    const cols = line.split(',');
    // cols: [code, parentF, parentM, gender]
    return `<tr>
      <td>
        <a href="https://dragcave.net/view/${cols[0]}" target="_blank" rel="noopener noreferrer">
          <img src="https://dragcave.net/image/${cols[0]}.gif" />
        </a>
        <i>(${cols[0]})</i>
      </td>
      <td>
        <a href="https://dragcave.net/view/${cols[1]}" target="_blank" rel="noopener noreferrer">
          <img src="https://dragcave.net/image/${cols[1]}.gif" />
        </a>
        <i>(${cols[1]})</i>
      </td>
      <td>
        <a href="https://dragcave.net/view/${cols[2]}" target="_blank" rel="noopener noreferrer">
          <img src="https://dragcave.net/image/${cols[2]}.gif" />
        </a>
        <i>(${cols[2]})</i>
      </td>
      <td>${cols[3] ? cols[3] : ''}</td>
    </tr>`;    
  })
  .join('\n');

const templatePath = join(__dirname, '../../templates/thuweds', 'mine.html');
let template = readFileSync(templatePath, 'utf8');

const output = template.replace('%REPLACE%', rows);

const outPath = join(__dirname, '../..', 'artifacts', 'thuweds.html');
writeFileSync(outPath, output, 'utf8');
console.log('Wrote artifacts/mine.html');
