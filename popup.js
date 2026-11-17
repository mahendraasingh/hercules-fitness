/**
 * Popup Script for GitHub Halloween Theme
 */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const badge = document.getElementById('status-badge');
  const STORAGE_KEY = 'gh_halloween_theme_enabled';

  function updateBadge(active) {
    if (active) {
      badge.textContent = 'Theme Active';
      badge.classList.remove('inactive');
    } else {
      badge.textContent = 'Theme Disabled';
      badge.classList.add('inactive');
    }
  }

  // Load saved setting
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get([STORAGE_KEY], (result) => {
      const isEnabled = result[STORAGE_KEY] !== false;
      toggle.checked = isEnabled;
      updateBadge(isEnabled);
    });

    toggle.addEventListener('change', () => {
      const isEnabled = toggle.checked;
      chrome.storage.sync.set({ [STORAGE_KEY]: isEnabled }, () => {
        updateBadge(isEnabled);
      });
    });
  } else {
    toggle.addEventListener('change', () => {
      updateBadge(toggle.checked);
    });
  }
});
