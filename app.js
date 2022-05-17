//###---DND---###
/** @type {HTMLCanvasElement} */
//Global Variables
let canvas = document.getElementById("sprite");
let ctx = canvas.getContext("2d");
let canvasW = (canvas.width = 800);
let canvasH = (canvas.height = 500);
let keyPresses = {};
const numOfGoblins = 1000;
let goblinArray = [];
let nextGoblin = 0;
let goblinIntervals = 1500;
let lastTime = 0;
let animationStart = false;
let score = 0;
let escaped = 0;
let gameWin = false;
let gameOver = false;
let squeak = new Audio("sounds/squeak.wav");
let cackle = new Audio("sounds/cackle.wav");

//User object to be upgraded
const user = {
  character: {},
  bag: [],
  x: 0,
  y: 0,
  w: 24,
  h: 32,
  spriteX: 0,
  spriteY: 4,
  hasMoved: false,
  FPS: 12,
  playerSpeed: 3,
};

//Goblin class to create multiple goblins.
let gob = new Image();
gob.src = "images/goblin.png";
let goblinFrame = 0;

class Goblin {
  constructor() {
    this.x = 0;
    this.y = Math.round(Math.random() * canvasH);
    this.w = 16;
    this.h = 29.5;
    this.speed = Math.random() * 1.5 + 0.4;
    this.frameX = 0;
    this.frameY = 2;
    this.goblinsEscaped = false;
  }
  update() {
    this.x += this.speed;
    this.frameX >= 2 ? (this.frameX = 0) : this.frameX++;
    if (this.x > canvasW && gameOver === false) {
      escaped += 1;
      this.goblinsEscaped = true;
    } else if (this.x < -1) {
      this.goblinsEscaped = true;
    }
    if (
      user.x < this.x + this.w &&
      user.x + user.w > this.x &&
      user.y < this.y + this.h &&
      user.y + user.h > this.y &&
      gameWin === false &&
      gameOver === false
    ) {
      score += 1;
      this.x = -this.speed;
      squeak.play();
    }
  }
  draw() {
    if (this.y > 12 && this.y < 420) {
      ctx.drawImage(
        gob,
        this.frameX * this.w,
        this.frameY * this.h,
        this.w,
        this.h,
        this.x,
        this.y,
        this.w * 1.5,
        this.h * 1.5
      );
    }
  }
}

//Weapon arrays to set different damages with each weapon-2.0
const weapon = {
  sword: ["miss", 2, 2, 4, 4, 5, 6, 7, 12],
  axe: ["miss", 5, 5, 6, 6, 7, 7, 10, 11],
  staff: ["miss", "miss", 6, 7, 8, 8, 8, 13, 13],
  bow: ["miss", "miss", 4, 5, 6, 7, 9, 10, 15],
  club: ["miss", 4, 4, 5, 5, 5, 5],
};

// World items to be found on the board
const worldItems = {
  pass: ["level 1", "level 2", "level 3"],
  chest: ["shield", "att X2", "heal", "manaP", "bomb"],
};

//Level array to create different levels-2.0
let levels = [];

// Characters to choose
const water = {
  name: "Ragnail",
  health: 100,
  mana: 100,
  weapon: weapon.axe,
  //special: storm,
};
const earth = {
  name: "Charlemagne",
  health: 100,
  mana: 100,
  weapon: weapon.sword,
  //special: earthquake,
};
const fire = {
  name: "Sutr",
  health: 100,
  mana: 100,
  weapon: weapon.staff,
  //special: flamethrower,
};
const air = {
  name: "Oberon",
  health: 100,
  mana: 100,
  weapon: weapon.staff,
  //special: hurricane,
};

//Coming levels-2.0
const orc = {
  health: 30,
  weapon: weapon.sword,
  position: {
    x: 0,
    y: 0,
  },
};
const lich = {
  health: 50,
  weapon: weapon.staff,
  //special: summon(),
  position: {
    x: 0,
    y: 0,
  },
};

//Function for character selector.
const choseFire = () => {
  user.character = fire;
  console.log(`You have chosen Sutr.` + JSON.stringify(user));
};
const choseEarth = () => {
  user.character = earth;
  console.log(`You have chosen Charlemagne.` + JSON.stringify(user));
};
const choseWater = () => {
  user.character = water;
  console.log(`You have chosen Ragnail.` + JSON.stringify(user));
};
const choseAir = () => {
  user.character = air;
  console.log(`You have chosen Oberon.` + JSON.stringify(user));
};
$(() => {
  $("#fire").on("click", choseFire);
  $("#water").on("click", choseWater);
  $("#earth").on("click", choseEarth);
  $("#air").on("click", choseAir);
});

//After selecting Character change to intro with tutorial
const selected = () => $("#start").show(1000);
const startGame = () => {
  $(".mainMenu").hide(1000);
  $(".intro").show(1000);
};
$(() => {
  $("#start").on("click", startGame);
  $("#start").on("click", level1Setup);
  $(".selected").on("click", selected);
});
let spriteImg = new Image();
//Chapter 1 setup
const level1Setup = () => {
  user.x = 720;
  user.y = 200;
  if (user.character === fire) {
    spriteImg.src = "images/fire.png";
  } else if (user.character === water) {
    spriteImg.src = "images/water.png";
  } else if (user.character === air) {
    spriteImg.src = "images/air.png";
  } else if (user.character === earth) {
    spriteImg.src = "images/earth.png";
  }
};
//Chapter 1
const dnG = () => {
  $(".intro").hide(1000);
  $("#map").show(1000);
  $(".chp1").show(1000);
  $("#game-map").show(1000);
  $("#sprite").show(1000);
  animationStart = true;
  animate(0);
  $(".score").show();
  $(".escaped").show();
};

$(() => {
  $("#lvl-1").on("click", dnG);
});

//Canvas animation for the game
const background = new Image();
background.src = "images/game-map.png";

function drawSprite(
  img,
  spriteSheetX,
  spriteSheetY,
  spriteWidth,
  spriteHeight,
  positionX,
  positionY,
  positionW,
  positionH
) {
  ctx.drawImage(
    img,
    spriteSheetX,
    spriteSheetY,
    spriteWidth,
    spriteHeight,
    positionX,
    positionY,
    positionW,
    positionH
  );
}

function animate(timestamp) {
  if (animationStart || escaped <= 15) {
    ctx.clearRect(0, 0, canvasW, canvasH);
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    nextGoblin += deltatime;
    ctx.drawImage(background, 0, 0, canvasW, canvasH);
    gameEnd();
    drawSprite(
      spriteImg,
      user.w * user.spriteX,
      user.h * user.spriteY,
      user.w,
      user.h,
      user.x,
      user.y,
      user.w * 2,
      user.h * 2
    );
    moveSprite();
    if (nextGoblin > goblinIntervals) {
      goblinArray.push(new Goblin());
      nextGoblin = 0;
    }
    [...goblinArray].forEach((object) => object.update());
    [...goblinArray].forEach((object) => object.draw());
    goblinArray = goblinArray.filter((object) => !object.goblinsEscaped);
    checkGameWin();
    checkGameOver();
    scoreBoard();
    console.log(escaped);
    console.log(score);
    requestAnimationFrame(animate);
  }
}

function scoreBoard() {
  if (score > 0 || escaped > 0) {
    $(".score").text(`Goblins Caught :${score}`);
    $(".escaped").text(`Goblins Escaped:${escaped}`);
  }
}

//Functions to check variables if game is won or lost
function checkGameWin() {
  if (score > 100) {
    gameWin = true;
    goblinIntervals += 300000;
    if (score > 25 || score > 50 || score > 75) {
      goblinIntervals -= 100;
    }
  }
}
function checkGameOver() {
  if (escaped > 15) {
    gameOver = true;
  }
}

function gameEnd() {
  if (gameOver || gameWin) {
    let text = "You Win!";
    $("#reload").show();

    if (gameOver) {
      text = "Game Over";
      goblinIntervals = 0;
      user.x = -100;
      cackle.play();
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvasH / 3.2, canvasW, 80);
    ctx.font = "75px fantasy";
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "white");
    gradient.addColorStop("0.5", "white");
    gradient.addColorStop("1.0", "white");
    ctx.fillStyle = gradient;
    ctx.fillText(text, 10, canvas.height / 2);
  }
}

//Keyup or down listener keycode is deceprecated
window.addEventListener("keydown", function (event) {
  keyPresses[event.key] = true;
  user.hasMoved = true;
});

window.addEventListener("keyup", function (event) {
  keyPresses[event.key] = false;
  user.hasMoved = false;
});

function moveSprite() {
  if (keyPresses.w && user.y > 12) {
    user.y -= user.playerSpeed + 0.35;
    user.spriteY = 0;
    user.hasMoved = true;
  } else if (keyPresses.s && user.y < 400) {
    user.y += user.playerSpeed + 0.35;
    user.spriteY = 2;
    user.hasMoved = true;
  } else if (keyPresses.a && user.x > 32) {
    user.x -= user.playerSpeed + 0.35;
    user.spriteY = 3;
    user.hasMoved = true;
  } else if (keyPresses.d && user.x < 720) {
    user.x += user.playerSpeed + 0.35;
    user.spriteY = 1;
    user.hasMoved = true;
  }
  if (user.spriteX < 2 && user.hasMoved) {
    user.spriteX++;
  } else {
    user.spriteX = 0;
  }
}

// Hidden divs
$(document).ready(function () {
  $(".intro").hide();
  $("#start").hide();
  $("#map").hide();
  $("#game-map").hide();
  $(".chp1").hide();
  $("#sprite").hide();
  $(".score").hide();
  $(".escaped").hide();
  $("#reload").hide();
});
