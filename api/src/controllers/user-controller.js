const userRepo = require('../repositories/user-repo');

class UserController {
  async createUser(req, res) {
    try {
      const { name, email, password } = req.body;

      // バリデーション
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: '名前、メールアドレス、パスワードは必須です'
        });
      }

      // メール形式チェック
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: '正しいメールアドレスを入力してください'
        });
      }

      // パスワード強度チェック
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'パスワードは6文字以上で入力してください'
        });
      }

      // ID生成（実際の運用ではUUIDなど使用）
      const id = `user_${Date.now()}`;

      const userData = {
        id,
        name,
        email,
        password
      };

      const user = await userRepo.createUser(userData);

      res.status(201).json({
        success: true,
        message: 'ユーザーが正常に作成されました',
        data: user
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'ユーザー作成中にエラーが発生しました'
      });
    }
  }

  // Firebase認証済みユーザーのプロフィール作成
  async createUserProfile(req, res) {
    try {
      const { name } = req.body;
      const userId = req.user.uid; // 認証ミドルウェアから取得
      const email = req.user.email;

      // バリデーション
      if (!name) {
        return res.status(400).json({
          success: false,
          message: '名前は必須です'
        });
      }

      // ユーザープロフィールを作成
      const userData = {
        id: userId,
        name,
        email,
        password: null // Firebase認証なのでパスワードは不要
      };

      const user = await userRepo.createUser(userData);

      res.status(201).json({
        success: true,
        message: 'ユーザープロフィールが正常に作成されました',
        data: user
      });
    } catch (error) {
      console.error('Create user profile error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'ユーザープロフィール作成中にエラーが発生しました'
      });
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await userRepo.getUserById(id);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(404).json({
        success: false,
        message: error.message || 'ユーザー取得中にエラーが発生しました'
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await userRepo.updateUser(id, updateData);

      res.status(200).json({
        success: true,
        message: 'ユーザーが正常に更新されました',
        data: user
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'ユーザー更新中にエラーが発生しました'
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await userRepo.deleteUser(id);

      res.status(200).json({
        success: true,
        message: 'ユーザーが正常に削除されました'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'ユーザー削除中にエラーが発生しました'
      });
    }
  }

  // 初期データ作成用
  async createInitialData(req, res) {
    try {
      const initialUsers = [
        { id: "user_001", name: "岡本結太", email: "okamoto@example.com", password: "password123" },
        { id: "user_002", name: "テストユーザー", email: "test@example.com", password: "password123" }
      ];

      const results = [];
      for (const userData of initialUsers) {
        try {
          const user = await userRepo.createUser(userData);
          results.push({ success: true, data: user });
        } catch (error) {
          results.push({ success: false, error: error.message, data: userData });
        }
      }

      res.status(200).json({
        success: true,
        message: '初期データ作成処理が完了しました',
        results
      });
    } catch (error) {
      console.error('Create initial data error:', error);
      res.status(500).json({
        success: false,
        message: error.message || '初期データ作成中にエラーが発生しました'
      });
    }
  }
}

module.exports = new UserController();
