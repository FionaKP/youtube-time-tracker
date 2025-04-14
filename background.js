// Initialize state
let isOnYouTube = false;
let trackingInterval = null;
const YOUTUBE_URL_PATTERN = "*://*.youtube.com/*";

// Check for active YouTube tabs and manage tracking
function checkForYouTubeTabs() {
  chrome.tabs.query({url: YOUTUBE_URL_PATTERN, active: true, currentWindow: true}, function(tabs) {
    const wasOnYouTube = isOnYouTube;
    isOnYouTube = tabs.length > 0;
    
    // Start tracking if we weren't on YouTube before but are now
    if (!wasOnYouTube && isOnYouTube) {
      startTracking();
    }
    
    // Stop tracking if we were on YouTube before but aren't now
    if (wasOnYouTube && !isOnYouTube) {
      stopTracking();
    }
  });
}

// Start the time tracking
function startTracking() {
  if (trackingInterval === null) {
    trackingInterval = setInterval(incrementTime, 1000);
  }
}

// Stop the time tracking
function stopTracking() {
  if (trackingInterval !== null) {
    clearInterval(trackingInterval);
    trackingInterval = null;
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
      chrome.storage.local.set({
        youtubeTime: 1, // Start with 1 second
        lastResetDate: currentDate
      });
    } else {
      // Increment existing counter
      chrome.storage.local.set({
        youtubeTime: timeCount + 1,
        lastResetDate: currentDate
      });
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
checkForYouTubeTabs();

// Also initialize storage with today's date if needed
const currentDate = new Date().toDateString();
chrome.storage.local.get('lastResetDate', function(data) {
  if (!data.lastResetDate) {
    chrome.storage.local.set({
      youtubeTime: 0,
      lastResetDate: currentDate
    });
  }
});