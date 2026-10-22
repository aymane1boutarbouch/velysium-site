const sharp = require('sharp');
const fs = require('fs');

async function removeCheckerboard() {
  const image = sharp('public/assets/velysium-logo.png');
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const out = Buffer.alloc(width * height * 4);

  let transparentCount = 0;
  let opaqueCount = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * channels;
      const dstIdx = (y * width + x) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      // Checkerboard detection:
      // Checkerboard squares are achromatic (R ≈ G ≈ B) and high brightness (> 195)
      // Logo pixels have chroma (saturation) or are dark navy (brightness < 120)
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const chroma = maxC - minC;
      const brightness = (r + g + b) / 3;

      // Checkerboard is high brightness and very low chroma
      // Let's check:
      let isBg = false;
      if (brightness > 195 && chroma < 18) {
        isBg = true;
      }

      if (isBg) {
        out[dstIdx] = 0;
        out[dstIdx + 1] = 0;
        out[dstIdx + 2] = 0;
        out[dstIdx + 3] = 0; // Transparent
        transparentCount++;
      } else {
        // Logo pixel: copy RGB and set full opacity
        // Smooth edge anti-aliasing if it was near the boundary
        out[dstIdx] = r;
        out[dstIdx + 1] = g;
        out[dstIdx + 2] = b;
        out[dstIdx + 3] = 255;
        opaqueCount++;
      }
    }
  }

  console.log(`Processed: ${transparentCount} transparent pixels, ${opaqueCount} opaque logo pixels`);

  await sharp(out, { raw: { width, height, channels: 4 } })
    .png()
    .toFile('public/assets/velysium-logo-clean.png');

  console.log('Saved clean transparent PNG to public/assets/velysium-logo-clean.png');
}

removeCheckerboard().catch(console.error);
