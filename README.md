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

### 🎯 **Contextual Time Awareness**
* **Fun Time Comparisons**: Receive playful notifications comparing your watch time to relatable activities
* **Dynamic Messaging**: Over 25 unique messages that change based on how long you've been watching
* **Smart Randomization**: Messages appear at semi-random intervals (every 8-15 minutes) to avoid predictability
* **No Repetition**: Intelligent message selection prevents showing the same message twice in a row
* **Color-Coded Urgency**: 
  - 🟢 Green background for short sessions (< 30 minutes)
  - 🟠 Orange background for medium sessions (30-60 minutes)
  - 🔴 Red background for long sessions (60+ minutes)
* **Non-Intrusive Design**: Corner notifications that auto-dismiss after 10 seconds
* **Example Messages**:
  - "You've watched enough time to soft-boil an egg 🥚" (6 minutes)
  - "Time to listen to 'All Too Well (10 Minute Version)' 🎵" (10 minutes)
  - "You could've done a quick workout 💪" (20 minutes)
  - "Three hours! You could've driven from Boston to NYC 🗽" (180 minutes)

### 💻 **User Interface**
* **Modern Gradient Design**: Sleek purple gradient theme with polished animations
* **Detailed Analytics Dashboard**: View comprehensive usage statistics in the extension popup
* **Professional Modal Design**: Clean, non-dismissible alerts with clear action buttons
* **Multiple Interaction Options**: Close tab, continue watching, or snooze alerts
* **Responsive Design**: Beautiful interface that works on any screen size
* **Visual Warning System**: Clear feedback showing how many alerts have been ignored
* **Hover Effects & Animations**: Smooth transitions and micro-interactions throughout
* **Testing Tools**: Built-in button to preview contextual alerts at different time intervals

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

### **Contextual Time Awareness System**
Fun, non-intrusive corner notifications that provide perspective on your watch time:
- **Smart Scheduling**: Appears every 8-15 minutes with randomized intervals to avoid predictability
- **Context Categories**:
  - **Short sessions (5-15 min)**: Activities like soft-boiling eggs, showers, or coffee breaks
  - **Medium sessions (16-40 min)**: Workouts, cooking meals, or TV episodes
  - **Long sessions (41-90 min)**: Full movies, college lectures, or sports matches
  - **Very long sessions (91+ min)**: Road trips, flight durations, or extended films
- **No Duplicates**: Remembers the last 10 messages shown to keep content fresh
- **Visual Urgency Indicators**: Background color transitions from green → orange → red as time increases
- **Dismissible**: Click anywhere to close, or auto-dismisses after 10 seconds
- **Examples at different times**:
  - 10 minutes: "Time to listen to 'All Too Well (10 Minute Version)' 🎵"
  - 30 minutes: "You could've taken a power nap 😴"
  - 60 minutes: "A whole hour! You could've learned a new skill 🎯"
  - 180 minutes: "Three hours! You could've driven from Boston to NYC 🗽"

### **Smart Features**
- **Multi-Method Video Pausing**: Uses YouTube's internal player API and direct video element manipulation for reliable pausing
- **Retry Logic**: Attempts to pause videos multiple times with delays to ensure success even on slow page loads
- **Snooze Protection**: 10-minute pause on rapid watching alerts for intentional viewing (doesn't count as an ignore)
- **Ignore Counter Reset**: Counter resets when you voluntarily close the tab or take positive action
- **Auto-Dismiss**: Time alerts automatically close after 15 seconds, contextual alerts after 10 seconds
- **Daily Reset**: All tracking, alert history, ignore counters, and message history reset each day
- **Cross-Tab Tracking**: Works across multiple YouTube tabs and windows
- **Extension Context Handling**: Graceful error handling if extension is reloaded during use
- **Message Diversity**: 100+ unique contextual messages across multiple categories ensure variety

### **Technical Implementation**
- **Background Script Tab Control**: Leverages Chrome's tabs API to close tabs when enforcement is needed
- **Message Passing**: Secure communication between content scripts and background service worker
- **Safe Message Handling**: Automatic reconnection attempts and user notifications if extension context is invalidated
- **Multiple Video Detection**: Finds and pauses all video elements on the page, including hidden ones
- **YouTube API Integration**: Uses YouTube's internal `pauseVideo()` method for maximum compatibility
- **Modular Message System**: Separate `messages.js` file for easy message management and updates
- **Intelligent Randomization**: Prevents message repetition while maintaining natural variation
- **Dynamic Color Coding**: Real-time color adjustments based on session duration for visual feedback

## Coming Soon
* **Customizable Thresholds**: Set your own time limits, video count triggers, and ignore limits
* **Custom Contextual Messages**: Add your own personalized time comparisons and messages
* **Message Categories Toggle**: Enable/disable specific types of contextual messages
* **Time Comparisons**: Additional contextualizations like "equivalent to X pages of reading"
* **AI-Powered Content Priority Matching**: Uses AI to evaluate if videos align with your priorities
* **Weekly/Monthly Statistics**: Extended analytics and usage patterns with charts
* **Export Data**: Download your usage statistics for personal analysis
* **Whitelist Feature**: Exclude educational or work-related channels from enforcement
* **Custom Alert Messages**: Personalize intervention messages and motivational quotes
* **Location-Based Messages**: Contextual comparisons based on your city (local landmarks, distances)

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
```
youtube-time-tracker/<br>
├── manifest.json      # Extension configuration and permissions
├── popup.html         # User interface for extension popup
├── popup.css          # Styling for popup with gradient theme
├── popup.js           # Popup logic and statistics display
├── background.js      # Service worker for time tracking and alert triggers
├── content.js         # Content script for YouTube page interactions
├── messages.js        # Contextual message library (25+ messages)
└── icons/             # Extension icons and screenshots       
```

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
**Contextual Message Engine:** Smart randomization algorithm that selects relevant, non-repetitive messages based on watch time and history<br>

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