const studyRepo = require('../repositories/study-repo');
const tagRepo = require('../repositories/tag-repo');
const linkRepo = require('../repositories/study-tags-link-repo');

class StudyController {
  // 勉強記録作成
  async createStudy(req, res) {
    try {
      const { title, content, image, tags = [] } = req.body;
      const userId = req.user.uid;

      if (!title || !content) {
        return res.status(400).json({
          success: false,
          message: 'タイトルと内容は必須です'
        });
      }

      const id = `study_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const studyData = { id, title, content, image: image || null, userId };
      const study = await studyRepo.createStudy(studyData);

      let tagIds = [];
      if (tags.length > 0) {
        const createdTags = await tagRepo.createTags(tags);
        tagIds = createdTags.map(tag => tag.id);
        await linkRepo.createLinks(id, tagIds);
      }

      res.status(201).json({
        success: true,
        message: '勉強記録が正常に作成されました',
        data: { ...study, tags: tagIds }
      });
    } catch (error) {
      console.error('Create study error:', error);
      res.status(500).json({
        success: false,
        message: error.message || '勉強記録作成中にエラーが発生しました'
      });
    }
  }

  // 勉強記録取得（ID指定）
  async getStudy(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.uid;
      const study = await studyRepo.getStudyById(id);

      if (study.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'この勉強記録にアクセスする権限がありません'
        });
      }

      const tagIds = await linkRepo.getTagsByStudy(id);
      res.status(200).json({
        success: true,
        data: { ...study, tags: tagIds }
      });
    } catch (error) {
      console.error('Get study error:', error);
      res.status(404).json({
        success: false,
        message: error.message || '勉強記録取得中にエラーが発生しました'
      });
    }
  }

  // ユーザーの勉強記録一覧取得
  async getStudies(req, res) {
    try {
      const userId = req.user.uid;
      const { limit = 50 } = req.query;
      const studies = await studyRepo.getStudiesByUserId(userId, parseInt(limit));

      res.status(200).json({
        success: true,
        data: studies,
        count: studies.length
      });
    } catch (error) {
      console.error('Get user studies error:', error);
      res.status(500).json({
        success: false,
        message: error.message || '勉強記録一覧取得中にエラーが発生しました'
      });
    }
  }

  // 勉強記録更新
  async updateStudy(req, res) {
    try {
      const { id } = req.params;
      const { title, content, image } = req.body;
      const userId = req.user.uid;

      const existingStudy = await studyRepo.getStudyById(id);
      if (existingStudy.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'この勉強記録を編集する権限がありません'
        });
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (image !== undefined) updateData.image = image;

      const study = await studyRepo.updateStudy(id, updateData);

      res.status(200).json({
        success: true,
        message: '勉強記録が正常に更新されました',
        data: study
      });
    } catch (error) {
      console.error('Update study error:', error);
      res.status(500).json({
        success: false,
        message: error.message || '勉強記録更新中にエラーが発生しました'
      });
    }
  }

  // 勉強記録削除
  async deleteStudy(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.uid;

      const existingStudy = await studyRepo.getStudyById(id);
      if (existingStudy.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'この勉強記録を削除する権限がありません'
        });
      }

      await studyRepo.deleteStudy(id);
      res.status(200).json({
        success: true,
        message: '勉強記録が正常に削除されました'
      });
    } catch (error) {
      console.error('Delete study error:', error);
      res.status(500).json({
        success: false,
        message: error.message || '勉強記録削除中にエラーが発生しました'
      });
    }
  }
}

module.exports = new StudyController();
