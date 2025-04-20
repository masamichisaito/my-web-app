const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

const users = [];
let userId = 1;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// セッションミドルウェアの設定
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // テスト環境では false に設定
}));

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


// EJSでセッション使えるように
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// テンプレート設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静的ファイル
app.use(express.static(path.join(__dirname, 'public')));

// トップページ
app.get('/', (req, res) => {
  res.render('index', {
    title: 'ホームページ',
    message: 'ユーザー登録フォーム',
    errors: [],
    previous: {}
  });
});

// 入力フォーム
app.get('/form', (req, res) => {
  res.render('form', {
    title: 'ユーザー登録フォーム',
    errors: [],
    previous: {}
  });
});

// ユーザー登録
app.post('/users', (req, res) => {
  const { name, age } = req.body;
  const errors = [];

  if (!name) {
    errors.push('名前は必須です');
  } else if (name.length > 255) {
    errors.push('名前は255文字以内で入力してください');
  } else if (/[^a-zA-Z0-9ぁ-んァ-ン一-龥ーａ-ｚＡ-Ｚ０-９]/.test(name)) {
    errors.push('名前に無効な文字が含まれています');
  }

  const ageNumber = Number(age);
  if (!age) {
    errors.push('年齢は必須です');
  } else if (isNaN(ageNumber)) {
    errors.push('年齢は数字で入力してください');
  } else if (!Number.isInteger(ageNumber) || ageNumber <= 0) {
    errors.push('年齢は正の整数で入力してください');
  } else if (ageNumber > 120) {
    errors.push('年齢は適切な範囲で入力してください');
  }

  if (errors.length > 0) {
    return res.status(400).send(errors.join('、'));
  }

  users.push({
    id: userId++,
    name,
    age: ageNumber
  });

  res.redirect('/users');
});

// ユーザー一覧
app.get('/users', (req, res) => {
  res.render('users', { users });
});

// ユーザー削除
app.get('/users/:id/delete', (req, res) => {
  const userIdToDelete = parseInt(req.params.id, 10);
  const index = users.findIndex(user => user.id === userIdToDelete);

  if (index === -1) {
    console.log(`⚠️ ID ${userIdToDelete} のユーザーが見つかりませんでした`);
  } else {
    console.log(`🗑️ ID ${userIdToDelete} のユーザーを削除しました`);
    users.splice(index, 1);
  }

  res.redirect('/users');
});

// RPGルーティング読み込み
const rpgRoutes = require('./routes/rpg');
app.use('/rpg', rpgRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
