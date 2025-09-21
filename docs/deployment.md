# デプロイガイド

Reminoteアプリケーションのデプロイ方法について説明します。

## 🚀 デプロイ概要

### アーキテクチャ
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │   API Server    │    │   Database      │
│   (Expo)        │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│   iOS/Android   │    │   Heroku/AWS    │    │   Heroku/AWS    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### デプロイ先
- **API**: Heroku / AWS EC2
- **データベース**: Heroku Postgres / AWS RDS
- **モバイルアプリ**: Expo / App Store / Google Play

## 🔧 環境準備

### 必要なアカウント
- [Heroku](https://heroku.com) - APIサーバー用
- [Expo](https://expo.dev) - モバイルアプリ用
- [AWS](https://aws.amazon.com) - 本番環境用（オプション）

### 必要なツール
```bash
# Heroku CLI
npm install -g heroku

# Expo CLI
npm install -g @expo/cli

# AWS CLI（AWS使用時）
npm install -g aws-cli
```

## 📱 モバイルアプリのデプロイ

### 1. Expo設定

#### app.json の設定
```json
{
  "expo": {
    "name": "Reminote",
    "slug": "reminote",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.reminote"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.reminote"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### 2. ビルドとデプロイ

#### 開発ビルド
```bash
cd app
expo build:android
expo build:ios
```

#### 本番ビルド
```bash
cd app
expo build:android --type app-bundle
expo build:ios --type archive
```

### 3. ストア公開

#### Google Play Store
1. [Google Play Console](https://play.google.com/console)にアクセス
2. アプリを作成
3. APK/AABファイルをアップロード
4. ストア情報を入力
5. 審査を提出

#### Apple App Store
1. [App Store Connect](https://appstoreconnect.apple.com)にアクセス
2. アプリを作成
3. アーカイブファイルをアップロード
4. ストア情報を入力
5. 審査を提出

## 🔌 APIサーバーのデプロイ

### Heroku デプロイ

#### 1. Herokuアプリ作成
```bash
# Herokuにログイン
heroku login

# アプリ作成
heroku create reminote-api

# 環境変数設定
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set DATABASE_URL=your_database_url
```

#### 2. package.json の設定
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

#### 3. Procfile 作成
```
web: npm start
```

#### 4. デプロイ
```bash
# Gitリポジトリに追加
git add .
git commit -m "Deploy to Heroku"

# Herokuにデプロイ
git push heroku main
```

### AWS EC2 デプロイ

#### 1. EC2インスタンス作成
- インスタンスタイプ: t3.micro（無料枠）
- OS: Ubuntu 20.04 LTS
- セキュリティグループ: HTTP(80), HTTPS(443), SSH(22)

#### 2. サーバー設定
```bash
# システム更新
sudo apt update && sudo apt upgrade -y

# Node.js インストール
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 インストール
sudo npm install -g pm2

# アプリケーションクローン
git clone https://github.com/yourusername/reminote.git
cd reminote/api

# 依存関係インストール
npm install --production

# 環境変数設定
cp env.example .env
# .envファイルを編集
```

#### 3. PM2設定
```bash
# PM2でアプリケーション起動
pm2 start src/server.js --name "reminote-api"

# 自動起動設定
pm2 startup
pm2 save
```

#### 4. Nginx設定
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🗄️ データベースのデプロイ

### Heroku Postgres

#### 1. アドオン追加
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

#### 2. 接続情報取得
```bash
heroku config:get DATABASE_URL
```

#### 3. マイグレーション実行
```bash
heroku run npx prisma migrate deploy
```

### AWS RDS

#### 1. RDSインスタンス作成
- エンジン: PostgreSQL
- インスタンスクラス: db.t3.micro
- ストレージ: 20GB
- セキュリティグループ: ポート5432

#### 2. 接続設定
```env
DATABASE_URL="postgresql://username:password@your-rds-endpoint:5432/reminote"
```

#### 3. マイグレーション実行
```bash
npx prisma migrate deploy
```

## 🔐 SSL証明書設定

### Let's Encrypt（無料）
```bash
# Certbot インストール
sudo apt install certbot python3-certbot-nginx

# 証明書取得
sudo certbot --nginx -d your-domain.com

# 自動更新設定
sudo crontab -e
# 以下を追加
0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 監視とログ

### ログ管理
```bash
# Heroku ログ確認
heroku logs --tail

# PM2 ログ確認
pm2 logs reminote-api

# ログローテーション設定
pm2 install pm2-logrotate
```

### 監視設定
```bash
# ヘルスチェックエンドポイント
GET /api/health

# レスポンス例
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z",
  "uptime": 3600
}
```

## 🚨 トラブルシューティング

### よくある問題

#### 1. アプリが起動しない
```bash
# ログ確認
heroku logs --tail

# 環境変数確認
heroku config

# プロセス確認
heroku ps
```

#### 2. データベース接続エラー
```bash
# 接続テスト
heroku run npx prisma db pull

# 接続情報確認
heroku config:get DATABASE_URL
```

#### 3. ビルドエラー
```bash
# ビルドログ確認
heroku logs --tail --source app

# 依存関係確認
heroku run npm list
```

## 📋 デプロイチェックリスト

### デプロイ前
- [ ] 環境変数の設定確認
- [ ] データベースマイグレーション実行
- [ ] テストの実行
- [ ] ビルドの確認
- [ ] セキュリティ設定の確認

### デプロイ後
- [ ] ヘルスチェックの確認
- [ ] ログの確認
- [ ] パフォーマンスの確認
- [ ] セキュリティスキャンの実行
- [ ] バックアップの設定

## 🔄 CI/CD パイプライン

### GitHub Actions 設定
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "reminote-api"
          heroku_email: "your-email@example.com"
```

## 📈 スケーリング

### 水平スケーリング
```bash
# Heroku ワーカー追加
heroku ps:scale web=2

# PM2 クラスター設定
pm2 start src/server.js -i max
```

### 垂直スケーリング
- Heroku: プラン変更
- AWS: インスタンスタイプ変更
- データベース: インスタンスクラス変更
