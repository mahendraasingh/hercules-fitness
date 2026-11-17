// ==UserScript==
// @name         GitHub Contribution Graph – Halloween Orange Theme
// @namespace    https://github.com/mahendraasingh/hercules-fitness
// @version      1.0.1
// @description  Replaces GitHub's default green contribution graph with the classic Halloween 5-level orange theme.
// @author       Mahendra Singh
// @match        https://github.com/*
// @match        https://*.github.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  const DARK_PALETTE = {
    '0': '#161B22',
    '1': '#4A210F',
    '2': '#8C3B0D',
    '3': '#D96B16',
    '4': '#FF9A3C'
  };

  const LIGHT_PALETTE = {
    '0': '#EBEDF0',
    '1': '#4A210F',
    '2': '#8C3B0D',
    '3': '#D96B16',
    '4': '#FF9A3C'
  };

  const css = `
    :root, html, body, [data-color-mode] {
      --color-calendar-graph-day-bg: #161B22 !important;
      --color-calendar-graph-day-L1-bg: #4A210F !important;
      --color-calendar-graph-day-L2-bg: #8C3B0D !important;
      --color-calendar-graph-day-L3-bg: #D96B16 !important;
      --color-calendar-graph-day-L4-bg: #FF9A3C !important;
    }

    [data-color-mode="light"] {
      --color-calendar-graph-day-bg: #EBEDF0 !important;
    }

    html body td.ContributionCalendar-day[data-level="0"],
    html body [data-level="0"] { background-color: var(--color-calendar-graph-day-bg, #161B22) !important; fill: var(--color-calendar-graph-day-bg, #161B22) !important; }
    html body td.ContributionCalendar-day[data-level="1"],
    html body [data-level="1"] { background-color: #4A210F !important; fill: #4A210F !important; }
    html body td.ContributionCalendar-day[data-level="2"],
    html body [data-level="2"] { background-color: #8C3B0D !important; fill: #8C3B0D !important; }
    html body td.ContributionCalendar-day[data-level="3"],
    html body [data-level="3"] { background-color: #D96B16 !important; fill: #D96B16 !important; }
    html body td.ContributionCalendar-day[data-level="4"],
    html body [data-level="4"] { background-color: #FF9A3C !important; fill: #FF9A3C !important; }

    .ContributionCalendar-day:hover {
      outline: 1px solid rgba(255, 154, 60, 0.8) !important;
    }
  `;

  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(css);
  } else {
    const style = document.createElement('style');
    style.id = 'gh-halloween-theme-style';
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function applyDirectStyles() {
    const isLight = document.documentElement.getAttribute('data-color-mode') === 'light';
    const palette = isLight ? LIGHT_PALETTE : DARK_PALETTE;

    const cells = document.querySelectorAll('[data-level]');
    cells.forEach(cell => {
      const level = cell.getAttribute('data-level');
      if (level && palette[level]) {
        cell.style.setProperty('background-color', palette[level], 'important');
        cell.style.setProperty('fill', palette[level], 'important');
      }
    });
  }

  // Synchronous and deferred runs
  applyDirectStyles();
  window.addEventListener('DOMContentLoaded', applyDirectStyles);
  window.addEventListener('load', applyDirectStyles);
  ['turbo:load', 'turbo:render', 'pjax:end'].forEach(ev => window.addEventListener(ev, applyDirectStyles));

  const observer = new MutationObserver(() => applyDirectStyles());
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-level', 'data-color-mode']
  });
})();
