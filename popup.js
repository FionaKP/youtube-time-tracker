document.addEventListener('DOMContentLoaded', function() {
  // Create a persistent connection to background script
  // When popup closes, this connection automatically disconnects
  const port = chrome.runtime.connect({ name: "popup" });
  
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
  // const contextBtn = document.getElementById('test-contextual-btn');
  
  // Stat elements
  const tabOpensElement = document.getElementById('tab-opens');
  const videosWatchedElement = document.getElementById('videos-watched');
  const activeTabsElement = document.getElementById('active-tabs');
  
  // Handle navigation
  seeMoreBtn.addEventListener('click', function() {
    mainScreen.classList.remove('active');
    detailsScreen.classList.add('active');
    updateStats(); // Update stats when showing details screen
    setupContextualButton(); // Add contextual button
  });
  
  backBtn.addEventListener('click', function() {
    detailsScreen.classList.remove('active');
    mainScreen.classList.add('active');
  });

  // contextBtn.addEventListener('click', function() {
  //   // Get current watch time to show appropriate message
  //   chrome.storage.local.get(['youtubeTime'], function(data) {
  //     const totalSeconds = data.youtubeTime || 60; // Default to 60 seconds if no time tracked
  //     const totalMinutes = Math.floor(totalSeconds / 60);
      
  //     // Send message to background script to trigger a contextual alert
  //     chrome.runtime.sendMessage({
  //       action: "testContextualAlert",
  //       currentMinutes: totalMinutes
  //     });
      
  //     // Visual feedback
  //     const btn = document.getElementById('test-contextual-btn');
  //     const originalText = btn.textContent;
  //     btn.textContent = '✓ Alert Sent!';
  //     btn.style.background = '#4CAF50';
      
  //     setTimeout(() => {
  //       btn.textContent = originalText;
  //       btn.style.background = '#667eea';
  //     }, 1500);
  //   });
  // });
  function setupContextualButton() {
    const contextBtn = document.getElementById('test-contextual-btn');
    
    // Check if button exists and doesn't already have a listener
    if (contextBtn && !contextBtn.dataset.listenerAdded) {
      contextBtn.dataset.listenerAdded = 'true'; // Prevent duplicate listeners
      
      contextBtn.addEventListener('click', function() {
        console.log('Contextual button clicked'); // Debug log
        
        // Get current watch time to show appropriate message
        chrome.storage.local.get(['youtubeTime'], function(data) {
          const totalSeconds = data.youtubeTime || 60;
          const totalMinutes = Math.floor(totalSeconds / 60);
          
          console.log(`Sending test alert for ${totalMinutes} minutes`); // Debug log
          
          // Send message to background script to trigger a contextual alert
          chrome.runtime.sendMessage({
            action: "testContextualAlert",
            currentMinutes: totalMinutes
          }, function(response) {
            console.log('Response from background:', response); // Debug log
            
            // Visual feedback
            const originalText = contextBtn.textContent;
            const originalBg = contextBtn.style.backgroundColor;
            
            if (response && response.success) {
              contextBtn.textContent = 'Alert Sent!';
              contextBtn.style.backgroundColor = '#4CAF50';
            } else {
              contextBtn.textContent = 'No YouTube tabs';
              contextBtn.style.backgroundColor = '#F44336';
            }
            
            setTimeout(() => {
              contextBtn.textContent = originalText;
              contextBtn.style.backgroundColor = originalBg || '#1a73e8';
            }, 1500);
          });
        });
      });
    }
  }

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