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

const blogPrompts = [
  "young person holding a classic film camera, a variety of beginner-friendly film cameras arranged on a table, warm analog tones, soft natural lighting, professional photography",
  "one Kodak Gold 200 film roll and one Fujifilm 400 film roll side by side, vintage analog mood, warm golden sunlight, cinematic film look",
  "authentic Olympus Superzoom 70 black compact film camera, realistic product photo on a vintage wooden surface, warm analog tones",
  "young person loading a 35mm film roll into a vintage SLR camera, concentrated expression, soft indoor lighting, analog film aesthetic",
  "vintage film camera, a wooden dry box, and a cleaning kit with a soft brush and cloth on a cream table, warm cinematic lighting",
  "cinematic shot of a beautiful old street in Hanoi at sunset, warm golden light, vintage colonial buildings, analog film grain",
  "different film rolls (ISO 100, 400, 800) placed in various lighting conditions from bright sun to deep shadow, warm analog cinematic lighting"
];

const demoDir = path.resolve('public/images/demo');
const PLACEHOLDER_SIZES = new Set([64966, 176626]);

console.log('--- Kiểm tra ảnh Blog ---');
for (const prompt of blogPrompts) {
  const key = `${prompt}::landscape_4_3`;
  const hash = hashKey(key);
  const fileName = `${hash}.jpg`;
  const filePath = path.join(demoDir, fileName);
  
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const isPlaceholder = PLACEHOLDER_SIZES.has(stats.size);
    console.log(`${fileName}: ${isPlaceholder ? 'LÀ PLACEHOLDER' : 'ẢNH THẬT'} (${stats.size} bytes)`);
  } else {
    console.log(`${fileName}: CHƯA CÓ`);
  }
}
