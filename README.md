# Reminote（リモノート）

リモートワーク管理アプリケーション（React Native + Node.js）

## 📱 アプリについて

Reminoteは、リモートワークを効率的に管理するためのモバイルアプリケーションです。チームでの協働作業、作業時間の追跡、リアルタイム通知などの機能を提供します。

## 🏗️ プロジェクト構成

```
Reminote/
├── api/                 # バックエンドAPI（Node.js/Express）
├── app/                 # フロントエンドアプリ（React Native/Expo）
├── docs/                # ドキュメント
├── shared/              # 共通ライブラリと型定義
├── .gitignore
├── env.example
├── package.json         # ルートレベルの管理
└── README.md
```

## 🚀 セットアップ

### 必要な環境

- Node.js（18.0.0以上）
- npm（8.0.0以上）
- Expo CLI（モバイル開発用）

### インストール手順

1. リポジトリをクローン
```bash
git clone <repository-url>
cd Reminote
```

2. 全ての依存関係をインストール
```bash
npm run install:all
```

3. 環境変数を設定
```bash
cp env.example .env
# .envファイルを編集して設定を入力
```

## 💻 開発

### 開発環境の起動

APIとアプリを同時に起動：
```bash
npm run dev
```

個別に起動する場合：
```bash
# APIサーバーのみ起動
npm run dev:api

# モバイルアプリのみ起動
npm run dev:app
```

### 利用可能なコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | APIとアプリを同時起動 |
| `npm run dev:api` | APIサーバーのみ起動 |
| `npm run dev:app` | モバイルアプリのみ起動 |
| `npm run build` | APIとアプリをビルド |
| `npm run test` | 全てのテストを実行 |
| `npm run install:all` | 全ての依存関係をインストール |
| `npm run clean` | node_modulesをクリーンアップ |

## 🔌 API

APIサーバーはデフォルトでポート3000で動作します。

### エンドポイント

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| `GET` | `/api/health` | ヘルスチェック |
| `POST` | `/api/auth/login` | ユーザーログイン |
| `POST` | `/api/auth/register` | ユーザー登録 |
| `GET` | `/api/users/profile` | ユーザープロフィール取得 |
| `PUT` | `/api/users/profile` | ユーザープロフィール更新 |

## 📱 モバイルアプリ

React NativeとExpoで構築されたモバイルアプリケーションです。

### 主な機能

- 🔐 ユーザー認証
- ⏰ リモートワーク時間追跡
- 👥 チーム協働
- 🔔 リアルタイム通知

## 📚 ドキュメント

詳細なドキュメントは`docs/`フォルダを参照してください：

- [API仕様書](./docs/api.md)
- [データベース設計](./docs/database.md)
- [デプロイガイド](./docs/deployment.md)
- [コントリビューションガイド](./docs/contributing.md)

## 🤝 コントリビューション

1. リポジトリをフォーク
2. フィーチャーブランチを作成
3. 変更を加える
4. テストを追加（該当する場合）
5. プルリクエストを送信

## 📄 ライセンス

MIT License

---

## 🆘 トラブルシューティング

### よくある問題

**Q: アプリが起動しない**
A: 依存関係が正しくインストールされているか確認してください：
```bash
npm run install:all
```

**Q: APIに接続できない**
A: 環境変数が正しく設定されているか確認してください：
```bash
# .envファイルの内容を確認
cat .env
```

**Q: ビルドエラーが発生する**
A: キャッシュをクリアして再試行してください：
```bash
npm run clean
npm run install:all
```
