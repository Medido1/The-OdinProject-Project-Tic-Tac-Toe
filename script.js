const circleClass = "circle";
const xClass = "x";
let currentClass = xClass;
let currentGameType;
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const gameBoard = document.querySelector("[data-board]");
const gameCells = document.querySelectorAll(".cell");
const resultPanel = document.querySelector("[data-result-panel]");
const restartBtn = document.querySelector("[data-restart-button]");
const multiPlayeGameForm = document.querySelector(
  "[data-multiplayer-game-form]",
);
const gameTypeForm = document.querySelector("[data-game-type-form]");
const xMarkButton = document.querySelector("[data-x-mark]");
const oMarkButton = document.querySelector("[data-o-mark]");

function setHoverMark() {
  gameBoard.classList.remove(xClass, circleClass);
  gameBoard.classList.add(currentClass);
}

function swapTurns() {
  currentClass = currentClass === xClass ? circleClass : xClass;
}

function checkForWin(turn) {
  return winningCombinations.some((combination) =>
    combination.every((index) => gameCells[index].classList.contains(turn)),
  );
}

function checkForDraw() {
  return [...gameCells].every(
    (cell) =>
      cell.classList.contains(xClass) || cell.classList.contains(circleClass),
  );
}

function resetBoard() {
  gameCells.forEach((cell) => {
    cell.classList.remove(xClass, circleClass);
  });
}

function endGame(turn, draw) {
  const gameResult = document.querySelector(".game_result");
  const player1 = document.getElementById("player1").value;
  const player2 = document.getElementById("player2").value;
  resultPanel.classList.remove("hide");
  if (!draw) {
    if (currentGameType === "multiplayer") {
      if (turn === xClass) {
        gameResult.textContent = `${player1} wins!!`;
      } else {
        gameResult.textContent = `${player2} wins!!`;
      }
    } else if (turn === xClass) {
      gameResult.textContent = "You win!!";
    } else {
      gameResult.textContent = "You lost :(";
    }
  } else {
    gameResult.textContent = "Draw!!";
  }
}

function getRemainingCells() {
  return [...gameCells].filter(
    (cell) =>
      !(
        cell.classList.contains(xClass) || cell.classList.contains(circleClass)
      ),
  );
}

function getRandomIndex(arr) {
  return Math.floor(Math.random() * arr.length);
}

function setAIMark() {
  const remainingCells = getRemainingCells();
  if (remainingCells.length < 1) return;
  const index = getRandomIndex(remainingCells);
  remainingCells[index].classList.add(circleClass);
}

function checkGame(){
  if (checkForWin(currentClass)){
    endGame(currentClass, false);
  }
  if (checkForDraw()){
    endGame(currentClass, true);
  }
  if (currentGameType === "multiplayer"){
    swapTurns();
    setHoverMark();
  }
  if (currentGameType === "AI"){
    setAIMark();
    if (checkForWin(circleClass)) {
      endGame(circleClass, false);
    }
    if (checkForDraw()) {
      endGame(circleClass, true);
    }
  }
}

function setMark(e) {
  const cell = e.target;
  if (cell.classList.contains(xClass) || cell.classList.contains(circleClass))
    return;
  cell.classList.add(currentClass);
  checkGame();
}

function showBoard() {
  if (currentGameType === "AI"){
    const markChoicePanel = document.querySelector(".mark_choice");
    markChoicePanel.classList.remove("hide");
  }
  gameTypeForm.classList.add("hide");
  multiPlayeGameForm.classList.add("hide");
  gameBoard.classList.remove("hide");
}

function startGame(e) {
  e.preventDefault();
  showBoard();
  setHoverMark();
  gameCells.forEach((cell) => {
    cell.addEventListener("click", setMark);
  });
}

function restartGame(e) {
  resetBoard();
  resultPanel.classList.add("hide");
  startGame(e);
}

function showMultiplayerForm() {
  gameTypeForm.classList.add("hide");
  multiPlayeGameForm.classList.remove("hide");
}

function getGameType(e) {
  e.preventDefault();
  const multiPlayer = document.getElementById("multiplayer");
  const AI = document.getElementById("AI");
  if (multiPlayer.checked) {
    currentGameType = "multiplayer";
    showMultiplayerForm();
  }
  if (AI.checked) {
    currentGameType = "AI";
    startGame(e);
  }
}


restartBtn.addEventListener("click", restartGame);
multiPlayeGameForm.addEventListener("submit", startGame);
gameTypeForm.addEventListener("submit", getGameType);
xMarkButton.addEventListener("click", (e) => {
  if (currentClass !== xClass){
    currentClass = xClass;
    restartGame(e);
  }
})
oMarkButton.addEventListener("click", (e) => {
  if (currentClass !== circleClass){
    currentClass = circleClass;
    restartGame(e);
  }
})
