# 🎃 GitHub Contribution Graph – Halloween Orange Theme

Recreates GitHub's iconic Halloween-themed contribution graph, replacing the default green contribution squares with the original Halloween-inspired orange color palette.

---

## 🎨 Color Palette & Intensity Levels

| Level | Intensity | Hex Code | Visual Description |
| :---: | :---: | :---: | :--- |
| **0** | No activity | `#161B22` | Dark background (*adaptive `#EBEDF0` in light mode*) |
| **1** | Low activity | `#4A210F` | Deep dark burnt orange |
| **2** | Moderate activity | `#8C3B0D` | Warm medium rust orange |
| **3** | High activity | `#D96B16` | Bright pumpkin orange |
| **4** | Maximum activity | `#FF9A3C` | Vivid glowing pumpkin orange |

---

## ✨ Features

- **Pixel-Accurate**: Preserves GitHub's original grid layout, spacing, corner rounding, and square dimensions.
- **Dynamic Navigation Safe**: Seamlessly handles GitHub's Turbo Drive, PJAX, tab switching, and yearly graph browsing via `MutationObserver` and event hooks.
- **Two Flexible Ways to Use**:
  1. **Manifest V3 Browser Extension**: Works on Google Chrome, Microsoft Edge, Brave, and Chromium browsers (with popup control).
  2. **Userscript (`.user.js`)**: 1-click install via Tampermonkey, Violentmonkey, or Greasemonkey on any browser.
- **Light & Dark Theme Compatible**: Dynamically adapts Level 0 for light vs dark appearances while preserving the orange intensity hierarchy.
- **Safe & Non-Intrusive**: Only modifies contribution squares and legend indicators; never alters contribution counts, dates, profile info, or other GitHub UI components.
- **Interactive Test Bench & Demo**: Includes a standalone, offline simulation of the GitHub profile contribution calendar with real-time color verification.

---

## 📦 Installation & Setup

### Method 1: Chrome / Edge / Brave (Browser Extension)

1. Open your browser's extensions page:
   - **Chrome**: `chrome://extensions`
   - **Edge**: `edge://extensions`
   - **Brave**: `brave://extensions`
2. Enable **"Developer mode"** (toggle in the top-right corner).
3. Click **"Load unpacked"**.
4. Select this project root directory (`hercules-fitness-main`).
5. Open any GitHub profile (e.g., [https://github.com/mahendraasingh](https://github.com/mahendraasingh)). The Halloween orange contribution graph will be active immediately!

### Method 2: Tampermonkey / Violentmonkey (Userscript)

If you prefer using a userscript manager:
1. Ensure [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/) is installed in your browser.
2. In Tampermonkey, click **"Create a new script"**.
3. Copy the contents of [`userscript/github-halloween-theme.user.js`](./userscript/github-halloween-theme.user.js) and paste it into the editor.
4. Press `Ctrl + S` (or `Cmd + S`) to save.
5. Visit any GitHub profile to see the Halloween orange graph.

---

## 🧪 Testing & Verification

### Interactive Browser Demo
You can view and test the theme locally without navigating to GitHub:
1. Open [`demo/index.html`](./demo/index.html) in any browser.
2. The demo features:
   - Full 52-week contribution graph with realistic activity distributions.
   - Interactive date & contribution count tooltips.
   - Legend with all 5 intensity levels.
   - Light Mode / Dark Mode toggle button.
   - Live automated color verification cards confirming exact hex matches for all levels.

### Automated Node.js Tests
Run the test suite from the terminal:
```bash
npm test
```
All 29 tests verify:
- Manifest V3 configuration and permissions.
- Exact hex color specifications (`#161B22`, `#4A210F`, `#8C3B0D`, `#D96B16`, `#FF9A3C`).
- Selector coverage (`td.ContributionCalendar-day`, `rect.ContributionCalendar-day`, legend).
- Userscript format and headers.
- Icon asset generation and presence.

---

## 📁 Project Structure

```
├── manifest.json              # Manifest V3 extension configuration
├── content.js                 # Content script handling DOM mutation & Turbo navigation
├── style.css                  # Injection stylesheet targeting all GitHub graph selectors
├── popup.html                 # Extension popup interface
├── popup.css                  # Extension popup styles
├── popup.js                   # Popup toggle logic and state management
├── icons/                     # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── icon.svg
├── userscript/
│   └── github-halloween-theme.user.js  # Tampermonkey / Violentmonkey userscript
├── demo/
│   ├── index.html             # Offline GitHub profile calendar simulation & test bench
│   ├── demo.css               # Styling for demo and test bench
│   └── demo.js                # Demo interaction, tooltips, and live hex verifier
├── test/
│   ├── verify.js              # Automated Node.js verification test suite
│   └── generate_icons.mjs     # Standalone icon generator script
├── package.json               # Project metadata and test scripts
└── README.md                  # Project documentation
```

---

## 📄 License
MIT License.
