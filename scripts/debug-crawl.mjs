async function check() {
  const res = await fetch('http://localhost:3000');
  const text = await res.text();
  const pattern = /https:\/\/coresg-normal\.trae\.ai\/api\/ide\/v1\/text_to_image\?[^\s"<>\\]+/g;
  const matches = text.match(pattern);
  console.log(`Found ${matches ? matches.length : 0} matches`);
  if (matches) {
    matches.forEach((m, i) => console.log(`${i}: ${m.substring(0, 100)}...`));
  }
}
check();
