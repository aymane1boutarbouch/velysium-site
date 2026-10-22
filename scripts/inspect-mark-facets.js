const sharp = require('sharp');

async function inspectMarkFacets() {
  const { data, info } = await sharp('public/assets/velysium-logo-clean.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, channels } = info;

  console.log('=== V Mark Geometry ===');
  // Sparkle from y=220 to y=254, V from y=254 to y=435
  for (let y = 220; y <= 436; y += 8) {
    let line = '';
    for (let x = 67; x <= 341; x += 4) {
      const idx = (y * width + x) * channels;
      const a = data[idx + 3];
      if (a < 50) {
        line += ' ';
      } else {
        const r = data[idx];
        const g = data[idx+1];
        const b = data[idx+2];
        // Distinguish by color:
        // Sparkle / light violet:
        if (y < 254) line += '*';
        // Cyan/blue:
        else if (b > 200 && r < 100) line += 'C';
        // Magenta/violet:
        else if (r > 120 && b > 200) line += 'V';
        // Deep navy:
        else if (r < 50 && b < 150) line += '#';
        // Indigo / purple:
        else line += '=';
      }
    }
    console.log(`y=${y.toString().padStart(3)}: ${line}`);
  }
}

inspectMarkFacets().catch(console.error);
