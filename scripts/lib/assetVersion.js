import { randomBytes } from "node:crypto";

const CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function generateAssetVersion(length = 12) {
  const bytes = randomBytes(length);
  let version = "";
  for (let i = 0; i < length; i++) {
    version += CHARS[bytes[i] % CHARS.length];
  }
  return version;
}

export function replaceAssetVersion(content) {
  return content.replace(/%ASSET_VERSION%/g, generateAssetVersion());
}