const express = require('express');
const router = express.Router();

// GET /rpg/start（勇者の名前入力）
router.get('/start', (req, res) => {
  res.render('rpg/start', {
    title: 'RPG開始',
    error: null
  });
});

// POST /rpg/start（勇者登録処理）
router.post('/start', (req, res) => {
  const { heroName } = req.body;

  if (!heroName || heroName.trim() === '') {
    return res.render('rpg/start', {
      title: 'RPG開始',
      error: '名前は必須です'
    });
  }

 // すでに勇者が存在していればスキップ（再出撃モード）
if (!req.session.hero) {
  req.session.hero = {
    name: heroName,
    hp: 30
  };
}

  // 敵＆ログもクリアしておく
  req.session.enemy = null;
  req.session.log = null;
  req.session.logs = []; // ←ログ履歴を初期化

  res.redirect('/rpg/battle');
});

// GET /rpg/battle（バトル画面）
router.get('/battle', (req, res) => {
  if (!req.session.hero) {
    return res.redirect('/rpg/start');
  }

  // テスト用のHP指定があれば反映（勇者）
  if (req.session.heroHP !== undefined) {
    req.session.hero.hp = req.session.heroHP;
  }

  // 敵が未登録ならランダムで生成
  if (!req.session.enemy) {
    const enemies = [
      { name: 'スライム', maxHp: 20, img: '/img/slime.png' },
      { name: 'ゴブリン', maxHp: 25, img: '/img/goblin.png' },
      { name: 'コウモリ', maxHp: 28, img: '/img/bat.png' }
    ];

    const selectedEnemy = enemies[Math.floor(Math.random() * enemies.length)];

    // テスト用のmonsterHPがあればそれを使用
    const initialHP = req.session.monsterHP ?? selectedEnemy.maxHp;

    req.session.enemy = {
      name: selectedEnemy.name,
      maxHp: selectedEnemy.maxHp,
      hp: initialHP,
      img: selectedEnemy.img
    };

    req.session.log = `${selectedEnemy.name} が現れた！！`;
  }

  console.log('敵情報（セッション）:', req.session.enemy);

  res.render('rpg/battle', {
    hero: req.session.hero,
    enemy: req.session.enemy
  });
});

// POST /rpg/attack（勇者の攻撃処理）
router.post('/attack', (req, res) => {
  const hero = req.session.hero;
  const enemy = req.session.enemy;

  if (!hero || !enemy) {
    return res.redirect('/rpg/start');
  }

  // 勇者の攻撃：3〜6ダメージ
  const heroDamage = Math.floor(Math.random() * 4) + 3;
  enemy.hp -= heroDamage;

  let log = `勇者 ${hero.name} の攻撃！${enemy.name} に ${heroDamage} ダメージ！`;
  req.session.logs.unshift(log); // ← 新しいログを先頭に

  // 敵のHPが0以下 → 勝利
  if (enemy.hp <= 0) {
    req.session.defeatedEnemy = {
      name: enemy.name,
      maxHp: enemy.maxHp,
      hp: enemy.hp, 
      img: enemy.img
    };
    req.session.enemy = null;
    req.session.log = log + ` ${enemy.name} を倒した！`;
    return res.redirect('/rpg/result');
  }

  // 敵の反撃：2〜5ダメージ
  const enemyDamage = Math.floor(Math.random() * 4) + 3;
  hero.hp -= enemyDamage;

  log += ` ${enemy.name} の反撃！${hero.name} に ${enemyDamage} ダメージ！`;
  req.session.logs.unshift(log); // ← 新しいログを先頭に

if (hero.hp <= 0) {
  req.session.enemy = null;
  req.session.log = log + ` ${hero.name} は倒れてしまった…`;
  return res.redirect('/rpg/dead');
}

  req.session.logs.push(log);
  req.session.log = log;
  res.redirect('/rpg/battle');

});

// GET /rpg/result（勝利画面）
router.get('/result', (req, res) => {
  const hero = req.session.hero;
  const defeatedEnemy = req.session.defeatedEnemy;
  req.session.hero.hp = Math.min(req.session.hero.hp + 10, 30);

  if (!hero || !defeatedEnemy) {
    return res.redirect('/rpg/start'); // 不正な遷移を防ぐ
  }

  res.render('rpg/result', {
    hero,
    enemy: defeatedEnemy
  });
});

router.get('/dead', (req, res) => {
  res.render('rpg/dead', {
    hero: req.session.hero
  });
});

module.exports = router;
