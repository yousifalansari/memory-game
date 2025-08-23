/*-------------- Constants -------------*/
var CARD_TEMPLATES = [
  { id: "clubs-1", imgSrc: "https://i.ibb.co/2Y0xFPpX/card-clubs-1.png", alt: "Club 1 suit card" },
  { id: "hearts-7", imgSrc: "https://i.ibb.co/zWXw42mX/card-hearts-7.png", alt: "Heart 7 suit card" },
  { id: "spades-13", imgSrc: "https://i.ibb.co/sv4pR05r/card-spades-13.png", alt: "Spade suit card" },
  { id: "diamonds-12", imgSrc: "https://i.ibb.co/hx7pFvzV/card-diamonds-12.png", alt: "Diamond suit card" },
  { id: "spades-3", imgSrc: "https://i.ibb.co/fdF7SY81/card-spades-3.png", alt: "Spade 3 card" },
  { id: "hearts-11", imgSrc: "https://i.ibb.co/KxkpWZ7W/card-hearts-11.png", alt: "Heart 11 card" }
];

const backgroundMusic = new Audio('audio/bg.mp3');
const countdownSound = new Audio('audio/321.mp3');
const winSound = new Audio('audio/victory.mp3');
const lossSound = new Audio('audio/boo.mp3');

backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

var boardLocked = false;
var timer = null;
var timeRemaining = 60000;
var totalMoves = 0;
var score = 0;
var isCountdownRunning = false;
var gameCards = [];
var firstCard = null;
var secondCard = null;
var matchedCount = 0;

var gameBoardElement = document.getElementById("game-board");
var movesCounterElement = document.getElementById("moves-counter");
var scoreElement = document.getElementById("score");
var countdownElement = document.getElementById("countdown");
var messageElement = document.getElementById("message");
var playAgainButton = document.getElementById("play-again-btn");
var timerElement = document.getElementById("timer");
var startButton = document.getElementById("start-btn");
var restartButton = document.getElementById("restart-btn");
var buttonsBottom = document.getElementById("buttons-bottom");
var instructionsElement = document.getElementById('start-instructions');

var speakerToggleBtn = document.createElement("button");
speakerToggleBtn.id = "speaker-toggle";
speakerToggleBtn.style.position = "fixed";
speakerToggleBtn.style.bottom = "20px";
speakerToggleBtn.style.left = "20px";
speakerToggleBtn.style.background = "none";
speakerToggleBtn.style.border = "none";
speakerToggleBtn.style.color = "white";
speakerToggleBtn.style.fontSize = "28px";
speakerToggleBtn.style.cursor = "pointer";
speakerToggleBtn.style.userSelect = "none";
speakerToggleBtn.title = "Toggle sound";
speakerToggleBtn.textContent = "🔊";
document.body.appendChild(speakerToggleBtn);

let isMuted = false;
speakerToggleBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  backgroundMusic.muted = isMuted;
  countdownSound.muted = isMuted;
  winSound.muted = isMuted;
  lossSound.muted = isMuted;
  speakerToggleBtn.textContent = isMuted ? '🔇' : '🔊';
});


function tryPlayBgMusic() {
  if (!backgroundMusic.playing && !isMuted) {
    backgroundMusic.play().catch(() => {});
  }
}

/*---------- Functions ---------*/
function shuffleCards() {
  var pairs = [];
  for (var i = 0; i < CARD_TEMPLATES.length; i++) {
    pairs.push(CARD_TEMPLATES[i], CARD_TEMPLATES[i]);
  }
  pairs.sort(function() {
    return 0.5 - Math.random();
  });
  return pairs;
}

function renderCards() {
  gameBoardElement.innerHTML = "";
  for (var i = 0; i < gameCards.length; i++) {
    var card = gameCards[i];
    var cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.dataset.id = card.id;
    cardDiv.setAttribute("data-index", i);
    var img = document.createElement("img");
    img.src = card.imgSrc;
    img.alt = card.alt;
    cardDiv.appendChild(img);
    cardDiv.onclick = function() {
      if (!boardLocked && this !== firstCard && !this.classList.contains("flipped")) {
        flipCard(this);
      }
    };
    gameBoardElement.appendChild(cardDiv);
  }
  gameBoardElement.style.display = "flex";
}

function flipAllCards(show) {
  var cards = gameBoardElement.children;
  for (var i = 0; i < cards.length; i++) {
    if (show) {
      cards[i].classList.add("flipped");
    } else {
      cards[i].classList.remove("flipped");
    }
  }
}

function playCountdownSound() {
  if (!isMuted) {
    countdownSound.currentTime = 0;
    countdownSound.play();
  }
}
function showCountdownAndFlipStartGame(callback) {
  if (isCountdownRunning) return;
  isCountdownRunning = true;
  boardLocked = true;
  startButton.disabled = true;
  restartButton.disabled = true;
  countdownElement.style.display = "block";
  buttonsBottom.style.justifyContent = "center";

  var count = 3;
  countdownElement.textContent = count;
  flipAllCards(true);

  if (!isMuted) {
    countdownSound.currentTime = 0;
    countdownSound.play();
  }

  var interval = setInterval(function() {
    count--;
    if (count > 0) {
      countdownElement.textContent = count;
    } else if (count === 0) {
      countdownElement.textContent = "Go!";
      flipAllCards(false);
    } else {
      clearInterval(interval);
      countdownElement.style.display = "none";
      isCountdownRunning = false;
      boardLocked = false;
      startButton.disabled = true;
      restartButton.disabled = false;
      buttonsBottom.style.justifyContent = "center";
      restartButton.style.display = "inline-block";
      playAgainButton.style.display = "none";
      callback();
    }
  }, 1000);
}

function prepareAndStartGame() {
  if (isCountdownRunning) return;

  // Hide instructions on start
  if (instructionsElement) {
    instructionsElement.style.display = 'none';
  }

  tryPlayBgMusic();
  if (timer !== null) clearInterval(timer);
  startButton.style.display = "none";
  restartButton.style.display = "none";
  playAgainButton.style.display = "none";
  movesCounterElement.style.display = "flex";
  scoreElement.style.display = "flex";
  timerElement.style.display = "flex";
  messageElement.style.display = "block";
  gameBoardElement.style.display = "flex";
  firstCard = null;
  secondCard = null;
  matchedCount = 0;
  totalMoves = 0;
  score = 0;
  movesCounterElement.textContent = "Moves: 0";
  scoreElement.textContent = "Score: 0 / 12";
  messageElement.textContent = "";
  timeRemaining = 60000;
  updateTimerDisplay();
  gameCards = shuffleCards();
  renderCards();
  showCountdownAndFlipStartGame(function() {
    startTimer();
  });
}

function flipCard(card) {
  card.classList.add("flipped");
  if (!firstCard) {
    firstCard = card;
    return;
  }
  secondCard = card;
  boardLocked = true;
  totalMoves += 1;
  movesCounterElement.textContent = "Moves: " + totalMoves;
  scoreElement.textContent = "Score: " + matchedCount + " / 12";
  if (firstCard.dataset.id === secondCard.dataset.id) {
    score += 2;
    matchedCount += 2;
    firstCard = null;
    secondCard = null;
    boardLocked = false;
    scoreElement.textContent = "Score: " + matchedCount + " / 12";
    if (matchedCount === gameCards.length) {
      if (!isMuted) {
        winSound.currentTime = 0;
        winSound.play();
      }
      endGame(true);
    }
  } else {
    setTimeout(function() {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard = null;
      secondCard = null;
      boardLocked = false;
      scoreElement.textContent = "Score: " + matchedCount + " / 12";
    }, 900);
  }
}

function startTimer() {
  updateTimerDisplay();
  if (timer !== null) clearInterval(timer);
  timer = setInterval(function() {
    timeRemaining -= 1000;
    updateTimerDisplay();
    if (timeRemaining <= 0) {
      clearInterval(timer);
      if (matchedCount < gameCards.length) {
        if (!isMuted) {
          lossSound.currentTime = 0;
          lossSound.play();
        }
        endGame(false);
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  if (timerElement) {
    timerElement.textContent = "Time Left: " + Math.ceil(timeRemaining / 1000) + "s";
  }
}

function endGame(won) {
  boardLocked = true;
  clearInterval(timer);
  countdownElement.style.display = "none";
  if (won) {
    messageElement.textContent = "You won! " + score + "/12 cards found! 🎉";
  } else {
    messageElement.textContent = "You lost, " + score + "/12 cards found ⏰";
  }
  playAgainButton.style.display = "inline-block";
  restartButton.style.display = "none";
  startButton.style.display = "none";
  startButton.disabled = false;
  restartButton.disabled = true;
  movesCounterElement.style.display = "none";
  scoreElement.style.display = "none";
  timerElement.style.display = "none";
  messageElement.style.display = "block";
  buttonsBottom.style.justifyContent = "center";
}

document.addEventListener("DOMContentLoaded", function() {
  startButton.style.display = "inline-block";
  restartButton.style.display = "none";
  playAgainButton.style.display = "none";
  movesCounterElement.style.display = "none";
  scoreElement.style.display = "none";
  timerElement.style.display = "none";
  messageElement.style.display = "none";
  gameBoardElement.style.display = "none";
  countdownElement.style.display = "none";
  startButton.addEventListener("click", function() {
    prepareAndStartGame();
  });
  restartButton.addEventListener("click", function() {
    prepareAndStartGame();
  });
  playAgainButton.addEventListener("click", function() {
    prepareAndStartGame();
    playAgainButton.style.display = "none";
  });
});
