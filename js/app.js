/*-------------- Constants -------------*/
const cardsData = [
  {
    id: "clubs-1",
    imgSrc: "https://i.ibb.co/2Y0xFPpX/card-clubs-1.png",
    alt: "Club suit card"
  },
  {
    id: "hearts-7",
    imgSrc: "https://i.ibb.co/zWXw42mX/card-hearts-7.png",
    alt: "Heart suit card"
  },
  {
    id: "spades-13",
    imgSrc: "https://i.ibb.co/sv4pR05r/card-spades-13.png",
    alt: "Spade suit card"
  }
];

/*---------- Variables (state) ---------*/
let moveCount = 0;
let flippedCards = [];
let matchedPairs = 0;
let boardLocked = false;  // Prevent clicks while cards are flipping back

/*----- Cached Element References  -----*/
var gameBoard = document.getElementById("game-board");
var movesCounter = document.getElementById("moves-counter");
var mainTitle = document.querySelector("main h1");
var instructionText = document.querySelector("main p");

/*-------------- Functions -------------*/

// Duplicate and shuffle cards to create pairs
function setupCards() {
  var cardPairs = [];
  cardsData.forEach(function(card) {
    cardPairs.push(Object.assign({}, card));
    cardPairs.push(Object.assign({}, card));
  });
  cardPairs.sort(function() {
    return Math.random() - 0.5;
  });
  return cardPairs;
}

// Clear game board and reset variables for a fresh game
function resetGame() {
  moveCount = 0;
  flippedCards = [];
  matchedPairs = 0;
  boardLocked = false;
  movesCounter.textContent = "Moves: 0";
  gameBoard.innerHTML = "";
  mainTitle.textContent = "Memory Card Game";
  instructionText.textContent = "Click cards to flip and find matching pairs.";
  renderCards();
}

// Create cards and add them to the board
function renderCards() {
  var cards = setupCards();
  cards.forEach(function(card) {
    var cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.id = card.id;

    var frontImg = document.createElement("img");
    frontImg.src = card.imgSrc;
    frontImg.alt = card.alt;

    cardElement.appendChild(frontImg);
    cardElement.addEventListener("click", function() {
      onCardClick(cardElement);
    });

    gameBoard.appendChild(cardElement);
  });
}

// Handle card click and flipping logic (instant flip)
function onCardClick(card) {
  if (boardLocked) return; // Prevent clicking during flip back
  if (flippedCards.length === 2 || card.classList.contains("flipped")) {
    return;
  }

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moveCount++;
    movesCounter.textContent = "Moves: " + moveCount;
    
    checkForMatch();
  }
}

// Check if flipped cards match and handle game progress
function checkForMatch() {
  var firstCard = flippedCards[0];
  var secondCard = flippedCards[1];

  if (firstCard.dataset.id === secondCard.dataset.id) {
    matchedPairs++;
    flippedCards = [];

    if (matchedPairs === cardsData.length) {
      showWinScreen();
    }
  } else {
    boardLocked = true;  // Lock board while cards are flipped back
    // Flip cards back after short delay (still instant flip, but gives user time to see)
    setTimeout(function() {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      flippedCards = [];
      boardLocked = false; // Unlock the board
    }, 800);
  }
}

// Show win screen with a "Play Again" button
function showWinScreen() {
  mainTitle.textContent = "You Won!";
  instructionText.textContent = "";
  movesCounter.textContent = "You completed the game in " + moveCount + " moves.";

  // Clear board and add play again button
  gameBoard.innerHTML = "";
  var playAgainBtn = document.createElement("button");
  playAgainBtn.textContent = "Play Again";
  playAgainBtn.id = "play-again-btn";
  playAgainBtn.style.padding = "10px 20px";
  playAgainBtn.style.fontSize = "16px";
  playAgainBtn.style.cursor = "pointer";

  playAgainBtn.addEventListener("click", function() {
    resetGame();
  });

  gameBoard.appendChild(playAgainBtn);
}

/*----------- Event Listeners ----------*/
document.addEventListener("DOMContentLoaded", function() {
  resetGame();
});
