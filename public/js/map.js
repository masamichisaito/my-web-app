const MAP_TILE_SIZE = 32;     // マップの1タイルのサイズ
const HERO_TILE_SIZE = 32;    // 勇者スプライト1コマのサイズ（64x64など）

const TILESET_SRC = '/img/rpg/pipo-map001.png'; // ← tilesetの画像
const MAP_SRC = '/maps/map.json'; // ← map.jsonの場所（/data じゃなく /maps に注意）
const HERO_SRC = '/img/rpg/hero1.png'; // 勇者スプライト

const canvas = document.getElementById('field');
const ctx = canvas.getContext('2d');

let heroImg;
let heroX = 5 * MAP_TILE_SIZE;
let heroY = 5 * MAP_TILE_SIZE;
let direction = 0; // 0:下, 1:左, 2:右, 3:上
let isMoving = false;
let frameCount = 0;
const heroFrames = [0, 1, 2, 1]; // 歩行アニメ順
let currentFrame = 0;

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

// 背景用キャンバス（ちらつき防止）
const bgCanvas = document.createElement('canvas');
bgCanvas.width = canvas.width;
bgCanvas.height = canvas.height;
const bgCtx = bgCanvas.getContext('2d');

// キー操作設定
window.addEventListener('keydown', (e) => {
  if (e.key in keys) {
    keys[e.key] = true;
    isMoving = true;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key in keys) {
    keys[e.key] = false;
    isMoving = Object.values(keys).some(Boolean);
  }
});

// マップを最初に1回だけ描画
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

// 勇者の移動処理
function updateHeroPosition() {
  const speed = 2;

  if (keys.ArrowUp) {
    heroY -= speed;
    direction = 0; // 実画像：上向きの行
  } else if (keys.ArrowDown) {
    heroY += speed;
    direction = 1; // 実画像：下向きの行
  } else if (keys.ArrowLeft) {
    heroX -= speed;
    direction = 2; // 実画像：左向きの行
  } else if (keys.ArrowRight) {
    heroX += speed;
    direction = 1; // 実画像：右向きの行
  }
}

// 勇者の描画処理
function drawHero() {
  const spriteX = heroFrames[currentFrame] * HERO_TILE_SIZE;
  const spriteY = direction * HERO_TILE_SIZE;

  ctx.drawImage(
    heroImg,
    spriteX, spriteY, HERO_TILE_SIZE, HERO_TILE_SIZE,
    heroX, heroY, HERO_TILE_SIZE, HERO_TILE_SIZE
  );
}

// メインループ
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgCanvas, 0, 0);

  if (isMoving) {
    updateHeroPosition();
    if (frameCount % 10 === 0) {
      currentFrame = (currentFrame + 1) % heroFrames.length;
    }
  } else {
    currentFrame = 1; // 止まってるときのフレーム
  }

  drawHero();
  frameCount++;
  requestAnimationFrame(gameLoop);
}

// 初期化処理
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
