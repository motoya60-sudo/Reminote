const express = require('express');
const { verifyFirebaseToken } = require('../middleware/auth');
const studyTagController = require('../controllers/study-tags-link-controller');

const router = express.Router();

// 勉強とタグの紐付け作成
router.post('/', verifyFirebaseToken, studyTagController.createLinks);

// 勉強に紐づくタグ取得
router.get('/:studyId', verifyFirebaseToken, studyTagController.getTagsByStudy);

// タグに紐づく勉強一覧取得
router.get('/tag/:tagId', verifyFirebaseToken, studyTagController.getStudiesByTag);

module.exports = router;