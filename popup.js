document.addEventListener('DOMContentLoaded', function() {
  // check if data is logged correctly
  chrome.storage.local.get(null, function(data) {
    console.log("All storage data:", data);
  });
    // Get UI elements
  const mainScreen = document.getElementById('main-screen');
  const detailsScreen = document.getElementById('details-screen');
  const seeMoreBtn = document.getElementById('see-more');
  const backBtn = document.getElementById('back-btn');
  const timerElement = document.getElementById('timer');
  const miniTimerElement = document.getElementById('mini-timer');
  const resetBtn = document.getElementById('resetBtn');
  
  // Stat elements
  const tabOpensElement = document.getElementById('tab-opens');
  const videosWatchedElement = document.getElementById('videos-watched');
  const activeTabsElement = document.getElementById('active-tabs');
  
  // Handle navigation
  seeMoreBtn.addEventListener('click', function() {
    mainScreen.classList.remove('active');
    detailsScreen.classList.add('active');
    updateStats(); // Update stats when showing details screen
  });
  
  backBtn.addEventListener('click', function() {
    detailsScreen.classList.remove('active');
    mainScreen.classList.add('active');
  });

  // Format seconds into HH:MM:SS
  function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  }
    
  // Update the timer display with the current value from storage
  function updateTimerDisplay() {
    chrome.storage.local.get(['youtubeTime', 'lastResetDate'], function(data) {
      const currentDate = new Date().toDateString();
      
      // Check if we need to reset for a new day
      if (data.lastResetDate !== currentDate) {
        // It's a new day, reset the timer
        chrome.storage.local.set({
          youtubeTime: 0,
          lastResetDate: currentDate, 
          tabOpens: 0,
          videosWatched: 0
        });
        timerElement.textContent = '00:00:00';
        miniTimerElement.textContent = '00:00:00';
      } else {
        // Display saved time
        const seconds = data.youtubeTime || 0;
        const formattedTime = formatTime(seconds);
        timerElement.textContent = formattedTime;
        miniTimerElement.textContent = formattedTime;
      }
    });
  }
  
  // Reset button handler
  resetBtn.addEventListener('click', function() {
    const currentDate = new Date().toDateString();
    chrome.storage.local.set({
      youtubeTime: 0,
      lastResetDate: currentDate, 
      tabOpens: 0,
      videosWatched: 0
    });
    timerElement.textContent = '00:00:00';
    miniTimerElement.textContent = '00:00:00';
  });

  // Listen for changes to the storage
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'local') {
      if (changes.youtubeTime) {
        updateTimerDisplay();
      }
      if (changes.tabOpens || changes.videosWatched) {
        updateStats();
      }
    }
  });

  // Update stats
  // Update the stats display
  function updateStats() {
    chrome.storage.local.get(['tabOpens', 'videosWatched'], function(data) {
      tabOpensElement.textContent = data.tabOpens || 0;
      console.log("UPDATE STATS Tab opens:", data.tabOpens);
      videosWatchedElement.textContent = data.videosWatched || 0;
      console.log("Videos watched:", data.videosWatched);
      
      // Count active YouTube tabs
      chrome.tabs.query({url: "*://*.youtube.com/*"}, function(tabs) {
        activeTabsElement.textContent = tabs.length;
      });
    });
  }
  
  // Initialize the display
  updateTimerDisplay();
  updateStats();
  
  // Refresh the display every second to show real-time updates
  setInterval(function() {
    updateTimerDisplay();
    // if (detailsScreen.classList.contains('active')) {
      updateStats();
    // }
  }, 1000);
});