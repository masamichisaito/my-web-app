router.post('/rpg/test/setup', (req, res) => {
  req.session.hero = {
    name: req.body.heroName || 'テスト勇者',
    hp: req.body.heroHP ?? 30,
  };
  req.session.enemy = {
    name: req.body.monsterName || 'テストモンスター',
    hp: req.body.monsterHP ?? 20,
    maxHp: req.body.monsterHP ?? 20,
    img: '/img/rpg/slime.png',
    test: true // 👈 これを付ける！
  };
  req.session.logs = [];
  req.session.log = null;
  req.session.noEncounter = false;
  res.send('setup complete');
});
