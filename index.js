// Expressモジュールを読み込む（Webサーバーを作るためのライブラリ）
const express = require('express');

// Expressアプリケーションのインスタンスを作成
const app = express();

// サーバーが待ち受けるポート番号（http://localhost:3000）
const PORT = 3000;

// "public"フォルダの中身を、静的ファイルとして公開する設定
// 例：publicフォルダ内の画像やCSS、JSがそのままアクセス可能になる
app.use(express.static('public'));

// ルートURL（http://localhost:3000/）にアクセスがあったとき、index.htmlを返す
app.get('/', (req, res) => {
  // __dirnameはこのファイル（index.js）のあるディレクトリを指す
  res.sendFile(__dirname + '/public/index.html');
});

// サーバーを起動して、指定ポートでリクエストを待ち受ける
app.listen(PORT, () => {
  // サーバー起動成功時のメッセージをコンソールに表示
  console.log(`Server is running at http://localhost:${PORT}`);
});