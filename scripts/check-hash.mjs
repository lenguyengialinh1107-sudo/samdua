import fs from 'node:fs';
import path from 'node:path';

function hashKey(input) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

const prompts = [
  ["young person shooting with a vintage film camera in a cinematic street setting, warm golden sunlight, analog film grain, chừa khoảng trống bên trái cho văn bản", "landscape_4_3"],
  ["vintage 35mm film SLR camera collection arranged on a warm cream linen surface with scattered film rolls and printed photographs, soft natural window light, muted terracotta and brown palette, editorial analog photography", "landscape_4_3"]
];

const demoDir = path.resolve('public/images/demo');

for (const [prompt, size] of prompts) {
  const key = `${prompt}::${size}`;
  const hash = hashKey(key);
  const fileName = `${hash}.jpg`;
  const filePath = path.join(demoDir, fileName);
  
  console.log(`Prompt: ${prompt.substring(0, 50)}...`);
  console.log(`Hash: ${hash}`);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`File: ${fileName} exists, size: ${stats.size} bytes`);
    if (stats.size < 200000) {
      console.log(`Warning: File size is small, might be a placeholder.`);
    }
  } else {
    console.log(`File: ${fileName} DOES NOT exist`);
  }
  console.log('---');
}
