const GRID_SIZE = 10;
let playerPosition = [0, 0];
let playerHealth = 100;
let playerPoints = 0;
let treasuresCollected = 0;
const exitPosition = [GRID_SIZE - 1, GRID_SIZE - 1];

// Initialize the grid
const grid = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }, () => ({
    type: randomCellType(),
    revealed: false,
  }))
);
grid[exitPosition[0]][exitPosition[1]].type = "exit";

// Random cell types
function randomCellType() {
  const random = Math.random();
  if (random < 0.1) return "treasure";
  if (random < 0.2) return "trap";
  if (random < 0.3) return "enemy";
  return "empty";
}

// Render the grid
function renderGrid() {
  const gridElement = document.getElementById("grid");
  gridElement.innerHTML = "";
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const cell = document.createElement("div");
      if (i === playerPosition[0] && j === playerPosition[1]) {
        cell.textContent = "P";
        cell.style.backgroundColor = "#aaffaa";
      } else if (grid[i][j].revealed) {
        switch (grid[i][j].type) {
          case "treasure":
            cell.textContent = "T";
            cell.style.backgroundColor = "#ffcc00";
            break;
          case "trap":
            cell.textContent = "X";
            cell.style.backgroundColor = "#ff6666";
            break;
          case "enemy":
            cell.textContent = "E";
            cell.style.backgroundColor = "#ff4444";
            break;
          case "exit":
            cell.textContent = "🚪";
            cell.style.backgroundColor = "#66ccff";
            break;
          default:
            cell.textContent = "";
            cell.style.backgroundColor = "#ddd";
        }
      }
      gridElement.appendChild(cell);
    }
  }
}

// Handle player movement
function movePlayer(direction) {
  const [x, y] = playerPosition;
  let newX = x;
  let newY = y;

  if (direction === "up" && x > 0) newX--;
  if (direction === "down" && x < GRID_SIZE - 1) newX++;
  if (direction === "left" && y > 0) newY--;
  if (direction === "right" && y < GRID_SIZE - 1) newY++;

  playerPosition = [newX, newY];
  handleCell(newX, newY);
  renderGrid();
  updateStats();
}

// Handle cell interaction
function handleCell(x, y) {
  const cell = grid[x][y];
  if (!cell.revealed) {
    cell.revealed = true;
    switch (cell.type) {
      case "treasure":
        playerPoints += 10;
        treasuresCollected++;
        addMessage("You found a treasure! +10 points.");
        break;
      case "trap":
        playerHealth -= 10;
        addMessage("You triggered a trap! -10 health.");
        break;
      case "enemy":
        playerHealth -= 20;
        addMessage("You encountered an enemy! -20 health.");
        break;
      case "exit":
        if (treasuresCollected >= 3) {
          addMessage("Congratulations! You escaped with " + playerPoints + " points!");
          resetGame();
        } else {
          addMessage("You need to collect 3 treasures to escape!");
        }
        break;
    }
  }
  checkGameOver();
}

// Add messages to the message box
function addMessage(message) {
  const messagesElement = document.getElementById("messages");
  messagesElement.textContent = message;
}

// Update player stats
function updateStats() {
  document.getElementById("health").textContent = playerHealth;
  document.getElementById("points").textContent = playerPoints;
  document.getElementById("treasures").textContent = treasuresCollected;
}

// Check if the game is over
function checkGameOver() {
  if (playerHealth <= 0) {
    addMessage("Game Over! Your health reached 0.");
    resetGame();
  }
}

// Reset the game
function resetGame() {
  playerPosition = [0, 0];
  playerHealth = 100;
  playerPoints = 0;
  treasuresCollected = 0;
  grid.forEach(row => row.forEach(cell => (cell.revealed = false)));
  renderGrid();
  updateStats();
}

// Initial render
renderGrid();
updateStats();
