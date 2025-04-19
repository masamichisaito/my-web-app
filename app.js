const express = require('express');
const path = require('path');
const app = express();
const users = [];
let userId = 1; // ユーザーIDを自動付与するためのカウンター

// ミドルウェア
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// EJSテンプレート設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静的ファイル
app.use(express.static(path.join(__dirname, 'public')));

// トップページ（フォーム）
app.get('/', (req, res) => {
  res.render('index', {
    title: 'ホームページ',
    message: 'ユーザー登録フォーム',
    errors: [],
    previous: {}
  });
});

// ユーザー登録処理（POST）
app.post('/users', (req, res) => {
  const { name, age } = req.body;
  const errors = [];

  // 名前のバリデーション
  if (!name) {
    errors.push('名前は必須です');
  } else if (name.length > 255) {
    errors.push('名前は255文字以内で入力してください');
  } else if (/[^a-zA-Z0-9ぁ-んァ-ン一-龥ーａ-ｚＡ-Ｚ０-９]/.test(name)) {
    errors.push('名前に無効な文字が含まれています');
  }

  // 年齢のバリデーション
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


// ✅ ユーザー一覧表示（GET /users）← これが抜けていた！
app.get('/users', (req, res) => {
  res.render('users', { users });
});

// ユーザー削除（GET /users/:id/delete）
app.get('/users/:id/delete', (req, res) => {
  const userIdToDelete = parseInt(req.params.id, 10);

  const index = users.findIndex(user => user.id === userIdToDelete);

  if (index === -1) {
    console.log(`⚠️ ID ${userIdToDelete} のユーザーが見つかりませんでした`);
  } else {
    console.log(`🗑️ ID ${userIdToDelete} のユーザーを削除しました`);
    users.splice(index, 1); // 該当ユーザーを削除
  }

  res.redirect('/users');
});

module.exports = app;
