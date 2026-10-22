const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

async function capture() {
  const artifactDir = "C:\\Users\\hp\\.gemini\\antigravity-ide\\brain\\5c2fe515-3363-45c8-a84f-f3fc70f20b8a";
  const publicDir = path.join(__dirname, "..", "public", "frames");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();

  // 1. Navigate and clear sessionStorage so intro is guaranteed to play
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.evaluate(() => {
    sessionStorage.removeItem("velysium_intro_seen");
  });

  // Reload to start intro fresh from t=0
  await page.reload({ waitUntil: "networkidle" });

  // Wait for the timeline to be initialized
  await page.waitForFunction(() => !!window.__velysiumIntroTl);

  // Pause timeline for frame-accurate seeking
  await page.evaluate(() => {
    window.__velysiumIntroTl.pause();
  });

  const frames = [
    { time: 0.5, name: "frame_0_5s.png", desc: "0.5s - Scene 1: Dark-ink dot & tunnel of speed streaks" },
    { time: 1.5, name: "frame_1_5s.png", desc: "1.5s - Scene 2: Speed lines converging, 200 shards flying in" },
    { time: 2.5, name: "frame_2_5s.png", desc: "2.5s - Scene 2: Shards slam into V mark, shockwave ring expands, flash" },
    { time: 3.5, name: "frame_3_5s.png", desc: "3.5s - Scene 3: Sparkle pops, wordmark letters sliding in through mask" },
    { time: 5.0, name: "frame_5_0s.png", desc: "5.0s - Scene 4: Lockup shrinks towards navbar, curtains split, hero rises" },
  ];

  for (const f of frames) {
    console.log(`Seeking to ${f.time}s...`);
    await page.evaluate((t) => {
      window.__velysiumIntroTl.seek(t);
    }, f.time);

    // Allow Three.js and DOM render loops to flush
    await page.waitForTimeout(300);

    const artifactPath = path.join(artifactDir, f.name);
    const localPath = path.join(publicDir, f.name);

    await page.screenshot({ path: artifactPath, fullPage: false });
    await page.screenshot({ path: localPath, fullPage: false });

    console.log(`Saved ${f.name} (${f.desc})`);
  }

  // Also test ESC skip
  console.log("Testing ESC skip...");
  await page.evaluate(() => {
    window.__velysiumIntroTl.play();
  });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);
  const skipPath = path.join(artifactDir, "frame_after_esc.png");
  await page.screenshot({ path: skipPath });
  console.log("Saved frame_after_esc.png (Hero section visible)");

  await browser.close();
  console.log("All frames captured successfully.");
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
