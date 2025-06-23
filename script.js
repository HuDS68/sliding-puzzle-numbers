let gridSize = 4;
let tiles = [];
let moves = 0;
let seconds = 0;
let timerInterval;

const puzzle = document.getElementById("puzzle");

function init() {
  gridSize = parseInt(document.getElementById("gridSize").value);
  const total = gridSize * gridSize;

  // Reset stats
  clearInterval(timerInterval);
  moves = 0;
  seconds = 0;
  document.getElementById("moves").textContent = moves;
  document.getElementById("timer").textContent = seconds;

  // Generate and shuffle
  tiles = [...Array(total - 1).keys()].map(n => n + 1).concat(null);
  shuffle(tiles);

  puzzle.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
  puzzle.style.gridTemplateRows = `repeat(${gridSize}, 80px)`;

  draw();

  timerInterval = setInterval(() => {
    seconds++;
    document.getElementById("timer").textContent = seconds;
  }, 1000);
}

function shuffle(arr) {
  do {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  } while (!isSolvable(arr));
}

function isSolvable(arr) {
  const inversions = arr.filter(n => n !== null).flatMap((v, i) =>
    arr.slice(i + 1).filter(w => w !== null && v > w)
  ).length;
  const row = Math.floor(arr.indexOf(null) / gridSize);
  return (gridSize % 2 === 1)
    ? inversions % 2 === 0
    : (inversions + (gridSize - row)) % 2 === 0;
}

function draw() {
  puzzle.innerHTML = '';
  tiles.forEach((val, idx) => {
    const div = document.createElement("div");
    div.classList.add("tile");
    if (val === null) {
      div.classList.add("empty");
    } else {
      div.textContent = val;
      div.addEventListener("click", () => move(idx));
    }
    puzzle.appendChild(div);
  });
}

function move(index) {
  const emptyIndex = tiles.indexOf(null);
  const valid = getValidMoves(emptyIndex);
  if (!valid.includes(index)) return;

  [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
  moves++;
  document.getElementById("moves").textContent = moves;

  draw();

  if (checkWin()) {
    clearInterval(timerInterval);
    setTimeout(() => alert(`🎉 You win! Moves: ${moves}, Time: ${seconds}s`), 100);
  }
}

function getValidMoves(emptyIndex) {
  const row = Math.floor(emptyIndex / gridSize);
  const col = emptyIndex % gridSize;
  const moves = [];

  if (row > 0) moves.push(emptyIndex - gridSize); // up
  if (row < gridSize - 1) moves.push(emptyIndex + gridSize); // down
  if (col > 0) moves.push(emptyIndex - 1); // left
  if (col < gridSize - 1) moves.push(emptyIndex + 1); // right

  return moves;
}

function checkWin() {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) return false;
  }
  return true;
}

window.onload = init;
