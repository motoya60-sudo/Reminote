# API仕様書

ReminoteのバックエンドAPIの完全な仕様書です。

## 📋 基本情報

- **ベースURL**: `http://localhost:3000`
- **認証方式**: JWT（JSON Web Token）
- **データ形式**: JSON
- **文字エンコーディング**: UTF-8

## 🔐 認証

### ログイン
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "ユーザー名",
      "role": "employee"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### ユーザー登録
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "ユーザー名"
}
```

### トークンリフレッシュ
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "jwt_refresh_token"
}
```

## 👤 ユーザー管理

### プロフィール取得
```http
GET /api/users/profile
Authorization: Bearer <access_token>
```

### プロフィール更新
```http
PUT /api/users/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "新しい名前",
  "avatar": "avatar_url"
}
```

## 👥 チーム管理

### チーム一覧取得
```http
GET /api/teams
Authorization: Bearer <access_token>
```

### チーム作成
```http
POST /api/teams
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "チーム名",
  "description": "チームの説明"
}
```

### チーム詳細取得
```http
GET /api/teams/:teamId
Authorization: Bearer <access_token>
```

## 📋 プロジェクト管理

### プロジェクト一覧取得
```http
GET /api/projects?teamId=:teamId
Authorization: Bearer <access_token>
```

### プロジェクト作成
```http
POST /api/projects
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "プロジェクト名",
  "description": "プロジェクトの説明",
  "teamId": "team_id",
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

## ✅ タスク管理

### タスク一覧取得
```http
GET /api/tasks?projectId=:projectId
Authorization: Bearer <access_token>
```

### タスク作成
```http
POST /api/tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "タスクタイトル",
  "description": "タスクの説明",
  "projectId": "project_id",
  "assigneeId": "user_id",
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

### タスク更新
```http
PUT /api/tasks/:taskId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "medium"
}
```

## ⏰ 時間追跡

### 時間記録作成
```http
POST /api/time-entries
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "taskId": "task_id",
  "description": "作業内容",
  "startTime": "2024-01-01T09:00:00Z",
  "endTime": "2024-01-01T17:00:00Z"
}
```

### 時間記録一覧取得
```http
GET /api/time-entries?userId=:userId&startDate=:startDate&endDate=:endDate
Authorization: Bearer <access_token>
```

## 🔔 通知

### 通知一覧取得
```http
GET /api/notifications
Authorization: Bearer <access_token>
```

### 通知既読更新
```http
PUT /api/notifications/:notificationId/read
Authorization: Bearer <access_token>
```

## 📊 レポート

### 作業時間レポート
```http
GET /api/reports/time?userId=:userId&startDate=:startDate&endDate=:endDate
Authorization: Bearer <access_token>
```

### プロジェクト進捗レポート
```http
GET /api/reports/progress?projectId=:projectId
Authorization: Bearer <access_token>
```

## 🚨 エラーレスポンス

### 400 Bad Request
```json
{
  "success": false,
  "error": "バリデーションエラー",
  "message": "入力データが正しくありません"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "認証エラー",
  "message": "トークンが無効です"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "権限エラー",
  "message": "この操作を実行する権限がありません"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "リソースが見つかりません",
  "message": "指定されたリソースが存在しません"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "サーバーエラー",
  "message": "内部サーバーエラーが発生しました"
}
```

## 🔧 開発者向け情報

### 環境変数
- `API_PORT`: APIサーバーのポート（デフォルト: 3000）
- `JWT_SECRET`: JWT署名用の秘密鍵
- `DATABASE_URL`: データベース接続URL
- `CORS_ORIGIN`: CORS許可オリジン

### レスポンス形式
すべてのAPIレスポンスは以下の形式に従います：

```json
{
  "success": boolean,
  "data": any,
  "error": string,
  "message": string
}
```

### ページネーション
リスト系のAPIでは、以下のクエリパラメータが利用可能です：

- `page`: ページ番号（デフォルト: 1）
- `limit`: 1ページあたりの件数（デフォルト: 20）
- `sort`: ソート順（例: `createdAt:desc`）
- `filter`: フィルタ条件（例: `status:active`）

### レート制限
- 認証なし: 100リクエスト/時間
- 認証あり: 1000リクエスト/時間
