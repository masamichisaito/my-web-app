// ✅ ログ付き 完成版 rpg.js（Docker+E2E完全対応）
const express = require('express');
const router = express.Router();

// ==============================
// 【通常機能ルーティング】
// ==============================

// チェック: エンカウントスキップ
router.get('/check-no-encounter', (req, res) => {
  const skip = !!req.session.noEncounter;
  console.log('🧪 /rpg/check-no-encounter →', skip);
  req.session.noEncounter = false;
  res.json({ noEncounter: skip });
});

// スタート画面 (GET)
router.get('/start', (req, res) => {
  console.log('📥 GET /start');
  req.session.hero = null;
  req.session.enemy = null;
  req.session.defeatedEnemy = null;
  req.session.log = null;
  req.session.logs = [];
  res.render('rpg/start', { title: 'RPG開始', error: null });
});

// スタート画面 (POST)
router.post('/start', (req, res) => {
  const { heroName } = req.body;
  console.log('📤 POST /start:', heroName);
  if (!heroName || heroName.trim() === '') {
    return res.render('rpg/start', { title: 'RPG開始', error: '名前は必須です' });
  }
  req.session.hero = { name: heroName, hp: 30 };
  req.session.enemy = null;
  req.session.log = null;
  req.session.logs = [];
  res.redirect('/rpg/map');
});

// マップ画面
router.get('/map', (req, res) => {
  const hero = req.session.hero;
  if (!hero) {
    console.warn('⚠️ heroが存在しない。セッション切れ？');
    return res.redirect('/rpg/start');
  }
  console.log('🗺️ /map accessed with hero:', hero);
  res.render('rpg/map', { hero });
});

// バトル画面
router.get('/battle', (req, res) => {
  if (!req.session.hero) return res.redirect('/rpg/start');

  if (!req.session.enemy || (!req.session.enemy.test)) { // テストフラグない場合だけランダム敵
    const enemies = [
      { name: 'スライム', maxHp: 20, img: '/img/rpg/slime.png' },
      { name: 'ゴブリン', maxHp: 25, img: '/img/rpg/goblin.png' },
      { name: 'コウモリ', maxHp: 28, img: '/img/rpg/bat.png' }
    ];
    const selected = enemies[Math.floor(Math.random() * enemies.length)];
    req.session.enemy = {
      name: selected.name,
      maxHp: selected.maxHp,
      hp: selected.maxHp,
      img: selected.img
    };
  }

  res.render('rpg/battle', {
    hero: req.session.hero,
    enemy: req.session.enemy
  });
});

// 攻撃ボタン
router.post('/attack', (req, res) => {
  const hero = req.session.hero;
  const enemy = req.session.enemy;
  if (!hero || !enemy) return res.redirect('/rpg/start');

  // --- 勇者の攻撃 ---
  const heroDamage = Math.floor(Math.random() * 4) + 3;
  enemy.hp = Math.max(enemy.hp - heroDamage, 0);
  console.log(`🗡️ 勇者の攻撃: ${heroDamage} ダメージ (残HP: ${enemy.hp})`);

  if (enemy.hp === 0) {
    req.session.defeatedEnemy = { ...enemy };
    req.session.enemy = null;
    req.session.log = `勇者 ${hero.name} の攻撃！${enemy.name} に ${heroDamage} ダメージ！ ${enemy.name} を倒した！`;
    req.session.noEncounter = true;
    return res.redirect('/rpg/result');
  }

  // --- 敵の反撃 ---
  const enemyDamage = Math.floor(Math.random() * 4) + 3;
  hero.hp = Math.max(hero.hp - enemyDamage, 0);
  console.log(`🛡️ 敵の反撃: ${enemyDamage} ダメージ (残HP: ${hero.hp})`);

  if (hero.hp === 0) {
    req.session.enemy = null;
    req.session.log = `勇者 ${hero.name} の攻撃！${enemy.name} に ${heroDamage} ダメージ！ ${enemy.name} の反撃！${hero.name} に ${enemyDamage} ダメージ！ ${hero.name} は倒れてしまった…`;
    req.session.hero.hp = 30; // 仮復活
    req.session.noEncounter = true;
    return req.session.save(err => {
      if (err) return res.status(500).send('内部エラー');
      res.redirect('/rpg/dead');
    });
  }

  // --- 継続バトル ---
  const log = `勇者 ${hero.name} の攻撃！${enemy.name} に ${heroDamage} ダメージ！ ${enemy.name} の反撃！${hero.name} に ${enemyDamage} ダメージ！`;
  req.session.logs.unshift(log);
  req.session.log = log;
  res.redirect('/rpg/battle');
});

// 勝利画面
router.get('/result', (req, res) => {
  const hero = req.session.hero;
  const enemy = req.session.defeatedEnemy;
  if (!hero || !enemy) return res.redirect('/rpg/start');
  hero.hp = Math.min(hero.hp + 10, 30);
  req.session.noEncounter = true;
  console.log('🏆 勝利！ noEncounter = true');
  res.render('rpg/result', { hero, enemy });
});

// 敗北画面
router.get('/dead', (req, res) => {
  req.session.noEncounter = true;
  console.log('💀 敗北... noEncounter = true');
  res.render('rpg/dead', { hero: req.session.hero });
});

// ==============================
// 【テスト専用API（E2Eサポート用）】
// ==============================

// 旧setup
router.post('/test/setup', (req, res) => {
  const { heroHP, monsterHP } = req.body;
  req.session.hero = { name: 'テスト勇者', hp: heroHP };
  req.session.enemy = { name: 'テストモンスター', maxHp: monsterHP, hp: monsterHP, img: '/img/rpg/slime.png', test: true };
  res.status(200).send('テストセットアップ完了');
});

// force-battle（最新）
router.post('/test/force-battle', (req, res) => {
  const { heroHP, monsterHP } = req.body;

  req.session.hero = {
    name: 'テスト勇者',
    maxHp: heroHP,
    hp: heroHP
  };

  req.session.enemy = {
    name: 'テストモンスター',
    maxHp: monsterHP,
    hp: monsterHP,
    img: '/img/rpg/test-monster.png',
    test: true
  };

  res.status(200).send('テストバトルセット完了');
});

// ==============================

module.exports = router;
