/**
 * Reddit Only Parent Comments (ROPC)
 * Content Script
 *
 * @author Nguyen Ha <newwenha@gmail.com>
 * @license MIT
 */

(function () {
  const ACTIVE_CLASS = 'ropc-active';

  /**
   * Applies or removes the active class on the root <html> tag.
   * @param {string} state - 'on' or 'off'
   */
  function applyState(state) {
    if (state === 'on' || state === undefined) {
      document.documentElement.classList.add(ACTIVE_CLASS);
    } else {
      document.documentElement.classList.remove(ACTIVE_CLASS);
    }
  }

  // Read initial configuration from sync storage
  try {
    chrome.storage.sync.get('state', (data) => {
      const currentState = data && data.state !== undefined ? data.state : 'on';
      applyState(currentState);
    });
  } catch (err) {
    applyState('on');
  }

  // Listen for storage changes from popup or context menu
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.state) {
      applyState(changes.state.newValue);
    }
  });

  // Handle status queries from the popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getStatus') {
      const isThread = window.location.pathname.includes('/comments/');
      let parentCount = 0;
      let totalCount = 0;

      if (isThread) {
        // Modern Reddit ("shreddit")
        const shredditParents = document.querySelectorAll('shreddit-comment[depth="0"]');
        if (shredditParents.length > 0) {
          parentCount = shredditParents.length;
          totalCount = document.querySelectorAll('shreddit-comment').length;
        } else {
          // Old Reddit ("old.reddit.com")
          const oldParents = document.querySelectorAll('.nestedlisting > .comment');
          if (oldParents.length > 0) {
            parentCount = oldParents.length;
            totalCount = document.querySelectorAll('.comment').length;
          } else {
            // New Reddit redesign
            const topLevel = document.querySelectorAll('[data-testid="comment"]');
            parentCount = topLevel.length;
            totalCount = topLevel.length;
          }
        }
      }

      sendResponse({
        active: document.documentElement.classList.contains(ACTIVE_CLASS),
        isThread,
        parentCount,
        totalCount
      });
    }
    return true;
  });
})();
