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

var gameGrid = cardsArray.concat(cardsArray).sort(function () {
  return 0.5 - Math.random();
});

var firstGuess = "";
var secondGuess = "";
var count = 0;
var previousTarget = null;
var delay = 1200;

// 新增計分與計時器變數
var score = 0;
var timer = 0;
var timerInterval;

var game = document.getElementById("game");

// 建立 scoreboard 區塊
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

var grid = document.createElement("section");
grid.setAttribute("class", "grid");
game.appendChild(grid);

gameGrid.forEach(function (item) {
  var name = item.name,
    img = item.img;

  var card = document.createElement("div");
  card.classList.add("card");
  card.dataset.name = name;

  var front = document.createElement("div");
  front.classList.add("front");

  var back = document.createElement("div");
  back.classList.add("back");
  back.style.backgroundImage = "url(" + img + ")";

  grid.appendChild(card);
  card.appendChild(front);
  card.appendChild(back);
});

// 更新 scoreboard 資訊的函數
var updateScoreboard = function () {
  // 取得所有獨立卡牌名稱（以 name 為主）
  var uniqueNames = Array.from(
    new Set(
      cardsArray.map(function (card) {
        return card.name;
      })
    )
  );

  // 過濾出配對成功的卡牌（若該種類卡牌有 2 張標記為 match 則表示已記憶）
  var matchedNames = uniqueNames.filter(function (name) {
    var matchedCards = document.querySelectorAll(
      '.card[data-name="' + name + '"].match'
    );
    return matchedCards.length === 2;
  });

  // 計算未記憶的數量
  var unmatchedCount = uniqueNames.length - matchedNames.length;

  // 產生左側：已記憶卡牌的圖片列表
  var matchedHTML = matchedNames
    .map(function (name) {
      // 從原本的資料中找出該卡牌的圖片路徑
      var cardInfo = cardsArray.find(function (card) {
        return card.name === name;
      });
      return `<img src="${cardInfo.img}" alt="${name}" style="width:40px;height:40px;margin-right:5px;">`;
    })
    .join("");

  // 右側顯示計時器與未記憶數量
  var infoHTML = `
    <div>時間: ${timer}秒</div>
    <div>未記憶: ${unmatchedCount}</div>
  `;

  // 將 scoreboard 分為左右兩區
  scoreboard.innerHTML = `
    <div class="matched-container" style="display:flex; align-items:center;">
      ${matchedHTML}
    </div>
    <div class="info-container" style="text-align:right;">
      ${infoHTML}
    </div>
  `;
};

// 啟動計時器，每秒更新一次
timerInterval = setInterval(function () {
  timer++;
  updateScoreboard();
}, 1000);

var match = function () {
  var selected = document.querySelectorAll(".selected");
  selected.forEach(function (card) {
    card.classList.add("match");
  });
  // 成功配對後，計分增加（這裡 score 變數可以做其他用途）
  score++;
  updateScoreboard();
};

var resetGuesses = function () {
  firstGuess = "";
  secondGuess = "";
  count = 0;
  previousTarget = null;

  var selected = document.querySelectorAll(".selected");
  selected.forEach(function (card) {
    card.classList.remove("selected");
  });
};

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
