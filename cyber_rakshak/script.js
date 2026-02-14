// DOM Elements
let startScreen, startBtn, gameContainer, scenarioIntro, introTitle, introDescription;
let continueBtn, video, questionContainer, questionText, optionYes, optionNo;
let progressFill, progressText, homeBtn, nextBtn, prevBtn, feedbackOverlay;
let feedbackText, endScreen, restartBtn, scenarioSelect;
let playPauseBtn, stopBtn, volumeBtn, volumeSlider;

// Audio Elements
let startSound, rightSound, wrongSound, endingSound, questionSound, clickSound, messageSound;

// Game Data - Added Deepfake and Romance/Relationship scams
const scenarios = [
  { 
    title: "ओटीपी कॉल", 
    video: "assets/videos/otp.mp4", 
    questionTime: 13, 
    correctAnswer: "no",
    description: "इस परिदृश्य में, कोई व्यक्ति आपसे ओटीपी मांग रहा है। आपको यह तय करना है कि क्या ओटीपी साझा करना सुरक्षित है।"
  },
  { 
    title: "डिजिटल गिरफ्तारी", 
    video: "assets/videos/digital.mp4", 
    questionTime: 16, 
    correctAnswer: "no",
    description: "इस परिदृश्य में, कोई व्यक्ति खुद को साइबर क्राइम विभाग का बताकर डिजिटल गिरफ्तारी की धमकी दे रहा है। आपको सही निर्णय लेना है।"
  },
  { 
    title: "आधार लिंक कॉल", 
    video: "assets/videos/aadhar.mp4", 
    questionTime: 13, 
    correctAnswer: "no",
    description: "इस परिदृश्य में, कोई व्यक्ति आपके आधार कार्ड को लिंक करने का दावा कर रहा है। आपको सही निर्णय लेना है।"
  },
  { 
    title: "रिश्तेदार बनकर कॉल", 
    video: "assets/videos/relative.mp4", 
    questionTime: 31, 
    correctAnswer: "no",
    description: "इस परिदृश्य में, कोई व्यक्ति आपके रिश्तेदार होने का दावा कर रहा है और मदद मांग रहा है। आपको सही निर्णय लेना है।"
  },
  { 
    title: "ऐप डाउनलोड घोटाला", 
    video: "assets/videos/appdownload.mp4", 
    questionTime: 14, 
    correctAnswer: "no",
    description: "इस परिदृश्य में, आपको एक ऐप डाउनलोड करने के लिए कहा जा रहा है जो धोखाधड़ी हो सकती है। आपको सही निर्णय लेना है।"
  },
  { 
    title: "सरकारी योजना कॉल", 
    video: "assets/videos/gov.mp4", 
    questionTime: 16, 
    correctAnswer: "no",
    description: "इस परिदृश्य में, कोई व्यक्ति सरकारी योजना का लाभ देने का दावा कर रहा है। आपको यह तय करना है कि क्या यह वास्तविक है।"
  },
  { 
    title: "लॉटरी घोटाला", 
    video: "assets/videos/lottery.mp4", 
    questionTime: 10, 
    correctAnswer: "no",
    description: "इस परिदृश्य में, आपको एक लॉटरी जीतने का ऑफर दिखाया जाएगा। आपका काम है सही निर्णय लेना और धोखाधड़ी से बचना।"
  },
  { 
    title: "डीपफेक धोखाधड़ी", 
    video: "assets/videos/deepfake.mp4", 
    questionTime: 13.5, 
    correctAnswer: "no",
    description: "इस परिदृश्य में आपको दिखाया जाएगा कि डीपफेक से कैसे निपटा जाए।"
  },
  { 
    title: "रोमांस / रिश्ता घोटाला", 
    video: "assets/videos/rel.mp4", 
    questionTime: 17.5, 
    correctAnswer: "no",
    description: "इस परिदृश्य में, कोई व्यक्ति आपसे ऑनलाइन रिश्ता बनाकर आपकी भावनाओं का फायदा उठाने की कोशिश कर रहा है। आपको सही निर्णय लेना है।"
  },
];

// Game State
let currentScenario = 0;
let pausedTime = 0;
let isAnswerSelected = false;
let isIntroActive = false;
let userPausedVideo = false;

// Play sound function
function playSound(sound) {
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio play error:", e));
  }
}

// Initialize DOM elements
function initializeDOMElements() {
  console.log("Initializing DOM elements...");
  
  // Main elements
  startScreen = document.getElementById("start-screen");
  startBtn = document.getElementById("start-btn");
  gameContainer = document.getElementById("game-container");
  scenarioIntro = document.getElementById("scenario-intro");
  introTitle = document.getElementById("intro-title");
  introDescription = document.getElementById("intro-description");
  continueBtn = document.getElementById("continue-btn");
  video = document.getElementById("scenario-video");
  questionContainer = document.getElementById("question-container");
  questionText = document.getElementById("question-text");
  optionYes = document.getElementById("option-yes");
  optionNo = document.getElementById("option-no");
  progressFill = document.getElementById("progress-fill");
  progressText = document.getElementById("progress-text");
  homeBtn = document.getElementById("home-btn");
  nextBtn = document.getElementById("next-btn");
  prevBtn = document.getElementById("prev-btn");
  feedbackOverlay = document.getElementById("feedback-overlay");
  feedbackText = document.getElementById("feedback-text");
  endScreen = document.getElementById("end-screen");
  restartBtn = document.getElementById("restart-btn");
  scenarioSelect = document.getElementById("scenario-select");

  // Audio elements
  startSound = document.getElementById("start-sound");
  rightSound = document.getElementById("right-sound");
  wrongSound = document.getElementById("wrong-sound");
  endingSound = document.getElementById("ending-sound");
  questionSound = document.getElementById("question-sound");
  clickSound = document.getElementById("click-sound");
  messageSound = document.getElementById("message-sound");

  // Video control elements
  playPauseBtn = document.querySelector('.play-pause-btn');
  stopBtn = document.querySelector('.stop-btn');
  volumeBtn = document.querySelector('.volume-btn');
  volumeSlider = document.querySelector('.volume-slider');

  console.log("Start button found:", !!startBtn);
  console.log("Game container found:", !!gameContainer);
}

// Initialize the game
function init() {
  console.log("Initializing game...");
  
  // Initialize DOM elements first
  initializeDOMElements();
  
  // Check if essential elements exist
  if (!startBtn) {
    console.error("Start button not found!");
    alert("Error: Start button not found. Please check the HTML structure.");
    return;
  }

  if (!gameContainer) {
    console.error("Game container not found!");
    return;
  }

  // Event Listeners with click sounds
  startBtn.addEventListener("click", () => {
    playSound(clickSound);
    startGame();
  });
  
  continueBtn.addEventListener("click", () => {
    playSound(clickSound);
    continueToScenario();
  });
  
  optionYes.addEventListener("click", () => {
    playSound(clickSound);
    handleAnswer("yes");
  });
  
  optionNo.addEventListener("click", () => {
    playSound(clickSound);
    handleAnswer("no");
  });
  
  homeBtn.addEventListener("click", () => {
    playSound(clickSound);
    goToHome();
  });
  
  nextBtn.addEventListener("click", () => {
    playSound(clickSound);
    goToNextScenario();
  });
  
  prevBtn.addEventListener("click", () => {
    playSound(clickSound);
    goToPrevScenario();
  });
  
  restartBtn.addEventListener("click", () => {
    playSound(clickSound);
    restartGame();
  });
  
  // Scenario dropdown listener
  scenarioSelect.addEventListener("change", () => {
    playSound(clickSound);
    const newScenario = parseInt(scenarioSelect.value);
    if (newScenario !== currentScenario) {
      currentScenario = newScenario;
      showScenarioIntro();
    }
  });
  
  // Video event listeners
  video.addEventListener("ended", handleVideoEnd);
  video.addEventListener("play", updatePlayPauseButton);
  video.addEventListener("pause", updatePlayPauseButton);
  video.addEventListener("volumechange", updateVolumeButton);
  
  // Video control listeners with click sounds
  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      playSound(clickSound);
      togglePlayPause();
    });
  }
  if (stopBtn) {
    stopBtn.addEventListener("click", () => {
      playSound(clickSound);
      stopVideo();
    });
  }
  if (volumeSlider) {
    volumeSlider.addEventListener("input", setVolume);
  }
  if (volumeBtn) {
    volumeBtn.addEventListener("click", () => {
      playSound(clickSound);
      toggleMute();
    });
  }
  
  // Set initial progress
  updateProgress();
  updateNavButtons();
  
  console.log("Game initialized successfully!");
}

// Start the game
function startGame() {
  console.log("Start game clicked!");
  
  if (!startScreen || !gameContainer) {
    console.error("Required elements not found!");
    return;
  }
  
  // Play start sound
  playSound(startSound);
  
  startScreen.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  
  showScenarioIntro();
}

// Show scenario intro with transition
function showScenarioIntro() {
  const scene = scenarios[currentScenario];
  introTitle.textContent = scene.title;
  introDescription.textContent = scene.description;
  
  // Update scenario dropdown
  scenarioSelect.value = currentScenario;
  
  // Play message sound for all scenario intros except the first one
  if (currentScenario > 0) {
    playSound(messageSound);
  }
  
  // Ensure video is paused and reset
  video.pause();
  video.currentTime = 0;
  video.ontimeupdate = null;
  userPausedVideo = false;
  
  // Add entrance animation
  scenarioIntro.style.animation = 'slideInFromTop 0.8s ease-out';
  
  // Show intro and hide question container
  scenarioIntro.classList.remove("hidden");
  questionContainer.classList.remove("active");
  isIntroActive = true;
  
  // Update progress and navigation
  updateProgress();
  updateNavButtons();
  
  // Remove animation after it completes
  setTimeout(() => {
    scenarioIntro.style.animation = '';
  }, 800);
}

// Continue to the scenario with transition
function continueToScenario() {
  // Add exit animation
  scenarioIntro.style.animation = 'slideOutToTop 0.8s ease-in';
  
  setTimeout(() => {
    scenarioIntro.classList.add("hidden");
    isIntroActive = false;
    scenarioIntro.style.animation = '';
    
    // Add video container entrance
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
      videoContainer.style.animation = 'zoomIn 0.8s ease-out';
    }
    
    loadScenario();
    
    setTimeout(() => {
      if (videoContainer) {
        videoContainer.style.animation = '';
      }
    }, 800);
  }, 500);
}

// Load the scenario video
function loadScenario() {
  const scene = scenarios[currentScenario];
  
  // Reset video state
  video.src = scene.video;
  video.currentTime = 0;
  userPausedVideo = false;
  
  // Apply Aadhar video adjustment
  if (scene.title === "आधार लिंक कॉल") {
    video.classList.add('aadhar-adjusted');
  } else {
    video.classList.remove('aadhar-adjusted');
  }
  
  // Clear UI states
  questionContainer.classList.remove("active");
  isAnswerSelected = false;
  feedbackOverlay.style.opacity = "0";
  feedbackText.textContent = "";

  // Clear any existing event listeners
  video.ontimeupdate = null;

  // Set up new event listeners
  video.ontimeupdate = () => {
    // Only auto-pause for question if video wasn't manually paused by user
    if (video.currentTime >= scene.questionTime && !isAnswerSelected && !isIntroActive && !userPausedVideo) {
      pausedTime = video.currentTime;
      video.pause();
      video.ontimeupdate = null;
      showOptions();
    }
  };

  // Enable next button immediately
  nextBtn.disabled = false;
  updateNavButtons();

  // Play video
  video.play().catch((error) => {
    console.log("Video autoplay blocked:", error);
    showPlayButtonOverlay();
  });
}

// Show play button overlay if autoplay is blocked
function showPlayButtonOverlay() {
  const videoContainer = document.querySelector('.video-container');
  if (!videoContainer) return;
  
  const playOverlay = document.createElement('div');
  playOverlay.className = 'play-overlay';
  playOverlay.innerHTML = `
    <button class="play-overlay-btn">
      <i class="fas fa-play"></i>
    </button>
  `;
  
  playOverlay.querySelector('.play-overlay-btn').onclick = () => {
    video.play();
    playOverlay.remove();
  };
  
  videoContainer.appendChild(playOverlay);
}

// Show options when video pauses
function showOptions() {
  questionContainer.style.animation = 'slideInFromBottom 0.6s ease-out';
  questionContainer.classList.add("active");
  
  // Play question sound
  playSound(questionSound);
  
  setTimeout(() => {
    questionContainer.style.animation = '';
  }, 600);
}

// Handle answer selection
function handleAnswer(choice) {
  isAnswerSelected = true;
  const scene = scenarios[currentScenario];
  const correct = choice === scene.correctAnswer;

  // Hide options with animation
  questionContainer.style.animation = 'slideOutToBottom 0.6s ease-in';
  setTimeout(() => {
    questionContainer.classList.remove("active");
    questionContainer.style.animation = '';
  }, 500);

  if (correct) {
    // Play right answer sound
    playSound(rightSound);
    showFeedback(true, "सही जवाब! 🎉 आप एक सच्चे साइबर रक्षक हैं! 💪");
    createConfetti();
  } else {
    // Play wrong answer sound
    playSound(wrongSound);
    showFeedback(false, "गलत जवाब! ❌ आइए देखते हैं ऐसी स्थिति में क्या करना चाहिए...");
  }

  // Update navigation buttons
  updateNavButtons();

  // Resume video after a longer delay to show feedback message properly
  setTimeout(() => {
    video.currentTime = pausedTime;
    video.play();
    userPausedVideo = false; // Reset user pause flag
  }, 4000);
}

// Show feedback overlay with message
function showFeedback(isCorrect, message) {
  feedbackText.textContent = message;
  feedbackOverlay.className = isCorrect ? 
    "feedback-overlay feedback-correct" : 
    "feedback-overlay feedback-wrong";
  
  feedbackOverlay.style.opacity = "1";
  
  // Keep the feedback visible longer
  setTimeout(() => {
    feedbackOverlay.style.opacity = "0";
  }, 3500);
}

// Create confetti effect for correct answers
function createConfetti() {
  const colors = ['#00ff00', '#00f7ff', '#0077b6', '#0ea5e9', '#0369a1', '#ffd700', '#ff6b6b', '#4ecdc4'];
  const container = document.body;
  
  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.opacity = '1';
    confetti.style.width = Math.random() * 15 + 5 + 'px';
    confetti.style.height = Math.random() * 15 + 5 + 'px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    
    const animation = confetti.animate([
      { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
      { transform: `translateY(${Math.random() * 100 + 50}vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], {
      duration: Math.random() * 3000 + 2000,
      easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
    });
    
    container.appendChild(confetti);
    
    animation.onfinish = () => {
      confetti.remove();
    };
  }
}

// Handle video end
function handleVideoEnd() {
  // Add transition effect before moving to next scenario
  const videoContainer = document.querySelector('.video-container');
  if (videoContainer) {
    videoContainer.style.animation = 'fadeOut 0.8s ease-in';
  }
  
  setTimeout(() => {
    if (currentScenario < scenarios.length - 1) {
      currentScenario++;
      showScenarioIntro();
    } else {
      endGame();
    }
  }, 800);
}

// Update progress bar and text
function updateProgress() {
  const progress = ((currentScenario + 1) / scenarios.length) * 100;
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `${currentScenario + 1}/${scenarios.length}`;
}

// Update navigation buttons state
function updateNavButtons() {
  nextBtn.disabled = currentScenario >= scenarios.length - 1;
  prevBtn.disabled = currentScenario <= 0;
  
  // Always enable next button except on last scenario
  if (currentScenario < scenarios.length - 1) {
    nextBtn.disabled = false;
  }
}

// VIDEO CONTROL FUNCTIONS
function togglePlayPause() {
  if (video.paused) {
    video.play();
    userPausedVideo = false;
  } else {
    video.pause();
    userPausedVideo = true; // User manually paused
  }
}

function updatePlayPauseButton() {
  if (!playPauseBtn) return;
  
  const icon = playPauseBtn.querySelector('i');
  if (video.paused) {
    icon.className = 'fas fa-play';
  } else {
    icon.className = 'fas fa-pause';
  }
}

function stopVideo() {
  video.pause();
  video.currentTime = 0;
  userPausedVideo = true; // User manually stopped
  updatePlayPauseButton();
}

function setVolume() {
  if (volumeSlider) {
    video.volume = volumeSlider.value;
    updateVolumeButton();
  }
}

function updateVolumeButton() {
  if (!volumeBtn) return;
  
  const icon = volumeBtn.querySelector('i');
  if (video.volume === 0 || video.muted) {
    icon.className = 'fas fa-volume-mute';
  } else if (video.volume < 0.5) {
    icon.className = 'fas fa-volume-down';
  } else {
    icon.className = 'fas fa-volume-up';
  }
}

function toggleMute() {
  video.muted = !video.muted;
  if (volumeSlider) {
    if (video.muted) {
      volumeSlider.value = 0;
    } else {
      volumeSlider.value = video.volume;
    }
  }
  updateVolumeButton();
}

// Home button functionality
function goToHome() {
  if (confirm("क्या आप वाकई होम स्क्रीन पर वापस जाना चाहते हैं? आपकी प्रगति खो जाएगी।")) {
    resetGame();
    gameContainer.classList.add("hidden");
    startScreen.classList.remove("hidden");
  }
}

// Next button functionality
function goToNextScenario() {
  if (currentScenario < scenarios.length - 1) {
    // Add transition effect
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
      videoContainer.style.animation = 'slideOutToLeft 0.8s ease-in';
    }
    
    setTimeout(() => {
      currentScenario++;
      showScenarioIntro();
    }, 500);
  }
}

// Previous button functionality
function goToPrevScenario() {
  if (currentScenario > 0) {
    // Add transition effect
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
      videoContainer.style.animation = 'slideOutToRight 0.8s ease-in';
    }
    
    setTimeout(() => {
      currentScenario--;
      showScenarioIntro();
    }, 500);
  }
}

// End the game
function endGame() {
  // Play ending sound
  playSound(endingSound);
  
  gameContainer.classList.add("hidden");
  endScreen.classList.remove("hidden");
}

// Restart the game
function restartGame() {
  resetGame();
  endScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

// Reset game state
function resetGame() {
  currentScenario = 0;
  pausedTime = 0;
  isAnswerSelected = false;
  isIntroActive = false;
  userPausedVideo = false;
  
  // Reset all media and UI states
  video.pause();
  video.currentTime = 0;
  video.ontimeupdate = null;
  
  questionContainer.classList.remove("active");
  scenarioIntro.classList.add("hidden");
  feedbackOverlay.style.opacity = "0";
  feedbackText.textContent = "";
  
  updateProgress();
  updateNavButtons();
}

// Initialize the game when the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM fully loaded and parsed");
  init();
});
