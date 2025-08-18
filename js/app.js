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
