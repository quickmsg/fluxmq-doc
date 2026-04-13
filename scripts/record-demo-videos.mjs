#!/usr/bin/env node
/**
 * 使用 Playwright 从 demo.fluxmq.com 录制短演示视频（WebM），输出到 static/video/。
 *
 * 用法：
 *   cd fluxmq-doc && npm install playwright --no-save && npx playwright install chromium
 *   node scripts/record-demo-videos.mjs
 *
 * 环境变量：
 *   FLUXMQ_DEMO_USER / FLUXMQ_DEMO_PASS — 默认 fluxmq / fluxmq
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'static', 'video');

const BASE = process.env.FLUXMQ_DEMO_URL || 'http://demo.fluxmq.com';
const USER = process.env.FLUXMQ_DEMO_USER || 'fluxmq';
const PASS = process.env.FLUXMQ_DEMO_PASS || 'fluxmq';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function login(page) {
  await page.goto(`${BASE}/#/login`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await delay(1000);
  await page.fill('input[name="username"]', USER);
  await page.fill('input[name="password"]', PASS);
  await page.click('button.ant-btn-primary');
  await delay(3500);
}

async function recordClip(name, runner) {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: OUT, size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();
  try {
    await runner(page);
  } finally {
    await context.close();
    await browser.close();
  }
  const files = fs
    .readdirSync(OUT)
    .filter((f) => f.endsWith('.webm'))
    .map((f) => ({ f, t: fs.statSync(path.join(OUT, f)).mtimeMs }))
    .sort((a, b) => b.t - a.t);
  if (!files.length) {
    console.warn(`No webm produced for ${name}`);
    return;
  }
  const latest = path.join(OUT, files[0].f);
  const target = path.join(OUT, `${name}.webm`);
  if (fs.existsSync(target)) fs.unlinkSync(target);
  fs.renameSync(latest, target);
  console.log('Wrote', target);
}

async function main() {
  await recordClip('overview', async (page) => {
    await login(page);
    await page.goto(`${BASE}/index.html#/dashboard/overview`, {
      waitUntil: 'networkidle',
      timeout: 90000,
    }).catch(() => page.goto(`${BASE}/#/dashboard/overview`, { waitUntil: 'networkidle', timeout: 90000 }));
    await delay(4000);
    await page.mouse.wheel(0, 400);
    await delay(2000);
  });

  await recordClip('rule-engine-datasource', async (page) => {
    await login(page);
    await page.goto(`${BASE}/index.html#/rule-engine/datasource`, {
      waitUntil: 'networkidle',
      timeout: 90000,
    }).catch(() => page.goto(`${BASE}/#/rule-engine/datasource`, { waitUntil: 'networkidle', timeout: 90000 }));
    await delay(5000);
  });

  await recordClip('instruct', async (page) => {
    await login(page);
    await page.goto(`${BASE}/index.html#/instruct/index`, {
      waitUntil: 'networkidle',
      timeout: 90000,
    }).catch(() => page.goto(`${BASE}/#/instruct/index`, { waitUntil: 'networkidle', timeout: 90000 }));
    await delay(5000);
  });

  console.log('Done. Files in', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
