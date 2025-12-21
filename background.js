// Initialize state
let isOnYouTube = false;
let trackingInterval = null;
const YOUTUBE_URL_PATTERN = "*://*.youtube.com/*";
let currentVideoId = null;
let watchedVideos = new Set();
let videoWatchTimes = [];
let rapidWatchingSnoozeUntil = 0;
let timeAlertsShown = new Set(); // Track which time alerts we've shown today

// Check for active YouTube tabs and manage tracking
function checkForYouTubeTabs() {
  chrome.tabs.query({url: YOUTUBE_URL_PATTERN, active: true, currentWindow: true}, function(tabs) {
    const wasOnYouTube = isOnYouTube;
    isOnYouTube = tabs.length > 0;
    
    // Start tracking if we weren't on YouTube before but are now
    if (!wasOnYouTube && isOnYouTube) {
      startTracking();
      incrementTabOpens();
      // Set badge background to red when actively tracking
      chrome.action.setBadgeBackgroundColor({ color: "#cc0000" });
    }
    
    // Stop tracking if we were on YouTube before but aren't now
    if (wasOnYouTube && !isOnYouTube) {
      stopTracking();
      // Set badge background to gray when not actively tracking
      chrome.action.setBadgeBackgroundColor({ color: "#888888" });
    }
  });
}

// Handle video changes and rapid watching detection
function handleVideoChange(videoId) {
  console.log("handleVideoChange called with:", videoId);
  console.log("Current video ID was:", currentVideoId);
  
  // If this is a different video than what we were watching
  if (videoId !== currentVideoId) {
    currentVideoId = videoId;
    const currentTime = Date.now();
    console.log("New video detected, tracking...");
    
    // Add to our set of watched videos
    if (!watchedVideos.has(videoId)) {
      console.log("This is a new unique video");
      watchedVideos.add(videoId);
      
      // Track when videos are watched for rapid detection
      videoWatchTimes.push(currentTime);
      
      // Keep only the last 10 minutes of watch times
      const tenMinutesAgo = currentTime - (10 * 60 * 1000);
      videoWatchTimes = videoWatchTimes.filter(time => time > tenMinutesAgo);
      
      // Check for rapid watching (3+ videos in 5 minute for easier testing)
      const oneMinuteAgo = currentTime - (5 * 60 * 1000);
      const recentVideos = videoWatchTimes.filter(time => time > oneMinuteAgo);
      
      console.log(`Videos watched in last 5 minute: ${recentVideos.length}`);
      console.log(`Total videos tracked: ${videoWatchTimes.length}`);
      
      if (recentVideos.length >= 5) {
        // Check if rapid watching alerts are snoozed
        const currentTime = Date.now();
        if (currentTime > rapidWatchingSnoozeUntil) {
          console.log("Triggering rapid watching alert!");
          
          // Get current time data for the alert
          chrome.storage.local.get(['youtubeTime'], function(data) {
            const totalSeconds = data.youtubeTime || 0;
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            
            // Send message to content script to show modal
            chrome.tabs.query({url: YOUTUBE_URL_PATTERN, active: true, currentWindow: true}, function(tabs) {
              if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, {
                  action: "showRapidWatchingAlert",
                  videoCount: recentVideos.length,
                  totalTimeToday: {
                    hours: hours,
                    minutes: minutes,
                    seconds: totalSeconds % 60
                  }
                });
              }
            });
          });
        } else {
          console.log("Rapid watching alert snoozed until", new Date(rapidWatchingSnoozeUntil));
        }
      }
      
      // Update the videos watched count
      chrome.storage.local.get(['videosWatched', 'lastResetDate'], function(data) {
        const currentDate = new Date().toDateString();
        
        // If it's a new day, reset the counter
        if (data.lastResetDate !== currentDate) {
          chrome.storage.local.set({
            videosWatched: 1,
            lastResetDate: currentDate
          });
        } else {
          // Increment the counter
          const videosWatched = (data.videosWatched || 0) + 1;
          chrome.storage.local.set({ videosWatched: videosWatched });
        }
      });
    }
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Background received message:", request);
  if (request.action === "videoChanged" && request.videoId) {
    console.log("Processing video change for:", request.videoId);
    handleVideoChange(request.videoId);
  } else if (request.action === "snoozeRapidWatching") {
    // Snooze rapid watching alerts for 10 minutes
    rapidWatchingSnoozeUntil = Date.now() + (10 * 60 * 1000);
    console.log("Rapid watching alerts snoozed for 10 minutes");
  }

  if (request.action === "forceCloseTab") {
    // Close the tab that sent the message
    if (sender.tab && sender.tab.id) {
      chrome.tabs.remove(sender.tab.id, function() {
        if (chrome.runtime.lastError) {
          console.error("Error closing tab:", chrome.runtime.lastError);
        } else {
          console.log("Tab closed successfully:", request.reason || "User requested");
        }
      });
    }
  }

  // If user hasn't watched for 30+ minutes, reset their ignore count
  if (request.action === "userTookBreak") {
    // Send message back to content script to reset
    chrome.tabs.sendMessage(sender.tab.id, {
      action: "resetIgnoreCount"
    });
  }
});

// Start the time tracking
function startTracking() {
  if (trackingInterval === null) {
    trackingInterval = setInterval(incrementTime, 1000);
    updateBadge(); // Update the badge immediately
  }
}

// Stop the time tracking
function stopTracking() {
  if (trackingInterval !== null) {
    clearInterval(trackingInterval);
    trackingInterval = null;
    updateBadge(); // Update the badge immediately
  }
}

// Increment the tracked time by 1 second
function incrementTime() {
  chrome.storage.local.get(['youtubeTime', 'lastResetDate'], function(data) {
    const currentDate = new Date().toDateString();
    let timeCount = data.youtubeTime || 0;
    
    // Log for debugging
    // console.log("Current time count:", timeCount);

    // Check if it's a new day
    if (data.lastResetDate !== currentDate) {
      // Reset for new day
      timeAlertsShown.clear();
      chrome.storage.local.set({
        youtubeTime: 1, // Start with 1 second
        lastResetDate: currentDate,
        tabOpens: 0,
        videosWatched: 0
      }, updateBadge);
    } else {
      // Increment existing counter
      const newTimeCount = timeCount + 1;
      chrome.storage.local.set({
        youtubeTime: newTimeCount,
        lastResetDate: currentDate 
      }, updateBadge);
      
      // Check for time-based alerts
      checkTimeBasedAlerts(newTimeCount);
    }
  });
}

// Check if we should show time-based alerts
function checkTimeBasedAlerts(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalSeconds / 3600);
  
  let alertKey = null;
  let alertType = null;
  
  // 30 minutes - green happy
  if (minutes >= 30 && !timeAlertsShown.has('30min')) {
    alertKey = '30min';
    alertType = 'timeAlert30';
  }
  // 45 minutes - yellow neutral  
  else if (minutes >= 45 && !timeAlertsShown.has('45min')) {
    alertKey = '45min';
    alertType = 'timeAlert45';
  }
  // 1+ hours - red sad (every 30 minutes after 1 hour)
  else if (minutes >= 60) {
    const hourlyKey = `${Math.floor(minutes / 30) * 30}min`;
    if (!timeAlertsShown.has(hourlyKey)) {
      alertKey = hourlyKey;
      alertType = 'timeAlertHourly';
    }
  }
  
  if (alertKey && alertType) {
    timeAlertsShown.add(alertKey);
    console.log(`Triggering ${alertType} for ${alertKey}`);
    
    // Send time alert to content script
    chrome.tabs.query({url: YOUTUBE_URL_PATTERN, active: true, currentWindow: true}, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: alertType,
          totalMinutes: minutes,
          totalHours: hours
        });
      }
    });
  }
}

// Update the badge with current time
function updateBadge() {
  chrome.storage.local.get(['youtubeTime'], function(data) {
    const seconds = data.youtubeTime || 0;
    
    // Format time for the badge (we'll use minutes for simplicity)
    const minutes = Math.floor(seconds / 60);
    
    // Different display formats based on time spent
    let badgeText;
    if (minutes < 60) {
      // Less than an hour: show minutes
      badgeText = `${minutes}m`;
    } else {
      // More than an hour: show hours with one decimal place
      const hours = (minutes / 60).toFixed(1);
      badgeText = `${hours}h`;
    }
    
    // Set the badge text
    chrome.action.setBadgeText({ text: badgeText });
    
    // If we're not on YouTube, use gray background
    if (!isOnYouTube) {
      chrome.action.setBadgeBackgroundColor({ color: "#888888" });
    } else {
      // If on YouTube, use red background
      chrome.action.setBadgeBackgroundColor({ color: "#cc0000" });
    }
  });
}

// Track YouTube tab opens
function incrementTabOpens() {
  chrome.storage.local.get(['tabOpens', 'lastResetDate'], function(data) {
    const currentDate = new Date().toDateString();
    
    // If it's a new day, reset the counter
    if (data.lastResetDate !== currentDate) {
      chrome.storage.local.set({
        tabOpens: 1,
        lastResetDate: currentDate
      });
    } else {
      // Increment the counter
      const tabOpens = (data.tabOpens || 0) + 1;
      chrome.storage.local.set({ tabOpens: tabOpens });
      console.log("Tab opens incremented:", tabOpens);
    }
  });
}

// Listen for tab changes
chrome.tabs.onActivated.addListener(checkForYouTubeTabs);
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    checkForYouTubeTabs();
  }
});

// Initial check when the extension loads
// Check for YouTube tabs when switching between windows
chrome.windows.onFocusChanged.addListener(function(windowId) {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) {
    checkForYouTubeTabs();
  }
});

// Initial setup when the extension loads
function initialize() {
  const currentDate = new Date().toDateString();
  
  // Initialize storage with default values if needed
  chrome.storage.local.get(['lastResetDate'], function(data) {
    if (!data.lastResetDate || data.lastResetDate !== currentDate) {
      chrome.storage.local.set({
        youtubeTime: 0,
        lastResetDate: currentDate,
        tabOpens: 0,
        videosWatched: 0
      });
      
      // Reset video tracking for new day
      watchedVideos.clear();
      videoWatchTimes = [];
    }
    
    // Initial check for YouTube tabs
    checkForYouTubeTabs();
    
    // Update badge
    updateBadge();
  });
}

// Run initialization
initialize();

// Set up a timer to update the badge even when not actively tracking
// This ensures the badge stays up-to-date
setInterval(updateBadge, 60000); // Update every minute