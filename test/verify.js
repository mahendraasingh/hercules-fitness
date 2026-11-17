/**
 * Automated Verification Test for GitHub Halloween Contribution Theme
 */

import fs from 'fs';
import path from 'path';

console.log('--- Running GitHub Halloween Contribution Theme Test Suite ---');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. Verify Manifest V3
try {
  const manifestRaw = fs.readFileSync('manifest.json', 'utf8');
  const manifest = JSON.parse(manifestRaw);
  assert(manifest.manifest_version === 3, 'Manifest is version 3');
  assert(manifest.name && manifest.version, 'Manifest has valid name and version');
  assert(manifest.content_scripts && manifest.content_scripts.length > 0, 'Manifest contains content_scripts');
  assert(manifest.content_scripts[0].matches.includes('https://github.com/*'), 'Content scripts target https://github.com/*');
  assert(fs.existsSync(manifest.content_scripts[0].css[0]), 'Manifest references valid CSS file');
  assert(fs.existsSync(manifest.content_scripts[0].js[0]), 'Manifest references valid JS file');
} catch (err) {
  assert(false, `Manifest error: ${err.message}`);
}

// 2. Verify Color Palette in style.css
try {
  const css = fs.readFileSync('style.css', 'utf8').toUpperCase();
  const requiredLevels = [
    { level: 0, hex: '#161B22' },
    { level: 1, hex: '#4A210F' },
    { level: 2, hex: '#8C3B0D' },
    { level: 3, hex: '#D96B16' },
    { level: 4, hex: '#FF9A3C' }
  ];

  for (const { level, hex } of requiredLevels) {
    assert(css.includes(hex), `style.css contains Level ${level} color: ${hex}`);
    assert(css.includes(`DATA-LEVEL="${level}"`) || css.includes(`DATA-LEVEL='${level}'`), `style.css targets [data-level="${level}"]`);
  }

  assert(css.includes('CONTRIBUTIONCALENDAR-DAY'), 'style.css targets .ContributionCalendar-day');
  assert(css.includes('RECT'), 'style.css includes SVG rect fallback');
  assert(css.includes('CONTRIBUTIONCALENDAR-LEGEND'), 'style.css targets contribution legend squares');
} catch (err) {
  assert(false, `CSS test error: ${err.message}`);
}

// 3. Verify Userscript
try {
  const userScript = fs.readFileSync('userscript/github-halloween-theme.user.js', 'utf8');
  assert(userScript.includes('// ==UserScript=='), 'Userscript contains UserScript metadata header');
  assert(userScript.includes('@match        https://github.com/*'), 'Userscript matches https://github.com/*');
  assert(userScript.includes('#FF9A3C'), 'Userscript contains Halloween pumpkin orange #FF9A3C');
} catch (err) {
  assert(false, `Userscript test error: ${err.message}`);
}

// 4. Verify Icons
const iconSizes = [16, 48, 128];
for (const s of iconSizes) {
  const p = `icons/icon${s}.png`;
  assert(fs.existsSync(p) && fs.statSync(p).size > 0, `Icon file exists: ${p}`);
}
assert(fs.existsSync('icons/icon.svg'), 'Vector icon.svg exists');

// 5. Verify Demo Files
assert(fs.existsSync('demo/index.html'), 'demo/index.html exists');
assert(fs.existsSync('demo/demo.css'), 'demo/demo.css exists');
assert(fs.existsSync('demo/demo.js'), 'demo/demo.js exists');

console.log('\n--- Test Summary ---');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 All tests passed successfully!');
}

