import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path'; 
import { getDirname } from './paths.js';

export default function() {
  const keyPath = join(getDirname(import.meta.url), '../../config');
  if (!existsSync(keyPath)) {
    throw new Error('API key file not found. Please create /key and add your API key.');
  }

  const input = readFileSync(keyPath, 'utf8').trim();
  
  const key = input.match(/API_KEY=(.*)/);
  const saltGroupId = input.match(/SALT_GROUP_ID=(.*)/);
  const thuwedGroupId = input.match(/THUWED_GROUP_ID=(.*)/);

  if (!key || !saltGroupId || !thuwedGroupId) {
    throw new Error('Some config is missing from the /config file.');
  }

  return {
    apiKey: key[1].trim(),
    saltGroupId: saltGroupId[1].trim(),
    thuwedGroupId: thuwedGroupId[1].trim()
  };
}
