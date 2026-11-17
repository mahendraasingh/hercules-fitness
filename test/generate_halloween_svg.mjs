/**
 * GitHub Halloween Contribution Graph SVG Generator
 * Fetches real contributions for user from GitHub and generates a pixel-accurate
 * Halloween Orange themed SVG graph identical to GitHub's Halloween Easter Egg.
 */

import https from 'https';
import fs from 'fs';

const USERNAME = process.argv[2] || 'mahendraasingh';

const PALETTE = {
  '0': '#161B22',
  '1': '#4A210F',
  '2': '#8C3B0D',
  '3': '#D96B16',
  '4': '#FF9A3C'
};

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function generate() {
  console.log(`Fetching contributions for @${USERNAME}...`);
  const html = await fetchHTML(`https://github.com/users/${USERNAME}/contributions`);

  // Extract total contributions header
  const totalMatch = html.match(/([0-9,]+)\s+contributions\s+in the last year/i);
  const totalText = totalMatch ? `${totalMatch[1]} contributions in the last year` : 'Contributions in the last year';

  // Extract days
  // Pattern: <td ... data-date="2026-01-01" data-level="2" data-count="5" ...>
  const dayRegex = /<td[^>]*data-date="([^"]+)"[^>]*data-level="([^"]+)"[^>]*data-count="([^"]+)"/g;
  const days = [];
  let match;

  while ((match = dayRegex.exec(html)) !== null) {
    days.push({
      date: match[1],
      level: match[2],
      count: parseInt(match[3], 10)
    });
  }

  // Fallback regex if attributes in different order
  if (days.length === 0) {
    const tdRegex = /<td\s+[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g;
    let tdMatch;
    while ((tdMatch = tdRegex.exec(html)) !== null) {
      const tag = tdMatch[0];
      const d = tag.match(/data-date="([^"]+)"/)?.[1];
      const l = tag.match(/data-level="([^"]+)"/)?.[1] || '0';
      const c = parseInt(tag.match(/data-count="([^"]+)"/)?.[1] || '0', 10);
      if (d) {
        days.push({ date: d, level: l, count: c });
      }
    }
  }

  console.log(`Found ${days.length} contribution days.`);
  if (days.length === 0) {
    console.error('Could not find contribution days in HTML response.');
    process.exit(1);
  }

  // Extract month labels
  const monthRegex = /<td[^>]*class="ContributionCalendar-label"[^>]*colspan="(\d+)"[^>]*>\s*<span[^>]*>[^<]*<\/span>\s*<span aria-hidden="true"[^>]*>([^<]+)<\/span>/g;
  const months = [];
  let mMatch;
  while ((mMatch = monthRegex.exec(html)) !== null) {
    months.push({
      colspan: parseInt(mMatch[1], 10),
      name: mMatch[2].trim()
    });
  }

  // Calculate layout
  const cellSize = 10;
  const cellGap = 3;
  const leftPadding = 50;
  const topPadding = 50;
  const graphWidth = 53 * (cellSize + cellGap);
  const totalWidth = leftPadding + graphWidth + 30;
  const totalHeight = 190;

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .bg { fill: #0d1117; stroke: #30363d; stroke-width: 1px; rx: 6px; }
    .header-text { fill: #f0f6fc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; }
    .label-text { fill: #8b949e; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 10px; }
    .legend-text { fill: #8b949e; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 11px; }
    .cell { rx: 2px; stroke: rgba(255, 255, 255, 0.05); stroke-width: 1px; }
    .cell:hover { stroke: #FF9A3C; stroke-width: 1.5px; }
  </style>

  <!-- Background Card -->
  <rect width="${totalWidth}" height="${totalHeight}" class="bg" />

  <!-- Header -->
  <text x="20" y="28" class="header-text">🎃 ${totalText}</text>

  <!-- Month Labels -->
`;

  // Draw Month Labels
  let curCol = 0;
  for (const m of months) {
    const x = leftPadding + curCol * (cellSize + cellGap);
    svg += `  <text x="${x}" y="${topPadding - 8}" class="label-text">${m.name}</text>\n`;
    curCol += m.colspan;
  }

  // Draw Weekday Labels (Mon, Wed, Fri)
  const weekdays = [
    { label: 'Mon', row: 1 },
    { label: 'Wed', row: 3 },
    { label: 'Fri', row: 5 }
  ];
  for (const w of weekdays) {
    const y = topPadding + w.row * (cellSize + cellGap) + 9;
    svg += `  <text x="${leftPadding - 28}" y="${y}" class="label-text">${w.label}</text>\n`;
  }

  // Draw Day Cells
  // Note: days array starts on Sunday and fills column by column or row by row
  // In GitHub, days are organized in weeks:
  // Week 0 has first days, then week 1, etc.
  for (let i = 0; i < days.length; i++) {
    const col = Math.floor(i / 7);
    const row = i % 7;
    const x = leftPadding + col * (cellSize + cellGap);
    const y = topPadding + row * (cellSize + cellGap);
    const color = PALETTE[days[i].level] || '#161B22';

    svg += `  <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${color}" class="cell">\n`;
    svg += `    <title>${days[i].count} contributions on ${days[i].date}</title>\n`;
    svg += `  </rect>\n`;
  }

  // Legend at bottom
  const legendY = topPadding + 7 * (cellSize + cellGap) + 20;
  const legendRightX = leftPadding + graphWidth - 10;
  const legendStartX = legendRightX - 110;

  svg += `
  <!-- Legend -->
  <g transform="translate(${legendStartX}, ${legendY})">
    <text x="0" y="9" class="legend-text">Less</text>
    <rect x="30" y="0" width="${cellSize}" height="${cellSize}" fill="${PALETTE['0']}" class="cell" />
    <rect x="44" y="0" width="${cellSize}" height="${cellSize}" fill="${PALETTE['1']}" class="cell" />
    <rect x="58" y="0" width="${cellSize}" height="${cellSize}" fill="${PALETTE['2']}" class="cell" />
    <rect x="72" y="0" width="${cellSize}" height="${cellSize}" fill="${PALETTE['3']}" class="cell" />
    <rect x="86" y="0" width="${cellSize}" height="${cellSize}" fill="${PALETTE['4']}" class="cell" />
    <text x="102" y="9" class="legend-text">More</text>
  </g>
</svg>`;

  fs.writeFileSync('halloween-graph.svg', svg);
  console.log(`✅ Successfully generated halloween-graph.svg (${days.length} days plotted)`);
}

generate().catch(err => {
  console.error('Error generating graph:', err);
  process.exit(1);
});
