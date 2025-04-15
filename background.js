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
      incrementTabOpens();
      // Set badge background to red when actively tracking
      chrome.action.setBadgeBackgroundColor({ color: "#cc0000" });
    }
    
    // Stop tracking if we were on YouTube before but aren't now
    if (wasOnYouTube && !isOnYouTube) {
      stopTracking();
      // checkForVideoChange(tabs[0].url);
      // Set badge background to gray when not actively tracking
      chrome.action.setBadgeBackgroundColor({ color: "#888888" });
    }
  });
}

// Check if we've switched to a new video
function checkForVideoChange(url) {
  // Extract video ID from YouTube URL
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  
  if (videoIdMatch && videoIdMatch[1]) {
    const videoId = videoIdMatch[1];
    
    // If this is a different video than what we were watching
    if (videoId !== currentVideoId) {
      currentVideoId = videoId;
      
      // Add to our set of watched videos
      if (!watchedVideos.has(videoId)) {
        watchedVideos.add(videoId);
        
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
  } else {
    // Not on a video page
    currentVideoId = null;
  }
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
    
    // Log for debugging
    // console.log("Current time count:", timeCount);

    // Check if it's a new day
    if (data.lastResetDate !== currentDate) {
      // Reset for new day
      chrome.storage.local.set({
        youtubeTime: 1, // Start with 1 second
        lastResetDate: currentDate,
        tabOpens: 0,
        videosWatched: 0
      }, updateBadge);
    } else {
      // Increment existing counter
      chrome.storage.local.set({
        youtubeTime: timeCount + 1,
        lastResetDate: currentDate 
        // tabOpens: data.tabOpens || 0,
        // videosWatched: data.videosWatched || 0
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
      
      // Clear the watched videos set
      chrome.storage.local.set({ videosWatched: null });
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