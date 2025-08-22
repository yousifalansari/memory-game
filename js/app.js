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
var gameBoard = document.getElementById("game-board");
var flippedCards = [];
var boardLocked = false;

/*-------------- Functions -------------*/
function setupCards() {
  var pairs = [];
  for (var i = 0; i < cardsData.length; i++) {
    pairs.push(cardsData[i]);
    pairs.push(cardsData[i]);
  }
  pairs.sort(function() {
    return Math.random() - 0.5;
  });
  return pairs;
}

function renderCards() {
  gameBoard.innerHTML = "";
  var cards = setupCards();
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.id = card.id;

    var frontImg = document.createElement("img");
    frontImg.src = card.imgSrc;
    frontImg.alt = card.alt;
    cardElement.appendChild(frontImg);

    cardElement.addEventListener("click", function() {
      onCardClick(this);
    });

    gameBoard.appendChild(cardElement);
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
