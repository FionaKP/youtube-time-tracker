const contextualMessages = {
  // Short sessions (5-15 minutes)
  short: [
    // 5–8
    { time: 5, message: "Enough time to brew a cup of coffee ☕", emoji: "☕" },
    { time: 5, message: "About the time it takes to stretch and loosen up 🧘", emoji: "🧘" },
    { time: 6, message: "You've watched enough time to soft-boil an egg 🥚", emoji: "🥚" },
    { time: 6, message: "Roughly long enough to wash a sink full of dishes 🍽️", emoji: "🍽️" },
    { time: 7, message: "That's one full shower worth of YouTube 🚿", emoji: "🚿" },
    { time: 7, message: "About the time to take the trash out and tidy a room 🗑️", emoji: "🗑️" },
    { time: 8, message: "Enough time to send 3 important texts you’ve been avoiding 📲", emoji: "📲" },
    { time: 8, message: "You could've done a quick posture reset + neck stretch 🧍", emoji: "🧍" },

    // 9–12
    { time: 9, message: "About the time to make oatmeal + clean up 🥣", emoji: "🥣" },
    { time: 9, message: "You could’ve walked ~0.5 mile at an easy pace 🚶", emoji: "🚶" },
    { time: 10, message: "You could've walked a mile in this time 🚶", emoji: "🚶" },
    { time: 10, message: "Time to listen to 'All Too Well (10 Minute Version)' 🎵", emoji: "🎵" },
    { time: 10, message: "Enough time to run a quick set of stairs and get your heart rate up 🏃", emoji: "🏃" },
    { time: 11, message: "About the time to pack tomorrow’s lunch 🥪", emoji: "🥪" },
    { time: 11, message: "Enough time to wipe counters, load dishwasher, and reset the kitchen 🧼", emoji: "🧼" },
    { time: 12, message: "You've been here longer than a typical coffee break ☕", emoji: "☕" },
    { time: 12, message: "About the time to fold a basket of laundry 👕", emoji: "👕" },

    // 13–15
    { time: 13, message: "You could’ve knocked out a short breathing + mindfulness reset 🌿", emoji: "🌿" },
    { time: 13, message: "Enough time to plan your day (top 3 tasks) and actually start one ✅", emoji: "✅" },
    { time: 14, message: "About the time to walk the dog around the block (and a little extra) 🐕", emoji: "🐕" },
    { time: 14, message: "Roughly long enough to do a quick core circuit 🧱", emoji: "🧱" },
    { time: 15, message: "That's a full episode of The Office! 📺", emoji: "📺" },
    { time: 15, message: "You could've meditated for 15 minutes instead 🧘", emoji: "🧘" },
    { time: 15, message: "Enough time to do a brisk 15-minute walk 🚶‍♀️", emoji: "🚶‍♀️" },

    // Multiples / fractions flavor (still short)
    { time: 6, message: "That’s ~12× longer than the average person can hold their breath 😮‍💨", emoji: "😮‍💨" },
    { time: 10, message: "That’s ~20× longer than the average breath-hold 😮‍💨", emoji: "😮‍💨" },
    { time: 15, message: "That’s ~30× longer than the average breath-hold 😮‍💨", emoji: "😮‍💨" },
  ],

  // Medium sessions (16-40 minutes)
  medium: [
    // 16–20
    { time: 16, message: "Enough time for a quick neighborhood loop walk 🚶", emoji: "🚶" },
    { time: 16, message: "You could’ve done a mobility session and felt brand new 🧘‍♂️", emoji: "🧘‍♂️" },
    { time: 18, message: "About the time to do a focused clean of one room 🧹", emoji: "🧹" },
    { time: 18, message: "Roughly enough time to prep veggies for the week 🥕", emoji: "🥕" },
    { time: 20, message: "You could've done a quick workout 💪", emoji: "💪" },
    { time: 20, message: "About the time to walk ~1 mile at a relaxed pace 🚶‍♂️", emoji: "🚶‍♂️" },
    { time: 20, message: "Enough time to read a solid article and remember it 📰", emoji: "📰" },

    // 21–25
    { time: 21, message: "You could’ve done a short strength circuit (push/pull/legs) 🏋️‍♀️", emoji: "🏋️‍♀️" },
    { time: 22, message: "That's enough time to cook a simple dinner 🍳", emoji: "🍳" },
    { time: 22, message: "Enough time to call someone and actually catch up 📞", emoji: "📞" },
    { time: 23, message: "Roughly enough time to grocery-list + order pickup 🛒", emoji: "🛒" },
    { time: 24, message: "About the time to do a quick jog (and cool down) 🏃‍♀️", emoji: "🏃‍♀️" },
    { time: 25, message: "You've been watching for a sitcom episode + commercials 📺", emoji: "📺" },
    { time: 25, message: "Enough time to vacuum the main areas and feel accomplished 🧹", emoji: "🧹" },

    // 26–30
    { time: 26, message: "That's 2.6 'All Too Well (10 Minute Versions)' 🎵", emoji: "🎵" },
    { time: 26, message: "Enough time to do a “quick errands run” (post office / drop-off) 📮", emoji: "📮" },
    { time: 28, message: "Roughly enough time to take a brisk 2-mile walk 🚶‍♀️", emoji: "🚶‍♀️" },
    { time: 28, message: "Enough time to clean the bathroom sink + mirror properly 🪞", emoji: "🪞" },
    { time: 30, message: "Half an hour! Time flies when you're scrolling ⏰", emoji: "⏰" },
    { time: 30, message: "You could've taken a power nap 😴", emoji: "😴" },
    { time: 30, message: "About 1/2 the time of a typical 60-minute meeting 🧑‍💼", emoji: "🧑‍💼" },
    { time: 30, message: "That’s ~60× longer than the average breath-hold 😮‍💨", emoji: "😮‍💨" },

    // 31–35
    { time: 32, message: "Enough time to do a solid HIIT session (and regret it a little) 🥵", emoji: "🥵" },
    { time: 33, message: "Roughly enough time to start laundry, swap it, and fold a bit 🧺", emoji: "🧺" },
    { time: 34, message: "Enough time to cook rice, prep protein, and make tomorrow easy 🍱", emoji: "🍱" },
    { time: 35, message: "That's a full yoga session worth of time 🧘‍♀️", emoji: "🧘‍♀️" },
    { time: 35, message: "Enough time to knock out a short run (~3–4 miles for many runners) 🏃", emoji: "🏃" },

    // 36–40
    { time: 36, message: "You could’ve watched a full documentary episode 🎥", emoji: "🎥" },
    { time: 38, message: "Roughly enough time to do a proper warm-up + lift session 🏋️", emoji: "🏋️" },
    { time: 40, message: "You could've read 20 pages of a book 📚", emoji: "📚" },
    { time: 40, message: "Enough time to meal-prep one full meal for later 🍲", emoji: "🍲" },

    // Multiples / fractions + travel-ish
    { time: 20, message: "That’s ~1/6 of a Back to the Future 🍿", emoji: "🍿" },
    { time: 30, message: "That’s ~1/4 of a Toy Story 3 🍿", emoji: "🍿" },
    { time: 40, message: "That’s a little less than ~1/2 of a inside out 🍿", emoji: "🍿" },
  ],

  // Long sessions (41-90 minutes)
  long: [
    // 41–50
    { time: 42, message: "Enough time to cook, eat, and clean up dinner 🍽️", emoji: "🍽️" },
    { time: 45, message: "Three quarters of an hour down the rabbit hole 🐰", emoji: "🐰" },
    { time: 45, message: "Roughly enough time for a solid 5K run (for many people) 🏃‍♂️", emoji: "🏃‍♂️" },
    { time: 47, message: "Enough time to grocery shop if you go in with a list 🛒", emoji: "🛒" },
    { time: 50, message: "That's a full college lecture! 🎓", emoji: "🎓" },
    { time: 50, message: "Enough time to deep-clean one area (kitchen or bathroom) 🧽", emoji: "🧽" },

    // 51–60
    { time: 52, message: "You could've watched an entire movie by now 🎬", emoji: "🎬" },
    { time: 55, message: "Enough time to do a full workout + cool down 🏋️‍♂️", emoji: "🏋️‍♂️" },
    { time: 58, message: "Roughly enough time to do a long dog walk + playtime 🐾", emoji: "🐾" },
    { time: 60, message: "A whole hour! You could've learned a new skill 🎯", emoji: "🎯" },
    { time: 60, message: "That’s ~120× longer than the average breath-hold 😮‍💨", emoji: "😮‍💨" },
    { time: 60, message: "That’s 2× a typical 30-minute power nap 😴", emoji: "😴" },

    // 61–75
    { time: 65, message: "That's longer than a soccer match ⚽", emoji: "⚽" },
    { time: 66, message: "Roughly enough time to read a serious chunk of a book 📖", emoji: "📖" },
    { time: 70, message: "You could've cleaned your entire apartment 🧹", emoji: "🧹" },
    { time: 72, message: "Enough time to do laundry start-to-finish (if you stay on it) 🧺", emoji: "🧺" },
    { time: 75, message: "That's 1.25 hours of your precious life ⌛", emoji: "⌛" },
    { time: 75, message: "That’s ~1/2 of a typical 2.5-hour long movie 🍿", emoji: "🍿" },

    // 76–90
    { time: 80, message: "Enough time for a long hike loop (short trail day) 🥾", emoji: "🥾" },
    { time: 82, message: "Roughly enough time to shop, cook, and portion lunches 🍱", emoji: "🍱" },
    { time: 85, message: "Enough time to do a full reset: tidy, dishes, laundry, counters ✨", emoji: "✨" },
    { time: 90, message: "90 minutes! You could've watched Titanic 🚢", emoji: "🚢" },
    { time: 90, message: "That’s 3× a 30-minute focus sprint 🎧", emoji: "🎧" },
    { time: 90, message: "That’s ~180× longer than the average breath-hold 😮‍💨", emoji: "😮‍💨" },
  ],

  // Very long sessions (91+ minutes)
  veryLong: [
    // 91–120
    { time: 95, message: "Enough time to do a full grocery run and put everything away 🛒", emoji: "🛒" },
    { time: 100, message: "That's the time to drive from Boston to Providence, RI 🚗", emoji: "🚗" },
    { time: 105, message: "Enough time to cook a real meal and do dishes properly 🍝", emoji: "🍝" },
    { time: 110, message: "That’s ~1/2 of a 3.5-hour long movie marathon 🍿", emoji: "🍿" },
    { time: 115, message: "Enough time for a long gym session + shower 🏋️‍♀️", emoji: "🏋️‍♀️" },
    { time: 120, message: "Two hours! You could've gone to the gym AND showered 🏋️", emoji: "🏋️" },
    { time: 120, message: "That’s 4× a 30-minute power nap 😴", emoji: "😴" },
    { time: 120, message: "That’s ~240× longer than the average breath-hold 😮‍💨", emoji: "😮‍💨" },

    // 121–150
    { time: 125, message: "Enough time to do a full house reset and still have energy left 🧹", emoji: "🧹" },
    { time: 130, message: "Roughly enough time to do a long hike plus a snack break 🥾", emoji: "🥾" },
    { time: 135, message: "You could've watched The Batman (2022) 🦇", emoji: "🦇" },
    { time: 140, message: "That’s 2× a typical 70-minute soccer match ⚽", emoji: "⚽" },
    { time: 145, message: "Enough time to meal-prep for several days 🥗", emoji: "🥗" },
    { time: 150, message: "2.5 hours... that's a flight from Boston to Miami ✈️", emoji: "✈️" },
    { time: 150, message: "That’s 5× a 30-minute focus sprint 🎧", emoji: "🎧" },

    // 151–200
    { time: 160, message: "Enough time to do a long workout, cook, and still clean up 💪", emoji: "💪" },
    { time: 170, message: "That’s ~1/2 of a typical cross-country flight (time in the air varies) ✈️", emoji: "✈️" },
    { time: 180, message: "Three hours! You could've driven from Boston to NYC 🗽", emoji: "🗽" },
    { time: 180, message: "That’s 6× a 30-minute power nap 😴", emoji: "😴" },
    { time: 180, message: "That’s ~360× longer than the average breath-hold 😮‍💨", emoji: "😮‍💨" },
    { time: 190, message: "Enough time to watch a movie and still have time for a walk 🎬", emoji: "🎬" },
    { time: 200, message: "That's longer than The Lord of the Rings: Extended Edition 🧙", emoji: "🧙" },

    // 201–300+
    { time: 210, message: "That’s 7× a 30-minute focus sprint 🎧", emoji: "🎧" },
    { time: 225, message: "Enough time to do a full deep clean of a small apartment 🧽", emoji: "🧽" },
    { time: 240, message: "Four hours! You could've binge-watched an entire season 📺", emoji: "📺" },
    { time: 240, message: "That’s 8× a 30-minute power nap 😴", emoji: "😴" },
    { time: 270, message: "Enough time to do a long hike and still grab food after 🥾", emoji: "🥾" },
    { time: 300, message: "Five hours. That’s a whole afternoon gone 🌅", emoji: "🌅" },
  ],

  // Seasonal / topical messages (sprinkled variety)
  seasonal: [
    { time: 18, message: "Enough time to wrap a few gifts (and lose the tape) 🎁", emoji: "🎁" },
    { time: 25, message: "You could’ve made hot chocolate and actually enjoyed it ☕", emoji: "☕" },
    { time: 35, message: "Enough time to shovel a small driveway (depending on snow) ❄️", emoji: "❄️" },

    { time: 48, message: "That's enough time to bake chocolate chip cookies 🍪", emoji: "🍪" },
    { time: 50, message: "Enough time to roast veggies and prep a cozy meal 🥘", emoji: "🥘" },
    { time: 55, message: "That's a full therapy session worth of YouTube 🛋️", emoji: "🛋️" },

    { time: 60, message: "Enough time to watch a holiday special and clean up after 🍿", emoji: "🍿" },
    { time: 75, message: "Enough time to decorate a small tree and untangle lights 🎄", emoji: "🎄" },
    { time: 80, message: "You could've meal-prepped for the entire week 🥗", emoji: "🥗" },

    { time: 90, message: "Enough time to cook a big batch meal for friends/family 🍲", emoji: "🍲" },
    { time: 120, message: "Enough time to make soup from scratch (and let it simmer) 🍲", emoji: "🍲" },
  ],
};
