const fs = require('fs');
const sharp = require('sharp');

// 1. MARK SVG
// Bounding box in original: x=[67, 341] (w=274), y=[220, 436] (h=216)
// We'll normalize coordinates to viewBox="0 0 274 216"
// Center X is 204 - 67 = 137. Y offset is 220.

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 274 216" fill="none">
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

    <!-- Sparkle Gradients -->
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
    <!-- V FACETS -->
    <g id="v-facets">
      <!-- Facet 1: Outer Left Main -->
      <path id="facet-outer-left-main"
        d="M 0 34 L 35 34 L 112 150 L 92 159 Z"
        fill="url(#g-out-left-main)"/>

      <!-- Facet 2: Outer Left Edge / Underside -->
      <path id="facet-outer-left-edge"
        d="M 0 34 L 92 159 L 137 215 L 122 215 L 0 34 Z"
        fill="url(#g-out-left-edge)"/>

      <!-- Facet 3: Inner Left Main -->
      <path id="facet-inner-left-main"
        d="M 44 34 L 79 34 L 137 122 L 120 131 Z"
        fill="url(#g-in-left-main)"/>

      <!-- Facet 4: Center Valley Shadow -->
      <path id="facet-center-valley"
        d="M 79 34 L 137 122 L 137 148 L 112 150 Z"
        fill="url(#g-center-valley)"/>

      <!-- Facet 5: Inner Right Main (Bright Blue) -->
      <path id="facet-inner-right-main"
        d="M 194 34 L 229 34 L 152 148 L 137 122 Z"
        fill="url(#g-in-right-main)"/>

      <!-- Facet 6: Inner Right Fold / Bevel -->
      <path id="facet-inner-right-bevel"
        d="M 194 34 L 137 122 L 137 156 L 152 148 Z"
        fill="url(#g-in-right-bevel)"/>

      <!-- Facet 7: Outer Right Main -->
      <path id="facet-outer-right-main"
        d="M 239 34 L 274 34 L 182 159 L 162 150 Z"
        fill="url(#g-out-right-main)"/>

      <!-- Facet 8: Outer Right Edge -->
      <path id="facet-outer-right-edge"
        d="M 274 34 L 152 215 L 137 215 L 182 159 Z"
        fill="url(#g-out-right-edge)"/>

      <!-- Facet 9: Bottom Apex Convergence -->
      <path id="facet-apex-bottom"
        d="M 122 215 L 137 194 L 152 215 L 137 216 Z"
        fill="url(#g-apex)"/>
    </g>

    <!-- SPARKLE (Center 137, 27) -->
    <g id="sparkle" transform="translate(137, 27)">
      <!-- Soft glow backdrop -->
      <circle r="26" fill="url(#g-sparkle-glow)"/>
      <!-- 4-point diamond star -->
      <path id="sparkle-star"
        d="M 0 -27 Q 0 0 28 0 Q 0 0 0 27 Q 0 0 -28 0 Q 0 0 0 -27 Z"
        fill="url(#g-sparkle-star)"/>
    </g>
  </g>
</svg>`;

// 2. WORDMARK SVG
// Coordinates: x=[352, 966] (w=614), y=[283, 345] (h=62)
// viewBox="0 0 614 62"
const wordmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 614 62" fill="none">
  <defs>
    <linearGradient id="g-wordmark" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#121348"/>
      <stop offset="50%" stop-color="#18175e"/>
      <stop offset="100%" stop-color="#14134a"/>
    </linearGradient>
  </defs>

  <g id="velysium-wordmark" fill="url(#g-wordmark)">
    <!-- Letter V: x=[0, 79], y=[1, 60] -->
    <path id="letter-V" class="wordmark-letter"
      d="M 0 1 L 18 1 L 40 50 L 61 1 L 79 1 L 49 60 L 30 60 Z"/>

    <!-- Letter E: x=[96, 155], y=[1, 60] - Three horizontal floating bars -->
    <g id="letter-E" class="wordmark-letter">
      <rect x="96" y="1" width="59" height="12" rx="1.5"/>
      <rect x="96" y="25" width="59" height="12" rx="1.5"/>
      <rect x="96" y="48" width="59" height="12" rx="1.5"/>
    </g>

    <!-- Letter L: x=[177, 232], y=[1, 60] -->
    <path id="letter-L" class="wordmark-letter"
      d="M 177 1 L 193 1 L 193 47 L 232 47 L 232 60 L 177 60 Z"/>

    <!-- Letter Y: x=[236, 310], y=[1, 60] -->
    <path id="letter-Y" class="wordmark-letter"
      d="M 236 1 L 254 1 L 273 28 L 292 1 L 310 1 L 282 37 L 282 60 L 265 60 L 265 37 Z"/>

    <!-- Letter S: x=[324, 392], y=[0, 61] -->
    <path id="letter-S" class="wordmark-letter"
      d="M 342 1 C 362 -1 386 2 391 14 L 375 18 C 372 12 359 11 346 12 C 334 13 331 18 332 23 C 334 30 348 31 366 34 C 385 37 392 43 391 52 C 389 62 368 62 344 61 C 323 60 317 50 316 43 L 332 41 C 333 46 343 50 354 50 C 367 50 374 46 373 39 C 372 34 360 32 345 30 C 327 28 315 22 316 12 C 318 2 331 1 342 1 Z"/>

    <!-- Letter I: x=[412, 427], y=[1, 60] -->
    <rect id="letter-I" class="wordmark-letter"
      x="412" y="1" width="15" height="59" rx="1"/>

    <!-- Letter U: x=[450, 516], y=[1, 61] -->
    <path id="letter-U" class="wordmark-letter"
      d="M 450 1 L 466 1 L 466 40 C 466 48 472 51 483 51 C 494 51 500 48 500 40 L 500 1 L 516 1 L 516 41 C 516 56 501 62 483 62 C 465 62 450 56 450 41 Z"/>

    <!-- Letter M: x=[536, 614], y=[1, 60] -->
    <path id="letter-M" class="wordmark-letter"
      d="M 536 1 L 553 1 L 575 38 L 597 1 L 614 1 L 614 60 L 598 60 L 598 19 L 579 51 L 571 51 L 552 19 L 552 60 L 536 60 Z"/>
  </g>
</svg>`;

// 3. FULL LOGO SVG
// Combines mark (at x=0, y=0, w=274, h=216) and wordmark (aligned vertically with the mark's optical center)
// Total width: 274 + 40 (gap) + 614 = 928. Total height: 216.
// Wordmark vertical alignment: V center is at y=130, height=62 -> y = 130 - 31 = 99.
const logoFullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940 216" fill="none">
  <defs>
    <!-- Facet Gradients -->
    <linearGradient id="lf-g-out-left-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#804cf8"/>
      <stop offset="50%" stop-color="#552adb"/>
      <stop offset="100%" stop-color="#241598"/>
    </linearGradient>
    <linearGradient id="lf-g-out-left-edge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3d22a8"/>
      <stop offset="60%" stop-color="#1e1378"/>
      <stop offset="100%" stop-color="#110d54"/>
    </linearGradient>
    <linearGradient id="lf-g-in-left-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a469fb"/>
      <stop offset="60%" stop-color="#6032e2"/>
      <stop offset="100%" stop-color="#2719a6"/>
    </linearGradient>
    <linearGradient id="lf-g-center-valley" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1c1678"/>
      <stop offset="50%" stop-color="#120e5c"/>
      <stop offset="100%" stop-color="#0b0840"/>
    </linearGradient>
    <linearGradient id="lf-g-in-right-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4e88fc"/>
      <stop offset="45%" stop-color="#3b72f5"/>
      <stop offset="100%" stop-color="#1d3ec7"/>
    </linearGradient>
    <linearGradient id="lf-g-in-right-bevel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2c4bc9"/>
      <stop offset="70%" stop-color="#1a2790"/>
      <stop offset="100%" stop-color="#0f145c"/>
    </linearGradient>
    <linearGradient id="lf-g-out-right-main" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c07bfe"/>
      <stop offset="50%" stop-color="#934af7"/>
      <stop offset="100%" stop-color="#5522d4"/>
    </linearGradient>
    <linearGradient id="lf-g-out-right-edge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7333e6"/>
      <stop offset="60%" stop-color="#3d189f"/>
      <stop offset="100%" stop-color="#190969"/>
    </linearGradient>
    <linearGradient id="lf-g-apex" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1d157d"/>
      <stop offset="50%" stop-color="#120c58"/>
      <stop offset="100%" stop-color="#0a0638"/>
    </linearGradient>
    <radialGradient id="lf-g-sparkle-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f0e2ff" stop-opacity="0.9"/>
      <stop offset="35%" stop-color="#caa2fd" stop-opacity="0.8"/>
      <stop offset="70%" stop-color="#985cfb" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="lf-g-sparkle-star" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#e0c2fd"/>
      <stop offset="70%" stop-color="#a777fc"/>
      <stop offset="100%" stop-color="#8047f8"/>
    </linearGradient>
    <linearGradient id="lf-g-wordmark" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#121348"/>
      <stop offset="50%" stop-color="#18175e"/>
      <stop offset="100%" stop-color="#14134a"/>
    </linearGradient>
  </defs>

  <!-- MARK -->
  <g id="full-mark" transform="translate(0, 0)">
    <g id="lf-v-facets">
      <path id="lf-facet-outer-left-main" d="M 0 34 L 35 34 L 112 150 L 92 159 Z" fill="url(#lf-g-out-left-main)"/>
      <path id="lf-facet-outer-left-edge" d="M 0 34 L 92 159 L 137 215 L 122 215 L 0 34 Z" fill="url(#lf-g-out-left-edge)"/>
      <path id="lf-facet-inner-left-main" d="M 44 34 L 79 34 L 137 122 L 120 131 Z" fill="url(#lf-g-in-left-main)"/>
      <path id="lf-facet-center-valley" d="M 79 34 L 137 122 L 137 148 L 112 150 Z" fill="url(#lf-g-center-valley)"/>
      <path id="lf-facet-inner-right-main" d="M 194 34 L 229 34 L 152 148 L 137 122 Z" fill="url(#lf-g-in-right-main)"/>
      <path id="lf-facet-inner-right-bevel" d="M 194 34 L 137 122 L 137 156 L 152 148 Z" fill="url(#lf-g-in-right-bevel)"/>
      <path id="lf-facet-outer-right-main" d="M 239 34 L 274 34 L 182 159 L 162 150 Z" fill="url(#lf-g-out-right-main)"/>
      <path id="lf-facet-outer-right-edge" d="M 274 34 L 152 215 L 137 215 L 182 159 Z" fill="url(#lf-g-out-right-edge)"/>
      <path id="lf-facet-apex-bottom" d="M 122 215 L 137 194 L 152 215 L 137 216 Z" fill="url(#lf-g-apex)"/>
    </g>
    <g id="lf-sparkle" transform="translate(137, 27)">
      <circle r="26" fill="url(#lf-g-sparkle-glow)"/>
      <path d="M 0 -27 Q 0 0 28 0 Q 0 0 0 27 Q 0 0 -28 0 Q 0 0 0 -27 Z" fill="url(#lf-g-sparkle-star)"/>
    </g>
  </g>

  <!-- WORDMARK -->
  <g id="full-wordmark" transform="translate(315, 80)" fill="url(#lf-g-wordmark)">
    <path id="lf-letter-V" d="M 0 1 L 18 1 L 40 50 L 61 1 L 79 1 L 49 60 L 30 60 Z"/>
    <g id="lf-letter-E">
      <rect x="96" y="1" width="59" height="12" rx="1.5"/>
      <rect x="96" y="25" width="59" height="12" rx="1.5"/>
      <rect x="96" y="48" width="59" height="12" rx="1.5"/>
    </g>
    <path id="lf-letter-L" d="M 177 1 L 193 1 L 193 47 L 232 47 L 232 60 L 177 60 Z"/>
    <path id="lf-letter-Y" d="M 236 1 L 254 1 L 273 28 L 292 1 L 310 1 L 282 37 L 282 60 L 265 60 L 265 37 Z"/>
    <path id="lf-letter-S" d="M 342 1 C 362 -1 386 2 391 14 L 375 18 C 372 12 359 11 346 12 C 334 13 331 18 332 23 C 334 30 348 31 366 34 C 385 37 392 43 391 52 C 389 62 368 62 344 61 C 323 60 317 50 316 43 L 332 41 C 333 46 343 50 354 50 C 367 50 374 46 373 39 C 372 34 360 32 345 30 C 327 28 315 22 316 12 C 318 2 331 1 342 1 Z"/>
    <rect id="lf-letter-I" x="412" y="1" width="15" height="59" rx="1"/>
    <path id="lf-letter-U" d="M 450 1 L 466 1 L 466 40 C 466 48 472 51 483 51 C 494 51 500 48 500 40 L 500 1 L 516 1 L 516 41 C 516 56 501 62 483 62 C 465 62 450 56 450 41 Z"/>
    <path id="lf-letter-M" d="M 536 1 L 553 1 L 575 38 L 597 1 L 614 1 L 614 60 L 598 60 L 598 19 L 579 51 L 571 51 L 552 19 L 552 60 L 536 60 Z"/>
  </g>
</svg>`;

async function exportSvgs() {
  fs.writeFileSync('public/assets/mark.svg', markSvg.trim());
  fs.writeFileSync('public/assets/wordmark.svg', wordmarkSvg.trim());
  fs.writeFileSync('public/assets/logo-full.svg', logoFullSvg.trim());

  console.log('Exported mark.svg, wordmark.svg, and logo-full.svg to public/assets/');

  // Convert to PNG using sharp to preview
  await sharp(Buffer.from(logoFullSvg))
    .png()
    .toFile('public/assets/logo-full-preview.png');
  console.log('Rendered logo-full-preview.png');
}

exportSvgs().catch(console.error);
