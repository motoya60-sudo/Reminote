# コントリビューションガイド

Reminoteプロジェクトへの貢献方法について説明します。

## 🤝 貢献方法

### 1. イシューの報告
- バグ報告
- 機能要望
- ドキュメント改善提案

### 2. プルリクエスト
- バグ修正
- 新機能追加
- ドキュメント更新
- テスト追加

## 🚀 開発環境セットアップ

### 1. リポジトリのフォーク
```bash
# GitHubでリポジトリをフォーク
# ローカルにクローン
git clone https://github.com/yourusername/reminote.git
cd reminote
```

### 2. 依存関係のインストール
```bash
# 全ての依存関係をインストール
npm run install:all
```

### 3. 環境変数の設定
```bash
# 環境変数ファイルをコピー
cp env.example .env

# .envファイルを編集
# 必要な設定を入力
```

### 4. データベースのセットアップ
```bash
# データベース作成
createdb reminote_dev

# マイグレーション実行
cd api
npx prisma migrate dev
```

### 5. 開発サーバーの起動
```bash
# 開発環境を起動
npm run dev
```

## 📝 コーディング規約

### TypeScript/JavaScript
```typescript
// 関数の命名
function getUserById(id: string): User {
  // 実装
}

// 変数の命名
const userName = 'John Doe';
const isActive = true;

// インターフェースの命名
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// クラスの命名
class UserService {
  // 実装
}
```

### React コンポーネント
```tsx
// コンポーネントの命名
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user)}>編集</button>
    </div>
  );
};
```

### API エンドポイント
```typescript
// ルートの命名
app.get('/api/users/:id', getUserById);
app.post('/api/users', createUser);
app.put('/api/users/:id', updateUser);
app.delete('/api/users/:id', deleteUser);

// レスポンス形式
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## 🧪 テスト

### テストの実行
```bash
# 全てのテストを実行
npm run test

# APIのテストのみ実行
npm run test:api

# アプリのテストのみ実行
npm run test:app

# カバレッジレポート生成
npm run test:coverage
```

### テストの書き方
```typescript
// API テスト例
describe('User API', () => {
  test('GET /api/users/:id should return user', async () => {
    const response = await request(app)
      .get('/api/users/123')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
  });
});

// コンポーネント テスト例
describe('UserCard', () => {
  test('renders user information', () => {
    const user = { id: '1', name: 'John', email: 'john@example.com' };
    render(<UserCard user={user} onEdit={jest.fn()} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});
```

## 📋 プルリクエストの流れ

### 1. ブランチ作成
```bash
# メインブランチから最新を取得
git checkout main
git pull origin main

# フィーチャーブランチを作成
git checkout -b feature/user-authentication
```

### 2. 変更の実装
```bash
# 変更をコミット
git add .
git commit -m "feat: add user authentication"

# ブランチをプッシュ
git push origin feature/user-authentication
```

### 3. プルリクエスト作成
- GitHubでプルリクエストを作成
- テンプレートに従って記入
- レビュアーを指定

### 4. レビュー対応
- レビューコメントに対応
- 必要に応じて追加コミット
- テストの追加・修正

## 📝 コミットメッセージ規約

### フォーマット
```
<type>(<scope>): <subject>

<body>

<footer>
```

### タイプ
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント更新
- `style`: コードスタイル変更
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: その他の変更

### 例
```
feat(auth): add JWT authentication

- Add JWT token generation
- Add token validation middleware
- Add login/logout endpoints

Closes #123
```

## 🔍 コードレビュー

### レビューの観点
- コードの品質
- パフォーマンス
- セキュリティ
- テストの網羅性
- ドキュメントの更新

### レビューコメントの書き方
```typescript
// ❌ 悪い例
// このコードは良くない

// ✅ 良い例
// この部分は型安全性を向上させるために、以下のように修正することを提案します：
// const user: User = await getUserById(id);
```

## 🐛 バグ報告

### バグ報告テンプレート
```markdown
## バグの概要
簡潔な説明

## 再現手順
1. 手順1
2. 手順2
3. 手順3

## 期待される動作
何が起こるべきか

## 実際の動作
何が起こったか

## 環境
- OS: 
- ブラウザ: 
- バージョン: 

## 追加情報
スクリーンショット、ログなど
```

## 💡 機能要望

### 機能要望テンプレート
```markdown
## 機能の概要
簡潔な説明

## 背景・動機
なぜこの機能が必要か

## 詳細
機能の詳細な説明

## 代替案
他に考えられる解決策

## 追加情報
参考資料、スクリーンショットなど
```

## 📚 ドキュメント

### ドキュメント更新
- API仕様書の更新
- データベース設計書の更新
- デプロイガイドの更新
- READMEの更新

### ドキュメントの書き方
- 分かりやすい日本語で記述
- コード例を含める
- 図表を使って視覚的に説明
- 定期的に更新

## 🎯 貢献の種類

### コード
- バグ修正
- 新機能追加
- リファクタリング
- テスト追加

### ドキュメント
- README更新
- API仕様書更新
- コメント追加
- チュートリアル作成

### デザイン
- UI/UX改善
- アイコン作成
- ロゴデザイン
- ワイヤーフレーム

### テスト
- 単体テスト追加
- 統合テスト追加
- E2Eテスト追加
- パフォーマンステスト

## 🏆 貢献者

### 貢献者一覧
- [@username1](https://github.com/username1) - 初期開発
- [@username2](https://github.com/username2) - API開発
- [@username3](https://github.com/username3) - UI/UX改善

### 貢献者になるには
1. プルリクエストをマージ
2. イシューに貢献
3. ドキュメントを改善
4. コミュニティを支援

## 📞 サポート

### 質問・相談
- GitHub Issues
- Discord サーバー
- メール: support@reminote.com

### 緊急時
- セキュリティ問題: security@reminote.com
- 重大なバグ: urgent@reminote.com

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。
貢献するコードも同様にMITライセンスの下で公開されることに同意してください。
