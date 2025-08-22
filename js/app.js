/*-------------- Constants -------------*/
const CARD_TEMPLATES = [
    {
        id: "clubs-1",
        imgSrc: "https://i.ibb.co/2Y0xFPpX/card-clubs-1.png",
        alt: "Club 1 suit card"
    },
    {
        id: "hearts-7",
        imgSrc: "https://i.ibb.co/zWXw42mX/card-hearts-7.png",
        alt: "Heart 7 suit card"
    },
    {
        id: "spades-13",
        imgSrc: "https://i.ibb.co/sv4pR05r/card-spades-13.png",
        alt: "Spade suit card"
    },
    {
        id: "diamonds-12",
        imgSrc: "https://i.ibb.co/hx7pFvzV/card-diamonds-12.png",
        alt: "Diamond suit card"
    },
    {
        id: "spades-3",
        imgSrc: "https://i.ibb.co/fdF7SY81/card-spades-3.png",
        alt: "Spade 3 card"
    },
    {
        id: "hearts-11",
        imgSrc: "https://i.ibb.co/KxkpWZ7W/card-hearts-11.png",
        alt: "Heart 11 card"
    }
];

const MEMORIZE_DISPLAY_TIME = 3000; 
const GAME_TIME_LIMIT = 60000;

/*---------- Variables (state) ---------*/
var gameCards = [];
var flippedCardIndexes = [];
var matchedCardIndexes = [];
var totalMoves = 0;
var boardLocked = false;
var timer = null;
var timeRemaining = GAME_TIME_LIMIT;

/*----- Cached Element References  ------*/
var gameBoardElement = document.getElementById("game-board");
var movesCounterElement = document.getElementById("moves-counter");
var messageElement = document.getElementById("message");
var playAgainButton = document.getElementById("play-again-btn");
var timerElement = document.getElementById("timer");

/*-------------- Functions -------------*/
function shuffleCards() {
    var pairs = [];
    for (var i = 0; i < CARD_TEMPLATES.length; i++) {
        pairs.push(CARD_TEMPLATES[i]);
        pairs.push(CARD_TEMPLATES[i]);
    }
    pairs.sort(function() {
        return Math.random() - 0.5;
    });
    return pairs;
}

function renderCards() {
    gameBoardElement.innerHTML = '';

    for (var i = 0; i < gameCards.length; i++) {
        var card = gameCards[i];
        var cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.setAttribute('data-index', i);

        if (flippedCardIndexes.indexOf(i) !== -1 || matchedCardIndexes.indexOf(i) !== -1) {
            cardDiv.classList.add('flipped');
        }

        var img = document.createElement('img');
        img.src = card.imgSrc;
        img.alt = card.alt;
        cardDiv.appendChild(img);

        cardDiv.onclick = function() {
            onCardClick(parseInt(this.getAttribute('data-index')));
        };

        gameBoardElement.appendChild(cardDiv);
    }
}

function onCardClick(index) {
    if (boardLocked) return;
    if (flippedCardIndexes.length === 2) return;
    if (flippedCardIndexes.indexOf(index) !== -1 || matchedCardIndexes.indexOf(index) !== -1) return;

    flippedCardIndexes.push(index);
    renderCards();

    if (flippedCardIndexes.length === 2) {
        totalMoves++;
        movesCounterElement.textContent = 'Moves: ' + totalMoves;

        var first = flippedCardIndexes[0];
        var second = flippedCardIndexes[9];

        if (gameCards[first].id === gameCards[second].id) {
            matchedCardIndexes.push(first);
            matchedCardIndexes.push(second);
            flippedCardIndexes = [];

            if (matchedCardIndexes.length === gameCards.length) {
                endGame(true);
            }
        } else {
            boardLocked = true;
            setTimeout(function() {
                flippedCardIndexes = [];
                boardLocked = false;
                renderCards();
            }, 800);
        }
    }
}

function startTimer() {
    timeRemaining = GAME_TIME_LIMIT;
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
        timerElement.textContent = 'Time Left: ' + Math.ceil(timeRemaining / 1000) + 's';
    }
}

function endGame(won) {
    boardLocked = true;
    clearInterval(timer);
    if (won) {
        messageElement.textContent = 'You won! 🎉';
    } else {
        messageElement.textContent = "Time's up! You lost. ⏰";
    }
    playAgainButton.style.display = 'inline-block';
}

playAgainButton.onclick = function() {
    startGame();
};

function startGame() {
    gameCards = shuffleCards();
    flippedCardIndexes = [];
    matchedCardIndexes = [];
    totalMoves = 0;
    boardLocked = false;
    movesCounterElement.textContent = 'Moves: 0';
    messageElement.textContent = '';
    playAgainButton.style.display = 'none';

    renderCards();
    startTimer();
}

/*----------- Event listeners -----------*/
document.addEventListener('DOMContentLoaded', function() {
    startGame();
});
