const sharp = require('sharp');
const fs = require('fs');

async function main() {
  const { data, info } = await sharp('public/assets/velysium-logo.png')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log('Image dimensions:', width, 'x', height, 'channels:', channels);

  // Check top-left corners
  for (let y = 0; y < 6; y++) {
    let row = '';
    for (let x = 0; x < 6; x++) {
      const idx = (y * width + x) * channels;
      row += `(${data[idx]},${data[idx+1]},${data[idx+2]}) `;
    }
    console.log(`y=${y}: ${row}`);
  }

  // Find non-checkerboard pixels (checkerboard is usually white 255,255,255 and grey ~238,238,238 or ~204,204,204)
  // Let's find min/max x, y of colored or dark pixels
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx+1];
      const b = data[idx+2];
      
      // Checkerboard is achromatic: r ≈ g ≈ b and > 180
      const isAchromatic = Math.abs(r - g) < 8 && Math.abs(g - b) < 8 && Math.abs(r - b) < 8;
      const isLight = (r + g + b) / 3 > 170;
      const isCheckerboard = isAchromatic && isLight;
      
      if (!isCheckerboard) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Logo bounding box: x=[${minX}, ${maxX}] (${maxX - minX}px), y=[${minY}, ${maxY}] (${maxY - minY}px)`);

  // Let's sample colors from the logo
  // Find mark bbox vs wordmark bbox
  // Mark is roughly left side, wordmark is right side
  let markMinX = minX, markMaxX = 0, markMinY = minY, markMaxY = 0;
  let wordMinX = width, wordMaxX = maxX, wordMinY = height, wordMaxY = 0;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx+1];
      const b = data[idx+2];
      const isCheckerboard = Math.abs(r - g) < 8 && Math.abs(g - b) < 8 && ((r + g + b) / 3 > 170);

      if (!isCheckerboard) {
        if (x < 360) {
          if (x < markMinX) markMinX = x;
          if (x > markMaxX) markMaxX = x;
          if (y < markMinY) markMinY = y;
          if (y > markMaxY) markMaxY = y;
        } else {
          if (x < wordMinX) wordMinX = x;
          if (x > wordMaxX) wordMaxX = x;
          if (y < wordMinY) wordMinY = y;
          if (y > wordMaxY) wordMaxY = y;
        }
      }
    }
  }

  console.log(`Mark bbox: x=[${markMinX}, ${markMaxX}] y=[${markMinY}, ${markMaxY}]`);
  console.log(`Wordmark bbox: x=[${wordMinX}, ${wordMaxX}] y=[${wordMinY}, ${wordMaxY}]`);
}

main().catch(console.error);
