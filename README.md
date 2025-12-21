# Youtube Time Tracker
A Chrome Extension that monitors and manages your YouTube watch time with intelligent alerts and intervention features to prevent mindless scrolling and encourage conscious viewing habits.


## Overview
YouTube Time Tracker is a Chrome extension designed to help users be more conscious of their time spent on YouTube. It provides real-time tracking of watch time, detects rapid video consumption patterns, and offers progressive intervention features to promote healthy viewing habits and prevent falling down the "YouTube rabbit hole."

![Pop up screenshot](/images/yt-time-tracker.png "Youtube time tracker extension")
![Extension Badge Active](/images/Extension_active.png "Active Extension Badge")
![Extension Badge Not Active](/images/Extension_not_active.png "Not Active Extension Badge")

![Green Pop Up](/images/Time_Check_Green.png "First green time check popup alert")
![Yellow Pop Up](/images/Time_Check_Yellow.png "Yellow reminder time check popup alert")
![Red Pop Up](/images/Time_Check_Red.png "Red warning time check popup alert")


## Features

### 📊 **Time & Usage Tracking**
* **Real-time Watch Time Tracking**: Tracks time spent watching YouTube videos across all tabs
* **Video Count Monitoring**: Automatically counts unique videos watched per day
* **Tab Usage Statistics**: Records number of YouTube tabs opened daily
* **Smart URL Detection**: Works with regular YouTube videos, Shorts, and all video formats
* **Automatic Daily Reset**: Timer and statistics reset at the beginning of each new day
* **Badge Timer Display**: Shows current watch time on the extension icon

### 🚨 **Rabbit Hole Prevention**
* **Rapid Watching Detection**: Automatically detects when you watch 5+ videos in 5 minutes
* **Automatic Video Pause**: Videos are paused when intervention alerts appear to prevent background watching
* **Immediate Intervention**: Full-screen modal alerts that interrupt mindless scrolling
* **Progressive Enforcement**: Track how many times alerts are ignored with visual warnings
* **Automatic Tab Closure**: After 3 ignored rapid watching alerts, the tab automatically closes to enforce breaks
* **Snooze Functionality**: "Remind me in 10 minutes" option for temporary alert pausing (doesn't count as an ignore)
* **YouTube Shorts Awareness**: Specifically designed to catch rapid shorts consumption

### ⏰ **Progressive Time Alerts**
* **30-Minute Gentle Reminder**: 😊 Green friendly notification about time spent
* **45-Minute Nudge**: 😐 Yellow alert suggesting a break might be good
* **Hourly+ Strong Alerts**: 😞 Red alerts every 30 minutes after 1 hour with direct advice
* **Smart Video Pausing**: All time-based alerts automatically pause the video to ensure you see them

### 💻 **User Interface**
* **Detailed Analytics**: View comprehensive usage statistics in the extension popup
* **Professional Modal Design**: Clean, non-dismissible alerts with clear action buttons
* **Multiple Interaction Options**: Close tab, continue watching, or snooze alerts
* **Mobile-friendly Design**: Responsive interface that works on any screen size
* **Visual Warning System**: Clear feedback showing how many alerts have been ignored

## How the Alert System Works

### **Rapid Watching Detection**
When the extension detects you've watched 5 or more videos within 5 minutes, it triggers an immediate full-screen intervention:
- **Automatic Video Pause**: The video immediately pauses to ensure you see the alert
- **Warning Modal**: Blocks the YouTube interface with a prominent alert
- **Usage Summary**: Shows how many videos you've watched and total time today
- **Action Options**: Close tab, continue watching, or snooze for 10 minutes
- **Progressive Warnings**: Visual counter shows how many times you've ignored the alert (e.g., "Warning 2/3")
- **Automatic Enforcement**: After 3 ignored alerts, the tab automatically closes via background script
- **Final Warning**: Before the last ignore, a prominent warning appears: "⚠️ FINAL WARNING: Tab will close on next ignore! ⚠️"
- **Smart Snooze**: Using snooze doesn't count as ignoring the alert
- **Anti-Rabbit Hole**: Specifically designed to interrupt mindless scrolling patterns

### **Time-Based Interventions**
Progressive alerts based on total daily watch time:
Progressive alerts based on total daily watch time:
1. **30 Minutes**: 😊 Friendly green reminder - just letting you know
2. **45 Minutes**: 😐 Yellow caution - suggesting a break might be good  
3. **60+ Minutes**: 😞 Red warning - every 30 minutes with stronger language
4. **All Time Alerts**: Automatically pause the video and auto-dismiss after 15 seconds

### **Smart Features**
- **Multi-Method Video Pausing**: Uses YouTube's internal player API and direct video element manipulation for reliable pausing
- **Retry Logic**: Attempts to pause videos multiple times with delays to ensure success even on slow page loads
- **Snooze Protection**: 10-minute pause on rapid watching alerts for intentional viewing (doesn't count as an ignore)
- **Ignore Counter Reset**: Counter resets when you voluntarily close the tab or take positive action
- **Auto-Dismiss**: Time alerts automatically close after 15 seconds
- **Daily Reset**: All tracking, alert history, and ignore counters reset each day
- **Cross-Tab Tracking**: Works across multiple YouTube tabs and windows
- **Extension Context Handling**: Graceful error handling if extension is reloaded during use

### **Technical Implementation**
- **Background Script Tab Control**: Leverages Chrome's tabs API to close tabs when enforcement is needed
- **Message Passing**: Secure communication between content scripts and background service worker
- **Safe Message Handling**: Automatic reconnection attempts and user notifications if extension context is invalidated
- **Multiple Video Detection**: Finds and pauses all video elements on the page, including hidden ones
- **YouTube API Integration**: Uses YouTube's internal `pauseVideo()` method for maximum compatibility

## Coming Soon
* **Customizable Thresholds**: Set your own time limits and video count triggers
* **Time Comparisons**: Contextualizes your watch time in relatable terms
* **AI-Powered Content Priority Matching**: Uses AI to evaluate if videos align with your priorities
* **Weekly/Monthly Statistics**: Extended analytics and usage patterns
* **Export Data**: Download your usage statistics for personal analysis
* **Whitelist Feature**: Exclude educational or work-related channels from enforcement
* **Custom Alert Messages**: Personalize intervention messages and motivational quotes

## Technologies Used
**JavaScript:** Core programming language for extension functionality<br>
**Chrome Extension API:** Leverages storage, tabs, notifications, and messaging APIs<br>
**HTML/CSS:** Front-end interface with responsive design and dynamic modal creation<br>
**Event-Driven Architecture:** Background service worker and content script communication<br>
**URL Pattern Matching:** Advanced regex for YouTube video and Shorts detection<br>
**Real-Time Tracking:** Interval-based monitoring with performance optimization
**YouTube Player API:** Direct integration with YouTube's internal video player for reliable control<br>
**Promise-Based Async Operations:** Ensures video pausing completes before showing alerts<br>
**Error Handling & Recovery:** Robust message passing with automatic retry and reconnection logic

## Installation
### For Users
1. Download the extension from the Chrome Web Store (coming soon)
2. Click "Add to Chrome" to install the extension
3. Pin the extension to your toolbar for easy access
4. Grant necessary permissions when prompted (tabs, storage, and YouTube access)

### For Developers
1. Clone this repository:
git clone https://github.com/FionaKP/youtube-time-tracker.git
2. Open Chrome and navigate to chrome://extensions/
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the cloned repository folder
5. The extension should now be installed and ready for testing or development
6. **Important**: After making code changes and reloading the extension, refresh all YouTube tabs to reconnect the content scripts

## Project Structure
youtube-time-tracker/<br>
├── manifest.json  
├── popup.html     
├── popup.js       
├── background.js  
├── content.js     
└── icons/         

## How It Works
**Background Service Worker:** Continuously monitors YouTube activity, manages timers, triggers alerts, and handles tab closure enforcement<br>
**Content Script:** Injects into YouTube pages to detect video changes, pause videos, and display intervention modals<br>
**Intelligent URL Tracking:** Monitors URL changes to detect video transitions including YouTube Shorts<br>
**Message Passing:** Real-time communication between background and content scripts with automatic error recovery<br>
**Storage API:** Maintains persistent data for timer, statistics, alert states, and ignore counters<br>
**Tabs API:** Enables background script to close tabs when users ignore too many warnings<br>
**Popup Interface:** Provides user-friendly access to detailed analytics and controls<br>
**Modal Intervention System:** Dynamic creation of full-screen alerts with multiple user options and progressive enforcement<br>
**Video Control System:** Multi-method approach to pausing videos using YouTube's player API and HTML5 video elements<br>
**Retry Logic:** Automatic retry mechanisms for video pausing to handle slow-loading pages and YouTube's dynamic content

## Privacy & Permissions
This extension requires the following permissions:
* **tabs**: To detect YouTube tabs and enforce tab closure when needed
* **storage**: To save your watch time statistics and preferences locally
* **Host permissions for YouTube**: To inject content scripts and track video watching
* **No data collection**: All data stays on your device - nothing is sent to external servers

## Contributions
Contributions are welcome! Feel free to submit issues or pull requests if you have ideas for improvements or have found bugs.

## About the Developer
Developed as part of a personal computer science portfolio project focusing on Chrome extension development, JavaScript programming, and creating tools for digital wellbeing.

## License
MIT License - Feel free to use and modify for personal or educational purposes.

---

**Made with ❤️ to help people build healthier relationships with YouTube**