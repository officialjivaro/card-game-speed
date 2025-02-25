const suits = ["♣","♦","♥","♠"];
const ranks = [1,2,3,4,5,6,7,8,9,10,11,12,13];
let deck = [];
function buildDeck() {
  deck = [];
  suits.forEach(suit => {
    ranks.forEach(rank => {
      deck.push({ rank, suit });
    });
  });
}
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
let playerHand = [];
let cpuHand = [];
let centerPiles = [[],[]];
function dealCards() {
  buildDeck();
  shuffle(deck);
  playerHand = deck.slice(0,20);
  cpuHand = deck.slice(20,40);
  centerPiles[0] = [ deck[40] ];
  centerPiles[1] = [ deck[41] ];
}
function renderAll() {
  renderHand(playerHand, "player-hand");
  renderHand(cpuHand, "cpu-hand", true);
  renderCenterPiles();
}
function renderHand(hand, containerId, isCPU = false) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  hand.forEach((card, index) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.innerText = isCPU ? "??" : cardToString(card);
    cardDiv.style.left = (index * 25) + "px";
    cardDiv.style.top = "0px";
    if (!isCPU) {
      cardDiv.addEventListener("click", () => attemptPlay(card, index));
    }
    container.appendChild(cardDiv);
  });
}
function renderCenterPiles() {
  for (let i = 0; i < 2; i++) {
    const pileDiv = document.getElementById("center-pile-" + (i+1));
    const topCard = centerPiles[i][ centerPiles[i].length - 1 ];
    if (topCard) {
      pileDiv.innerText = cardToString(topCard);
    } else {
      pileDiv.innerText = "Empty";
    }
  }
}
function cardToString(card) {
  let rankStr = card.rank;
  if (card.rank === 1) rankStr = "A";
  else if (card.rank === 11) rankStr = "J";
  else if (card.rank === 12) rankStr = "Q";
  else if (card.rank === 13) rankStr = "K";
  return rankStr + card.suit;
}
function attemptPlay(card, index) {
  for (let i = 0; i < 2; i++) {
    const topCard = centerPiles[i][ centerPiles[i].length - 1 ];
    if (isValidPlay(card, topCard)) {
      centerPiles[i].push(card);
      playerHand.splice(index, 1);
      renderAll();
      setTimeout(cpuTurn, 800);
      return;
    }
  }
}
function isValidPlay(card, topCard) {
  return card.rank === topCard.rank + 1 || card.rank === topCard.rank - 1;
}
function cpuTurn() {
  for (let i = 0; i < cpuHand.length; i++) {
    const card = cpuHand[i];
    for (let j = 0; j < 2; j++) {
      const topCard = centerPiles[j][ centerPiles[j].length - 1 ];
      if (isValidPlay(card, topCard)) {
        centerPiles[j].push(card);
        cpuHand.splice(i, 1);
        renderAll();
        return;
      }
    }
  }
}
document.getElementById("start-game-btn").addEventListener("click", () => {
  dealCards();
  renderAll();
});
