app.post('/rpg/test/setup', (req, res) => {
  const { monsterHP, heroHP } = req.body;
  if (monsterHP !== undefined) {
    req.session.monsterHP = monsterHP;
  }
  if (heroHP !== undefined) {
    req.session.heroHP = heroHP;
  }
  res.status(200).send('Setup complete');
});