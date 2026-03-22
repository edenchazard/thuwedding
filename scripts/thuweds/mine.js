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
    const [code, parentF, parentM, gender] = line.split(',');

    return `<tr>
      <td>
        <a href="https://dragcave.net/view/${code}" target="_blank" rel="noopener noreferrer">
          <img src="https://dragcave.net/image/${code}.gif" />
        </a>
        <i>(${code})</i>
      </td>
      <td>
        <a href="https://dragcave.net/view/${parentF}" target="_blank" rel="noopener noreferrer">
          <img src="https://dragcave.net/image/${parentF}.gif" />
        </a>
        <i>(${parentF})</i>
      </td>
      <td>
        <a href="https://dragcave.net/view/${parentM}" target="_blank" rel="noopener noreferrer">
          <img src="https://dragcave.net/image/${parentM}.gif" />
        </a>
        <i>(${parentM})</i>
      </td>
      <td>${gender ? gender : ''}</td>
    </tr>`;    
  })
  .join('\n');

const templatePath = join(__dirname, '../../templates/thuweds', 'mine.html');
let template = readFileSync(templatePath, 'utf8');

const output = template.replace('%REPLACE%', rows);

const outPath = join(__dirname, '../..', 'artifacts', 'thuweds.html');
writeFileSync(outPath, output, 'utf8');
console.log('Wrote artifacts/mine.html');
