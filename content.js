/**
 * GitHub Contribution Graph - Halloween Orange Theme
 * Content Script for Chrome / Firefox Extension
 *
 * Direct DOM injection + MutationObserver + Turbo Lifecycle
 */

(() => {
  'use strict';

  const STORAGE_KEY = 'gh_halloween_theme_enabled';
  const STYLE_ID = 'gh-halloween-injected-style';

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

  let isEnabled = true;

  function isLightMode() {
    const mode = document.documentElement.getAttribute('data-color-mode');
    if (mode === 'light') return true;
    if (mode === 'dark') return false;
    // Auto mode fallback to media query
    return window.matchMedia && !window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function getPalette() {
    return isLightMode() ? LIGHT_PALETTE : DARK_PALETTE;
  }

  /**
   * Inject high-priority stylesheet into document.documentElement or document.head
   */
  function injectStyleSheet() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      html body td.ContributionCalendar-day[data-level="0"],
      html body table.ContributionCalendar-grid td[data-level="0"],
      html body .ContributionCalendar [data-level="0"] {
        background-color: var(--gh-halloween-l0, #161B22) !important;
        fill: var(--gh-halloween-l0, #161B22) !important;
      }
      html body td.ContributionCalendar-day[data-level="1"],
      html body table.ContributionCalendar-grid td[data-level="1"],
      html body .ContributionCalendar [data-level="1"] {
        background-color: #4A210F !important;
        fill: #4A210F !important;
      }
      html body td.ContributionCalendar-day[data-level="2"],
      html body table.ContributionCalendar-grid td[data-level="2"],
      html body .ContributionCalendar [data-level="2"] {
        background-color: #8C3B0D !important;
        fill: #8C3B0D !important;
      }
      html body td.ContributionCalendar-day[data-level="3"],
      html body table.ContributionCalendar-grid td[data-level="3"],
      html body .ContributionCalendar [data-level="3"] {
        background-color: #D96B16 !important;
        fill: #D96B16 !important;
      }
      html body td.ContributionCalendar-day[data-level="4"],
      html body table.ContributionCalendar-grid td[data-level="4"],
      html body .ContributionCalendar [data-level="4"] {
        background-color: #FF9A3C !important;
        fill: #FF9A3C !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  /**
   * Directly color all contribution cells and legend elements
   */
  function applyTheme() {
    if (!isEnabled) {
      removeTheme();
      return;
    }

    injectStyleSheet();

    const palette = getPalette();
    const cells = document.querySelectorAll('[data-level]');

    cells.forEach(el => {
      const level = el.getAttribute('data-level');
      if (level && palette[level]) {
        const color = palette[level];
        el.style.setProperty('background-color', color, 'important');
        el.style.setProperty('fill', color, 'important');
      }
    });
  }

  /**
   * Remove inline styling when toggled off
   */
  function removeTheme() {
    const injected = document.getElementById(STYLE_ID);
    if (injected) injected.remove();

    const cells = document.querySelectorAll('[data-level]');
    cells.forEach(el => {
      el.style.removeProperty('background-color');
      el.style.removeProperty('fill');
    });
  }

  /**
   * Initialize theme immediately and observe changes
   */
  function init() {
    // 1. Synchronous initial application to prevent green flash
    applyTheme();

    // 2. Read saved preference asynchronously
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get([STORAGE_KEY], (result) => {
        isEnabled = result[STORAGE_KEY] !== false;
        applyTheme();
      });

      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'sync' && changes[STORAGE_KEY]) {
          isEnabled = changes[STORAGE_KEY].newValue !== false;
          applyTheme();
        }
      });
    }

    // 3. MutationObserver to handle dynamically injected calendar fragments
    let timeoutId = null;
    const observer = new MutationObserver(() => {
      if (timeoutId) cancelAnimationFrame(timeoutId);
      timeoutId = requestAnimationFrame(() => {
        applyTheme();
      });
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-level', 'data-color-mode']
    });

    // 4. Hook into GitHub Turbo & PJAX navigation lifecycle
    ['turbo:load', 'turbo:render', 'turbo:before-render', 'pjax:end', 'pjax:complete', 'DOMContentLoaded', 'load'].forEach(event => {
      window.addEventListener(event, applyTheme);
      document.addEventListener(event, applyTheme);
    });
  }

  // Run as early as possible
  init();
})();
