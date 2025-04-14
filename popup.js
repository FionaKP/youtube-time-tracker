document.addEventListener('DOMContentLoaded', function() {
    // Get the timer display element
    const timerElement = document.getElementById('timer');
    const resetBtn = document.getElementById('resetBtn');
    
    // Update the timer display with the current value from storage
    function updateTimerDisplay() {
      chrome.storage.local.get(['youtubeTime', 'lastResetDate'], function(data) {
        const currentDate = new Date().toDateString();
        
        // Check if we need to reset for a new day
        if (data.lastResetDate !== currentDate) {
          // It's a new day, reset the timer
          chrome.storage.local.set({
            youtubeTime: 0,
            lastResetDate: currentDate
          });
          timerElement.textContent = '00:00:00';
        } else {
          // Display saved time
          const seconds = data.youtubeTime || 0;
          timerElement.textContent = formatTime(seconds);
        }
      });
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
    
    // Reset button handler
    resetBtn.addEventListener('click', function() {
      const currentDate = new Date().toDateString();
      chrome.storage.local.set({
        youtubeTime: 0,
        lastResetDate: currentDate
      });
      timerElement.textContent = '00:00:00';
    });
    
    // Initialize the display
    updateTimerDisplay();
    
    // Refresh the display every second to show real-time updates
    setInterval(updateTimerDisplay, 1000);
  });