// Define variables
const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const boardSize = 20;
const snake = [{ x: 10, y: 10 }];
const pickups = [];
let direction = "right";

function checkCollisions() {
  const head = snake[0];
  if (head.x < 0 || head.x >= canvas.width / boardSize || head.y < 0 || head.y >= canvas.height / boardSize) {
    clearInterval(gameLoop);
    const name = prompt("Game over! Enter your name:");
    if (name && (localStorage.getItem("scores") === null || getScores().length < 5 || snake.length - 1 > getScores()[4][1])) {
      saveScore(name, snake.length - 1);
      alert("Score saved!");
    }
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      clearInterval(gameLoop);
      const name = prompt("Game over! Enter your name:");
      if (name && (localStorage.getItem("scores") === null || getScores().length < 5 || snake.length - 1 > getScores()[4][1])) {
        saveScore(name, snake.length - 1);
        alert("Score saved!");
      }
    }
  }
}

function saveScore(name, score) {
  const data = `${name},${score}\n`;
  // Save score to local storage
  if (localStorage.getItem("scores")) {
    localStorage.setItem("scores", localStorage.getItem("scores") + data);
  } else {
    localStorage.setItem("scores", data);
  }
}

function generatePickup() {
  const x = Math.floor(Math.random() * canvas.width / boardSize);
  const y = Math.floor(Math.random() * canvas.height / boardSize);
  pickups.push({ x, y });
}

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
    pickups.splice(pickups.findIndex((pickup) => pickup.x === head.x && pickup.y === head.y), 1);
    generatePickup();
  } else {
    snake.pop();
  }
}

function update() {
  move();
  checkCollisions();
  draw();
}

function startGame() {
  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  restartButton.style.display = "none";
  startButton.addEventListener("click", () => {
    generatePickup();
    generatePickup();
    generatePickup();
    gameLoop = setInterval(update, 100);
    draw();
    startButton.style.display = "none";
    restartButton.style.display = "block";
  });
  restartButton.addEventListener("click", () => {
    clearInterval(gameLoop);
    snake.length = 1;
    direction = "right";
    generatePickup();
    generatePickup();
    generatePickup();
    gameLoop = setInterval(update, 100);
    draw();
    generateScoreTable();
    location.reload();
  });
  generateScoreTable();
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        if (direction !== "down") {
          direction = "up";
        }
        break;
      case "ArrowDown":
        if (direction !== "up") {
          direction = "down";
        }
        break;
      case "ArrowLeft":
        if (direction !== "right") {
          direction = "left";
        }
        break;
      case "ArrowRight":
        if (direction !== "left") {
          direction = "right";
        }
        break;
    }
  });
}

function getScores() {
  return localStorage.getItem("scores").split("\n").filter(Boolean).map((line) => line.split(",")).sort((a, b) => b[1] - a[1]);
}

function generateScoreTable() {
  const table = document.getElementById("score-table");
  const tbody = table.getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";
  const scores = localStorage.getItem("scores") ? getScores().slice(0, 3) : [];
  scores.forEach((score) => {
    const tr = document.createElement("tr");
    const nameTd = document.createElement("td");
    const scoreTd = document.createElement("td");
    nameTd.textContent = score[0];
    scoreTd.textContent = score[1];
    tr.appendChild(nameTd);
    tr.appendChild(scoreTd);
    tbody.appendChild(tr);
  });
}

startGame();