import { fileURLToPath } from 'url';
import path from 'path';

export function getFilename(metaUrl) {
  return fileURLToPath(metaUrl);
}

export function getDirname(metaUrl) {
  return path.dirname(getFilename(metaUrl));
}
