/**
 * Reddit Only Parent Comments (ROPC)
 * Popup Controller Logic
 *
 * @author Nguyen Ha <newwenha@gmail.com>
 * @license MIT
 */

document.addEventListener('DOMContentLoaded', async () => {
  const toggleSwitch = document.getElementById('toggle-switch');
  const statusTitle = document.getElementById('status-title');
  const statusDesc = document.getElementById('status-desc');
  const statusDot = document.getElementById('status-dot');
  const statusBadge = document.getElementById('status-badge');
  const threadStats = document.getElementById('thread-stats');
  const statParents = document.getElementById('stat-parents');
  const statReplies = document.getElementById('stat-replies');

  function updateUI(isEnabled) {
    toggleSwitch.checked = isEnabled;
    if (isEnabled) {
      statusDot.classList.add('active');
      statusBadge.classList.add('active');
      statusBadge.textContent = 'ACTIVE';
      statusTitle.textContent = 'Hiding Child Comments';
      statusDesc.textContent = 'Focusing solely on direct responses to the original poster.';
      if (statReplies) statReplies.textContent = 'Suppressed';
    } else {
      statusDot.classList.remove('active');
      statusBadge.classList.remove('active');
      statusBadge.textContent = 'PAUSED';
      statusTitle.textContent = 'Showing All Comments';
      statusDesc.textContent = 'Replies and nested discussions are fully visible.';
      if (statReplies) statReplies.textContent = 'Visible';
    }
  }

  // Initial state retrieval
  try {
    const data = await chrome.storage.sync.get('state');
    const isEnabled = data.state === 'on' || data.state === undefined;
    updateUI(isEnabled);
  } catch (err) {
    console.error('Failed to load state:', err);
    updateUI(true);
  }

  // Toggle change handler
  toggleSwitch.addEventListener('change', async () => {
    const isEnabled = toggleSwitch.checked;
    const newState = isEnabled ? 'on' : 'off';
    updateUI(isEnabled);

    try {
      await chrome.storage.sync.set({ state: newState });
    } catch (err) {
      console.error('Failed to save state:', err);
    }
  });

  // Query active tab for thread stats
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url && tab.url.includes('reddit.com')) {
      chrome.tabs.sendMessage(tab.id, { action: 'getStatus' }, (response) => {
        if (chrome.runtime.lastError || !response) {
          return;
        }

        if (response.isThread && response.parentCount > 0) {
          threadStats.classList.remove('hidden');
          statParents.textContent = response.parentCount;
          statReplies.textContent = response.active ? 'Suppressed' : 'Visible';
        }
      });
    }
  } catch (err) {
    // Non-critical, ignore if tab query fails
  }
});
