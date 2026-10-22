const fs = require('fs');
const sharp = require('sharp');
const potrace = require('potrace');

function traceBuffer(buffer, params = {}) {
  return new Promise((resolve, reject) => {
    potrace.trace(buffer, {
      threshold: params.threshold || 128,
      optCurve: true,
      optTolerance: 0.2,
      turdSize: 2,
      turnPolicy: potrace.Potrace.TURNPOLICY_MINORITY,
      ...params
    }, (err, svg) => {
      if (err) return reject(err);
      // Extract the path "d" from the generated SVG
      const match = svg.match(/d="([^"]+)"/);
      if (match) resolve(match[1]);
      else resolve(null);
    });
  });
}

async function main() {
  const cleanImage = sharp('public/assets/velysium-logo-clean.png');
  const { data, info } = await cleanImage.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  console.log('--- Tracing Wordmark Letters ---');
  // Wordmark letters bounding boxes:
  const letterDefs = [
    { name: 'V', x0: 350, x1: 435, y0: 280, y1: 348 },
    { name: 'E', x0: 445, x1: 512, y0: 280, y1: 348 },
    { name: 'L', x0: 525, x1: 586, y0: 280, y1: 348 },
    { name: 'Y', x0: 586, x1: 665, y0: 280, y1: 348 },
    { name: 'S', x0: 673, x1: 748, y0: 280, y1: 348 },
    { name: 'I', x0: 760, x1: 782, y0: 280, y1: 348 },
    { name: 'U', x0: 799, x1: 871, y0: 280, y1: 348 },
    { name: 'M', x0: 885, x1: 968, y0: 280, y1: 348 }
  ];

  // Wordmark origin: x=350, y=280
  const letterPaths = [];
  for (const l of letterDefs) {
    const w = l.x1 - l.x0;
    const h = l.y1 - l.y0;
    const bmp = Buffer.alloc(w * h);

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const srcX = l.x0 + x;
        const srcY = l.y0 + y;
        const idx = (srcY * width + srcX) * channels;
        const a = data[idx + 3];
        // Binarize: dark navy letter pixels -> black, transparent -> white
        bmp[y * w + x] = a > 80 ? 0 : 255;
      }
    }

    const pngBuffer = await sharp(bmp, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
    const d = await traceBuffer(pngBuffer, { threshold: 128 });
    const offsetX = l.x0 - 350;
    const offsetY = l.y0 - 280;
    letterPaths.push({ name: l.name, d, offsetX, offsetY, w, h });
    console.log(`Traced letter ${l.name}: path length ${d ? d.length : 0}`);
  }

  // Generate wordmark.svg
  let wordmarkSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 622 70" fill="none">
  <defs>
    <linearGradient id="g-wordmark" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#121348"/>
      <stop offset="50%" stop-color="#191760"/>
      <stop offset="100%" stop-color="#131248"/>
    </linearGradient>
  </defs>
  <g id="velysium-wordmark" fill="url(#g-wordmark)">\n`;

  letterPaths.forEach(l => {
    wordmarkSvgContent += `    <g id="letter-${l.name}" class="wordmark-letter" transform="translate(${l.offsetX}, ${l.offsetY})">
      <path d="${l.d}"/>
    </g>\n`;
  });
  wordmarkSvgContent += `  </g>\n</svg>`;
  fs.writeFileSync('public/assets/wordmark.svg', wordmarkSvgContent);
  console.log('Saved wordmark.svg');

  console.log('--- Tracing Mark Facets ---');
  // Mark is in x=[65, 345], y=[218, 438] (w=280, h=220)
  const mw = 280;
  const mh = 220;
  const mx0 = 65;
  const my0 = 218;

  // Facet masks definition:
  // 1. Sparkle: y < 255
  // 2. Outer Left Wing (Upper/Outer): x < 204, y in [254, 435], outer chevron
  // 3. Outer Left Wing (Bevel/Inner Edge)
  // 4. Inner Left Wing
  // 5. Center Valley Fold (Dark shadow)
  // 6. Inner Right Wing (Bright Cyan/Blue)
  // 7. Inner Right Fold / Bevel
  // 8. Outer Right Wing (Magenta/Violet)
  // 9. Outer Right Bevel
  // 10. Apex convergence at bottom

  const facetDefs = [
    {
      name: 'sparkle',
      fill: 'url(#g-sparkle-star)',
      filter: (x, y, r, g, b, a) => y < 254 && a > 60
    },
    {
      name: 'facet-outer-left-main',
      fill: 'url(#g-out-left-main)',
      filter: (x, y, r, g, b, a) => y >= 254 && x < 150 && (r > 60 && b > 160) && ((x - 67) * 1.35 < (y - 240))
    },
    {
      name: 'facet-outer-left-edge',
      fill: 'url(#g-out-left-edge)',
      filter: (x, y, r, g, b, a) => y >= 254 && x < 180 && (r <= 60 && b >= 100 && b < 190) && (y > 300)
    },
    {
      name: 'facet-inner-left-main',
      fill: 'url(#g-in-left-main)',
      filter: (x, y, r, g, b, a) => y >= 254 && y < 360 && x >= 110 && x < 204 && (r > 70 && b > 170)
    },
    {
      name: 'facet-center-valley',
      fill: 'url(#g-center-valley)',
      filter: (x, y, r, g, b, a) => y >= 320 && y <= 375 && x >= 137 && x <= 215 && (r < 50 && b < 140)
    },
    {
      name: 'facet-inner-right-main',
      fill: 'url(#g-in-right-main)',
      filter: (x, y, r, g, b, a) => y >= 254 && y <= 370 && x >= 204 && x <= 298 && (b > 210 && r < 110 && g > 70)
    },
    {
      name: 'facet-inner-right-bevel',
      fill: 'url(#g-in-right-bevel)',
      filter: (x, y, r, g, b, a) => y >= 290 && y <= 385 && x >= 180 && x <= 250 && (b >= 130 && b <= 210 && r < 80)
    },
    {
      name: 'facet-outer-right-main',
      fill: 'url(#g-out-right-main)',
      filter: (x, y, r, g, b, a) => y >= 254 && x >= 239 && (r > 110 && b > 180)
    },
    {
      name: 'facet-outer-right-edge',
      fill: 'url(#g-out-right-edge)',
      filter: (x, y, r, g, b, a) => y >= 254 && x >= 210 && (r <= 110 && b >= 120 && b <= 220) && y > 300
    },
    {
      name: 'facet-apex-bottom',
      fill: 'url(#g-apex)',
      filter: (x, y, r, g, b, a) => y >= 395 && x >= 180 && x <= 228 && a > 80
    }
  ];

  const markFacetPaths = [];
  for (const f of facetDefs) {
    const bmp = Buffer.alloc(mw * mh);
    let count = 0;
    for (let y = 0; y < mh; y++) {
      for (let x = 0; x < mw; x++) {
        const srcX = mx0 + x;
        const srcY = my0 + y;
        const idx = (srcY * width + srcX) * channels;
        const r = data[idx];
        const g = data[idx+1];
        const b = data[idx+2];
        const a = data[idx+3];

        if (a > 40 && f.filter(srcX, srcY, r, g, b, a)) {
          bmp[y * mw + x] = 0; // Black for trace
          count++;
        } else {
          bmp[y * mw + x] = 255;
        }
      }
    }

    if (count > 20) {
      const pngBuffer = await sharp(bmp, { raw: { width: mw, height: mh, channels: 1 } }).png().toBuffer();
      const d = await traceBuffer(pngBuffer, { threshold: 128 });
      markFacetPaths.push({ name: f.name, fill: f.fill, d });
      console.log(`Traced ${f.name}: ${count} px, path length ${d ? d.length : 0}`);
    } else {
      console.log(`Skipped ${f.name} (only ${count} px)`);
    }
  }

  // Also trace the full mark silhouette for clean outline/crispness
  const fullMarkBmp = Buffer.alloc(mw * mh);
  for (let y = 0; y < mh; y++) {
    for (let x = 0; x < mw; x++) {
      const srcX = mx0 + x;
      const srcY = my0 + y;
      const a = data[(srcY * width + srcX) * channels + 3];
      fullMarkBmp[y * mw + x] = a > 60 ? 0 : 255;
    }
  }
  const fullMarkPng = await sharp(fullMarkBmp, { raw: { width: mw, height: mh, channels: 1 } }).png().toBuffer();
  const fullMarkD = await traceBuffer(fullMarkPng, { threshold: 128 });

  // Generate mark.svg
  const markSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 220" fill="none">
  <defs>
    <!-- Facet 1: Outer Left Main (Vibrant Violet to Indigo) -->
    <linearGradient id="g-out-left-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#804cf8"/>
      <stop offset="50%" stop-color="#552adb"/>
      <stop offset="100%" stop-color="#241598"/>
    </linearGradient>

    <!-- Facet 2: Outer Left Edge / Underside (Deep Navy Indigo) -->
    <linearGradient id="g-out-left-edge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3d22a8"/>
      <stop offset="60%" stop-color="#1e1378"/>
      <stop offset="100%" stop-color="#110d54"/>
    </linearGradient>

    <!-- Facet 3: Inner Left Main (Bright Violet to Indigo) -->
    <linearGradient id="g-in-left-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a469fb"/>
      <stop offset="60%" stop-color="#6032e2"/>
      <stop offset="100%" stop-color="#2719a6"/>
    </linearGradient>

    <!-- Facet 4: Center Valley Shadow (Midnight Navy) -->
    <linearGradient id="g-center-valley" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1c1678"/>
      <stop offset="50%" stop-color="#120e5c"/>
      <stop offset="100%" stop-color="#0b0840"/>
    </linearGradient>

    <!-- Facet 5: Inner Right Main (Bright Electric Cyan/Royal Blue) -->
    <linearGradient id="g-in-right-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4e88fc"/>
      <stop offset="45%" stop-color="#3b72f5"/>
      <stop offset="100%" stop-color="#1d3ec7"/>
    </linearGradient>

    <!-- Facet 6: Inner Right Fold / Bevel -->
    <linearGradient id="g-in-right-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2c4bc9"/>
      <stop offset="70%" stop-color="#1a2790"/>
      <stop offset="100%" stop-color="#0f145c"/>
    </linearGradient>

    <!-- Facet 7: Outer Right Main (Vibrant Violet Magenta) -->
    <linearGradient id="g-out-right-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c07bfe"/>
      <stop offset="50%" stop-color="#934af7"/>
      <stop offset="100%" stop-color="#5522d4"/>
    </linearGradient>

    <!-- Facet 8: Outer Right Edge (Rich Indigo/Violet) -->
    <linearGradient id="g-out-right-edge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7333e6"/>
      <stop offset="60%" stop-color="#3d189f"/>
      <stop offset="100%" stop-color="#190969"/>
    </linearGradient>

    <!-- Facet 9: Bottom Apex Convergence -->
    <linearGradient id="g-apex" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1d157d"/>
      <stop offset="50%" stop-color="#120c58"/>
      <stop offset="100%" stop-color="#0a0638"/>
    </linearGradient>

    <radialGradient id="g-sparkle-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f0e2ff" stop-opacity="0.9"/>
      <stop offset="35%" stop-color="#caa2fd" stop-opacity="0.8"/>
      <stop offset="70%" stop-color="#985cfb" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>

    <linearGradient id="g-sparkle-star" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#e0c2fd"/>
      <stop offset="70%" stop-color="#a777fc"/>
      <stop offset="100%" stop-color="#8047f8"/>
    </linearGradient>
  </defs>

  <g id="velysium-mark">
    <!-- V Facets rendered individually for GSAP stagger animation -->
    <g id="v-facets">
${markFacetPaths.filter(f => f.name !== 'sparkle').map(f => `      <path id="${f.name}" class="v-facet" d="${f.d}" fill="${f.fill}"/>`).join('\n')}
    </g>

    <!-- Sparkle with glow and 4-point star -->
    <g id="sparkle" class="v-sparkle">
      <circle cx="139" cy="29" r="28" fill="url(#g-sparkle-glow)"/>
      ${markFacetPaths.find(f => f.name === 'sparkle') ? `<path id="sparkle-star" d="${markFacetPaths.find(f => f.name === 'sparkle').d}" fill="url(#g-sparkle-star)"/>` : `<path id="sparkle-star" d="M 139 2 Q 139 29 167 29 Q 139 29 139 56 Q 139 29 111 29 Q 139 29 139 2 Z" fill="url(#g-sparkle-star)"/>`}
    </g>
  </g>
</svg>`;

  fs.writeFileSync('public/assets/mark.svg', markSvgContent);
  console.log('Saved mark.svg with separate facet paths and sparkle');

  // Generate logo-full.svg
  const fullSvgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 220" fill="none">
  <defs>
    <!-- Facet Gradients -->
    <linearGradient id="lf-g-out-left-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#804cf8"/><stop offset="50%" stop-color="#552adb"/><stop offset="100%" stop-color="#241598"/>
    </linearGradient>
    <linearGradient id="lf-g-out-left-edge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3d22a8"/><stop offset="60%" stop-color="#1e1378"/><stop offset="100%" stop-color="#110d54"/>
    </linearGradient>
    <linearGradient id="lf-g-in-left-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a469fb"/><stop offset="60%" stop-color="#6032e2"/><stop offset="100%" stop-color="#2719a6"/>
    </linearGradient>
    <linearGradient id="lf-g-center-valley" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1c1678"/><stop offset="50%" stop-color="#120e5c"/><stop offset="100%" stop-color="#0b0840"/>
    </linearGradient>
    <linearGradient id="lf-g-in-right-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4e88fc"/><stop offset="45%" stop-color="#3b72f5"/><stop offset="100%" stop-color="#1d3ec7"/>
    </linearGradient>
    <linearGradient id="lf-g-in-right-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2c4bc9"/><stop offset="70%" stop-color="#1a2790"/><stop offset="100%" stop-color="#0f145c"/>
    </linearGradient>
    <linearGradient id="lf-g-out-right-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c07bfe"/><stop offset="50%" stop-color="#934af7"/><stop offset="100%" stop-color="#5522d4"/>
    </linearGradient>
    <linearGradient id="lf-g-out-right-edge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7333e6"/><stop offset="60%" stop-color="#3d189f"/><stop offset="100%" stop-color="#190969"/>
    </linearGradient>
    <linearGradient id="lf-g-apex" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1d157d"/><stop offset="50%" stop-color="#120c58"/><stop offset="100%" stop-color="#0a0638"/>
    </linearGradient>
    <radialGradient id="lf-g-sparkle-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f0e2ff" stop-opacity="0.9"/><stop offset="35%" stop-color="#caa2fd" stop-opacity="0.8"/><stop offset="70%" stop-color="#985cfb" stop-opacity="0.5"/><stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="lf-g-sparkle-star" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="30%" stop-color="#e0c2fd"/><stop offset="70%" stop-color="#a777fc"/><stop offset="100%" stop-color="#8047f8"/>
    </linearGradient>
    <linearGradient id="lf-g-wordmark" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#121348"/><stop offset="50%" stop-color="#18175e"/><stop offset="100%" stop-color="#14134a"/>
    </linearGradient>
  </defs>

  <!-- MARK (x=0, y=0) -->
  <g id="full-mark" transform="translate(0, 0)">
    <g id="lf-v-facets">
${markFacetPaths.filter(f => f.name !== 'sparkle').map(f => `      <path id="lf-${f.name}" d="${f.d}" fill="${f.fill.replace('#g-', '#lf-g-')}"/>`).join('\n')}
    </g>
    <g id="lf-sparkle" class="v-sparkle">
      <circle cx="139" cy="29" r="28" fill="url(#lf-g-sparkle-glow)"/>
      ${markFacetPaths.find(f => f.name === 'sparkle') ? `<path id="lf-sparkle-star" d="${markFacetPaths.find(f => f.name === 'sparkle').d}" fill="url(#lf-g-sparkle-star)"/>` : `<path id="lf-sparkle-star" d="M 139 2 Q 139 29 167 29 Q 139 29 139 56 Q 139 29 111 29 Q 139 29 139 2 Z" fill="url(#lf-g-sparkle-star)"/>`}
    </g>
  </g>

  <!-- WORDMARK (aligned at y=76 to match the optical center of the mark) -->
  <g id="full-wordmark" transform="translate(315, 76)" fill="url(#lf-g-wordmark)">
${letterPaths.map(l => `    <g id="lf-letter-${l.name}" transform="translate(${l.offsetX}, ${l.offsetY})">
      <path d="${l.d}"/>
    </g>`).join('\n')}
  </g>
</svg>`;

  fs.writeFileSync('public/assets/logo-full.svg', fullSvgContent);
  console.log('Saved logo-full.svg');

  // Preview render
  await sharp(Buffer.from(fullSvgContent)).png().toFile('public/assets/logo-full-traced.png');
  console.log('Rendered logo-full-traced.png');
}

main().catch(console.error);
