# ベースイメージ
FROM node:18

# 作業ディレクトリ作成
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# サーバーを起動（本番用じゃないのでnpm start）
CMD ["npm", "start"]

# 外部に公開するポート（Expressアプリがlistenしてるポート）
EXPOSE 3000