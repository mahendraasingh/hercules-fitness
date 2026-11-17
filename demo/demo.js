/**
 * Interactive Demo and Verification Suite for GitHub Halloween Theme
 */

document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('contribution-grid');
  const tooltip = document.getElementById('custom-tooltip');
  const toggleThemeBtn = document.getElementById('toggle-theme-btn');
  const toggleModeBtn = document.getElementById('toggle-mode-btn');

  let themeEnabled = true;
  let isDarkMode = true;

  // Generate 52 weeks x 7 days
  const weeks = 52;
  const daysPerWeek = 7;
  const now = new Date();
  
  // Create table structure: 7 rows (Sun -> Sat)
  const rows = [];
  const tbody = document.createElement('tbody');
  
  for (let r = 0; r < daysPerWeek; r++) {
    const tr = document.createElement('tr');
    tr.style.height = '10px';
    rows.push(tr);
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);

  // Level probability distribution to create realistic contribution clusters
  function getSampleLevel(w, d) {
    const seed = Math.sin(w * 13 + d * 37) * 10000;
    const rand = seed - Math.floor(seed);
    if (rand < 0.45) return 0;
    if (rand < 0.70) return 1;
    if (rand < 0.85) return 2;
    if (rand < 0.95) return 3;
    return 4;
  }

  // Populate cells
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < daysPerWeek; d++) {
      const td = document.createElement('td');
      const level = getSampleLevel(w, d);
      td.className = 'ContributionCalendar-day';
      td.setAttribute('data-level', level);
      
      const dayOffset = (weeks - 1 - w) * 7 + (6 - d);
      const date = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const count = level === 0 ? 0 : (level === 1 ? Math.floor(Math.random() * 2) + 1 : (level === 2 ? Math.floor(Math.random() * 4) + 3 : (level === 3 ? Math.floor(Math.random() * 6) + 7 : Math.floor(Math.random() * 10) + 13)));
      
      td.setAttribute('data-date', dateStr);
      td.setAttribute('data-count', count);
      
      // Tooltip handling
      td.addEventListener('mouseenter', (e) => {
        const text = count === 0 ? `No contributions on ${dateStr}` : `${count} contribution${count > 1 ? 's' : ''} on ${dateStr}`;
        tooltip.textContent = text;
        tooltip.style.display = 'block';
        const rect = td.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX - 20}px`;
        tooltip.style.top = `${rect.top + window.scrollY - 34}px`;
      });

      td.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });

      rows[d].appendChild(td);
    }
  }

  // Toggle Theme Button
  toggleThemeBtn.addEventListener('click', () => {
    themeEnabled = !themeEnabled;
    const styleLink = document.getElementById('theme-stylesheet');
    if (styleLink) {
      styleLink.disabled = !themeEnabled;
    }
    toggleThemeBtn.textContent = themeEnabled ? '🎃 Theme: Halloween (ON)' : '🌲 Theme: Default Green (OFF)';
    toggleThemeBtn.className = themeEnabled ? 'btn btn-primary' : 'btn';
    runVerification();
  });

  // Toggle Light / Dark Mode
  toggleModeBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.documentElement.setAttribute('data-color-mode', isDarkMode ? 'dark' : 'light');
    toggleModeBtn.textContent = isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode';
    runVerification();
  });

  // Automated Verification Suite
  function rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent') return '';
    if (rgb.startsWith('#')) return rgb.toUpperCase();
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return '';
    const r = parseInt(match[0], 10).toString(16).padStart(2, '0');
    const g = parseInt(match[1], 10).toString(16).padStart(2, '0');
    const b = parseInt(match[2], 10).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
  }

  function runVerification() {
    const expected = {
      '0': isDarkMode ? '#161B22' : '#EBEDF0',
      '1': '#4A210F',
      '2': '#8C3B0D',
      '3': '#D96B16',
      '4': '#FF9A3C'
    };

    for (let l = 0; l <= 4; l++) {
      const cell = document.querySelector(`td.ContributionCalendar-day[data-level="${l}"]`);
      if (cell) {
        const computedBg = rgbToHex(window.getComputedStyle(cell).backgroundColor);
        const statusEl = document.getElementById(`status-l${l}`);
        const hexEl = document.getElementById(`hex-l${l}`);
        if (hexEl) hexEl.textContent = computedBg;

        if (statusEl) {
          if (!themeEnabled) {
            statusEl.textContent = '⚪ (Green mode)';
          } else if (computedBg === expected[l]) {
            statusEl.textContent = '✅ PASS';
            statusEl.style.color = '#3fb950';
          } else {
            statusEl.textContent = `⚠️ (${computedBg})`;
            statusEl.style.color = '#f85149';
          }
        }
      }
    }
  }

  // Initial verification run
  setTimeout(runVerification, 100);
});

