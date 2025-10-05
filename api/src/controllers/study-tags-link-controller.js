const linkRepo = require('../repositories/study-tags-link-repo');

class StudyTagLinkController {
  async createLinks(req, res) {
    try {
      const { studyId, tagIds } = req.body;
      if (!studyId || !tagIds || !Array.isArray(tagIds)) {
        return res.status(400).json({ success: false, message: 'studyId と tagIds 配列を指定してください' });
      }

      const result = await linkRepo.createLinks(studyId, tagIds);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      console.error('Create study-tag links error:', error);
      res.status(500).json({
        success: false,
        message: error.message || '勉強とタグの紐付け中にエラーが発生しました'
      });
    }
  }
}

module.exports = new StudyTagLinkController();
