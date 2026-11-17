// ==UserScript==
// @name         GitHub Contribution Graph – Halloween Orange Theme
// @namespace    https://github.com/mahendraasingh/hercules-fitness
// @version      1.0.0
// @description  Replaces GitHub's default green contribution graph with the classic Halloween 5-level orange theme.
// @author       Mahendra Singh
// @match        https://github.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  const css = `
    :root {
      --gh-halloween-l0: #161B22;
      --gh-halloween-l1: #4A210F;
      --gh-halloween-l2: #8C3B0D;
      --gh-halloween-l3: #D96B16;
      --gh-halloween-l4: #FF9A3C;

      --color-calendar-graph-day-bg: var(--gh-halloween-l0) !important;
      --color-calendar-graph-day-L1-bg: var(--gh-halloween-l1) !important;
      --color-calendar-graph-day-L2-bg: var(--gh-halloween-l2) !important;
      --color-calendar-graph-day-L3-bg: var(--gh-halloween-l3) !important;
      --color-calendar-graph-day-L4-bg: var(--gh-halloween-l4) !important;

      --color-calendar-halloween-graph-day-L1-bg: var(--gh-halloween-l1) !important;
      --color-calendar-halloween-graph-day-L2-bg: var(--gh-halloween-l2) !important;
      --color-calendar-halloween-graph-day-L3-bg: var(--gh-halloween-l3) !important;
      --color-calendar-halloween-graph-day-L4-bg: var(--gh-halloween-l4) !important;
    }

    [data-color-mode="light"]:root,
    html[data-color-mode="light"],
    [data-light-theme="light"] {
      --gh-halloween-l0: #EBEDF0;
    }

    [data-color-mode="dark"]:root,
    html[data-color-mode="dark"],
    [data-dark-theme="dark"],
    [data-dark-theme="dark_dimmed"],
    [data-dark-theme="dark_high_contrast"] {
      --gh-halloween-l0: #161B22;
    }

    @media (prefers-color-scheme: dark) {
      :root[data-color-mode="auto"],
      html[data-color-mode="auto"] {
        --gh-halloween-l0: #161B22;
      }
    }

    /* Modern Table Grid cells */
    .js-calendar-graph table.ContributionCalendar-grid td.ContributionCalendar-day[data-level="0"],
    .ContributionCalendar-day[data-level="0"],
    [data-level="0"].ContributionCalendar-day {
      background-color: var(--gh-halloween-l0) !important;
      fill: var(--gh-halloween-l0) !important;
    }

    .js-calendar-graph table.ContributionCalendar-grid td.ContributionCalendar-day[data-level="1"],
    .ContributionCalendar-day[data-level="1"],
    [data-level="1"].ContributionCalendar-day {
      background-color: #4A210F !important;
      fill: #4A210F !important;
    }

    .js-calendar-graph table.ContributionCalendar-grid td.ContributionCalendar-day[data-level="2"],
    .ContributionCalendar-day[data-level="2"],
    [data-level="2"].ContributionCalendar-day {
      background-color: #8C3B0D !important;
      fill: #8C3B0D !important;
    }

    .js-calendar-graph table.ContributionCalendar-grid td.ContributionCalendar-day[data-level="3"],
    .ContributionCalendar-day[data-level="3"],
    [data-level="3"].ContributionCalendar-day {
      background-color: #D96B16 !important;
      fill: #D96B16 !important;
    }

    .js-calendar-graph table.ContributionCalendar-grid td.ContributionCalendar-day[data-level="4"],
    .ContributionCalendar-day[data-level="4"],
    [data-level="4"].ContributionCalendar-day {
      background-color: #FF9A3C !important;
      fill: #FF9A3C !important;
    }

    /* SVG Fallback */
    svg.js-calendar-graph-svg rect[data-level="0"],
    .js-calendar-graph rect[data-level="0"] {
      fill: var(--gh-halloween-l0) !important;
    }
    svg.js-calendar-graph-svg rect[data-level="1"],
    .js-calendar-graph rect[data-level="1"] {
      fill: #4A210F !important;
    }
    svg.js-calendar-graph-svg rect[data-level="2"],
    .js-calendar-graph rect[data-level="2"] {
      fill: #8C3B0D !important;
    }
    svg.js-calendar-graph-svg rect[data-level="3"],
    .js-calendar-graph rect[data-level="3"] {
      fill: #D96B16 !important;
    }
    svg.js-calendar-graph-svg rect[data-level="4"],
    .js-calendar-graph rect[data-level="4"] {
      fill: #FF9A3C !important;
    }

    /* Legend squares */
    .ContributionCalendar-legend [data-level="0"] { background-color: var(--gh-halloween-l0) !important; }
    .ContributionCalendar-legend [data-level="1"] { background-color: #4A210F !important; }
    .ContributionCalendar-legend [data-level="2"] { background-color: #8C3B0D !important; }
    .ContributionCalendar-legend [data-level="3"] { background-color: #D96B16 !important; }
    .ContributionCalendar-legend [data-level="4"] { background-color: #FF9A3C !important; }

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
})();
