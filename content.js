// This script runs when a YouTube page is loaded

console.log("YouTube Time Tracker is active");

// Listen for video player events to better track actual video watching
// This helps distinguish between browsing YouTube and actually watching videos

let currentVideoId = null;

// Function to extract video ID from URL
function getVideoIdFromUrl(url) {
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return videoIdMatch ? videoIdMatch[1] : null;
}

// Check for video ID changes every second
setInterval(() => {
  const newVideoId = getVideoIdFromUrl(window.location.href);
  
  // If we've changed videos, notify the background script
  if (newVideoId !== currentVideoId) {
    currentVideoId = newVideoId;
    
    // Send message to background script about video change
    if (currentVideoId) {
      chrome.runtime.sendMessage({
        action: "videoChanged",
        videoId: currentVideoId
      });
    }
  }
}, 1000);

// Optional: Monitor video play state for more accurate tracking
// This requires more complex implementation but would provide better data
// about active watching vs. having a paused video