# Youtube Time Tracker
A Chrome Extension that monitors and manages your YouTube watch time with interactive features to encourage mindful viewing.


## Overview
YouTube Time Tracker is a Chrome extension designed to help users be more conscious of their time spent on YouTube. It provides real-time tracking of watch time, collects usage statistics, and offers interactive features to promote healthy viewing habits.

![Screenshot of extension pop up screen with timer] (/images/yt-time-tracker.png "Youtube time tracker extension")

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
**JavaScript:** Core programming language for extension functionality<br>
**Chrome Extension API:** Leverages storage, tabs, and webNavigation APIs <br>
**HTML/CSS:** Front-end interface with responsive design<br>
**Event-Driven Architecture:** Background listeners to track page interactions

## Installation
### For Users
1. Download the extension from the Chrome Web Store (coming soon)
2. Click "Add to Chrome" to install the extension
3. Pin the extension to your toolbar for easy access

### For Developers
1. Clone this repository:
git clone https://github.com/FionaKP/youtube-time-tracker.git
2. Open Chrome and navigate to chrome://extensions/
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the cloned repository folder
5. The extension should now be installed and ready for testing or development

## Project Structure
youtube-time-tracker/<br>
├── manifest.json  
├── popup.html     
├── popup.js       
├── background.js  
├── content.js     
└── icons/         

## How It Works
**Background Script:** Continuously monitors YouTube activity across all tabs<br>
**Content Script:** Injects into YouTube pages to detect video playback<br>
**Storage API:** Maintains persistent data for timer and statistics<br>
**Popup Interface:** Provides user-friendly access to data and controls

## Contributions
Contributions are welcome! Feel free to submit issues or pull requests if you have ideas for improvements or have found bugs.

## About the Developer
Developed as part of a personal computer science portfolio project focusing on Chrome extension development, JavaScript programming, and creating tools for digital wellbeing.