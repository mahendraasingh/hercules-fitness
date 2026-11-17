/**
 * GitHub Contribution Graph - Halloween Orange Theme
 * Content Script for Chrome / Firefox Extension
 */

(() => {
  'use strict';

  const STORAGE_KEY = 'gh_halloween_theme_enabled';
  const CLASS_NAME = 'gh-halloween-theme-active';

  const PALETTE = {
    '0': '#161B22',
    '1': '#4A210F',
    '2': '#8C3B0D',
    '3': '#D96B16',
    '4': '#FF9A3C'
  };

  let isEnabled = true;

  /**
   * Apply theme class to document and update any SVG elements with hardcoded fill attributes.
   */
  function applyTheme() {
    if (!isEnabled) {
      document.documentElement.classList.remove(CLASS_NAME);
      return;
    }

    document.documentElement.classList.add(CLASS_NAME);

    // Update any SVG rects that might have inline fill overrides
    const graphSvg = document.querySelector('.js-calendar-graph-svg, .js-calendar-graph svg');
    if (graphSvg) {
      const rects = graphSvg.querySelectorAll('rect.ContributionCalendar-day, rect[data-level]');
      rects.forEach(rect => {
        const level = rect.getAttribute('data-level');
        if (level && PALETTE[level]) {
          rect.setAttribute('fill', PALETTE[level]);
        }
      });
    }
  }

  /**
   * Initialize storage listener and retrieve saved user preference.
   */
  function init() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get([STORAGE_KEY], (result) => {
        isEnabled = result[STORAGE_KEY] !== false; // Default true
        applyTheme();
      });

      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'sync' && changes[STORAGE_KEY]) {
          isEnabled = changes[STORAGE_KEY].newValue !== false;
          applyTheme();
        }
      });
    } else {
      applyTheme();
    }

    // Observe dynamic changes (Turbo / PJAX / Year switching)
    const observer = new MutationObserver((mutations) => {
      let shouldReapply = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (
                node.matches?.('.js-calendar-graph, .js-yearly-contributions, table.ContributionCalendar-grid, .ContributionCalendar-day') ||
                node.querySelector?.('.js-calendar-graph, table.ContributionCalendar-grid, .ContributionCalendar-day')
              ) {
                shouldReapply = true;
                break;
              }
            }
          }
        }
        if (shouldReapply) break;
      }

      if (shouldReapply) {
        applyTheme();
      }
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    });

    // GitHub Turbo & PJAX event lifecycle hooks
    ['turbo:load', 'turbo:render', 'pjax:end', 'pjax:complete'].forEach(event => {
      document.addEventListener(event, applyTheme);
    });

    // Initial application
    applyTheme();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
