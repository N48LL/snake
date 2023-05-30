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
    if (name) {
      saveScore(name, snake.length - 1, Math.floor((Date.now() - startTime) / 1000));
      alert("Score saved!");
    }
  }
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      clearInterval(gameLoop);
      const name = prompt(`Game over! Your time was ${Math.floor((Date.now() - startTime) / 1000)} seconds. Enter your name:`);
      if (name) {
        saveScore(name, snake.length - 1, Math.floor((Date.now() - startTime) / 1000));
        alert("Score saved!");
      }
    }
  }
}

async function saveScore(name, score, time) {
  const data = `${name},${score},${time}\n`;
  const fileName = "scores.csv";
  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: fileName,
      types: [
        {
          description: "CSV Files",
          accept: {
            "text/csv": [".csv"],
          },
        },
      ],
    });
    const writable = await fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
  } catch (error) {
    console.error(error);
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
    pickups.splice(
      pickups.findIndex((pickup) => pickup.x === head.x && pickup.y === head.y),
      1
    );
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

function updateScoreTable() {
  getScores("scores.csv").then((scores) => {
    const scoreTable = document.getElementById("score-table");
    scoreTable.innerHTML = "";
    scores.forEach((score) => {
      const row = document.createElement("tr");
      const nameCell = document.createElement("td");
      nameCell.textContent = score[0];
      const scoreCell = document.createElement("td");
      scoreCell.textContent = score[1];
      const timeCell = document.createElement("td");
      timeCell.textContent = score[2];
      row.appendChild(nameCell);
      row.appendChild(scoreCell);
      row.appendChild(timeCell);
      scoreTable.appendChild(row);
    });
  });
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
  updateScoreTable();
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

async function getScores(fileName) {
  let scores = [];
  const localScores = localStorage.getItem("scores");
  if (localScores) {
    const scoreData = localScores.split("\n").map((score) => score.split(","));
    scoreData.pop();
    scoreData.sort((a, b) => b[1] - a[1]);
    scores = scoreData.slice(0, 3).map((score) => [score[0], score[1], score[2]]);
  }
  try {
    const response = await fetch(fileName);
    const csvData = await response.text();
    const scoreData = csvData.split("\n").map((score) => score.split(","));
    scoreData.pop();
    scoreData.sort((a, b) => b[1] - a[1]);
    const fileScores = scoreData.slice(0, 3).map((score) => [score[0], score[1], score[2]]);
    scores = [...scores, ...fileScores].sort((a, b) => b[1] - a[1]).slice(0, 3);
  } catch (error) {
    console.error(error);
  }
  return scores;
}

startGame();