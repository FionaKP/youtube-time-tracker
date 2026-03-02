# CLAUDE.md - YouTube Time Tracker

## Project Overview

YouTube Time Tracker is a Chrome extension (Manifest v3) for digital wellbeing that monitors daily YouTube watch time and intervenes with progressive alerts to help users avoid mindless consumption. All data is stored locally — no external servers or analytics.

## Tech Stack

- **Vanilla JavaScript (ES6+)**, HTML5, CSS3
- **Chrome Extension APIs**: `tabs`, `storage`, `notifications`, `runtime`, `action`
- **No build tools, no package manager, no external dependencies**
- Target: Chrome/Chromium browsers with Manifest v3 support

## Project Structure

```
youtube-time-tracker/
├── manifest.json       # Extension config (Manifest v3, version 2.0)
├── background.js       # Service worker — core tracking, alerts, state management (~640 lines)
├── content.js          # Content script injected into YouTube pages (~590 lines)
├── messages.js         # Contextual message library (~180 lines, imported by background.js)
├── popup.html          # Extension popup UI (two-screen: main + details)
├── popup.js            # Popup logic — timer display, stats, button handlers (~280 lines)
├── popup.css           # Popup styling (320px width, flexbox, gradients)
├── images/             # Icons and screenshot assets
└── README.md           # User-facing documentation
```

## Architecture

### Communication Flow

```
background.js (service worker)
  ├── imports messages.js via importScripts()
  ├── manages all state and timers
  ├── sends messages to content.js via chrome.tabs.sendMessage()
  └── responds to popup.js via chrome.storage and chrome.runtime

content.js (injected into YouTube pages)
  ├── detects video changes via URL monitoring
  ├── sends videoChanged messages to background.js
  ├── renders modal alerts (rapid watching, time alerts)
  └── pauses YouTube videos via player API

popup.js (extension popup)
  ├── connects to background.js via chrome.runtime.connect()
  ├── reads state from chrome.storage.local
  └── triggers actions (reset, snooze, podcast mode)
```

### Key Modules

- **background.js** — The central hub. Runs as a service worker. Handles time tracking (1-second interval), video counting, rapid-watching detection (5+ videos in 5 minutes), progressive time alerts (30/45/60+ min), contextual message selection, badge updates, snooze timers, and podcast mode state.
- **content.js** — Injected into all YouTube pages. Monitors URL changes (including YouTube's SPA navigation), extracts video IDs from regular videos and Shorts, renders full-screen modal alerts, and pauses videos using YouTube's internal player API (`#movie_player`) with retry logic.
- **messages.js** — Data-only module exporting `contextualMessages` object with four categories: `short` (5-15 min), `medium` (16-40 min), `long` (41-90 min), `veryLong` (91+ min). Each entry has `time`, `message`, and `emoji` fields.
- **popup.js** — Drives the popup UI. Two screens: main (timer display) and details (stats + controls). Manages podcast mode toggle, alert snooze, and a test button for contextual alerts.

### Chrome Storage Keys

| Key | Type | Description |
|-----|------|-------------|
| `youtubeTime` | number | Total seconds watched today |
| `lastResetDate` | string | Date string for daily reset |
| `tabOpens` | number | YouTube tab opens today |
| `videosWatched` | number | Videos watched today |
| `isSnoozed` | boolean | Whether alerts are snoozed |
| `snoozeEnd` | number | Timestamp when snooze expires |
| `podcastModeTabs` | object | Tab IDs in podcast mode |

## Code Conventions

### Naming
- **Variables & functions**: `camelCase` — `isOnYouTube`, `handleVideoChange()`, `getContextualMessage()`
- **Constants**: `SCREAMING_SNAKE_CASE` — `YOUTUBE_URL_PATTERN`, `MAX_IGNORES`, `MAX_HISTORY`
- **HTML IDs**: `kebab-case` — `yt-tracker-modal`, `yt-contextual-notification`
- **CSS classes**: BEM-adjacent — `.stat-card`, `.podcast-btn`, `.snooze-link`

### Style
- 2-space indentation
- Semicolons used consistently
- Double quotes for strings
- Callback-based Chrome API usage (not Promise-based)
- Console logging for debugging (`console.log()`)

### Patterns
- Event-driven architecture with Chrome API listeners
- Message passing between background ↔ content scripts via `chrome.runtime.sendMessage` / `chrome.tabs.sendMessage`
- State stored in module-level variables (background.js) and persisted via `chrome.storage.local`
- Error handling with try-catch around `chrome.runtime.sendMessage` (context invalidation)
- `chrome.runtime.lastError` checks for Chrome API calls

## Development Workflow

### Setup
```bash
git clone <repo-url>
# Open chrome://extensions/
# Enable "Developer mode"
# Click "Load unpacked" → select the repo folder
```

### Testing
- **No automated test framework** — testing is manual
- Load the extension in Chrome, open YouTube, and verify behavior
- Use the "Time Context" button in the popup details screen to test contextual alerts
- Check Chrome DevTools console for debug logs (both service worker and YouTube tab consoles)
- After code changes: click the reload button on `chrome://extensions/` and refresh YouTube tabs

### Key Testing Scenarios
1. **Time tracking**: Open YouTube tab, verify timer increments in popup
2. **Video counting**: Navigate between videos, check `videosWatched` in popup stats
3. **Rapid watching**: Watch 5+ videos quickly, verify modal alert appears
4. **Time alerts**: Accumulate 30/45/60 minutes of watch time (or modify thresholds temporarily)
5. **Podcast mode**: Toggle podcast mode, verify current video is excluded from tracking
6. **Snooze**: Activate snooze, verify alerts are suppressed for 10 minutes
7. **Daily reset**: Change system date or modify `lastResetDate` in storage to test reset logic

## Important Implementation Details

- `background.js` calls `initialize()` at the bottom of the file to bootstrap the service worker
- `messages.js` is loaded into the service worker via `importScripts('messages.js')` (not ES modules)
- Content script uses `MutationObserver` and `setInterval` for YouTube SPA navigation detection (YouTube doesn't trigger normal page loads)
- Video pausing uses a multi-method approach: YouTube player API (`pauseVideo()`), direct HTML5 video element (`video.pause()`), with retries — because YouTube's player may not be ready immediately
- Rapid watching alert has escalating enforcement: after `MAX_IGNORES` (3) dismissals, the tab is closed automatically
- Progressive time alerts: 30 min (green/friendly), 45 min (yellow/nudge), 60+ min (red/strong, repeats every 30 min)
- Daily reset happens automatically when a new day is detected (compares current date to `lastResetDate`)

## Gotchas

- Service workers can be terminated by Chrome — all persistent state must go through `chrome.storage.local`, not just in-memory variables
- YouTube is a Single Page Application — standard page load events don't fire on navigation; URL polling and `yt-navigate-finish` events are used instead
- Content script context can be invalidated when the extension reloads — all `chrome.runtime.sendMessage` calls should be wrapped in try-catch
- The popup's connection to background (`chrome.runtime.connect`) is used to detect when the popup opens/closes for badge update logic
