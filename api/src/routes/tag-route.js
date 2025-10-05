const express = require('express');
const { verifyFirebaseToken } = require('../middleware/auth');
const tagController = require('../controllers/tag-controller');

const router = express.Router();

// 全てのルートで認証が必要

// タグ作成
router.post('/',verifyFirebaseToken, tagController.createTag);

// タグ一覧取得
router.get('/',verifyFirebaseToken, tagController.getTags);

// タグ検索
router.get('/search/:name',verifyFirebaseToken, tagController.searchTags);

module.exports = router;