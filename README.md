# SurakshaNet
Gamified Digital Safety Literacy Platform for Rural Adolescents
**File Structure**
suraksha-net/
│
├── index.html                     → Main landing page (Home, Play, Dashboard buttons)
├── style.css                      → Global styles (fonts, theme, shared components)
├── main.js                        → Main JS for navigation, global coin logic, etc.
│
├── /assets/                       → Common images, sounds, icons
│    ├── logo.png
│    ├── bg-pattern.svg
│    ├── background.mp3
│    └── gameover.mp3
│
├── /games/                        → All 5 individual game folders
│    │
│    ├── cyberjungle/
│    │    ├── index.html           → Game UI (phishing quiz)
│    │    ├── game.js              → Game logic (questions, scoring)
│    │    ├── style.css            → Game-specific styles
│    │
│    ├── privacymaze/
│    │    ├── index.html
│    │    ├── game.js
│    │    ├── style.css
│    │
│    ├── factcheck/
│    │    ├── index.html
│    │    ├── game.js
│    │    ├── style.css
│    │
│    ├── safechat/
│    │    ├── index.html
│    │    ├── game.js
│    │    ├── style.css
│    │
│    └── digitaldetective/
│         ├── index.html
│         ├── game.js
│         ├── style.css
│
├── /scripts/                      → Shared Firebase + Gemini logic
│    ├── firebase-config.js        → Firebase keys and initialization
│    ├── firestore-utils.js        → Save/load user stats, coins, etc.
│    └── gemini-api.js             → Gemini question/quote generator
│
├── /pages/                        → Supporting app pages
│    ├── about.html
│    ├── leaderboard.html
│    ├── profile.html
│    └── help.html
│
├── firebase.json                  → Firebase Hosting config (which folder to host)
├── .firebaserc                    → Firebase project alias
├── README.md                      → Project overview, setup, and contributor guide
└── LICENSE                        → Optional (MIT or Creative Commons)
