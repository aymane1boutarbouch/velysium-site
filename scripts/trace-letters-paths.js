const sharp = require('sharp');
const fs = require('fs');

async function traceLetters() {
  const { data, info } = await sharp('public/assets/velysium-logo-clean.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, channels } = info;

  // Let's analyze the exact dimensions of each letter relative to wordmark origin:
  // Wordmark starts at x=352, y=284. Baseline=343 (height=59px).
  // Let's get the exact pixel column profiles for each letter.
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

  for (const l of letters) {
    console.log(`\nLetter ${l.name}: x=[${l.x0}, ${l.x1}], w=${l.x1 - l.x0 + 1}`);
    // Top bar / top point
    let topCols = [];
    for (let x = l.x0; x <= l.x1; x++) {
      if (data[(284 * width + x) * channels + 3] > 80) topCols.push(x - l.x0);
    }
    console.log(`Top row (y=284) active: [${topCols[0]}..${topCols[topCols.length - 1]}], count=${topCols.length}`);
    
    // Bottom row active
    let botCols = [];
    for (let x = l.x0; x <= l.x1; x++) {
      if (data[(343 * width + x) * channels + 3] > 80) botCols.push(x - l.x0);
    }
    console.log(`Bottom row (y=343) active: [${botCols[0]}..${botCols[botCols.length - 1]}], count=${botCols.length}`);

    // Mid row active
    let midCols = [];
    for (let x = l.x0; x <= l.x1; x++) {
      if (data[(314 * width + x) * channels + 3] > 80) midCols.push(x - l.x0);
    }
    console.log(`Mid row (y=314) active: [${midCols[0]}..${midCols[midCols.length - 1]}], count=${midCols.length}`);
  }
}

traceLetters().catch(console.error);
