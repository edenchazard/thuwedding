import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path'; 
import { getDirname } from './paths.js';

export default function() {
  const keyPath = join(getDirname(import.meta.url), '../../key');
  if (!existsSync(keyPath)) {
    throw new Error('API key file not found. Please create /key and add your API key.');
  }
  return readFileSync(keyPath, 'utf8').trim();
}
