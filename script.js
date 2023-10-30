//template
const cardTemplate = document.createElement("template");
cardTemplate.innerHTML = `
    <slot name="card-div"> 
        <slot name="card-content"></slot>
    </slot>

`;

//component
class Card extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    let clone = cardTemplate.content.cloneNode(true);
    shadowRoot.append(clone);
  }
}

customElements.define("card-template", Card);

document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.querySelector(".start-button");
  startButton.addEventListener("click", function () {
    const countdownElement = document.getElementById("countdown-timer");

    function updateCountdown() {
      let timeLeft = parseInt(countdownElement.textContent, 10);

      if (timeLeft > 0) {
        timeLeft -= 1;
        countdownElement.textContent = timeLeft;
        setTimeout(updateCountdown, 1000);
      } else {
        countdownElement.textContent = "Time's up!";
        function timeout() {
          alert("Out of time :(");
          location.reload();
        }
        timeout();
      }
    }
    updateCountdown();
    const cards = document.querySelectorAll(".card-div");
    let flippedCards = [];

    // Array of symbols with two of each
    const symbols = ["&", "&", "+", "+", "*", "*"];

    // Shuffle the symbols using the Fisher-Yates algorithm
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    shuffleArray(symbols);

    function handleCardClick(event) {
      const card = event.currentTarget;
      const cardData = card.getAttribute("data-card");

      if (card.classList.contains("flipped") || flippedCards.length >= 2) {
        return; // Prevent flipping more than two cards at a time
      }

      card.classList.add("flipped");
      flippedCards.push(card);
      card.textContent = cardData;

      console.log(flippedCards);
      if (flippedCards.length === 2) {
        const [firstCard, secondCard] = flippedCards;
        const firstCardData = firstCard.getAttribute("data-card");
        const secondCardData = secondCard.getAttribute("data-card");

        if (firstCardData === secondCardData) {
          // Matched
          setTimeout(() => {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            flippedCards = [];

            // Check if all cards are matched
            const allMatched =
              document.querySelectorAll(".card-div.matched").length ===
              cards.length;
            if (allMatched) {
              alert("Congratulations! You've won the game!");
              location.reload();
            }
          }, 500);
        } else {
          // Not a match, flip the cards back
          setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.textContent = "";
            secondCard.textContent = "";
            flippedCards = [];
          }, 500);
        }
      }
    }

    cards.forEach((card) => {
      card.addEventListener("click", handleCardClick);
      const symbol = symbols.pop();
      card.setAttribute("data-card", symbol); // Set card data
    });
  });
});

