// Define variables
const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const boardSize = 20;
const snake = [{ x: 10, y: 10 }];
const pickups = [];
let direction = "right";

// Draw the snake and pickups on the canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "green";
  snake.forEach((segment) => {
    ctx.fillRect(segment.x * boardSize, segment.y * boardSize, boardSize, boardSize);
  });
  ctx.fillStyle = "red";
  pickups.forEach((pickup) => {
    ctx.fillRect(pickup.x * boardSize, pickup.y * boardSize, boardSize, boardSize);
  });
}

// Move the snake based on user input
function move() {
  const head = { x: snake[0].x, y: snake[0].y };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }
  snake.unshift(head);
  if (pickups.some((pickup) => pickup.x === head.x && pickup.y === head.y)) {
    const index = pickups.findIndex((pickup) => pickup.x === head.x && pickup.y === head.y);
    pickups.splice(index, 1);
    snake.push(snake[snake.length - 1]);
    generatePickup();
  } else {
    snake.pop();
  }
}

// Check for collisions with game board boundaries and snake's own body
function checkCollisions() {
  const head = snake[0];
  if (head.x < 0 || head.x >= canvas.width / boardSize || head.y < 0 || head.y >= canvas.height / boardSize) {
    clearInterval(gameLoop);
    alert("Game over!");
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      clearInterval(gameLoop);
      alert("Game over!");
    }
  }
}

// Generate new pickups and check for collisions with the snake
function generatePickup() {
  const pickup = { x: Math.floor(Math.random() * canvas.width / boardSize), y: Math.floor(Math.random() * canvas.height / boardSize) };
  if (snake.some((segment) => segment.x === pickup.x && segment.y === pickup.y) || pickups.some((existingPickup) => existingPickup.x === pickup.x && existingPickup.y === pickup.y)) {
    generatePickup();
  } else {
    pickups.push(pickup);
  }
}

// Update the game state and redraw the canvas
function update() {
  move();
  checkCollisions();
  draw();
}

// Add event listeners for user input
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      direction = "up";
      break;
    case "ArrowDown":
      direction = "down";
      break;
    case "ArrowLeft":
      direction = "left";
      break;
    case "ArrowRight":
      direction = "right";
      break;
  }
});

// Call the update function in a loop
const gameLoop = setInterval(update, 100);

// Generate initial pickups
generatePickup();
generatePickup();
generatePickup();