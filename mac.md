# Node.js + Express + Jest + Supertest 環境構築一括手順（Mac）

## 手順概要  
この通りにコピペで実行すれば、Expressサーバー構築＋自動テスト（Jest + Supertest）導入＆テスト成功まで一気に完了します。

---

```bash
# プロジェクト作成
mkdir my-web-app
cd my-web-app
npm init -y

# Expressインストール
npm install express

# アプリ本体作成
cat <<EOF > app.js
const express = require('express');
const app = express();
app.get('/', (req, res) => {
  res.status(200).send('Hello, test!');
});
module.exports = app;
EOF

# サーバー起動ファイル（任意）
cat <<EOF > server.js
const app = require('./app');
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
EOF

# テストツール導入
npm install --save-dev jest supertest

# package.json にテスト設定を追記
npx json -I -f package.json -e '
this.scripts.test="jest --verbose --runInBand";
this.jest={testEnvironment: "node"}'

# テストフォルダとファイル作成
mkdir tests
cat <<EOF > tests/app.test.js
const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });

  it('should return Hello, test!', async () => {
    const res = await request(app).get('/');
    expect(res.text).toBe('Hello, test!');
  });
});
EOF

# テスト実行
npm test