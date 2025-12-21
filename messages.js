const contextualMessages = {
  // Short sessions (5-15 minutes)
  short: [
    { time: 6, message: "You've watched enough time to soft-boil an egg 🥚", emoji: "🥚" },
    { time: 7, message: "That's one full shower worth of YouTube 🚿", emoji: "🚿" },
    { time: 10, message: "You could've walked a mile in this time 🚶", emoji: "🚶" },
    { time: 10, message: "Time to listen to 'All Too Well (10 Minute Version)' 🎵", emoji: "🎵" },
    { time: 12, message: "You've been here longer than a typical coffee break ☕", emoji: "☕" },
    { time: 15, message: "That's a full episode of The Office! 📺", emoji: "📺" },
    { time: 15, message: "You could've meditated for 15 minutes instead 🧘", emoji: "🧘" },
  ],
  
  // Medium sessions (16-40 minutes)
  medium: [
    { time: 20, message: "You could've done a quick workout 💪", emoji: "💪" },
    { time: 22, message: "That's enough time to cook a simple dinner 🍳", emoji: "🍳" },
    { time: 25, message: "You've been watching for a sitcom episode + commercials 📺", emoji: "📺" },
    { time: 26, message: "That's 2.6 'All Too Well (10 Minute Versions)' 🎵", emoji: "🎵" },
    { time: 30, message: "Half an hour! Time flies when you're scrolling ⏰", emoji: "⏰" },
    { time: 30, message: "You could've taken a power nap 😴", emoji: "😴" },
    { time: 35, message: "That's a full yoga session worth of time 🧘‍♀️", emoji: "🧘‍♀️" },
    { time: 40, message: "You could've read 20 pages of a book 📚", emoji: "📚" },
  ],
  
  // Long sessions (41-90 minutes)
  long: [
    { time: 45, message: "Three quarters of an hour down the rabbit hole 🐰", emoji: "🐰" },
    { time: 50, message: "That's a full college lecture! 🎓", emoji: "🎓" },
    { time: 52, message: "You could've watched an entire movie by now 🎬", emoji: "🎬" },
    { time: 60, message: "A whole hour! You could've learned a new skill 🎯", emoji: "🎯" },
    { time: 65, message: "That's longer than a soccer match ⚽", emoji: "⚽" },
    { time: 70, message: "You could've cleaned your entire apartment 🧹", emoji: "🧹" },
    { time: 75, message: "That's 1.25 hours of your precious life ⌛", emoji: "⌛" },
    { time: 90, message: "90 minutes! You could've watched Titanic 🚢", emoji: "🚢" },
  ],
  
  // Very long sessions (91+ minutes)
  veryLong: [
    { time: 100, message: "That's the time to drive from Boston to Providence, RI 🚗", emoji: "🚗" },
    { time: 120, message: "Two hours! You could've gone to the gym AND showered 🏋️", emoji: "🏋️" },
    { time: 135, message: "You could've watched The Batman (2022) 🦇", emoji: "🦇" },
    { time: 150, message: "2.5 hours... that's a flight from Boston to Miami ✈️", emoji: "✈️" },
    { time: 180, message: "Three hours! You could've driven from Boston to NYC 🗽", emoji: "🗽" },
    { time: 200, message: "That's longer than The Lord of the Rings: Extended Edition 🧙", emoji: "🧙" },
    { time: 240, message: "Four hours! You could've binge-watched an entire season 📺", emoji: "📺" },
  ],
  
  // Add seasonal/topical messages
  seasonal: [
    { time: 48, message: "That's enough time to bake chocolate chip cookies 🍪", emoji: "🍪" },
    { time: 80, message: "You could've meal-prepped for the entire week 🥗", emoji: "🥗" },
    { time: 55, message: "That's a full therapy session worth of YouTube 🛋️", emoji: "🛋️" },
  ]
};