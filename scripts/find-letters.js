const sharp = require('sharp');

async function findLetters() {
  const { data, info } = await sharp('public/assets/velysium-logo-clean.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Wordmark is x in [350, 980], y in [270, 360]
  let inLetter = false;
  let letterStart = 0;
  const letters = [];

  for (let x = 350; x < 980; x++) {
    let colOpaque = 0;
    for (let y = 270; y < 360; y++) {
      if (data[(y * width + x) * channels + 3] > 80) colOpaque++;
    }
    if (colOpaque > 0 && !inLetter) {
      inLetter = true;
      letterStart = x;
    } else if (colOpaque === 0 && inLetter) {
      inLetter = false;
      letters.push([letterStart, x - 1]);
    }
  }

  const names = ['V', 'E', 'L', 'Y', 'S', 'I', 'U', 'M'];
  console.log(`Found ${letters.length} letters:`);
  letters.forEach((l, i) => {
    // Find min/max Y for this letter
    let minY = 500, maxY = 0;
    for (let x = l[0]; x <= l[1]; x++) {
      for (let y = 270; y < 360; y++) {
        if (data[(y * width + x) * channels + 3] > 80) {
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    console.log(`${names[i] || i}: x=[${l[0]}, ${l[1]}] (${l[1] - l[0] + 1}px) y=[${minY}, ${maxY}] (${maxY - minY + 1}px)`);
  });
}

findLetters().catch(console.error);
