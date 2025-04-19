# Git 初期化 → GitHub リポジトリ連携（HTTPS + PAT 対応）一括手順

```bash
# プロジェクト直下で実行してください（例: my-web-app）

# Git初期化とコミット
git init
echo "node_modules/\n.env" > .gitignore
git add .
git commit -m "initial commit"
git branch -M main

# GitHubで新しい空のリポジトリ（README等なし）を作成
# → ブラウザで以下を実行: https://github.com/new
# → リポジトリ名は my-web-app（または任意）

# リモート登録（URLは自分のリポジトリに書き換えて）
git remote add origin https://github.com/あなたのユーザー名/my-web-app.git

# GitHubへ初回Push（認証が出たら、ユーザー名 + PAT）
git push -u origin main

1. GitHub右上アイコン → Settings
2. 左下の Developer settings → Personal access tokens → Tokens (classic)
3. Generate new token (classic) を選択
4. スコープに「repo」チェック、有効期限設定 → Generate token
5. トークンをコピー（再表示不可）

1. GitHub右上アイコン → Settings
2. 左下の Developer settings → Personal access tokens → Tokens (classic)
3. Generate new token (classic) を選択
4. スコープに「repo」チェック、有効期限設定 → Generate token
5. トークンをコピー（再表示不可）