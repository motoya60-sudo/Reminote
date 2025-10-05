const express = require('express');
const { verifyFirebaseToken } = require('../middleware/auth');
const diaryController = require('../controllers/diary-controller');

const router = express.Router();

router.use((req, _res, next) => {
    console.log('[ROUTER diaries]', req.method, req.originalUrl);
    next();
  });

// 固定ルートを先に
router.get('/admin/all', verifyFirebaseToken, diaryController.getAllDiaries);
router.get('/search', verifyFirebaseToken, diaryController.searchDiaries);
router.get('/range/date', verifyFirebaseToken, diaryController.getDiariesByDateRange);

// 一覧・作成
router.get('/', verifyFirebaseToken, diaryController.getUserDiaries);
router.post('/', verifyFirebaseToken, diaryController.createDiary);

// ID系（★正規表現は使わない）
router.get('/:id', verifyFirebaseToken, diaryController.getDiary);
router.put('/:id', verifyFirebaseToken, diaryController.updateDiary);
router.delete('/:id', verifyFirebaseToken, diaryController.deleteDiary);

module.exports = router;
