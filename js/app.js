/*-------------- Constants -------------*/
const CARD_TEMPLATES = [
    { id: "clubs-1", imgSrc: "https://i.ibb.co/2Y0xFPpX/card-clubs-1.png", alt: "Club 1 suit card" },
    { id: "hearts-7", imgSrc: "https://i.ibb.co/zWXw42mX/card-hearts-7.png", alt: "Heart 7 suit card" },
    { id: "spades-13", imgSrc: "https://i.ibb.co/sv4pR05r/card-spades-13.png", alt: "Spade suit card" },
    { id: "diamonds-12", imgSrc: "https://i.ibb.co/hx7pFvzV/card-diamonds-12.png", alt: "Diamond suit card" },
    { id: "spades-3", imgSrc: "https://i.ibb.co/fdF7SY81/card-spades-3.png", alt: "Spade 3 card" },
    { id: "hearts-11", imgSrc: "https://i.ibb.co/KxkpWZ7W/card-hearts-11.png", alt: "Heart 11 card" }
];

/*---------- Variables (state) ---------*/

var flippedCards = [];
var matchedCardIndexes = [];
var boardLocked = false;
var totalMoves = 0;
var timer = null;
var timeRemaining = 60000;

/*---------- Cached Element References ---------*/

var gameBoardElement = document.getElementById("game-board");
var movesCounterElement = document.getElementById("moves-counter");
var messageElement = document.getElementById("message");
var playAgainButton = document.getElementById("play-again-btn");
var timerElement = document.getElementById("timer");
var startButton = document.getElementById("start-btn");

var gameCards = []; 


/*---------- Functions ---------*/

function shuffleCards() {
    var pairs = [];
    for (var i = 0; i < CARD_TEMPLATES.length; i++) {
        pairs.push(CARD_TEMPLATES[i]);
        pairs.push(CARD_TEMPLATES[i]);
    }
    pairs.sort(function() { return Math.random() - 0.5; });
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

        if (matchedCardIndexes.includes(i) || flippedCards.includes(cardDiv)) {
            cardDiv.classList.add("flipped");
        }

        var img = document.createElement("img");
        img.src = card.imgSrc;
        img.alt = card.alt;
        cardDiv.appendChild(img);

        cardDiv.onclick = function() {
            onCardClick(this);
        };

        gameBoardElement.appendChild(cardDiv);
    }
}

function onCardClick(card) {
    if (boardLocked) return;
    if (card.classList.contains("flipped") || flippedCards.length === 2) return;
    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        totalMoves++;
        movesCounterElement.textContent = "Moves: " + totalMoves;

        var first = flippedCards[0];
        var second = flippedCards[1]; // fixed from 9 to 1

        if (first.dataset.id === second.dataset.id) {
            matchedCardIndexes.push(parseInt(first.getAttribute("data-index")));
            matchedCardIndexes.push(parseInt(second.getAttribute("data-index")));
            flippedCards = [];

            if (matchedCardIndexes.length === gameCards.length) {
                endGame(true);
            }
        } else {
            boardLocked = true;
            setTimeout(function() {
                first.classList.remove("flipped");
                second.classList.remove("flipped");
                flippedCards = [];
                boardLocked = false;
            }, 800);
        }
    }
}

function startTimer() {
    timeRemaining = 60000;
    updateTimerDisplay();

    if (timer !== null) clearInterval(timer);
    timer = setInterval(function() {
        timeRemaining -= 1000;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timer);
            if (matchedCardIndexes.length !== gameCards.length) {
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
    if (won) {
        messageElement.textContent = "You won! 🎉";
    } else {
        messageElement.textContent = "Time's up! You lost. ⏰";
    }
    playAgainButton.style.display = "inline-block";
}

playAgainButton.onclick = function() {
    startGame();
};

function startGame() {
    gameCards = shuffleCards();
    flippedCards = [];
    matchedCardIndexes = [];
    totalMoves = 0;
    boardLocked = false;
    movesCounterElement.textContent = "Moves: 0";
    messageElement.textContent = "";
    playAgainButton.style.display = "none";

    renderCards();
    startTimer();
}

/*---------- Event Listeners ---------*/

document.addEventListener("DOMContentLoaded", function() {
    gameBoardElement.style.display = "none";
    movesCounterElement.style.display = "none";
    timerElement.style.display = "none";
    messageElement.style.display = "none";
    playAgainButton.style.display = "none";

    if (startButton) {
        startButton.style.display = "inline-block";
        startButton.addEventListener("click", function() {
            startGame();
            startButton.style.display = "none";

            gameBoardElement.style.display = "flex";
            movesCounterElement.style.display = "block";
            timerElement.style.display = "block";
            messageElement.style.display = "block";
        });
    }
});
