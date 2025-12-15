const welcomeScreen = document.getElementById('welcome-screen');
const startGameBtn = document.getElementById('start-game');
const gameWrapper = document.getElementById('game-wrapper');

const cells = document.querySelectorAll('.cell');
const symbolButtons = document.querySelectorAll('.symbol-btn');
const board = document.getElementById('board');
const symbolChoice = document.getElementById('symbol-choice');

const overlay = document.getElementById('overlay');
const overlayMessage = document.getElementById('overlay-message');
const resetBtn = document.getElementById('reset');

let boardState = Array(9).fill('');
let playerSymbol = '';
let aiSymbol = '';
let currentPlayer = '';

startGameBtn.addEventListener('click', () => {
  welcomeScreen.classList.add('hidden');
  gameWrapper.classList.remove('hidden');
  symbolChoice.classList.remove('hidden');
});

symbolButtons.forEach(button => {
  button.addEventListener('click', () => {
    playerSymbol = button.getAttribute('data-symbol');
    aiSymbol = playerSymbol === 'X' ? 'O' : 'X';

    currentPlayer = Math.random() < 0.5 ? playerSymbol : aiSymbol;

    symbolChoice.classList.add('hidden');
    board.classList.remove('hidden');

    if (currentPlayer === aiSymbol) {
      setTimeout(aiMove, 400);
    }
  });
});

cells.forEach(cell => {
  cell.addEventListener('click', () => {
    const index = Number(cell.getAttribute('data-index'));

    if (boardState[index] !== '' || currentPlayer !== playerSymbol) return;

    makeMove(index, playerSymbol);

    if (checkWinner(playerSymbol)) {
      showOverlay('You Win!');
    } else if (isBoardFull()) {
      showOverlay('Draw!');
    } else {
      currentPlayer = aiSymbol;
      setTimeout(aiMove, 500);
    }
  });
});

function makeMove(index, symbol) {
  boardState[index] = symbol;
  cells[index].textContent = symbol;
}

function aiMove() {
  const emptyIndices = boardState
    .map((value, index) => (value === '' ? index : null))
    .filter(index => index !== null);

  if (emptyIndices.length === 0) return;

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randomIndex, aiSymbol);

  if (checkWinner(aiSymbol)) {
    showOverlay('You Lose!');
  } else if (isBoardFull()) {
    showOverlay('Draw!');
  } else {
    currentPlayer = playerSymbol;
  }
}

function checkWinner(symbol) {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winCombos.some(combo =>
    combo.every(index => boardState[index] === symbol)
  );
}

function isBoardFull() {
  return boardState.every(cell => cell !== '');
}

function showOverlay(message) {
  overlayMessage.textContent = message;
  overlay.style.display = 'flex';
}

resetBtn.addEventListener('click', () => {
  boardState = Array(9).fill('');
  cells.forEach(cell => (cell.textContent = ''));
  overlay.style.display = 'none';

  board.classList.add('hidden');
  symbolChoice.classList.remove('hidden');
  welcomeScreen.classList.remove('hidden');
  gameWrapper.classList.add('hidden');
  playerSymbol = '';
  aiSymbol = '';
  currentPlayer = '';
});
