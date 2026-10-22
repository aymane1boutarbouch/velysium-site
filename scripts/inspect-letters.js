const sharp = require('sharp');

async function inspectLetterShapes() {
  const { data, info } = await sharp('public/assets/velysium-logo-clean.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, channels } = info;

  // Let's print ASCII art or binary mask of each letter so we see the exact geometry!
  const letters = [
    { name: 'V', x0: 352, x1: 431 },
    { name: 'E', x0: 448, x1: 507 },
    { name: 'L', x0: 529, x1: 584 },
    { name: 'Y', x0: 588, x1: 662 },
    { name: 'S', x0: 676, x1: 744 },
    { name: 'I', x0: 764, x1: 779 },
    { name: 'U', x0: 802, x1: 868 },
    { name: 'M', x0: 888, x1: 966 }
  ];

  for (const letter of letters) {
    console.log(`\n=== Letter ${letter.name} ===`);
    for (let y = 284; y <= 344; y += 4) {
      let line = '';
      for (let x = letter.x0; x <= letter.x1; x += 2) {
        const a = data[(y * width + x) * channels + 3];
        line += a > 100 ? '#' : '.';
      }
      console.log(line);
    }
  }
}

inspectLetterShapes().catch(console.error);
