import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

export function getFilename(metaUrl) {
  return fileURLToPath(metaUrl);
}

export function getDirname(metaUrl) {
  return dirname(getFilename(metaUrl));
}
