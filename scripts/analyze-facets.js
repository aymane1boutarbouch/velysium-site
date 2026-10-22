const sharp = require('sharp');

async function analyzeMark() {
  const { data, info } = await sharp('public/assets/velysium-logo.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, channels } = info;

  // Let's sample colors across several key points of the mark
  // Mark bbox: x=[67, 359] y=[220, 436]
  // Let's sample along horizontal slices and vertical slices
  console.log('--- Sampling Facet Colors ---');
  const points = [
    { name: 'Sparkle Center', x: 206, y: 247 },
    { name: 'Sparkle Left Arm', x: 196, y: 247 },
    { name: 'Sparkle Glow/Top', x: 206, y: 230 },
    { name: 'Left Wing Outer Top', x: 80, y: 260 },
    { name: 'Left Wing Mid Outer', x: 120, y: 310 },
    { name: 'Left Wing Mid Inner', x: 155, y: 320 },
    { name: 'Left Wing Inner Edge', x: 180, y: 340 },
    { name: 'Center Fold Bottom Apex', x: 206, y: 430 },
    { name: 'Center Fold Low Mid', x: 206, y: 395 },
    { name: 'Center Fold Inner Apex', x: 206, y: 360 },
    { name: 'Right Wing Inner Highlight', x: 250, y: 280 },
    { name: 'Right Wing Mid Cyan/Blue', x: 265, y: 320 },
    { name: 'Right Wing Outer Top Right', x: 325, y: 260 },
    { name: 'Right Wing Outer Violet', x: 295, y: 330 },
    { name: 'Right Wing Bottom Edge', x: 220, y: 405 },
    { name: 'Left Wing Bottom Edge', x: 190, y: 405 },
    { name: 'Wordmark V', x: 375, y: 310 },
    { name: 'Wordmark E', x: 460, y: 310 },
    { name: 'Wordmark L', x: 540, y: 310 },
    { name: 'Wordmark Y', x: 620, y: 310 },
    { name: 'Wordmark S', x: 700, y: 310 },
    { name: 'Wordmark I', x: 780, y: 310 },
    { name: 'Wordmark U', x: 830, y: 310 },
    { name: 'Wordmark M', x: 920, y: 310 }
  ];

  for (const p of points) {
    const idx = (p.y * width + p.x) * channels;
    const r = data[idx];
    const g = data[idx+1];
    const b = data[idx+2];
    const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    console.log(`${p.name.padEnd(28)} at (${p.x}, ${p.y}): RGB(${r}, ${g}, ${b}) -> ${hex}`);
  }
}

analyzeMark().catch(console.error);
