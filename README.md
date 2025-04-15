# Youtube Time Tracker
A Chrome Extension that monitors and manages your YouTube watch time with interactive features to encourage mindful viewing.


## Overview
YouTube Time Tracker is a Chrome extension designed to help users be more conscious of their time spent on YouTube. It provides real-time tracking of watch time, collects usage statistics, and offers interactive features to promote healthy viewing habits.


## Features
* Real-time Watch Time Tracking: Tracks time spent watching YouTube videos across all tabs
* Daily Usage Statistics: Records number of YouTube tabs opened and videos watched
* Automatic Daily Reset: Timer and statistics reset at the beginning of each new day
* Badge Timer Display: Shows current watch time on the extension icon
* Detailed Analytics: View comprehensive usage statistics in the extension popup
* Mobile-friendly Design: Clean interface that works on any screen size

## Coming Soon
* Random Continuation Prompts: Periodic popups asking if you want to continue watching
* Time Comparisons: Contextualizes your watch time in relatable terms
* AI-Powered Content Priority Matching: Uses AI to evaluate if videos align with your priorities

## Technologies Used
<b>JavaScript:</b> Core programming language for extension functionality
<b>Chrome Extension API:</b> Leverages storage, tabs, and webNavigation APIs
<b>HTML/CSS:</b> Front-end interface with responsive design
<b>Event-Driven Architecture:</b> Background listeners to track page interactions

## Installation
### For Users
1. Download the extension from the Chrome Web Store (coming soon)
2. Click "Add to Chrome" to install the extension
3. Pin the extension to your toolbar for easy access

### For Developers
1. Clone this repository:
git clone https://github.com/yourusername/youtube-time-tracker.git
2. Open Chrome and navigate to chrome://extensions/
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the cloned repository folder
5. The extension should now be installed and ready for testing or development

## Project Structure
youtube-time-tracker/
├── manifest.json  - Extension configuration
├── popup.html     - UI for the extension popup
├── popup.js       - Handles popup functionality and display updates
├── background.js  - Background service worker for cross-tab tracking
├── content.js     - Content script for YouTube page integration
└── icons/         - Extension icons in various sizes

## How It Works
<b>Background Script:</b> Continuously monitors YouTube activity across all tabs
<b>Content Script:</b> Injects into YouTube pages to detect video playback
<b>Storage API:</b> Maintains persistent data for timer and statistics
<b>Popup Interface:</b> Provides user-friendly access to data and controls

## Contributions
Contributions are welcome! Feel free to submit issues or pull requests if you have ideas for improvements or have found bugs.

## About the Developer
Developed as part of a personal computer science portfolio project focusing on Chrome extension development, JavaScript programming, and creating tools for digital wellbeing.