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
      chrome.storage.local.set({
        youtubeTime: 1, // Start with 1 second
        lastResetDate: currentDate
      }, updateBadge);
    } else {
      // Increment existing counter
      chrome.storage.local.set({
        youtubeTime: timeCount + 1,
        lastResetDate: currentDate
      }, updateBadge);
    }
  });
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
  // Update the badge immediately on load
  updateBadge();
});