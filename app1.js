   // --- Firebase 11.6.1 Imports ---
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, doc, getDoc, collection, query, getDocs, limit, orderBy, setLogLevel } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        // --- Firebase Config (From your files) ---
        const FIREBASE_CONFIG = {
            apiKey: "AIzaSyAc4_dlsV6qmzmiialiaiyzg9OzQ1FIVsE",
            authDomain: "surakshanetdei.firebaseapp.com",
            projectId: "surakshanetdei",
            storageBucket: "surakshanetdei.firebasestorage.app",
            messagingSenderId: "140455865217",
            appId: "1:140455865217:web:1f33162515bea371d1d680"
        };
        
        // --- Global State ---
        const state = {
            db: null,
            auth: null,
            userId: null,
            username: localStorage.getItem('surakshaNetUser') || null,
            language: localStorage.getItem('surakshaNetLang') || 'en',
            quizHighScore: 0,
            callGamePlays: 0,
            recentlyPlayed: JSON.parse(localStorage.getItem('surakshaNetRecent')) || [],
        };
        
        // --- Internationalization (i18n) ---
        const UI_TEXT = {
            en: {
                connecting: "CONNECTING TO SURAKSHA-NET...",
                auth: "AUTHENTICATING AGENT...",
                fetch: "LOADING USER DATA...",
                ready: "AGENT PROFILE LOADED.",
                welcome: "Welcome to SURAKSHA NET",
                enterNamePrompt: "Please enter your name to begin.",
                callsign: "Your Name:",
                engage: "Engage",
                welcomeBack: (name) => `Welcome back, ${name}!`,
                recent: "Recently Played",
                modules: "Game Modules",
                stats: "Your Stats",
                statQuiz: "Quiz High Score",
                statCall: "Call Sims Played",
                played: "Played",
                gameTitleCall: "The Scammer's Call",
    gameDescCall: "Can you outsmart a live scammer in a call?",

    gameTitleQuiz: "Multilingual Quiz",
    gameDescQuiz: "Test your cyber security knowledge.",

    gameTitleVideo: "CyberRakshak",
    gameDescVideo: "Watch interactive, scenario-based videos about common cyber threats.",

    gameTitleCards: "JagruktaCards",
    gameDescCards: "Flip cards to unveil data privacy & cyber hygiene tips.",

    gameTitleAnalyzer: "HelpCircle",
    gameDescAnalyzer: "Check suspicious content and get smart chat assistance."
            },
            hi: {
                connecting: "सुरक्षा-नेट से कनेक्ट हो रहा है...",
                auth: "एजेंट को प्रमाणित किया जा रहा है...",
                fetch: "उपयोगकर्ता डेटा लोड हो रहा है...",
                ready: "एजेंट प्रोफ़ाइल लोड हो गई।",
                welcome: "सुरक्षा नेट में आपका स्वागत है",
                enterNamePrompt: "शुरू करने के लिए कृपया अपना नाम दर्ज करें।",
                callsign: "आपका नाम:",
                engage: "शुरू करें",
                welcomeBack: (name) => `वापस स्वागत है, ${name}!`,
                recent: "हाल ही में खेला गया",
                modules: "गेम मॉड्यूल",
                stats: "आपके आँकड़े",
                statQuiz: "प्रश्नोत्तरी उच्च स्कोर",
                statCall: "स्कैम कॉल खेले गए",
                played: "खेला गया",
                gameTitleCall: "स्कैम कॉल गेम",
    gameDescCall: "क्या आप एक स्कैमर को कॉल पर हरा सकते हैं?",

    gameTitleQuiz: "बहुभाषी प्रश्नोत्तरी",
    gameDescQuiz: "अपनी साइबर सुरक्षा जानकारी का परीक्षण करें।",

    gameTitleVideo: "साइबर रक्षक",
    gameDescVideo: "सामान्य साइबर खतरों पर इंटरएक्टिव वीडियो देखें।",

    gameTitleCards: "जागरूकता कार्ड्स",
    gameDescCards: "डेटा गोपनीयता और साइबर हाइजीन टिप्स जानने के लिए कार्ड पलटें।",

    gameTitleAnalyzer: "हेल्पसर्कल",
    gameDescAnalyzer: "संदिग्ध सामग्री की जांच करें और स्मार्ट सहायता प्राप्त करें।"
            }
        };

        function t(key, ...args) {
            const langPack = UI_TEXT[state.language] || UI_TEXT['en'];
            const text = langPack[key];
            if (typeof text === 'function') {
                return text(...args);
            }
            return text || key;
        }

        // --- Audio Manager ---
        const audioManager = {
            isInitialized: false, synths: {},
            async init() {
                if (this.isInitialized) return;
                await Tone.start();
                this.synths.click = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.1 } }).toDestination();
                this.synths.boot = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.01, decay: 0.05, sustain: 0, release: 0.1 } }).toDestination();
                this.synths.login = new Tone.PolySynth(Tone.Synth).toDestination();
                this.isInitialized = true;
            },
            play(soundName) {
                if (!this.isInitialized) return;
                try {
                    const now = Tone.now();
                    if (soundName === 'click') this.synths.click.triggerAttackRelease("C5", "8n", now);
                    if (soundName === 'boot') this.synths.boot.triggerAttackRelease("G2", "32n", now);
                    if (soundName === 'login') this.synths.login.triggerAttackRelease(["C5", "E5", "G5"], "4n", now);
                } catch (e) { console.warn(`Audio play failed: ${e.message}`); }
            }
        };

        // --- App Initialization ---
        document.addEventListener('DOMContentLoaded', () => {
            document.body.addEventListener('click', () => audioManager.init(), { once: true });
            
            runParticleAnimation();
            
            document.getElementById('lang-select').value = state.language;
            updateAllText();
            
            if (state.username) {
                initFirebase();
            } else {
                document.getElementById('loading-overlay').classList.add('hidden');
                document.getElementById('login-modal').classList.remove('hidden');
            }
            
            attachListeners();
        });

        // --- Event Listeners ---
        function attachListeners() {
            // Login
            document.getElementById('login-btn').addEventListener('click', () => {
                const usernameInput = document.getElementById('username-input');
                const name = usernameInput.value.trim();
                if (name.length > 1) {
                    audioManager.play('login');
                    state.username = name;
                    localStorage.setItem('surakshaNetUser', name);
                    document.getElementById('login-modal').classList.add('hidden');
                    document.getElementById('loading-overlay').classList.remove('hidden');
                    initFirebase();
                } else {
                    usernameInput.focus();
                }
            });

            // Logout
            document.getElementById('logout-btn').addEventListener('click', () => {
                audioManager.play('click');
                state.username = null;
                localStorage.removeItem('surakshaNetUser');
                localStorage.removeItem('surakshaNetRecent');
                document.getElementById('app').classList.add('hidden');
                document.getElementById('login-modal').classList.remove('hidden');
            });

            // Language
            document.getElementById('lang-select').addEventListener('change', (e) => {
                audioManager.play('click');
                state.language = e.target.value;
                localStorage.setItem('surakshaNetLang', state.language);
                updateAllText();
                renderRecentlyPlayed(); // Re-render names in new language
            });

            // Game Card Clicks
            document.querySelectorAll('.game-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    audioManager.play('click');
                    const gameId = card.dataset.gameId;
                    const gameName = state.language === 'hi' ? card.dataset.gameNameHi : card.dataset.gameNameEn;
                    const icon = card.querySelector('.card-icon i').className;
                    
                    if (gameId && gameName && icon) {
                        updateRecentlyPlayed(gameId, gameName, icon);
                    }
                    // Note: The `href` on the <a> tag handles the navigation
                });
            });
        }
        
        // --- Boot & Firebase ---
        function startBootSequence() {
            const container = document.getElementById('boot-sequence');
            if (!container) return;
            const lines = ['connecting', 'auth', 'fetch', 'ready'];
            let index = 0;
            function addLine() {
                if (index < lines.length) {
                    audioManager.play('boot');
                    const div = document.createElement('div');
                    div.textContent = t(lines[index]);
                    div.style.animationDelay = `${index * 0.1}s`;
                    container.appendChild(div);
                    index++;
                    setTimeout(addLine, index === lines.length - 1 ? 1000 : 300);
                } else {
                    // Boot sequence finished
                    document.getElementById('loading-overlay').classList.add('hidden');
                    document.getElementById('app').classList.remove('hidden');
                    renderDashboard();
                }
            }
            addLine();
        }

        async function initFirebase() {
            try {
                const app = initializeApp(FIREBASE_CONFIG);
                state.db = getFirestore(app);
                state.auth = getAuth(app);
                state.appId = FIREBASE_CONFIG.appId; 
                setLogLevel('Debug');
    
                onAuthStateChanged(state.auth, async (user) => {
                    if (user) { 
                        state.userId = user.uid; 
                    } else {
                        try { 
                            await signInAnonymously(state.auth); 
                            return; 
                        } catch (authError) { 
                            console.error("Anonymous auth failed:", authError); 
                            return;
                        }
                    }
                    
                    if (state.userId) {
                        await loadUserData(); // Fetch scores
                        startBootSequence(); // Start UI boot
                    }
                });
            } catch (error) {
                console.error("Error initializing Firebase:", error);
            }
        }

        // --- Data Fetching ---
        async function loadUserData() {
            if (!state.db || !state.userId || !state.appId) return;

            try {
                // 1. Fetch Fake Call Game data
                const callDocRef = doc(state.db, `/artifacts/${state.appId}/users/${state.userId}/cyberGame/gameData`);
                const callDocSnap = await getDoc(callDocRef);
                if (callDocSnap.exists()) {
                    const data = callDocSnap.data();
                    state.callGamePlays = (data.playedScenarioIndices || []).length;
                }

                // 2. Fetch Quiz Game data
                const quizScoresRef = collection(state.db, `/artifacts/${state.appId}/users/${state.userId}/game-quiz-scores`);
                // Query for the highest score, ordered by score descending, limit 1
                const q = query(quizScoresRef, orderBy("score", "desc"), limit(1));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    state.quizHighScore = querySnapshot.docs[0].data().score || 0;
                }
                
                console.log("User data loaded:", state);
                
            } catch (e) {
                console.error("Error loading user data:", e);
            }
        }
        
        // --- UI Rendering ---
        function renderDashboard() {
            // Update Welcome Message
            document.getElementById('username-display').textContent = state.username;
            document.getElementById('welcome-msg').textContent = t('welcomeBack', state.username);
            
            // Update Stats
            document.getElementById('quiz-score').textContent = state.quizHighScore;
            document.getElementById('call-plays').textContent = state.callGamePlays;
            
            // Show "Played" badges
            if (state.quizHighScore > 0) {
                document.getElementById('played-quiz').classList.remove('hidden');
            }
            if (state.callGamePlays > 0) {
                document.getElementById('played-call').classList.remove('hidden');
            }
            
            // Render Recently Played
            renderRecentlyPlayed();
        }

        function renderRecentlyPlayed() {
            const container = document.getElementById('recent-container');
            const section = document.getElementById('recent-section');
            container.innerHTML = '';
            
            if (state.recentlyPlayed.length === 0) {
                section.classList.add('hidden');
                return;
            }
            
            section.classList.remove('hidden');
            
            state.recentlyPlayed.forEach(game => {
                // Determine the correct name based on the current language
                const cardEl = document.querySelector(`.game-card[data-game-id="${game.id}"]`);
                let gameName = game.name; // Fallback
                if (cardEl) {
                     gameName = state.language === 'hi' ? cardEl.dataset.gameNameHi : cardEl.dataset.gameNameEn;
                }

                container.innerHTML += `
                    <a href="${game.id}.html" class="recent-card">
                        <div class="flex items-center">
                            <i class="${game.icon} icon"></i>
                            <span class="name">${gameName}</span>
                        </div>
                    </a>
                `;
            });
        }

        function updateAllText() {
            document.querySelectorAll('[data-lang-key]').forEach(el => {
                const key = el.dataset.langKey;
                el.textContent = t(key);
            });
            // Handle dynamic text
            document.getElementById('welcome-msg').textContent = t('welcomeBack', state.username);
        }

        // --- Recently Played Logic ---
        function updateRecentlyPlayed(gameId, gameName, iconClass) {
            // 1. Remove if exists
            let recent = state.recentlyPlayed.filter(item => item.id !== gameId);
            
            // 2. Add to front
            recent.unshift({ id: gameId, name: gameName, icon: iconClass });
            
            // 3. Limit to 3
            recent = recent.slice(0, 3);
            
            // 4. Save
            state.recentlyPlayed = recent;
            localStorage.setItem('surakshaNetRecent', JSON.stringify(recent));
        }

        // --- Particle Animation ---
        function runParticleAnimation() {
            const canvas = document.getElementById('particle-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let particles = [];
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
            
            function createParticle() {
                const x = Math.random() * canvas.width; const y = Math.random() * canvas.height;
                const size = Math.random() * 2 + 1;
                const speedX = (Math.random() * 0.2) - 0.1; const speedY = (Math.random() * 0.2) - 0.1;
                particles.push({ x, y, size, speedX, speedY });
            }
            for (let i = 0; i < 100; i++) { createParticle(); }
            
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < particles.length; i++) {
                    let p = particles[i];
                    p.x += p.speedX; p.y += p.speedY;
                    if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
                    if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
                    ctx.fillStyle = 'rgba(100, 230, 255, 0.3)';
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
                }
                requestAnimationFrame(animate);
            }
            animate();
        }
