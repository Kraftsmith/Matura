// Reports which "Słownictwo" illustrations are still missing or have the wrong format.
// Usage (from app/):  node scripts/check-vocab-images.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = path.join(root, 'src', 'data', 'vocabularyTexts.ts');
const imagesDir = path.join(root, 'public', 'images', 'vocab');
const EXPECTED = { width: 1200, height: 800 };

const expected = [...fs.readFileSync(dataFile, 'utf8').matchAll(/src:\s*'\/images\/vocab\/([^']+)'/g)].map((m) => m[1]);

const pngSize = (file) => {
  const buf = Buffer.alloc(24);
  const fd = fs.openSync(file, 'r');
  fs.readSync(fd, buf, 0, 24, 0);
  fs.closeSync(fd);
  const isPng = buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (!isPng) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
};

const missing = [];
const wrong = [];
const ok = [];
for (const name of expected) {
  const file = path.join(imagesDir, name);
  if (!fs.existsSync(file)) {
    missing.push(name);
    continue;
  }
  const size = pngSize(file);
  if (!size) wrong.push(`${name}: not a PNG`);
  else if (size.width !== EXPECTED.width || size.height !== EXPECTED.height)
    wrong.push(`${name}: ${size.width}x${size.height}, expected ${EXPECTED.width}x${EXPECTED.height}`);
  else ok.push(name);
}

const extra = fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir).filter((f) => !f.startsWith('.') && !expected.includes(f)) : [];

console.log(`Illustrations: ${ok.length}/${expected.length} ready`);
if (wrong.length) console.log(`\nWrong format (${wrong.length}):\n  ${wrong.join('\n  ')}`);
if (missing.length) console.log(`\nMissing (${missing.length}):\n  ${missing.join('\n  ')}`);
if (extra.length) console.log(`\nUnexpected files in images/vocab (not referenced by any text):\n  ${extra.join('\n  ')}`);
process.exitCode = missing.length || wrong.length ? 1 : 0;
