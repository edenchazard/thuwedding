import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../..', 'sources', 'thuweds.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

const rows = csvContent
  .trim()
  .split('\n')
  .map(line => {
    const cols = line.split(',');
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
    </tr>`;    
  })
  .join('\n');

const templatePath = path.join(__dirname, '../../templates/thuweds', 'mine.html');
let template = fs.readFileSync(templatePath, 'utf8');

const output = template.replace('%REPLACE%', rows);

const outPath = path.join(__dirname, '../..', 'artifacts', 'thuweds.html');
fs.writeFileSync(outPath, output, 'utf8');
console.log('Wrote artifacts/mine.html');
