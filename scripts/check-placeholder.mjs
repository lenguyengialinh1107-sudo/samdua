import fs from 'node:fs';
import path from 'node:path';

const demoDir = path.resolve('public/images/demo');
const PLACEHOLDER_SIZES = new Set([64966, 176626]);

const files = fs.readdirSync(demoDir);
let placeholders = 0;
let realImages = 0;

for (const file of files) {
  if (file.endsWith('.jpg')) {
    const stats = fs.statSync(path.join(demoDir, file));
    if (PLACEHOLDER_SIZES.has(stats.size)) {
      placeholders++;
    } else {
      realImages++;
    }
  }
}

console.log(`Total images: ${files.length}`);
console.log(`Real images: ${realImages}`);
console.log(`Placeholders: ${placeholders}`);
