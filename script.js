const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const restartBtn = document.getElementById("restartBtn");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem("snakeHighScore") || 0;
let gameInterval;
let isGameOver = false;

highScoreEl.textContent = highScore;

// Lắng nghe sự kiện bàn phím
document.addEventListener("keydown", changeDirection);
restartBtn.addEventListener("click", resetGame);

function startGame() {
  gameInterval = setInterval(gameLoop, 100);
}

function gameLoop() {
  if (isGameOver) return;
  
  clearCanvas();
  moveSnake();
  checkCollision();
  drawFood();
  drawSnake();
}

function clearCanvas() {
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? "#e94560" : "#00fff5"; // Đầu rắn màu hồng đỏ, thân màu xanh
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
  });
}

function moveSnake() {
  if (dx === 0 && dy === 0) return; // Chưa bấm phím thì chưa di chuyển

  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // Kiểm tra ăn mồi
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreEl.textContent = score;
    if (score > highScore) {
      highScore = score;
      highScoreEl.textContent = highScore;
      localStorage.setItem("snakeHighScore", highScore);
    }
    generateFood();
  } else {
    snake.pop();
  }
}

function changeDirection(event) {
  const keyPressed = event.keyCode;
  const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
  const KEY_A = 65, KEY_W = 87, KEY_D = 68, KEY_S = 83;

  const goingUp = dy === -1;
  const goingDown = dy === 1;
  const goingRight = dx === 1;
  const goingLeft = dx === -1;

  if ((keyPressed === LEFT || keyPressed === KEY_A) && !goingRight) {
    dx = -1; dy = 0;
  }
  if ((keyPressed === UP || keyPressed === KEY_W) && !goingDown) {
    dx = 0; dy = -1;
  }
  if ((keyPressed === RIGHT || keyPressed === KEY_D) && !goingLeft) {
    dx = 1; dy = 0;
  }
  if ((keyPressed === DOWN || keyPressed === KEY_S) && !goingUp) {
    dx = 0; dy = 1;
  }
}

function generateFood() {
  food.x = Math.floor(Math.random() * tileCount);
  food.y = Math.floor(Math.random() * tileCount);

  // Không tạo mồi trùng với thân rắn
  snake.forEach(part => {
    if (part.x === food.x && part.y === food.y) {
      generateFood();
    }
  });
}

function drawFood() {
  ctx.fillStyle = "#ffbd39";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function checkCollision() {
  const head = snake[0];

  // Chạm tường
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver();
  }

  // Cắn vào thân
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
    }
  }
}

function gameOver() {
  isGameOver = true;
  clearInterval(gameInterval);
  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#e94560";
  ctx.font = "bold 30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);

  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.fillText("Bấm 'Chơi lại' để bắt đầu ván mới", canvas.width / 2, canvas.height / 2 + 25);
}

function resetGame() {
  clearInterval(gameInterval);
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  score = 0;
  scoreEl.textContent = score;
  isGameOver = false;
  generateFood();
  startGame();
}

startGame();