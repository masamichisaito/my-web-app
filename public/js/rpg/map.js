// ✅ 完全対応版 map.js（マップ画面のエンカウント制御込み）
const MAP_TILE_SIZE = 32;
const HERO_TILE_SIZE = 32;

const TILESET_SRC = '/img/rpg/pipo-map001.png';
const MAP_SRC = '/maps/map.json';
const HERO_SRC = '/img/rpg/hero1.png';

const canvas = document.getElementById('field');
const ctx = canvas.getContext('2d');

let heroImg;
let heroX = 5 * MAP_TILE_SIZE;
let heroY = 5 * MAP_TILE_SIZE;
let targetX = heroX;
let targetY = heroY;

let direction = 0;
let isMoving = false;
let frameCount = 0;
let currentFrame = 1;

const heroFrames = [0, 1, 2, 1];

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

const MOVE_SPEED = 2;
const bgCanvas = document.createElement('canvas');
bgCanvas.width = canvas.width;
bgCanvas.height = canvas.height;
const bgCtx = bgCanvas.getContext('2d');

let noEncounter = false;

window.addEventListener('load', () => {
  fetch('/rpg/check-no-encounter')
    .then(res => res.json())
    .then(data => {
      noEncounter = data.noEncounter;
    });
});

window.addEventListener('keydown', (e) => {
  if (e.key in keys) keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  if (e.key in keys) keys[e.key] = false;
});

async function drawMapOnce() {
  const mapData = await fetch(MAP_SRC).then(res => {
    if (!res.ok) throw new Error('map.jsonの読み込み失敗');
    return res.json();
  });

  const tileset = new Image();
  tileset.src = TILESET_SRC;
  await new Promise(resolve => tileset.onload = resolve);

  const layer = mapData.layers[0];
  const mapW = mapData.width;

  layer.data.forEach((tileIndex, i) => {
    if (tileIndex === 0) return;
    const col = i % mapW;
    const row = Math.floor(i / mapW);
    const x = col * MAP_TILE_SIZE;
    const y = row * MAP_TILE_SIZE;

    const tileId = tileIndex - 1;
    const tilesPerRow = tileset.width / MAP_TILE_SIZE;
    const sx = (tileId % tilesPerRow) * MAP_TILE_SIZE;
    const sy = Math.floor(tileId / tilesPerRow) * MAP_TILE_SIZE;

    bgCtx.drawImage(tileset, sx, sy, MAP_TILE_SIZE, MAP_TILE_SIZE, x, y, MAP_TILE_SIZE, MAP_TILE_SIZE);
  });
}

function updateHeroPosition() {
  if (isMoving) {
    const dx = targetX - heroX;
    const dy = targetY - heroY;

    if (dx !== 0) heroX += Math.sign(dx) * MOVE_SPEED;
    if (dy !== 0) heroY += Math.sign(dy) * MOVE_SPEED;

    if (Math.abs(heroX - targetX) < MOVE_SPEED && Math.abs(heroY - targetY) < MOVE_SPEED) {
      heroX = targetX;
      heroY = targetY;
      isMoving = false;
      currentFrame = 1;
      checkForEncounter();
    }

    if (frameCount % 8 === 0) {
      currentFrame = (currentFrame + 1) % heroFrames.length;
    }
    return;
  }

  if (keys.ArrowUp) {
    targetY -= MAP_TILE_SIZE;
    direction = 3;
    isMoving = true;
  } else if (keys.ArrowLeft) {
    targetX -= MAP_TILE_SIZE;
    direction = 1;
    isMoving = true;
  } else if (keys.ArrowDown) {
    targetY += MAP_TILE_SIZE;
    direction = 0;
    isMoving = true;
  } else if (keys.ArrowRight) {
    targetX += MAP_TILE_SIZE;
    direction = 2;
    isMoving = true;
  }
}

function checkForEncounter() {
  if (noEncounter) {
    noEncounter = false;
    return;
  }

  const encounterChance = 0.1;
  if (Math.random() < encounterChance) {
    window.location.href = '/rpg/battle';
  }
}

function drawHero() {
  const spriteX = heroFrames[currentFrame] * HERO_TILE_SIZE;
  const spriteY = direction * HERO_TILE_SIZE;
  ctx.drawImage(heroImg, spriteX, spriteY, HERO_TILE_SIZE, HERO_TILE_SIZE, heroX, heroY, HERO_TILE_SIZE, HERO_TILE_SIZE);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgCanvas, 0, 0);
  updateHeroPosition();
  drawHero();
  frameCount++;
  requestAnimationFrame(gameLoop);
}

async function initGame() {
  heroImg = new Image();
  heroImg.src = HERO_SRC;
  await Promise.all([
    new Promise(resolve => heroImg.onload = resolve),
    drawMapOnce()
  ]);
  gameLoop();
}

initGame();
