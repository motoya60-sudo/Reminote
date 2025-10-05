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

  async getTagsByStudy(req, res) {
    try {
      const { studyId } = req.params;
      if (!studyId) {
        return res.status(400).json({ success: false, message: 'studyId を指定してください' });
      }

      const tags = await linkRepo.getTagsByStudy(studyId);
      res.status(200).json({ success: true, data: tags });
    } catch (error) {
      console.error('Get tags by study error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'タグ取得中にエラーが発生しました'
      });
    }
  }

  async getStudiesByTag(req, res) {
    try {
      const { tagId } = req.params;
      if (!tagId) {
        return res.status(400).json({ success: false, message: 'tagId を指定してください' });
      }

      const studies = await linkRepo.getStudiesByTag(tagId);
      res.status(200).json({ success: true, data: studies });
    } catch (error) {
      console.error('Get studies by tag error:', error);
      res.status(500).json({
        success: false,
        message: error.message || '勉強記録取得中にエラーが発生しました'
      });
    }
  }
}

module.exports = new StudyTagLinkController();
