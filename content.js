// This script runs when a YouTube page is loaded

console.log("YouTube Time Tracker is active");

// Listen for video player events to better track actual video watching
// This helps distinguish between browsing YouTube and actually watching videos

let currentVideoId = null;
let currentUrl = window.location.href;

// Function to extract video ID from URL - improved for shorts and various formats
function getVideoIdFromUrl(url) {
  // Handle YouTube Shorts
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^"&?\/\s]{11})/);
  if (shortsMatch) return shortsMatch[1];
  
  // Handle regular YouTube videos
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return videoIdMatch ? videoIdMatch[1] : null;
}

// Function to handle URL/video changes
function handleUrlChange() {
  const newUrl = window.location.href;
  const newVideoId = getVideoIdFromUrl(newUrl);
  
  // If URL changed or video ID changed, we might be on a new video
  if (newUrl !== currentUrl || newVideoId !== currentVideoId) {
    currentUrl = newUrl;
    
    // Only send message if we have a valid video ID and it's different
    if (newVideoId && newVideoId !== currentVideoId) {
      currentVideoId = newVideoId;
      
      console.log("Video changed to:", currentVideoId);
      try {
        chrome.runtime.sendMessage({
          action: "videoChanged",
          videoId: currentVideoId
        });
      } catch (error) {
        console.log("Extension context invalidated, skipping message");
      }
    } else if (!newVideoId) {
      // Not on a video page anymore
      currentVideoId = null;
    }
  }
}

// Check for changes more frequently to catch rapid scrolling through shorts
setInterval(handleUrlChange, 500);

// Also listen for browser navigation events
window.addEventListener('popstate', handleUrlChange);

// Listen for YouTube's internal navigation (for single-page app behavior)
// YouTube uses pushState for navigation, so we need to override it
const originalPushState = history.pushState;
history.pushState = function() {
  originalPushState.apply(history, arguments);
  // Small delay to let the page update
  setTimeout(handleUrlChange, 100);
};

const originalReplaceState = history.replaceState;
history.replaceState = function() {
  originalReplaceState.apply(history, arguments);
  setTimeout(handleUrlChange, 100);
};

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "showRapidWatchingAlert") {
    showRapidWatchingModal(request.videoCount, request.totalTimeToday);
  } else if (request.action === "timeAlert30") {
    showTimeAlert('happy', '😊', '#4CAF50', '30 minutes', "Hey! Just letting you know you've watched 30 minutes of YouTube today!");
  } else if (request.action === "timeAlert45") {
    showTimeAlert('neutral', '😐', '#FF9800', '45 minutes', "Hey, you've watched YouTube for 45 minutes today. Maybe take a break?");
  } else if (request.action === "timeAlertHourly") {
    const totalHours = request.totalHours;
    const totalMinutes = request.totalMinutes;
    const timeText = totalHours >= 1 ? 
      `${totalHours} hour${totalHours > 1 ? 's' : ''} and ${totalMinutes % 60} minutes` :
      `${totalMinutes} minutes`;
    showTimeAlert('sad', '😞', '#F44336', timeText, `Hey, you've watched YouTube for ${timeText}. Check yourself and do something else!`);
  }
});

// Create and show the rapid watching modal
function showRapidWatchingModal(videoCount, timeToday) {
  // Remove existing modal if any
  const existingModal = document.getElementById('yt-tracker-modal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Format time display
  let timeDisplay;
  if (timeToday.hours > 0) {
    timeDisplay = `${timeToday.hours}h ${timeToday.minutes}m`;
  } else if (timeToday.minutes > 0) {
    timeDisplay = `${timeToday.minutes}m ${timeToday.seconds}s`;
  } else {
    timeDisplay = `${timeToday.seconds}s`;
  }
  
  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'yt-tracker-modal';
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Roboto', Arial, sans-serif;
  `;
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 30px;
    max-width: 450px;
    width: 90%;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  `;
  
  modalContent.innerHTML = `
    <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
    <h2 style="color: #cc0000; margin: 0 0 15px 0; font-size: 24px;">YouTube Rabbit Hole Alert!</h2>
    <p style="color: #333; font-size: 16px; margin: 15px 0;">
      You've watched <strong>${videoCount} videos</strong> in the last 5 minutes.
    </p>
    <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #666; font-size: 14px;">Time on YouTube today:</p>
      <p style="margin: 5px 0 0 0; color: #cc0000; font-size: 20px; font-weight: bold;">${timeDisplay}</p>
    </div>
    <p style="color: #555; font-size: 14px; margin: 20px 0;">
      Consider taking a break before going deeper down the rabbit hole!
    </p>
    <div style="margin-top: 25px;">
      <button id="yt-tracker-close-tab" style="
        background: #cc0000;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 14px;
        margin: 0 10px;
        cursor: pointer;
        font-weight: bold;
      ">Close Tab</button>
      <button id="yt-tracker-continue" style="
        background: #666;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 14px;
        margin: 0 10px;
        cursor: pointer;
      ">Continue Watching</button>
    </div>
    <div style="margin-top: 15px;">
      <button id="yt-tracker-snooze" style="
        background: transparent;
        color: #888;
        border: none;
        padding: 8px 16px;
        font-size: 12px;
        cursor: pointer;
        text-decoration: underline;
      ">Remind me in 10 minutes</button>
    </div>
  `;
  
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
  
  // Add button event listeners
  document.getElementById('yt-tracker-close-tab').onclick = function() {
    window.close();
  };
  
  document.getElementById('yt-tracker-continue').onclick = function() {
    modalOverlay.remove();
  };
  
  document.getElementById('yt-tracker-snooze').onclick = function() {
    try {
      chrome.runtime.sendMessage({action: "snoozeRapidWatching"});
      modalOverlay.remove();
    } catch (error) {
      console.log("Extension context invalidated, skipping snooze message");
      modalOverlay.remove();
    }
  };
  
  // Close modal when clicking overlay
  modalOverlay.onclick = function(e) {
    if (e.target === modalOverlay) {
      modalOverlay.remove();
    }
  };
  
  // Close modal with Escape key
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      modalOverlay.remove();
      document.removeEventListener('keydown', escapeHandler);
    }
  });
}

// Create and show time-based alerts
function showTimeAlert(mood, emoji, color, timeText, message) {
  // Remove existing modal if any
  const existingModal = document.getElementById('yt-tracker-modal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Create modal overlay
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'yt-tracker-modal';
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Roboto', Arial, sans-serif;
  `;
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 30px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    border: 3px solid ${color};
  `;
  
  modalContent.innerHTML = `
    <div style="font-size: 64px; margin-bottom: 20px;">${emoji}</div>
    <h2 style="color: ${color}; margin: 0 0 20px 0; font-size: 22px;">Time Check!</h2>
    <p style="color: #333; font-size: 16px; margin: 20px 0; line-height: 1.5;">
      ${message}
    </p>
    <div style="background: ${color}20; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid ${color}40;">
      <p style="margin: 0; color: ${color}; font-size: 18px; font-weight: bold;">${timeText}</p>
    </div>
    <div style="margin-top: 25px;">
      <button id="yt-tracker-time-ok" style="
        background: ${color};
        color: white;
        border: none;
        padding: 12px 32px;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        font-weight: bold;
      ">Got it!</button>
    </div>
  `;
  
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
  
  // Add button event listener
  document.getElementById('yt-tracker-time-ok').onclick = function() {
    modalOverlay.remove();
  };
  
  // Close modal when clicking overlay
  modalOverlay.onclick = function(e) {
    if (e.target === modalOverlay) {
      modalOverlay.remove();
    }
  };
  
  // Close modal with Escape key
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      modalOverlay.remove();
      document.removeEventListener('keydown', escapeHandler);
    }
  });
  
  // Auto-close after 10 seconds for time alerts
  setTimeout(() => {
    if (document.getElementById('yt-tracker-modal')) {
      modalOverlay.remove();
    }
  }, 10000);
}

// Optional: Monitor video play state for more accurate tracking
// This requires more complex implementation but would provide better data
// about active watching vs. having a paused video