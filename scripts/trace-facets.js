const sharp = require('sharp');

async function traceMark() {
  const { data, info } = await sharp('public/assets/velysium-logo-clean.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Let's find the bounding box of the mark and sparkle
  // Mark is roughly x in [60, 350], y in [220, 440]
  let minX = 1000, maxX = 0, minY = 1000, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 60; x < 350; x++) {
      const a = data[(y * width + x) * channels + 3];
      if (a > 50) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Mark bounding box: x=[${minX}, ${maxX}] (${maxX - minX}px), y=[${minY}, ${maxY}] (${maxY - minY}px)`);

  // Sparkle vs V-chevron:
  // Let's find where the sparkle ends and V begins in Y
  for (let y = minY; y <= maxY; y++) {
    let rowOpaque = 0;
    for (let x = minX; x <= maxX; x++) {
      if (data[(y * width + x) * channels + 3] > 50) rowOpaque++;
    }
    // Print rows around sparkle and top of V
    if (y < 275) {
      console.log(`y=${y}: ${rowOpaque} opaque px`);
    }
  }
}

traceMark().catch(console.error);
