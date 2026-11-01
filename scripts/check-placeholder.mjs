
async function check() {
  const prompt = "overhead cinematic shot of film photography essentials: a classic camera, several film rolls, an open notebook and a magnifying glass on a warm vintage wooden table, soft golden window light, analog cinematic aesthetic";
  const url = `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=landscape_4_3`;
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  console.log("Size:", buffer.byteLength);
}
check();
