"use strict";

var cardsArray = [
  { name: "shell", img: "img/blueshell.png" },
  { name: "star", img: "img/star.png" },
  { name: "bobomb", img: "img/bobomb.png" },
  { name: "mario", img: "img/mario.png" },
  { name: "luigi", img: "img/luigi.png" },
  { name: "peach", img: "img/peach.png" },
  { name: "1up", img: "img/1up.png" },
  { name: "mushroom", img: "img/mushroom.png" },
  { name: "thwomp", img: "img/thwomp.png" },
  { name: "bulletbill", img: "img/bulletbill.png" },
  { name: "coin", img: "img/coin.png" },
  { name: "goomba", img: "img/goomba.png" },
];

var gameGrid;
var firstGuess = "";
var secondGuess = "";
var count = 0;
var previousTarget = null;
var delay = 1200;
var score = 0;
var timer = 0;
var timerInterval;
var game = document.getElementById("game");

// 創建 scoreboard
var scoreboard = document.createElement("div");
scoreboard.id = "scoreboard";
scoreboard.style.cssText = `
  font-size: 36px;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #f9f9f9, #e0e0e0);
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 10px 20px;
  margin-bottom: 10px;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
game.prepend(scoreboard);

// 創建遊戲區塊
var grid = document.createElement("section");
grid.setAttribute("class", "grid");
game.appendChild(grid);

// 創建 "挑戰成功" 視窗
var winMessage = document.createElement("div");
winMessage.id = "winMessage";
winMessage.style.cssText = `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  display: none;
  z-index: 1000;
`;
winMessage.innerHTML = `
  <p>🎉 挑戰成功！🎉</p>
  <button id="restartButton" style="
    font-size: 20px;
    padding: 10px 20px;
    border: none;
    background: #28a745;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    margin-top: 10px;
  ">重新開始</button>
`;
document.body.appendChild(winMessage);

// 初始化遊戲
function initializeGame() {
  grid.innerHTML = "";
  gameGrid = cardsArray.concat(cardsArray).sort(() => 0.5 - Math.random());
  firstGuess = "";
  secondGuess = "";
  count = 0;
  previousTarget = null;
  score = 0;
  timer = 0;

  // 清除計時器
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    updateScoreboard();
  }, 1000);

  gameGrid.forEach((item) => {
    var card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = item.name;

    var front = document.createElement("div");
    front.classList.add("front");

    var back = document.createElement("div");
    back.classList.add("back");
    back.style.backgroundImage = `url(${item.img})`;

    grid.appendChild(card);
    card.appendChild(front);
    card.appendChild(back);
  });

  updateScoreboard();
}

// 更新 scoreboard
function updateScoreboard() {
  var uniqueNames = [...new Set(cardsArray.map((card) => card.name))];
  var matchedNames = uniqueNames.filter(
    (name) =>
      document.querySelectorAll(`.card[data-name="${name}"].match`).length === 2
  );
  var unmatchedCount = uniqueNames.length - matchedNames.length;

  var matchedHTML = matchedNames
    .map((name) => {
      var cardInfo = cardsArray.find((card) => card.name === name);
      return `<img src="${cardInfo.img}" alt="${name}" style="width:40px;height:40px;margin-right:5px;">`;
    })
    .join("");

  var infoHTML = `<div>時間: ${timer}秒</div><div>未記憶: ${unmatchedCount}</div>`;

  scoreboard.innerHTML = `
    <div class="matched-container" style="display:flex; align-items:center;">
      ${matchedHTML}
    </div>
    <div class="info-container" style="text-align:right;">
      ${infoHTML}
    </div>
  `;

  checkWinCondition();
}

// 檢查是否全部配對成功
function checkWinCondition() {
  if (document.querySelectorAll(".match").length === gameGrid.length) {
    clearInterval(timerInterval);
    winMessage.style.display = "block";
  }
}

// 重新開始遊戲
function restartGame() {
  winMessage.style.display = "none";
  initializeGame();
}

// 監聽重新開始按鈕
document.getElementById("restartButton").addEventListener("click", restartGame);

// 配對成功函數
function match() {
  document.querySelectorAll(".selected").forEach((card) => {
    card.classList.add("match");
  });
  score++;
  updateScoreboard();
}

// 重置猜測
function resetGuesses() {
  firstGuess = "";
  secondGuess = "";
  count = 0;
  previousTarget = null;

  document.querySelectorAll(".selected").forEach((card) => {
    card.classList.remove("selected");
  });
}

// 點擊卡牌事件
grid.addEventListener("click", function (event) {
  var clicked = event.target;

  if (
    clicked.nodeName === "SECTION" ||
    clicked === previousTarget ||
    clicked.parentNode.classList.contains("selected") ||
    clicked.parentNode.classList.contains("match")
  ) {
    return;
  }

  if (count < 2) {
    count++;
    if (count === 1) {
      firstGuess = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add("selected");
    } else {
      secondGuess = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add("selected");
    }

    if (firstGuess && secondGuess) {
      if (firstGuess === secondGuess) {
        setTimeout(match, delay);
      }
      setTimeout(resetGuesses, delay);
    }
    previousTarget = clicked;
  }
});

// 啟動遊戲
initializeGame();
