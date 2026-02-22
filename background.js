importScripts('messages.js');

// Initialize state
let isOnYouTube = false;
let trackingInterval = null;
const YOUTUBE_URL_PATTERN = "*://*.youtube.com/*";
let currentVideoId = null;
let watchedVideos = new Set();
let videoWatchTimes = [];
let rapidWatchingSnoozeUntil = 0;
let allAlertsSnoozeUntil = 0; // Snooze all alerts (from popup)
let timeAlertsShown = new Set(); // Track which time alerts we've shown today
let podcastModeTabs = new Map(); // Map of tabId -> originalUrl (tracks tabs in podcast mode)
let shownMessagesHistory = [];
const MAX_HISTORY = 10; // Remember last 10 messages
let lastContextualAlert = 0;
let nextContextualAlertTime = null;
let isPopupOpen = false;

// Listen for popup connection/disconnection
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "popup") {
    console.log("Popup opened");
    isPopupOpen = true;
    updateBadge();
    
    // When popup closes, this fires automatically
    port.onDisconnect.addListener(function() {
      console.log("Popup closed");
      isPopupOpen = false;
      updateBadge();
    });
  }
});

// Show time context messages
// Helper function to get a random contextual message
function getContextualMessage(totalMinutes) {
  // Determine category based on time
  let category;
  if (totalMinutes < 16) category = 'short';
  else if (totalMinutes < 41) category = 'medium';
  else if (totalMinutes < 91) category = 'long';
  else category = 'veryLong';
  
  // Get all messages in this category that apply to current time
  let applicableMessages = contextualMessages[category].filter(msg => 
    msg.time <= totalMinutes
  );
  
  // Add seasonal messages if applicable
  const seasonalApplicable = contextualMessages.seasonal.filter(msg => 
    msg.time <= totalMinutes
  );
  applicableMessages = [...applicableMessages, ...seasonalApplicable];
  
  // Filter out recently shown messages
  applicableMessages = applicableMessages.filter(msg => 
    !shownMessagesHistory.includes(msg.message)
  );
  
  // If we've shown everything, reset history
  if (applicableMessages.length === 0) {
    shownMessagesHistory = [];
    applicableMessages = contextualMessages[category].filter(msg => 
      msg.time <= totalMinutes
    );
    applicableMessages = [...applicableMessages, ...seasonalApplicable.filter(msg => 
      msg.time <= totalMinutes
    )];
  }
  
  // Pick a random message from applicable ones
  if (applicableMessages.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * applicableMessages.length);
  const selectedMessage = applicableMessages[randomIndex];
  
  // Add to history
  shownMessagesHistory.push(selectedMessage.message);
  if (shownMessagesHistory.length > MAX_HISTORY) {
    shownMessagesHistory.shift(); // Remove oldest
  }
  
  return selectedMessage;
}

// Generate next alert time with some randomness
function scheduleNextContextualAlert(currentMinutes) {
  // Base intervals: every 10-20 minutes, but with randomness
  const baseInterval = 10; // minutes
  const randomVariation = Math.floor(Math.random() * 10) + 1; // 1-10 minutes
  
  nextContextualAlertTime = currentMinutes + baseInterval + randomVariation;
  
  console.log(`Next contextual alert scheduled for ${nextContextualAlertTime} minutes`);
}

// Check if it's time for a contextual alert
function shouldShowContextualAlert(currentMinutes) {
  // Initialize if first time
  if (nextContextualAlertTime === null) {
    scheduleNextContextualAlert(currentMinutes);
    return false;
  }
  
  // Check if we've reached the scheduled time
  if (currentMinutes >= nextContextualAlertTime) {
    lastContextualAlert = currentMinutes;
    scheduleNextContextualAlert(currentMinutes);
    return true;
  }
  
  return false;
}

// Check for active YouTube tabs and manage tracking
function checkForYouTubeTabs() {
  chrome.tabs.query({url: YOUTUBE_URL_PATTERN, active: true, currentWindow: true}, function(tabs) {
    const wasOnYouTube = isOnYouTube;

    // Check if the active tab is in podcast mode
    let activeTabInPodcastMode = false;
    if (tabs.length > 0) {
      const activeTabId = tabs[0].id;
      activeTabInPodcastMode = podcastModeTabs.has(activeTabId);
    }

    // Only consider "on YouTube" if not in podcast mode
    isOnYouTube = tabs.length > 0 && !activeTabInPodcastMode;

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
      
      // Check for rapid watching (5+ videos in 5 minutes)
      const fiveMinutesAgo = currentTime - (5 * 60 * 1000);
      const recentVideos = videoWatchTimes.filter(time => time > fiveMinutesAgo);
      
      console.log(`Videos watched in last 5 minutes: ${recentVideos.length}`);
      console.log(`Total videos tracked: ${videoWatchTimes.length}`);
      
      if (recentVideos.length >= 5) {
        // Check if alerts are snoozed (either rapid watching specific or all alerts)
        if (Date.now() > rapidWatchingSnoozeUntil && Date.now() > allAlertsSnoozeUntil) {
          console.log("Triggering rapid watching alert!");
          
          // Get current time data for the alert
          chrome.storage.local.get(['youtubeTime'], function(data) {
            // Query for the active YouTube tab - THIS IS THE FIX
            chrome.tabs.query({url: YOUTUBE_URL_PATTERN, active: true, currentWindow: true}, function(tabs) {
              if (tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, {
                  action: "showRapidWatchingAlert",
                  videoCount: recentVideos.length,
                  totalTimeToday: {
                    hours: Math.floor((data.youtubeTime || 0) / 3600),
                    minutes: Math.floor(((data.youtubeTime || 0) % 3600) / 60),
                    seconds: (data.youtubeTime || 0) % 60
                  }
                }, function(response) {
                  if (chrome.runtime.lastError) {
                    console.log("Could not send rapid watching alert:", chrome.runtime.lastError.message);
                  } else {
                    console.log("Rapid watching alert sent successfully");
                  }
                });
              } else {
                console.log("No active YouTube tab found for rapid watching alert");
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
  } else if (request.action === "snoozeAllAlerts") {
    // Snooze all alerts for 10 minutes (from popup)
    allAlertsSnoozeUntil = Date.now() + (10 * 60 * 1000);
    rapidWatchingSnoozeUntil = Date.now() + (10 * 60 * 1000);
    console.log("All alerts snoozed for 10 minutes");
    sendResponse({success: true});
    return true;
  } else if (request.action === "getSnoozeState") {
    const isSnoozed = Date.now() < allAlertsSnoozeUntil;
    sendResponse({isSnoozed: isSnoozed});
    return true;
  } else if (request.action === "togglePodcastMode") {
    const tabId = request.tabId;
    const url = request.url;

    if (podcastModeTabs.has(tabId)) {
      // Turn off podcast mode
      podcastModeTabs.delete(tabId);
      console.log("Podcast mode disabled for tab:", tabId);
      // Re-check tracking state to resume tracking
      checkForYouTubeTabs();
      sendResponse({isActive: false});
    } else {
      // Turn on podcast mode - store the URL to detect changes
      podcastModeTabs.set(tabId, url);
      console.log("Podcast mode enabled for tab:", tabId, "URL:", url);
      // Re-check tracking state to stop tracking
      checkForYouTubeTabs();
      sendResponse({isActive: true});
    }
    return true;
  } else if (request.action === "getPodcastModeState") {
    const isActive = podcastModeTabs.has(request.tabId);
    sendResponse({isActive: isActive});
    return true;
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

  if (request.action === "testContextualAlert") {
    const minutes = request.currentMinutes || 10;
    
    console.log(`Testing contextual alert for ${minutes} minutes`);
    console.log('Next Contextual Time Alert is at: ' + nextContextualAlertTime);
    // nextContextualAlertTime = request.currentMinutes + 1; // DEBUG
    
    const contextMsg = getContextualMessage(minutes);
    
    if (contextMsg) {
      chrome.tabs.query({url: YOUTUBE_URL_PATTERN}, function(tabs) {
        if (tabs.length > 0) {
          let successCount = 0;
          let errorCount = 0;
          
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
              action: "showContextualAlert",
              message: contextMsg.message,
              emoji: contextMsg.emoji,
              totalMinutes: minutes
            }, function(response) {
              // Check for errors using chrome.runtime.lastError
              if (chrome.runtime.lastError) {
                console.log("Could not send to tab:", chrome.runtime.lastError.message);
                errorCount++;
              } else {
                console.log("Successfully sent to tab");
                successCount++;
              }
            });
          });
          
          sendResponse({success: true, message: contextMsg.message});
        } else {
          console.log("No YouTube tabs open to send test alert to");
          sendResponse({success: false, error: "No YouTube tabs open"});
        }
      });
    } else {
      console.log("No contextual message available for this time");
      sendResponse({success: false, error: "No message available"});
    }
    
    return true;
  }
  
  // Handle force close tab
  if (request.action === "forceCloseTab") {
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

    // Check if it's a new day
    if (data.lastResetDate !== currentDate) {
      // Reset for new day
      timeAlertsShown.clear();
      shownMessagesHistory = []; // Reset contextual message history
      nextContextualAlertTime = null; // Reset contextual alert schedule
      
      chrome.storage.local.set({
        youtubeTime: 1,
        lastResetDate: currentDate,
        tabOpens: 0,
        videosWatched: 0
      }, updateBadge);
    } else {
      // Increment existing counter
      const newTimeCount = timeCount + 1;
      
      // DEFINE totalMinutes HERE, before using it
      const totalMinutes = Math.floor(newTimeCount / 60);
      
      chrome.storage.local.set({
        youtubeTime: newTimeCount,
        lastResetDate: currentDate 
      }, updateBadge);
      
      // Check for time-based alerts (skip if snoozed)
      if (Date.now() > allAlertsSnoozeUntil) {
        checkTimeBasedAlerts(newTimeCount);
      }

      // Check for contextual alerts (skip if snoozed)
      if (Date.now() > allAlertsSnoozeUntil && shouldShowContextualAlert(totalMinutes)) {
        const contextMsg = getContextualMessage(totalMinutes);
        
        if (contextMsg) {
          console.log(`Showing contextual alert: ${contextMsg.message}`);
          console.log(`Next alert scheduled for: ${nextContextualAlertTime} minutes`); // Your debug log
          
          // Send to all YouTube tabs
          chrome.tabs.query({url: YOUTUBE_URL_PATTERN}, function(tabs) {
            tabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, {
                action: "showContextualAlert",
                message: contextMsg.message,
                emoji: contextMsg.emoji,
                totalMinutes: totalMinutes
              }, function(response) {
                // Handle errors with callback instead of .catch()
                if (chrome.runtime.lastError) {
                  console.log("Could not send contextual alert:", chrome.runtime.lastError.message);
                }
              });
            });
          });
        }
      }
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
    // chrome.tabs.query({url: YOUTUBE_URL_PATTERN, active: true, currentWindow: true}, function(tabs) {
    //   if (tabs.length > 0) {
    //     chrome.tabs.sendMessage(tabs[0].id, {
    //       action: alertType,
    //       totalMinutes: minutes,
    //       totalHours: hours
    //     });
    //   }
    // });
    chrome.tabs.query({url: YOUTUBE_URL_PATTERN, active: true, currentWindow: true}, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: alertType,
          totalMinutes: minutes,
          totalHours: hours
        }, function(response) {
          if (chrome.runtime.lastError) {
            console.log("Could not send time alert:", chrome.runtime.lastError.message);
          }
        });
      }
    });
  }
}

// Update the badge with current time
function updateBadge() {
  // First check if active tab is in podcast mode
  chrome.tabs.query({url: YOUTUBE_URL_PATTERN, active: true, currentWindow: true}, function(tabs) {
    let isInPodcastMode = false;
    if (tabs.length > 0) {
      isInPodcastMode = podcastModeTabs.has(tabs[0].id);
    }

    // If in podcast mode, show headphone icon
    if (isInPodcastMode) {
      chrome.action.setBadgeText({ text: "🎧" });
      chrome.action.setBadgeBackgroundColor({ color: "#666666" });
      return;
    }

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

      if (isOnYouTube) {
        // On YouTube - show full badge with YouTube red
        chrome.action.setBadgeText({ text: badgeText });
        chrome.action.setBadgeBackgroundColor({ color: "#fc1c17" });
        chrome.action.setBadgeTextColor({ color: "#FFFFFF" });
      } else if (isPopupOpen) {
        // Popup is open - show time with subtle styling
        chrome.action.setBadgeText({ text: badgeText });
        chrome.action.setBadgeBackgroundColor({ color: "#FFFFFF" });
        chrome.action.setBadgeTextColor({ color: "#666666" });
      } else {
        // Not on YouTube and popup closed - hide badge
        chrome.action.setBadgeText({ text: "" });
      }
    });
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

  // Check if URL changed for tabs in podcast mode
  if (changeInfo.url && podcastModeTabs.has(tabId)) {
    const originalUrl = podcastModeTabs.get(tabId);
    // If URL changed, disable podcast mode for this tab
    if (changeInfo.url !== originalUrl) {
      console.log("URL changed, disabling podcast mode for tab:", tabId);
      podcastModeTabs.delete(tabId);
      // Re-check tracking state since podcast mode was disabled
      checkForYouTubeTabs();
    }
  }
});

// Clean up podcast mode when tabs are closed
chrome.tabs.onRemoved.addListener(function(tabId) {
  if (podcastModeTabs.has(tabId)) {
    podcastModeTabs.delete(tabId);
    console.log("Tab closed, removed from podcast mode:", tabId);
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