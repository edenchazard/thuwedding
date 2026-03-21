import fs from 'fs';
import path from 'node:path'; 
import { getDirname } from './paths.js';

export default function() {
  const keyPath = path.join(getDirname(import.meta.url), '../../key');
  if (!fs.existsSync(keyPath)) {
    throw new Error('API key file not found. Please create scripts/salts/key and add your API key.');
  }
  return fs.readFileSync(keyPath, 'utf8').trim();
}
