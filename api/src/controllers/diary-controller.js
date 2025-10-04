const diaryRepo = require('../repositories/diary-repo');

class DiaryController {
  // 日記作成
  async createDiary(req, res) {

    console.log(req.body);
    try {
      const { title, content, date, image } = req.body;
      const userId = req.user.uid; // 認証ミドルウェアから取得

      // バリデーション
      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'タイトルと内容は必須です'
        });
      }

      // ID生成
      const id = `diary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const diaryData = {
        id,
        title,
        content,
        createdAt: date || new Date().toISOString(),
        image: image || null,
        userId
      };

      const diary = await diaryRepo.createDiary(diaryData);

      res.status(201).json({
        success: true,
        message: '日記が正常に作成されました',
        data: diary
      });
    } catch (error) {
      console.error('Create diary error:', error);
      res.status(500).json({
        success: false,
        message: error.message || '日記作成中にエラーが発生しました'
      });
    }
  }

  // 日記取得（ID指定）
  async getDiary(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.uid;

      const diary = await diaryRepo.getDiaryById(id);

      // ユーザーが自分の日記かチェック
      if (diary.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'この日記にアクセスする権限がありません'
        });
      }

      res.status(200).json({
        success: true,
        data: diary
      });
    } catch (error) {
      console.error('Get diary error:', error);
      res.status(404).json({
        success: false,
        message: error.message || '日記取得中にエラーが発生しました'
      });
    }
  }

  // ユーザーの日記一覧取得
  async getUserDiaries(req, res) {
    try {
      const userId = req.user.uid;
      const { limit = 50 } = req.query;

      const diaries = await diaryRepo.getDiariesByUserId(userId, parseInt(limit));

      res.status(200).json({
        success: true,
        data: diaries,
        count: diaries.length
      });
    } catch (error) {
      console.error('Get user diaries error:', error);
      res.status(500).json({
        success: false,
        message: error.message || '日記一覧取得中にエラーが発生しました'
      });
    }
  }

  // 全日記一覧取得（管理者用）
  async getAllDiaries(req, res) {
    try {
      const { limit = 50 } = req.query;

      const diaries = await diaryRepo.getAllDiaries(parseInt(limit));

      res.status(200).json({
        success: true,
        data: diaries,
        count: diaries.length
      });
    } catch (error) {
      console.error('Get all diaries error:', error);
      res.status(500).json({
        success: false,
        message: error.message || '日記一覧取得中にエラーが発生しました'
      });
    }
  }

  // 日記更新
  async updateDiary(req, res) {
    try {
      const { id } = req.params;
      const { title, content, date, image } = req.body;
      const userId = req.user.uid;

      // 日記の存在確認と権限チェック
      const existingDiary = await diaryRepo.getDiaryById(id);
      if (existingDiary.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'この日記を編集する権限がありません'
        });
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (date !== undefined) updateData.date = date;
      if (image !== undefined) updateData.image = image;

      const diary = await diaryRepo.updateDiary(id, updateData);

      res.status(200).json({
        success: true,
        message: '日記が正常に更新されました',
        data: diary
      });
    } catch (error) {
      console.error('Update diary error:', error);
      res.status(500).json({
        success: false,
        message: error.message || '日記更新中にエラーが発生しました'
      });
    }
  }

  // 日記削除
  async deleteDiary(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.uid;

      // 日記の存在確認と権限チェック
      const existingDiary = await diaryRepo.getDiaryById(id);
      if (existingDiary.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'この日記を削除する権限がありません'
        });
      }

      await diaryRepo.deleteDiary(id);

      res.status(200).json({
        success: true,
        message: '日記が正常に削除されました'
      });
    } catch (error) {
      console.error('Delete diary error:', error);
      res.status(500).json({
        success: false,
        message: error.message || '日記削除中にエラーが発生しました'
      });
    }
  }

  // 日記検索
  async searchDiaries(req, res) {
    try {
      const { q } = req.query;
      const userId = req.user.uid;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: '検索キーワードを入力してください'
        });
      }

      const diaries = await diaryRepo.searchDiaries(userId, q);

      res.status(200).json({
        success: true,
        data: diaries,
        count: diaries.length,
        searchTerm: q
      });
    } catch (error) {
      console.error('Search diaries error:', error);
      res.status(500).json({
        success: false,
        message: error.message || '日記検索中にエラーが発生しました'
      });
    }
  }

  // 日付範囲で日記取得
  async getDiariesByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const userId = req.user.uid;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: '開始日と終了日を指定してください'
        });
      }

      const diaries = await diaryRepo.getDiariesByDateRange(userId, startDate, endDate);

      res.status(200).json({
        success: true,
        data: diaries,
        count: diaries.length,
        dateRange: { startDate, endDate }
      });
    } catch (error) {
      console.error('Get diaries by date range error:', error);
      res.status(500).json({
        success: false,
        message: error.message || '日付範囲での日記取得中にエラーが発生しました'
      });
    }
  }
}

module.exports = new DiaryController();
