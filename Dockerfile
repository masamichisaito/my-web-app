# Node.jsのAlpine版公式イメージを使う
FROM node:18-alpine

WORKDIR /app

# 依存だけインストールする
COPY package*.json ./
RUN npm install

# アプリケーション本体をコピー
COPY . .

# ローカルnode_modulesを消してからbuildする場合はこれもあり
# RUN rm -rf node_modules && npm install --production

EXPOSE 3000

CMD ["npm", "start"]