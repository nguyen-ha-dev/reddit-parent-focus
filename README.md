# Reddit Parent Focus

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Platform](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://www.google.com/chrome/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A high-performance Google Chrome extension (Manifest V3) that automatically hides nested child comments and replies on Reddit, allowing you to focus exclusively on direct responses to the original post.

---

## Features

- **Direct Parent Filtering**: Focus on top-level thoughts without scrolling through endless argument chains and nested replies.
- **Full Reddit Layout Compatibility**:
  - **Modern Reddit ("shreddit")**: Handles custom web components (`<shreddit-comment>`) and dynamic depth filtering (`depth="0"`).
  - **Old Reddit (`old.reddit.com`)**: Suppresses `.comment .child` tree structures natively.
  - **2018 Redesign (`new.reddit.com`)**: Hides nested reply containers.
- **Zero-Latency Injected CSS**: Styles are applied at `document_start` to eliminate comment flicker or layout shift.
- **Live Toggle**: Enable or disable the filter instantly from the popup without reloading the page or losing your scroll position.
- **Real-Time Thread Stats**: Displays the number of top-level parent comments in the active thread.
- **Right-Click Context Menu**: Quickly toggle filtering on or off directly from any Reddit page.
- **Privacy-First**: Operates 100% locally in your browser. No telemetry, no external network requests, no tracking.

---

## Installation (Load Unpacked)

1. Clone this repository to your computer:
   ```bash
   git clone https://github.com/nguyen-ha-dev/reddit-parent-focus.git
   ```
2. Open **Google Chrome** and navigate to `chrome://extensions`.
3. In the upper-right corner, switch the **Developer mode** toggle to **ON**.
4. In the upper-left corner, click **Load unpacked**.
5. Select the `reddit-parent-focus` directory.
6. (Optional) Click the puzzle icon in Chrome's toolbar and **Pin** the extension for quick access.

---

## How It Works

Unlike legacy scripts that attempt to append `?depth=1` to the URL (which modern Reddit largely ignores and breaks SPA client-side routing), Reddit Parent Focus uses a dual-engine architecture:

1. **Declarative CSS Engine**: Injects scoped styles matching `shreddit-comment:not([depth="0"])` and `.comment .child`, keeping the DOM intact while hiding child comment hierarchies with native browser rendering performance.
2. **State Sync & SPA Controller**: Communicates between the Manifest V3 service worker, popup UI, and content script via `chrome.storage.sync` to toggle filtering on the fly.

---

## Project Structure

```
reddit-parent-focus/
|-- background.js           # Manifest V3 service worker (badge, context menus, state)
|-- manifest.json           # Extension configuration & permissions
|-- LICENSE                 # MIT License
|-- README.md               # Documentation & setup guide
|-- .gitignore              # Git ignore file
|-- content/
|   |-- content.js          # Injected DOM manager & status query handler
|   \-- styles.css          # Scoped CSS hiding rules for all Reddit versions
|-- popup/
|   |-- popup.html          # Extension popup markup
|   |-- popup.css           # Modern dark-theme popup styles
|   \-- popup.js            # Popup switch controller & live stats reader
\-- images/
    \-- png/                # High-res extension icons (16x16 up to 128x128)
```

---

## Author

**Nguyen Ha**
- GitHub: [@nguyen-ha-dev](https://github.com/nguyen-ha-dev)
- Email: [newwenha@gmail.com](mailto:newwenha@gmail.com)

---

## License

This project is open-source and available under the [MIT License](LICENSE).
