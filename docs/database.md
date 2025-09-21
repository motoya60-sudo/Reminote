# データベース設計

Reminoteのデータベース設計とスキーマについて説明します。

## 🗄️ データベース概要

- **データベース**: PostgreSQL
- **ORM**: Prisma
- **接続**: 環境変数 `DATABASE_URL` で設定

## 📊 テーブル構成

### users テーブル
ユーザー情報を管理

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | UUID | PRIMARY KEY | ユーザーID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | メールアドレス |
| password | VARCHAR(255) | NOT NULL | ハッシュ化されたパスワード |
| name | VARCHAR(100) | NOT NULL | ユーザー名 |
| avatar | VARCHAR(500) | NULL | アバター画像URL |
| role | ENUM | NOT NULL | ユーザー役割（admin, manager, employee） |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

### teams テーブル
チーム情報を管理

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | UUID | PRIMARY KEY | チームID |
| name | VARCHAR(100) | NOT NULL | チーム名 |
| description | TEXT | NULL | チームの説明 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

### team_members テーブル
チームとメンバーの関連を管理

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | UUID | PRIMARY KEY | 関連ID |
| team_id | UUID | FOREIGN KEY | チームID |
| user_id | UUID | FOREIGN KEY | ユーザーID |
| role | ENUM | NOT NULL | チーム内での役割（owner, member） |
| joined_at | TIMESTAMP | NOT NULL | 参加日時 |

### projects テーブル
プロジェクト情報を管理

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | UUID | PRIMARY KEY | プロジェクトID |
| name | VARCHAR(100) | NOT NULL | プロジェクト名 |
| description | TEXT | NULL | プロジェクトの説明 |
| team_id | UUID | FOREIGN KEY | チームID |
| status | ENUM | NOT NULL | ステータス（active, completed, paused） |
| start_date | DATE | NOT NULL | 開始日 |
| end_date | DATE | NULL | 終了日 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

### tasks テーブル
タスク情報を管理

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | UUID | PRIMARY KEY | タスクID |
| title | VARCHAR(200) | NOT NULL | タスクタイトル |
| description | TEXT | NULL | タスクの説明 |
| project_id | UUID | FOREIGN KEY | プロジェクトID |
| assignee_id | UUID | FOREIGN KEY | 担当者ID |
| status | ENUM | NOT NULL | ステータス（todo, in_progress, completed） |
| priority | ENUM | NOT NULL | 優先度（low, medium, high） |
| due_date | TIMESTAMP | NULL | 期限 |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

### time_entries テーブル
作業時間記録を管理

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | UUID | PRIMARY KEY | 時間記録ID |
| user_id | UUID | FOREIGN KEY | ユーザーID |
| task_id | UUID | FOREIGN KEY | タスクID（NULL可） |
| project_id | UUID | FOREIGN KEY | プロジェクトID（NULL可） |
| description | TEXT | NOT NULL | 作業内容 |
| start_time | TIMESTAMP | NOT NULL | 開始時刻 |
| end_time | TIMESTAMP | NULL | 終了時刻 |
| duration | INTEGER | NULL | 作業時間（分） |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |
| updated_at | TIMESTAMP | NOT NULL | 更新日時 |

### notifications テーブル
通知情報を管理

| カラム名 | 型 | 制約 | 説明 |
|---------|---|------|------|
| id | UUID | PRIMARY KEY | 通知ID |
| user_id | UUID | FOREIGN KEY | ユーザーID |
| type | ENUM | NOT NULL | 通知タイプ（task_assigned, task_completed, etc.） |
| title | VARCHAR(200) | NOT NULL | 通知タイトル |
| message | TEXT | NOT NULL | 通知メッセージ |
| is_read | BOOLEAN | NOT NULL | 既読フラグ |
| created_at | TIMESTAMP | NOT NULL | 作成日時 |

## 🔗 リレーション

### ユーザー関連
```
users (1) ←→ (N) team_members (N) ←→ (1) teams
users (1) ←→ (N) time_entries
users (1) ←→ (N) notifications
users (1) ←→ (N) tasks (assignee)
```

### チーム関連
```
teams (1) ←→ (N) team_members (N) ←→ (1) users
teams (1) ←→ (N) projects
```

### プロジェクト関連
```
projects (1) ←→ (N) tasks
projects (1) ←→ (N) time_entries
```

### タスク関連
```
tasks (1) ←→ (N) time_entries
tasks (N) ←→ (1) users (assignee)
tasks (N) ←→ (1) projects
```

## 📈 インデックス

### パフォーマンス向上のためのインデックス

```sql
-- ユーザー検索用
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- チーム関連
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);

-- プロジェクト関連
CREATE INDEX idx_projects_team_id ON projects(team_id);
CREATE INDEX idx_projects_status ON projects(status);

-- タスク関連
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- 時間記録関連
CREATE INDEX idx_time_entries_user_id ON time_entries(user_id);
CREATE INDEX idx_time_entries_task_id ON time_entries(task_id);
CREATE INDEX idx_time_entries_start_time ON time_entries(start_time);

-- 通知関連
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
```

## 🔒 セキュリティ

### データ保護
- パスワードはbcryptでハッシュ化
- 個人情報は暗号化して保存
- アクセスログの記録

### 権限管理
- ユーザーロールによるアクセス制御
- チーム単位でのデータ分離
- APIレベルでの認証・認可

## 📊 データ移行

### 初期データ
```sql
-- 管理者ユーザーの作成
INSERT INTO users (id, email, password, name, role) VALUES 
('admin-uuid', 'admin@reminote.com', 'hashed_password', '管理者', 'admin');

-- デフォルトチームの作成
INSERT INTO teams (id, name, description) VALUES 
('default-team-uuid', 'デフォルトチーム', '初期チーム');
```

### バックアップ
```bash
# データベースバックアップ
pg_dump -h localhost -U username -d reminote > backup.sql

# データベース復元
psql -h localhost -U username -d reminote < backup.sql
```

## 🔧 開発環境セットアップ

### 1. データベース作成
```sql
CREATE DATABASE reminote;
CREATE USER reminote_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE reminote TO reminote_user;
```

### 2. 環境変数設定
```env
DATABASE_URL="postgresql://reminote_user:password@localhost:5432/reminote"
```

### 3. マイグレーション実行
```bash
npx prisma migrate dev
```

### 4. シードデータ投入
```bash
npx prisma db seed
```

## 📋 運用監視

### パフォーマンス監視
- クエリ実行時間の監視
- インデックス使用率の確認
- 接続数の監視

### ログ管理
- アクセスログ
- エラーログ
- セキュリティログ

### バックアップ戦略
- 日次フルバックアップ
- 時間単位増分バックアップ
- 災害復旧計画
