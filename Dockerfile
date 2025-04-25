# Node.js の公式イメージを使用
FROM node:18

# 作業ディレクトリを作成
WORKDIR /app

# 依存関係ファイルを先にコピー
COPY package*.json ./

# 依存パッケージをインストール
RUN npm install

# アプリ本体をコピー
COPY . .

# アプリ起動コマンド
CMD ["npm", "start"]
