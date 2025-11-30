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
* **Immediate Intervention**: Full-screen modal alerts that interrupt mindless scrolling
* **Snooze Functionality**: "Remind me in 10 minutes" option for temporary alert pausing
* **YouTube Shorts Awareness**: Specifically designed to catch rapid shorts consumption

### ⏰ **Progressive Time Alerts**
* **30-Minute Gentle Reminder**: 😊 Green friendly notification about time spent
* **45-Minute Nudge**: 😐 Yellow alert suggesting a break might be good
* **Hourly+ Strong Alerts**: 😞 Red alerts every 30 minutes after 1 hour with direct advice

### 💻 **User Interface**
* **Detailed Analytics**: View comprehensive usage statistics in the extension popup
* **Professional Modal Design**: Clean, non-dismissible alerts with clear action buttons
* **Multiple Interaction Options**: Close tab, continue watching, or snooze alerts
* **Mobile-friendly Design**: Responsive interface that works on any screen size

## How the Alert System Works

### **Rapid Watching Detection**
When the extension detects you've watched 5 or more videos within 5 minutes, it triggers an immediate full-screen intervention:
- **Warning Modal**: Blocks the YouTube interface with a prominent alert
- **Usage Summary**: Shows how many videos you've watched and total time today
- **Action Options**: Close tab, continue watching, or snooze for 10 minutes
- **Anti-Rabbit Hole**: Specifically designed to interrupt mindless scrolling patterns

### **Time-Based Interventions**
Progressive alerts based on total daily watch time:
1. **30 Minutes**: 😊 Friendly green reminder - just letting you know
2. **45 Minutes**: 😐 Yellow caution - suggesting a break might be good  
3. **60+ Minutes**: 😞 Red warning - every 30 minutes with stronger language

### **Smart Features**
- **Snooze Protection**: 10-minute pause on rapid watching alerts for intentional viewing
- **Auto-Dismiss**: Time alerts automatically close after 10 seconds
- **Daily Reset**: All tracking and alert history resets each day
- **Cross-Tab Tracking**: Works across multiple YouTube tabs and windows

## Coming Soon
* **Customizable Thresholds**: Set your own time limits and video count triggers
* **Time Comparisons**: Contextualizes your watch time in relatable terms
* **AI-Powered Content Priority Matching**: Uses AI to evaluate if videos align with your priorities
* **Weekly/Monthly Statistics**: Extended analytics and usage patterns
* **Export Data**: Download your usage statistics for personal analysis

## Technologies Used
**JavaScript:** Core programming language for extension functionality<br>
**Chrome Extension API:** Leverages storage, tabs, notifications, and messaging APIs<br>
**HTML/CSS:** Front-end interface with responsive design and dynamic modal creation<br>
**Event-Driven Architecture:** Background service worker and content script communication<br>
**URL Pattern Matching:** Advanced regex for YouTube video and Shorts detection<br>
**Real-Time Tracking:** Interval-based monitoring with performance optimization

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
**Background Service Worker:** Continuously monitors YouTube activity, manages timers, and triggers alerts<br>
**Content Script:** Injects into YouTube pages to detect video changes and display intervention modals<br>
**Intelligent URL Tracking:** Monitors URL changes to detect video transitions including YouTube Shorts<br>
**Message Passing:** Real-time communication between background and content scripts<br>
**Storage API:** Maintains persistent data for timer, statistics, and alert states<br>
**Popup Interface:** Provides user-friendly access to detailed analytics and controls<br>
**Modal Intervention System:** Dynamic creation of full-screen alerts with multiple user options

## Contributions
Contributions are welcome! Feel free to submit issues or pull requests if you have ideas for improvements or have found bugs.

## About the Developer
Developed as part of a personal computer science portfolio project focusing on Chrome extension development, JavaScript programming, and creating tools for digital wellbeing.