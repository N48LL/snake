const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const boardSize = 20;
const snake = [{ x: 10, y: 10 }];
const pickups = [];
let direction = "right";
let gameLoop;
let startTime;

function checkCollisions() {
  const head = snake[0];
  if (head.x < 0 || head.x >= canvas.width / boardSize || head.y < 0 || head.y >= canvas.height / boardSize) {
    clearInterval(gameLoop);
    const name = prompt(`Game over! Your time was ${Math.floor((Date.now() - startTime) / 1000)} seconds. Enter your name:`);
    if (name && (localStorage.getItem("scores") === null || getScores().length < 5 || snake.length - 1 > getScores()[4][1])) {
      saveScore(name, snake.length - 1, Math.floor((Date.now() - startTime) / 1000));
      alert("Score saved!");
    }
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      clearInterval(gameLoop);
      const name = prompt(`Game over! Your time was ${Math.floor((Date.now() - startTime) / 1000)} seconds. Enter your name:`);
      if (name && (localStorage.getItem("scores") === null || getScores().length < 5 || snake.length - 1 > getScores()[4][1])) {
        saveScore(name, snake.length - 1, Math.floor((Date.now() - startTime) / 1000));
        alert("Score saved!");
      }
    }
  }
}

function saveScore(name, score, time) {
  const data = `${name},${score},${time}\n`;
  // Save score to local storage
  if (localStorage.getItem("scores")) {
    localStorage.setItem("scores", localStorage.getItem("scores") + data);
  } else {
    localStorage.setItem("scores", data);
  }
}

function generatePickup() {
  let x, y;
  do {
    x = Math.floor(Math.random() * canvas.width / boardSize);
    y = Math.floor(Math.random() * canvas.height / boardSize);
  } while (snake.some((segment) => segment.x === x && segment.y === y));
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
    startTime = Date.now();
  });
  restartButton.addEventListener("click", () => {
    clearInterval(gameLoop);
    location.reload();
  });
  updateScoreTable(); // Call the correct function here
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
  const scores = localStorage.getItem("scores");
  if (scores) {
    const scoreData = scores.split("\n").map((score) => score.split(","));
    scoreData.pop(); 
    scoreData.sort((a, b) => b[1] - a[1]); 
    return scoreData.slice(0, 3).map((score) => [score[0], score[1], score[2]]); 
  } else {
    return [];
  }
}

function updateScoreTable() {
  const scoreTable = document.getElementById("score-table");
  const tbody = scoreTable.getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";
  const scores = getScores();
  for (let i = 0; i < scores.length; i++) {
    const tr = document.createElement("tr");
    const nameTd = document.createElement("td");
    const scoreTd = document.createElement("td");
    const timeTd = document.createElement("td");
    nameTd.textContent = scores[i][0];
    scoreTd.textContent = scores[i][1];
    timeTd.textContent = scores[i][2] + "s";
    tr.appendChild(nameTd);
    tr.appendChild(scoreTd);
    tr.appendChild(timeTd);
    tbody.appendChild(tr);
  }
}

startGame();