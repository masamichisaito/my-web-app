// ✅ ログ付き完全版 rpg.js（noEncounter対策＆動作確認用ログ付き）
const express = require('express');
const router = express.Router();

router.get('/check-no-encounter', (req, res) => {
  const skip = !!req.session.noEncounter;
  console.log('🧪 /rpg/check-no-encounter:', skip);
  req.session.noEncounter = false;
  res.json({ noEncounter: skip });
});

router.get('/start', (req, res) => {
  console.log('📥 GET /start');
  req.session.log = null;
  req.session.logs = [];
  res.render('rpg/start', { title: 'RPG開始', error: null });
});

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

router.get('/map', (req, res) => {
  const hero = req.session.hero;
  if (!hero) {
    console.warn('⚠️ heroが存在しません。セッション切れの可能性');
    return res.redirect('/rpg/start');
  }
  console.log('🗺️ /map accessed with hero:', hero);
  res.render('rpg/map', { hero });
});

router.get('/battle', (req, res) => {
  if (!req.session.hero) return res.redirect('/rpg/start');

  if (!req.session.enemy) {
    const enemies = [
      { name: 'スライム', maxHp: 20, img: '/img/rpg/slime.png' },
      { name: 'ゴブリン', maxHp: 25, img: '/img/rpg/goblin.png' },
      { name: 'コウモリ', maxHp: 28, img: '/img/rpg/bat.png' }
    ];
    const selected = enemies[Math.floor(Math.random() * enemies.length)];
    req.session.enemy = {
      name: selected.name,
      maxHp: selected.maxHp,
      hp: req.session.monsterHP ?? selected.maxHp,
      img: selected.img
    };
    req.session.log = `${selected.name} が現れた！！`;
  }

  console.log('⚔️ /battle: enemy =', req.session.enemy);
  res.render('rpg/battle', {
    hero: req.session.hero,
    enemy: req.session.enemy
  });
});

router.post('/attack', (req, res) => {
  const hero = req.session.hero;
  const enemy = req.session.enemy;
  if (!hero || !enemy) return res.redirect('/rpg/start');

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

  const enemyDamage = Math.floor(Math.random() * 4) + 3;
  hero.hp = Math.max(hero.hp - enemyDamage, 0);
  console.log(`🛡️ 敵の反撃: ${enemyDamage} ダメージ (残HP: ${hero.hp})`);

  if (hero.hp === 0) {
    req.session.enemy = null;
    req.session.log = `勇者 ${hero.name} の攻撃！${enemy.name} に ${heroDamage} ダメージ！ ${enemy.name} の反撃！${hero.name} に ${enemyDamage} ダメージ！ ${hero.name} は倒れてしまった…`;
    req.session.hero.hp = 30;
    req.session.noEncounter = true;
    return req.session.save(err => {
      if (err) return res.status(500).send('内部エラー');
      res.redirect('/rpg/dead');
    });
  }

  const log = `勇者 ${hero.name} の攻撃！${enemy.name} に ${heroDamage} ダメージ！ ${enemy.name} の反撃！${hero.name} に ${enemyDamage} ダメージ！`;
  req.session.logs.unshift(log);
  req.session.log = log;
  res.redirect('/rpg/battle');
});

router.get('/result', (req, res) => {
  const hero = req.session.hero;
  const enemy = req.session.defeatedEnemy;
  if (!hero || !enemy) return res.redirect('/rpg/start');
  hero.hp = Math.min(hero.hp + 10, 30);
  req.session.noEncounter = true;
  console.log('🏆 勝利！noEncounter = true');
  res.render('rpg/result', { hero, enemy });
});

router.get('/dead', (req, res) => {
  req.session.noEncounter = true;
  console.log('💀 敗北... noEncounter = true');
  res.render('rpg/dead', { hero: req.session.hero });
});

// ✅ 1歩だけエンカウント無効用
router.get('/check-no-encounter', (req, res) => {
  const skip = !!req.session.noEncounter;
  console.log('🧪 /rpg/check-no-encounter →', skip);
  req.session.noEncounter = false;
  res.json({ noEncounter: skip });
});

module.exports = router;
