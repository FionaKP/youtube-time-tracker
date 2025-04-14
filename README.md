# youtube-time-tracker
 Custom Chrome Extension with running timer of youtube watchtime

## Purpose
I love learning. I like to read articles, listen to podcasts, and watch videos to learn about new cool topics and hear the thoughts of people I admire and look up to. The problem with Youtube is that all of this good educational content is mixed in with some really great captivating and entertaining videos. Sometimes I can get carried away and the purpose of this chrome extension is to help me realize how much time I am spending on youtube. 

## File Structure
youtube-time-tracker/
├── manifest.json - tells the browser about the extension
├── popup.html - popup that is displayed when user clicks on extension
├── popup.js - handles the timer value when the popup is displayed
├── background.js - runs in background to track youtube activity across tabs
├── content.js - runs on youtube pages to communicate with background script
└── icon.png - extention icon image (made with canva logo generator)


### Potential Future Additions
* Add a badge to the extension with current time
* Make time comparisons (2 ATWTMVs, 1 half of a soccer game, etc)
* Use AI to tell you if the video fits into your inputted priorities
* Randomly timed popups asking if you would like to keep watching (like netflix)