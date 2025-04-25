const express = require('express');
const path = require('path');
const session = require('express-session');
const rpgRoutes = require('./routes/rpg'); // ← ルーティングモジュール
const app = express();

const PORT = process.env.PORT || 3000;

// 🗂️ 静的ファイル（.json, .tmj のMIME補正付き）
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.json') || filePath.endsWith('.tmj')) {
      res.setHeader('Content-Type', 'application/json');
    }
  }
}));

// 📦 ミドルウェア設定
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'your-secret-key', // 本番では環境変数で管理！
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // 本番では true + HTTPS
}));

// 🌍 セッションをテンプレート内で使う用
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// 🖼️ テンプレートエンジン
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 🧩 RPGルート
app.use('/rpg', rpgRoutes);

// 🧪 セッション状態注入用API（テスト用）
app.post('/rpg/test/setup', (req, res) => {
  const { monsterHP, heroHP } = req.body;
  if (monsterHP !== undefined) req.session.monsterHP = monsterHP;
  if (heroHP !== undefined) req.session.heroHP = heroHP;
  res.status(200).send('Setup complete');
});

// 📋 ユーザーフォーム関連（確認用）
const users = [];
let userId = 1;

app.get('/', (req, res) => {
  res.render('index', {
    title: 'ホームページ',
    message: 'ユーザー登録フォーム',
    errors: [],
    previous: {}
  });
});

app.get('/form', (req, res) => {
  res.render('form', {
    title: 'ユーザー登録フォーム',
    errors: [],
    previous: {}
  });
});

app.post('/users', (req, res) => {
  const { name, age } = req.body;
  const errors = [];

  if (!name) errors.push('名前は必須です');
  else if (name.length > 255) errors.push('名前は255文字以内で入力してください');
  else if (/[^a-zA-Z0-9ぁ-んァ-ン一-龥ーａ-ｚＡ-Ｚ０-９]/.test(name)) {
    errors.push('名前に無効な文字が含まれています');
  }

  const ageNumber = Number(age);
  if (!age) errors.push('年齢は必須です');
  else if (isNaN(ageNumber)) errors.push('年齢は数字で入力してください');
  else if (!Number.isInteger(ageNumber) || ageNumber <= 0) {
    errors.push('年齢は正の整数で入力してください');
  } else if (ageNumber > 120) {
    errors.push('年齢は適切な範囲で入力してください');
  }

  if (errors.length > 0) {
    return res.status(400).send(errors.join('、'));
  }

  users.push({ id: userId++, name, age: ageNumber });
  res.redirect('/users');
});

app.get('/users', (req, res) => {
  res.render('users', { users });
});

app.get('/users/:id/delete', (req, res) => {
  const userIdToDelete = parseInt(req.params.id, 10);
  const index = users.findIndex(user => user.id === userIdToDelete);
  if (index !== -1) {
    users.splice(index, 1);
    console.log(`🗑️ ユーザーID ${userIdToDelete} を削除`);
  }
  res.redirect('/users');
});

　　　　　　　// 🚀 起動
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

module.exports = app;
