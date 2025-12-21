// This script runs when a YouTube page is loaded

console.log("YouTube Time Tracker is active");

// Listen for video player events to better track actual video watching
// This helps distinguish between browsing YouTube and actually watching videos

let currentVideoId = null;
let currentUrl = window.location.href;
let rapidAlertIgnoreCount = 0;
const MAX_IGNORES = 3; // Close tab after 3 ignores

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
    // Pause video then show modal
    videoPause().then(() => {
      showRapidWatchingModal(request.videoCount, request.totalTimeToday);
    });
  } else if (request.action === "timeAlert30") {
    videoPause().then(() => {
      showTimeAlert('happy', '😊', '#4CAF50', '30 minutes', "Hey! Just letting you know you've watched 30 minutes of YouTube today!");
    });
  } else if (request.action === "timeAlert45") {
    videoPause().then(() => {
      showTimeAlert('neutral', '😐', '#FF9800', '45 minutes', "Hey, you've watched YouTube for 45 minutes today. Maybe take a break?");
    });
  } else if (request.action === "timeAlertHourly") {
    const totalHours = request.totalHours;
    const totalMinutes = request.totalMinutes;
    const timeText = totalHours >= 1 ? 
      `${totalHours} hour${totalHours > 1 ? 's' : ''} and ${totalMinutes % 60} minutes` :
      `${totalMinutes} minutes`;
    videoPause().then(() => {
      showTimeAlert('sad', '😞', '#F44336', timeText, `Hey, you've watched YouTube for ${timeText}. Check yourself and do something else!`);
    });
  } else if (request.action === "pauseVideo") {
    videoPause().then((success) => {
      sendResponse({success: success});
    });
    return true; // Important: keeps the message channel open for async response
  } else if (request.action === "resetIgnoreCount") {
    // Reset counter if user takes a break
    rapidAlertIgnoreCount = 0;
  } else if (request.action === "showContextualAlert") {
    showContextualNotification(
      request.message,
      request.emoji,
      request.totalMinutes
    );
  }
});

// Function to pause the YouTube video with retries
// Referenced but not copy of function from this repo: https://github.com/Hemmingsson/FacePause/tree/master
// More aggressive pause using YouTube's internal player
function videoPause(retries = 5, delay = 200) {
  return new Promise((resolve) => {
    const attemptPause = (attemptsLeft) => {
      try {
        // Method 1: Use YouTube's player API (most reliable on modern YouTube)
        const player = document.getElementById('movie_player');
        if (player) {
          // Try multiple API methods
          if (typeof player.pauseVideo === 'function') {
            player.pauseVideo();
            console.log("Paused via player.pauseVideo()");
            resolve(true);
            return;
          }
          
          if (typeof player.stopVideo === 'function') {
            player.stopVideo();
            console.log("Stopped via player.stopVideo()");
            resolve(true);
            return;
          }
        }
        
        // Method 2: Direct video element manipulation
        const videoElements = document.querySelectorAll('video');
        let pausedAny = false;
        
        videoElements.forEach((video, index) => {
          console.log(`Video ${index}: currentTime=${video.currentTime}, paused=${video.paused}, readyState=${video.readyState}`);
          
          // Pause all video elements found
          if (video.currentTime > 0 || !video.paused) {
            video.pause();
            pausedAny = true;
            console.log(`Paused video element ${index}`);
          }
        });
        
        if (pausedAny || videoElements.length > 0) {
          resolve(true);
          return;
        }
        
        // Retry if needed
        if (attemptsLeft > 0) {
          console.log(`Retrying... (${attemptsLeft} attempts left)`);
          setTimeout(() => attemptPause(attemptsLeft - 1), delay);
        } else {
          console.log("Failed to pause after all retries");
          resolve(false);
        }
      } catch (error) {
        console.error("Error pausing video:", error);
        if (attemptsLeft > 0) {
          setTimeout(() => attemptPause(attemptsLeft - 1), delay);
        } else {
          resolve(false);
        }
      }
    };
    
    attemptPause(retries);
  });
}

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

  const warningText = rapidAlertIgnoreCount > 0 
  ? `<p style="color: #ff5722; font-weight: bold; margin-top: 10px;">
       ⚠️ Warnings: ${rapidAlertIgnoreCount}/${MAX_IGNORES} - Tab will close after ${MAX_IGNORES - rapidAlertIgnoreCount} more ignore(s)
     </p>`
  : '';
  
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
    ${warningText} 
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
    rapidAlertIgnoreCount = 0; // Reset since they're taking action
    chrome.runtime.sendMessage({action: "forceCloseTab"});
  };
  
  // Increment Ignore Count and Check if MAX_IGNORES reached
  document.getElementById('yt-tracker-continue').onclick = function() {
    rapidAlertIgnoreCount++;
    console.log(`Rapid alert ignored ${rapidAlertIgnoreCount} times`);
    
    if (rapidAlertIgnoreCount >= MAX_IGNORES) {
      // Send message to background script to close the tab
      try {
        chrome.runtime.sendMessage({
          action: "forceCloseTab",
          reason: "Too many rapid watching alerts ignored"
        });
      } catch (error) {
        console.log("Could not send close tab message:", error);
      }
    } else {
      // Show warning if approaching limit
      if (rapidAlertIgnoreCount === MAX_IGNORES - 1) {
        alert(`Warning: This is your last chance! The tab will close automatically if you ignore the next alert.`);
      }
      modalOverlay.remove();
    }
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
  
  // Auto-close after 15 seconds for time alerts
  setTimeout(() => {
    if (document.getElementById('yt-tracker-modal')) {
      modalOverlay.remove();
    }
  }, 15000);
}

function showContextualNotification(message, emoji, totalMinutes) {
  // Remove any existing contextual notification
  const existing = document.getElementById('yt-contextual-notification');
  if (existing) existing.remove();
  
  // Determine color based on watch time
  let accentColor, backgroundColor;
  if (totalMinutes < 30) {
    accentColor = '#4CAF50'; // Green for short sessions
    backgroundColor = '#4CAF5020';
  } else if (totalMinutes < 60) {
    accentColor = '#FF9800'; // Orange for medium sessions
    backgroundColor = '#FF980020';
  } else {
    accentColor = '#F44336'; // Red for long sessions
    backgroundColor = '#F4433620';
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'yt-contextual-notification';
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    color: #333;
    padding: 25px;
    border-radius: 12px;
    border: 3px solid ${accentColor};
    z-index: 9999;
    font-family: 'Roboto', Arial, sans-serif;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    max-width: 420px;
    min-height: 140px;
    animation: slideInUp 0.5s ease-out;
    transition: transform 0.2s, box-shadow 0.2s;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: stretch; gap: 20px; min-height: 120px;">
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="font-size: 11px; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; color: ${accentColor}; font-weight: bold;">
            TIME CHECK
          </div>
          <div style="font-size: 16px; font-weight: 600; line-height: 1.5; color: #333; margin-bottom: 15px;">
            ${message}
          </div>
        </div>
        <div style="background: ${backgroundColor}; padding: 10px 14px; border-radius: 8px; border: 1px solid ${accentColor}40;">
          <span style="font-size: 13px; color: ${accentColor}; font-weight: bold;">Total today: ${totalMinutes} minute${totalMinutes !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 80px;">
        <div style="font-size: 72px; line-height: 1;">${emoji}</div>
      </div>
      <button id="yt-contextual-close" style="
        position: absolute;
        top: 12px;
        right: 12px;
        background: #f0f0f0;
        border: none;
        color: #666;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 22px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        line-height: 1;
        padding: 0;
      ">×</button>
    </div>
  `;
  
  // Add animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInUp {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutDown {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(100px);
        opacity: 0;
      }
    }
    
    #yt-contextual-notification:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
    }
    
    #yt-contextual-close:hover {
      background: #e0e0e0;
      color: #333;
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Close button with proper event handling
  const closeBtn = document.getElementById('yt-contextual-close');
  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    notification.style.animation = 'slideOutDown 0.3s ease-out forwards';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  });
  
  // Click notification body to dismiss (optional)
  notification.addEventListener('click', function(e) {
    if (e.target.id !== 'yt-contextual-close') {
      notification.style.animation = 'slideOutDown 0.3s ease-out forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  });
  
  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    if (document.getElementById('yt-contextual-notification')) {
      notification.style.animation = 'slideOutDown 0.3s ease-out forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 10000);
}