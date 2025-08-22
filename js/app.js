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
function shuffledDeck() {
  var pairs = [];
  for (var i = 0; i < cardsData.length; i++) {
    pairs.push(CARD_TEMPLATES[i]);
    pairs.push(CARD_TEMPLATES[i]);
  }
  pairs.sort(function() {
    return Math.random() - 0.5;
  });
  return pairs;
}

function renderCards() {
  gameBoard.innerHTML = '';

  for (var i = 0; i < deck.length; i++) {
    var card = deck[i];
    var cardDiv = document.createElement('div');
    cardDiv.className = 'card';
    cardDiv.setAttribute('data-index', i);

    if (flipped.indexOf(i) !== -1 || matched.indexOf(i) !== -1) {
      cardDiv.classList.add('flipped');
    }

    var img = document.createElement('img');
    img.src = card.imgSrc;
    img.alt = card.alt;
    cardDiv.appendChild(img);

    cardDiv.onclick = function() {
      onFlip(parseInt(this.getAttribute('data-index')));
    };

    gameBoard.appendChild(cardDiv);
  }
}



function onCardClick(card) {
  if (boardLocked) return;
  if (card.classList.contains("flipped") || flippedCards.length === 2) return;
  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    var first = flippedCards[0];
    var second = flippedCards[1];
    if (first.dataset.id === second.dataset.id) {
      flippedCards = [];
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

/*----------- Event listeners -----------*/
document.addEventListener("DOMContentLoaded", function() {
  renderCards();
});
