const express = require('express');
const path = require('path');
const session = require('express-session');
const usersRouter = require('./routes/users');
const logger = require('./utils/logger');
const requestLogger = require('./middlewares/requestLogger');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// ビューエンジン
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ★ここで通常ルーティングを定義
app.get('/', (req, res) => {
  res.render('index', { title: 'ホームページ', message: 'ようこそ！', errors: [], previous: {} });
});

app.get('/form', (req, res) => {
  res.render('form', { title: 'ユーザー登録フォーム', errors: [], previous: {} });
});

// ルーティング（/users 以下）
app.use('/users', usersRouter);

// ===== エラーハンドリング =====

// 404ページ
app.use((req, res, next) => {
  res.status(404).render('error404');
});

// 500エラー
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message}`);
  res.status(500).render('error500');
});

// サーバ起動
app.listen(PORT, () => {
  logger.info(`✅ Server running at http://localhost:${PORT}`);
});

module.exports = app;
