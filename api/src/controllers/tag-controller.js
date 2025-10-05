const tagRepo = require('../repositories/tag-repo');

class TagController {
  // タグ作成（複数対応）
  async createTag(req, res) {
    console.log('req',req.body);
    try {
      console.log('Tag creation request body:', req.body);
      const { name, tags } = req.body;
      
      // 単一タグの場合
      if (name) {
        // 既存のタグをチェック
        let tag = await tagRepo.findTagByName(name);
        if (tag) {
          return res.status(200).json({
            success: true,
            message: 'タグは既に存在します',
            data: tag
          });
        }

        // 新しいタグを作成
        const newTag = await tagRepo.createTag({ name });
        
        return res.status(201).json({
          success: true,
          message: 'タグが正常に作成されました',
          data: newTag
        });
      }
      
      // 複数タグの場合
      if (tags && Array.isArray(tags)) {
        const createdTags = [];
        
        for (const tagName of tags) {
          if (!tagName || typeof tagName !== 'string') continue;
          
          // 既存のタグをチェック
          let existingTag = await tagRepo.findTagByName(tagName);
          if (existingTag) {
            createdTags.push(existingTag);
          } else {
            // 新しいタグを作成
            const newTag = await tagRepo.createTag({ name: tagName });
            createdTags.push(newTag);
          }
        }
        
        return res.status(201).json({
          success: true,
          message: `${createdTags.length}個のタグを処理しました`,
          data: createdTags
        });
      }
      
      return res.status(400).json({
        success: false,
        message: 'タグ名またはタグ配列が必須です'
      });
    } catch (error) {
      console.error('Create tag error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'タグ作成中にエラーが発生しました'
      });
    }
  }

  // タグ一覧取得
  async getTags(req, res) {
    try {
      const { limit = 50 } = req.query;
      const tags = await tagRepo.getAllTags(parseInt(limit));

      res.status(200).json({
        success: true,
        data: tags,
        count: tags.length
      });
    } catch (error) {
      console.error('Get tags error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'タグ一覧取得中にエラーが発生しました'
      });
    }
  }

  // タグ検索
  async searchTags(req, res) {
    try {
      const { name } = req.params;
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: '検索キーワードは必須です'
        });
      }

      const tags = await tagRepo.searchTagsByName(name);
      
      res.status(200).json({
        success: true,
        data: tags,
        count: tags.length
      });
    } catch (error) {
      console.error('Search tags error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'タグ検索中にエラーが発生しました'
      });
    }
  }
}

module.exports = new TagController();