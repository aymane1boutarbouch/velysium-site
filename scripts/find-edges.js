const sharp = require('sharp');

async function findEdges() {
  const { data, info } = await sharp('public/assets/velysium-logo-clean.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's examine rows in the V:
  // e.g. at y=254 (top edge), y=270, y=300, y=330, y=360, y=390, y=410, y=435 (apex)
  const yRows = [254, 270, 290, 310, 330, 350, 370, 390, 410, 430, 435];
  for (const y of yRows) {
    let ranges = [];
    let start = null;
    for (let x = 60; x <= 350; x++) {
      const idx = (y * width + x) * channels;
      const opaque = data[idx + 3] > 80;
      if (opaque && start === null) start = x;
      else if (!opaque && start !== null) {
        ranges.push([start, x - 1]);
        start = null;
      }
    }
    if (start !== null) ranges.push([start, 350]);
    console.log(`y=${y}: ranges=${JSON.stringify(ranges)}`);
  }
}

findEdges().catch(console.error);
