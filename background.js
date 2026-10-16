/**
 * Reddit Only Parent Comments (ROPC)
 * Background Service Worker (Manifest V3)
 *
 * @author Nguyen Ha <newwenha@gmail.com>
 * @license MIT
 */

const BADGE_COLOR_ON = '#FF4500';
const BADGE_COLOR_OFF = '#717171';

/**
 * Updates the extension badge text and background color according to state.
 * @param {string} state - 'on' or 'off'
 */
function updateBadge(state) {
  const isEnabled = state === 'on' || state === undefined;
  chrome.action.setBadgeText({ text: isEnabled ? 'ON' : 'OFF' });
  chrome.action.setBadgeBackgroundColor({
    color: isEnabled ? BADGE_COLOR_ON : BADGE_COLOR_OFF
  });
}

// Extension installation / initial setup
chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.sync.get('state');
  const currentState = data.state || 'on';
  await chrome.storage.sync.set({ state: currentState });
  updateBadge(currentState);

  // Setup right-click context menu toggle
  chrome.contextMenus.create({
    id: 'toggle-ropc',
    title: 'Toggle Only Parent Comments',
    contexts: ['page', 'link'],
    documentUrlPatterns: ['https://*.reddit.com/*']
  });
});

// Browser startup sync
chrome.runtime.onStartup.addListener(async () => {
  const data = await chrome.storage.sync.get('state');
  updateBadge(data.state || 'on');
});

// React to storage changes across all tabs and contexts
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.state) {
    updateBadge(changes.state.newValue);
  }
});

// Handle context menu toggle
chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === 'toggle-ropc') {
    const data = await chrome.storage.sync.get('state');
    const newState = data.state === 'on' ? 'off' : 'on';
    await chrome.storage.sync.set({ state: newState });
  }
});
