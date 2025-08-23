/*-------------- Constants -------------*/
/*
  Defines the unique cards used in the game; each card has an id and associated image.
  These cards are duplicated and shuffled to form pairs on the game board.
*/
var CARD_TEMPLATES = [
    { id: "clubs-1", imgSrc: "https://i.ibb.co/2Y0xFPpX/card-clubs-1.png", alt: "Club 1 suit card" },
    { id: "hearts-7", imgSrc: "https://i.ibb.co/zWXw42mX/card-hearts-7.png", alt: "Heart 7 suit card" },
    { id: "spades-13", imgSrc: "https://i.ibb.co/sv4pR05r/card-spades-13.png", alt: "Spade suit card" },
    { id: "diamonds-12", imgSrc: "https://i.ibb.co/hx7pFvzV/card-diamonds-12.png", alt: "Diamond suit card" },
    { id: "spades-3", imgSrc: "https://i.ibb.co/fdF7SY81/card-spades-3.png", alt: "Spade 3 card" },
    { id: "hearts-11", imgSrc: "https://i.ibb.co/KxkpWZ7W/card-hearts-11.png", alt: "Heart 11 card" }
];

/*
  Initializes audio elements for background and sound effects.
  Background music loops softly to maintain ambience.
*/
const backgroundMusic = new Audio('audio/bg.mp3');
const countdownSound = new Audio('audio/321.mp3');
const winSound = new Audio('audio/victory.mp3');
const lossSound = new Audio('audio/boo.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

/*-------------- State Variables -------------*/
/*
  Variables that maintain game status and references.

  boardLocked: Controls interaction lock during animations or delays.
  timer: Reference to the ongoing countdown interval.
  timeRemaining: Milliseconds left for the active game.
  totalMoves: Tracks player moves (flips).
  score: Current player score (matched cards).
  isCountdownRunning: Ensures countdown does not overlap.
  gameCards: Array of shuffled card objects for a game session.
  firstCard/secondCard: Current flipped cards being compared.
  matchedCount: Tally of cards successfully matched.
*/
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

/*-------------- Cached Element References -------------*/
// Cached DOM elements to optimize DOM queries and updates.
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

/*
  Dynamically generates a speaker toggle button fixed on the UI’s bottom-left,
  maintaining accessibility regardless of scroll.
  The button toggles global mute state and provides visual feedback via icon.
*/
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

let isMuted = false;  // Reflects the current mute state applied globally

/*
  Event handler toggles mute/unmute state on click,
  propagates this state to all audio objects,
  and changes the toggle icon to show current state.
*/
speakerToggleBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    backgroundMusic.muted = isMuted;
    countdownSound.muted = isMuted;
    winSound.muted = isMuted;
    lossSound.muted = isMuted;
    speakerToggleBtn.textContent = isMuted ? '🔇' : '🔊';
});

/*
  Attempts to start background music playback when not already playing and sound is enabled.
  It catches and ignores errors silently due to browser autoplay restrictions.
*/
function tryPlayBgMusic() {
    if (!backgroundMusic.playing && !isMuted) {
        backgroundMusic.play().catch(() => { });
    }
}

/*---------- Functions ----------*/
/*
  shuffleCards duplicates the template cards to create pairs and shuffles the entire deck.
  This provides randomness on each game start while ensuring every card has a matching pair.
*/
function shuffleCards() {
    var pairs = [];
    for (var i = 0; i < CARD_TEMPLATES.length; i++) {
        pairs.push(CARD_TEMPLATES[i], CARD_TEMPLATES[i]);
    }
    pairs.sort(() => 0.5 - Math.random());
    return pairs;
}

/*
  renderCards clears any existing cards from the board and constructs card divs
  for every card in the shuffled game deck.
  Each card listens for clicks to trigger flip logic while preventing invalid clicks.
  It also ensures that the game board is visible after cards are rendered.
*/
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
        cardDiv.onclick = function () {
            if (!boardLocked && this !== firstCard && !this.classList.contains("flipped")) {
                flipCard(this);
            }
        };
        gameBoardElement.appendChild(cardDiv);
    }
    gameBoardElement.style.display = "flex";
}

/*
  flipAllCards either flips all cards face-up or face-down depending on the argument.
  This is employed during the countdown timer to briefly reveal the cards before gameplay starts.
*/
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

/*
  playCountdownSound plays the countdown beep sound if the game’s audio is not muted.
  This reinforces the countdown visually and auditorily.
*/
function playCountdownSound() {
    if (!isMuted) {
        countdownSound.currentTime = 0;
        countdownSound.play();
    }
}

/*
  showCountdownAndFlipStartGame handles the countdown UI and logic.
  It shows a countdown from 3 to ‘Go!’, flips all cards face-up initially for memorization,
  then flips them face-down on ‘Go!’.
  During this process, it disables player interaction and disables buttons to avoid premature input.
  When countdown finishes, it calls a callback to start the actual game timer and enable play.
*/
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

    var interval = setInterval(() => {
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

/*
  prepareAndStartGame resets all game states and UI components for a new round.
  This includes hiding instructions, resetting counters, setting up the cards,
  starting background music, and beginning the countdown and play timer.
*/
function prepareAndStartGame() {
    if (isCountdownRunning) return;

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

    showCountdownAndFlipStartGame(() => {
        startTimer();
    });
}

/*
  flipCard manages the user's card flip interaction:
  It flips the selected card, stores references for matching,
  locks the game board to prevent concurrent inputs,
  and updates score and move displays.
  If cards match: maintains flipped state and checks for game win.
  If cards do not match: flips cards back after a pause for memory.
*/
function flipCard(card) {
    card.classList.add("flipped");

    if (!firstCard) {
        firstCard = card;
        return;
    }

    secondCard = card;
    boardLocked = true;
    totalMoves++;
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
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard = null;
            secondCard = null;
            boardLocked = false;
            scoreElement.textContent = "Score: " + matchedCount + " / 12";
        }, 900);
    }
}

/*
  startTimer initiates a countdown ticking every second,
  updating the UI and stopping the game when time expires.
*/
function startTimer() {
    updateTimerDisplay();

    if (timer !== null) clearInterval(timer);

    timer = setInterval(() => {
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

/*
  updateTimerDisplay shows the remaining time in seconds on the UI,
  rounding up to ensure the timer does not prematurely display zero.
*/
function updateTimerDisplay() {
    if (timerElement) {
        timerElement.textContent = "Time Left: " + Math.ceil(timeRemaining / 1000) + "s";
    }
}

/*
  endGame finalizes the game state upon completion,
  stopping interactions, displaying results appropriately,
  and toggling control button visibility for replay options.
*/
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

/*
  On page load: initialize UI to show start screen and hide gameplay elements.
  Set up event listeners on control buttons to initialize or restart the game.
*/

/*-------------- Event Listeners -------------*/
document.addEventListener("DOMContentLoaded", () => {
    startButton.style.display = "inline-block";
    restartButton.style.display = "none";
    playAgainButton.style.display = "none";
    movesCounterElement.style.display = "none";
    scoreElement.style.display = "none";
    timerElement.style.display = "none";
    messageElement.style.display = "none";
    gameBoardElement.style.display = "none";
    countdownElement.style.display = "none";

    startButton.addEventListener("click", () => {
        prepareAndStartGame();
    });

    restartButton.addEventListener("click", () => {
        prepareAndStartGame();
    });

    playAgainButton.addEventListener("click", () => {
        prepareAndStartGame();
        playAgainButton.style.display = "none";
    });
});
