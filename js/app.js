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
let boardLocked = false;  // to stop clicks while cards are flipping back from the game logic itself

/*---------- Cached Element Reference ---------*/
var gameBoard = document.getElementById("game-board");

/*-------------- Functions -------------*/
function renderCards() {
  cardsData.forEach(function(card) {
    var cardElement = document.createElement("div");
    cardElement.classList.add("card");

    var frontImg = document.createElement("img");
    frontImg.src = card.imgSrc;
    frontImg.alt = card.alt;

    cardElement.appendChild(frontImg);

    cardElement.addEventListener("click", function() {
      cardElement.classList.toggle("flipped");
    });

    gameBoard.appendChild(cardElement);
  });
}

/*----------- Event listeners -----------*/
document.addEventListener("DOMContentLoaded", function() {
  renderCards();
});