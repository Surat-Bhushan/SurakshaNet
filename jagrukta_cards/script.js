// Game state
const gameState = {
    currentScreen: 'home',
    cards: [],
    seenCards: 0,
    currentCardIndex: -1,
    quizCards: [],
    isQuizActive: false,
    isGameCompleted: false,
    isSpeaking: false,
    usedQuizCards: [],
    // Track which cards have been seen to prevent double-counting
    seenCardIndices: new Set(),
    // 15 Questions targeting Data & Privacy Literacy and Cyber Hygiene
    facts: [
        // Data & Privacy Literacy (8 questions)
        {
            text: "ऐप इंस्टॉल करते समय सिर्फ जरूरी परमिशन ही दें - लोकेशन, कॉन्टैक्ट्स, माइक्रोफोन जैसी परमिशन सोच-समझकर दें।",
            quiz: {
                question: "ऐप इंस्टॉल करते समय परमिशन के बारे में क्या सही है?",
                options: ["सभी परमिशन दे दें", "सिर्फ जरूरी परमिशन दें", "कोई परमिशन न दें", "बाद में परमिशन दें"],
                correct: 1
            }
        },
        {
            text: "वेबसाइट्स पर 'कुकीज़' स्वीकार करने से पहले सोचें - ये आपकी ब्राउज़िंग एक्टिविटी ट्रैक कर सकती हैं।",
            quiz: {
                question: "वेबसाइट की कुकीज़ के बारे में क्या सही है?",
                options: ["हमेशा स्वीकार करें", "कभी स्वीकार न करें", "समझकर स्वीकार करें", "सिर्फ मुफ्त वेबसाइट्स की कुकीज़ स्वीकार करें"],
                correct: 2
            }
        },
        {
            text: "सोशल मीडिया पर प्राइवेसी सेटिंग्स चेक करें - अपनी पोस्ट्स सिर्फ दोस्तों तक ही सीमित रखें।",
            quiz: {
                question: "सोशल मीडिया पर प्राइवेसी सेटिंग्स क्यों जरूरी हैं?",
                options: ["ऐप तेज चलता है", "डेटा सेव होता है", "निजी जानकारी सुरक्षित रहती है", "वीडियो बेहतर चलते हैं"],
                correct: 2
            }
        },
        {
            text: "किसी भी ऐप को अपना कॉन्टैक्ट लिस्ट एक्सेस करने की अनुमति न दें जब तक बहुत जरूरी न हो।",
            quiz: {
                question: "ऐप को कॉन्टैक्ट लिस्ट एक्सेस कब देना चाहिए?",
                options: ["हमेशा दें", "कभी न दें", "सिर्फ जरूरत पड़ने पर दें", "सिर्फ मुफ्त ऐप्स को दें"],
                correct: 2
            }
        },
        {
            text: "ऑनलाइन फॉर्म भरते समय सिर्फ जरूरी जानकारी ही शेयर करें - ज्यादा पर्सनल डिटेल्स न दें।",
            quiz: {
                question: "ऑनलाइन फॉर्म भरते समय क्या करना चाहिए?",
                options: ["सारी जानकारी दें", "सिर्फ जरूरी जानकारी दें", "झूठी जानकारी दें", "फॉर्म न भरें"],
                correct: 1
            }
        },
        {
            text: "अपने फोन में ऐप परमिशन्स रेगुलर चेक करते रहें - अनजान ऐप्स को अननैसरी परमिशन न दें।",
            quiz: {
                question: "ऐप परमिशन्स कितनी बार चेक करनी चाहिए?",
                options: ["कभी नहीं", "साल में एक बार", "रोज", "समय-समय पर चेक करते रहें"],
                correct: 3
            }
        },
        {
            text: "पब्लिक वाई-फाई पर बैंकिंग या शॉपिंग न करें - ये हैकर्स के लिए आसान टारगेट होते हैं।",
            quiz: {
                question: "पब्लिक वाई-फाई पर क्या नहीं करना चाहिए?",
                options: ["गेम खेलना", "वीडियो देखना", "बैंकिंग या शॉपिंग", "म्यूजिक सुनना"],
                correct: 2
            }
        },
        {
            text: "अनजान वेबसाइट्स पर अपना मोबाइल नंबर और ईमेल शेयर न करें - स्पैम और फ्रॉड का खतरा रहता है।",
            quiz: {
                question: "अनजान वेबसाइट्स पर क्या नहीं करना चाहिए?",
                options: ["वीडियो देखना", "मोबाइल नंबर शेयर करना", "आर्टिकल पढ़ना", "डाउनलोड करना"],
                correct: 1
            }
        },
        
        // Cyber Hygiene (7 questions)
        {
            text: "मजबूत पासवर्ड बनाएं - छोटे अक्षर, बड़े अक्षर, नंबर और स्पेशल करैक्टर का मिक्स उपयोग करें।",
            quiz: {
                question: "मजबूत पासवर्ड में क्या होना चाहिए?",
                options: ["सिर्फ नंबर", "नाम और जन्मतिथि", "अक्षर, नंबर और स्पेशल करैक्टर का मिक्स", "सिर्फ अक्षर"],
                correct: 2
            }
        },
        {
            text: "हर 3 महीने में अपने पासवर्ड बदलते रहें - एक ही पासवर्ड लंबे समय तक उपयोग न करें।",
            quiz: {
                question: "पासवर्ड कितने समय बाद बदलने चाहिए?",
                options: ["कभी नहीं", "हर साल", "हर 3 महीने", "हर हफ्ते"],
                correct: 2
            }
        },
        {
            text: "अपने फोन और ऐप्स को हमेशा अपडेट रखें - नए अपडेट में सिक्योरिटी फिक्स होते हैं।",
            quiz: {
                question: "फोन और ऐप्स को अपडेट क्यों रखना चाहिए?",
                options: ["नए फीचर्स के लिए", "सिक्योरिटी के लिए", "तेज चलने के लिए", "कम जगह लेने के लिए"],
                correct: 1
            }
        },
        {
            text: "अनजान लिंक्स पर क्लिक न करें - खासकर व्हाट्सएप और एसएमएस में आए लिंक्स पर।",
            quiz: {
                question: "अनजान लिंक्स पर क्या करना चाहिए?",
                options: ["हमेशा क्लिक करें", "कभी क्लिक न करें", "दोस्तों से पूछकर क्लिक करें", "सिर्फ दिन में क्लिक करें"],
                correct: 1
            }
        },
        {
            text: "अपने फोन में एंटीवायरस ऐप जरूर इंस्टॉल करें - ये मैलवेयर और वायरस से बचाता है।",
            quiz: {
                question: "एंटीवायरस ऐप क्यों जरूरी है?",
                options: ["फोन तेज चलता है", "मैलवेयर से बचाव होता है", "बैटरी बचती है", "इंटरनेट तेज चलता है"],
                correct: 1
            }
        },
        {
            text: "प्राइवेट ब्राउजिंग (इन्कॉग्निटो मोड) का उपयोग करें जब दूसरे के फोन या कंप्यूटर पर ब्राउज करें।",
            quiz: {
                question: "इन्कॉग्निटो मोड कब उपयोग करना चाहिए?",
                options: ["हमेशा", "कभी नहीं", "दूसरे के डिवाइस पर ब्राउज करते समय", "सिर्फ वीडियो देखते समय"],
                correct: 2
            }
        },
        {
            text: "हर अकाउंट के लिए अलग-अलग पासवर्ड उपयोग करें - एक ही पासवर्ड सभी जगह उपयोग न करें।",
            quiz: {
                question: "अलग-अलग अकाउंट्स के लिए पासवर्ड कैसे होने चाहिए?",
                options: ["सबका एक ही पासवर्ड", "अलग-अलग पासवर्ड", "पासवर्ड न रखें", "सिर्फ नंबर उपयोग करें"],
                correct: 1
            }
        }
    ]
};

// DOM Elements
const screens = {
    home: document.getElementById('home-screen'),
    card: document.getElementById('card-screen'),
    quiz: document.getElementById('quiz-screen'),
    completion: document.getElementById('completion-screen')
};

const audioElements = {
    bg: document.getElementById('bg-music'),
    click: document.getElementById('click-sound'),
    start: document.getElementById('start-sound'),
    fly: document.getElementById('fly-sound'),
    message: document.getElementById('message-sound'),
    right: document.getElementById('right-sound'),
    wrong: document.getElementById('wrong-sound'),
    ending: document.getElementById('ending-sound')
};

// Initialize the game
function initGame() {
    // Set up event listeners
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('back-to-home-btn').addEventListener('click', () => showScreen('home'));
    document.getElementById('play-again-btn').addEventListener('click', () => showScreen('home'));
    //document.getElementById('back-to-home-completion-btn').addEventListener('click', () => showScreen('https://surakshanet-2025.web.app/'));
    
    // Start background music
    audioElements.bg.volume = 0.2;
    
    console.log("Game initialized successfully!");
}

// Switch between screens
function showScreen(screenName) {
    // Hide all screens
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the requested screen
    screens[screenName].classList.add('active');
    gameState.currentScreen = screenName;
    
    // Play appropriate sound
    if (screenName === 'card') {
        playSound('fly');
    } else if (screenName === 'quiz') {
        playSound('message');
    } else if (screenName === 'completion') {
        playSound('ending');
    }
}

// Play sound effects
function playSound(soundName) {
    console.log(`Playing sound: ${soundName}`);
    
    if (audioElements[soundName]) {
        audioElements[soundName].currentTime = 0;
        audioElements[soundName].play().catch(e => {
            console.log(`Could not play ${soundName}:`, e);
        });
    }
}

// FIXED: Separate function for listening again - INTERRUPTS current audio and starts immediately
function listenAgain(text) {
    // Immediately stop any current speech
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel(); // This stops any ongoing speech immediately
        
        // Create a completely separate utterance that doesn't interact with game state
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // No callbacks, no game state changes
        speechSynthesis.speak(utterance);
    }
}

// Start the game
function startGame() {
    playSound('start');
    
    // Reset game state
    gameState.seenCards = 0;
    gameState.currentCardIndex = -1;
    gameState.quizCards = [];
    gameState.isQuizActive = false;
    gameState.isGameCompleted = false;
    gameState.isSpeaking = false;
    gameState.usedQuizCards = [];
    gameState.seenCardIndices = new Set(); // Reset seen indices
    
    // Shuffle and select 15 cards
    const shuffledFacts = [...gameState.facts].sort(() => Math.random() - 0.5);
    gameState.cards = shuffledFacts.slice(0, 15);
    
    // Create card elements
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerHTML = '';
    
    gameState.cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.setAttribute('data-index', index);
        
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <div class="card-shine"></div>
                    ${index + 1}
                </div>
                <div class="card-back">
                    <div class="card-shine"></div>
                    <div class="fact-text">${card.text}</div>
                    <button class="listen-btn">फिर से सुनें</button>
                </div>
            </div>
        `;
        
        // Add click event to flip card
        cardElement.addEventListener('click', function(e) {
            // Don't flip if clicking the listen button
            if (!e.target.classList.contains('listen-btn') && 
                !gameState.isQuizActive && 
                !gameState.isGameCompleted) {
                flipCard(index);
            }
        });
        
        // Add event listener for the listen button
        const listenBtn = cardElement.querySelector('.listen-btn');
        listenBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card flip
            listenAgain(card.text); // Use completely isolated function
        });
        
        cardContainer.appendChild(cardElement);
    });
    
    // Update progress
    updateProgress();
    
    // Show card screen
    showScreen('card');
    
    console.log("Game started with", gameState.cards.length, "cards");
}

// Flip a card
function flipCard(index) {
    const cardElement = document.querySelectorAll('.card')[index];
    
    // Only flip if not already seen and not during quiz/game completion
    if (!cardElement.classList.contains('seen') && !gameState.isQuizActive && !gameState.isGameCompleted) {
        console.log("Flipping card:", index);
        playSound('click');
        
        // Add flipped class to trigger animation
        cardElement.classList.add('flipped');
        
        // Auto-play the fact when card flip animation completes
        setTimeout(() => {
            speakText(gameState.cards[index].text, () => {
                // This callback runs after TTS completes
                
                // Mark card as seen immediately after TTS
                cardElement.classList.add('seen');
                
                // Update game state - ONLY if this card hasn't been seen before
                if (!gameState.seenCardIndices.has(index)) {
                    gameState.seenCards++;
                    gameState.seenCardIndices.add(index);
                    updateProgress();
                    
                    // Add to quiz cards
                    gameState.quizCards.push(gameState.cards[index]);
                    
                    // Check if it's time for a quiz (after every 5 cards)
                    if (gameState.seenCards % 5 === 0 && gameState.seenCards > 0) {
                        console.log(`Showing quiz after ${gameState.seenCards} cards`);
                        if (!gameState.isGameCompleted) {
                            // Show quiz immediately after TTS ends
                            showQuiz();
                        }
                    }
                    
                    // Check if all cards are seen
                    if (gameState.seenCards === gameState.cards.length) {
                        gameState.isGameCompleted = true;
                        showCompletion();
                    }
                }
            });
        }, 400); // Wait for flip animation to complete before starting TTS
    }
}

// Update progress display
function updateProgress() {
    document.getElementById('cards-seen').textContent = gameState.seenCards;
}

// Show quiz
function showQuiz() {
    if (gameState.isQuizActive || gameState.isGameCompleted) return;
    
    gameState.isQuizActive = true;
    
    // Get the last 5 cards for the quiz
    const recentQuizCards = gameState.quizCards.slice(-5);
    const availableQuizCards = recentQuizCards.filter(card => 
        !gameState.usedQuizCards.includes(card.text)
    );
    
    // If all recent cards are used, reset and use any from recent 5
    let randomCard;
    if (availableQuizCards.length > 0) {
        randomCard = availableQuizCards[Math.floor(Math.random() * availableQuizCards.length)];
    } else {
        randomCard = recentQuizCards[Math.floor(Math.random() * recentQuizCards.length)];
    }
    
    // Mark this card as used for quiz
    gameState.usedQuizCards.push(randomCard.text);
    
    document.getElementById('quiz-question').textContent = randomCard.quiz.question;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    randomCard.quiz.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'quiz-option';
        optionElement.textContent = `${index + 1}. ${option}`;
        optionElement.addEventListener('click', () => checkAnswer(index, randomCard.quiz.correct, optionElement));
        optionsContainer.appendChild(optionElement);
    });
    
    document.getElementById('quiz-feedback').textContent = '';
    document.getElementById('quiz-feedback').className = 'feedback';
    
    showScreen('quiz');
}

// Check quiz answer
function checkAnswer(selectedIndex, correctIndex, optionElement) {
    if (!gameState.isQuizActive) return;
    
    const feedbackElement = document.getElementById('quiz-feedback');
    
    if (selectedIndex === correctIndex) {
        playSound('right');
        optionElement.classList.add('correct');
        feedbackElement.textContent = 'वाह! आप सही दिशा में हैं 🌱';
        feedbackElement.classList.add('correct');
    } else {
        playSound('wrong');
        optionElement.classList.add('incorrect');
        
        const options = document.querySelectorAll('.quiz-option');
        options[correctIndex].classList.add('correct');
        
        feedbackElement.textContent = 'कोई बात नहीं, अगली बार ध्यान रखिए 💡';
        feedbackElement.classList.add('incorrect');
    }
    
    // Disable further clicks
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(opt => {
        opt.style.pointerEvents = 'none';
    });
    
    // Return to cards after a delay
    setTimeout(() => {
        gameState.isQuizActive = false;
        if (!gameState.isGameCompleted) {
            showScreen('card');
        }
    }, 3000);
}

// Show completion screen
function showCompletion() {
    gameState.isGameCompleted = true;
    showScreen('completion');
}

// Text-to-speech function with callback - ONLY USED FOR CARD FLIPS
function speakText(text, callback) {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        gameState.isSpeaking = true;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = function() {
            gameState.isSpeaking = false;
            if (callback) callback();
        };
        
        utterance.onerror = function() {
            gameState.isSpeaking = false;
            if (callback) callback();
        };
        
        speechSynthesis.speak(utterance);
        
        console.log(`Speaking: ${text}`);
    } else {
        alert(`Text-to-speech not supported. Text: ${text}`);
        gameState.isSpeaking = false;
        if (callback) callback();
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);
