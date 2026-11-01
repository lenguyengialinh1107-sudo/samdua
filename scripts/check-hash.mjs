
function hashKey(input) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

const prompt = "overhead cinematic shot of film photography essentials: a classic camera, several film rolls, an open notebook and a magnifying glass on a warm vintage wooden table, soft golden window light, analog cinematic aesthetic";
const size = "landscape_4_3";
console.log(hashKey(`${prompt}::${size}`) + ".jpg");
