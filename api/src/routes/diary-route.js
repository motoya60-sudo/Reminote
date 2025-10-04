const express = require('express');
const { verifyFirebaseToken, optionalAuth } = require('../middleware/auth');
const diaryController = require('../controllers/diary-controller');

const router = express.Router();

// 日記作成（認証必須）
router.post('/', verifyFirebaseToken, diaryController.createDiary);

// 日記取得（認証必須）
router.get('/:id', verifyFirebaseToken, diaryController.getDiary);

// ユーザーの日記一覧取得（認証必須）
router.get('/', verifyFirebaseToken, diaryController.getUserDiaries);

// 全日記一覧取得（認証必須）
router.get('/admin/all', verifyFirebaseToken, diaryController.getAllDiaries);

// 日記更新（認証必須）
router.put('/:id', verifyFirebaseToken, diaryController.updateDiary);

// 日記削除（認証必須）
router.delete('/:id', verifyFirebaseToken, diaryController.deleteDiary);

// 日記検索（認証必須）
router.get('/search', verifyFirebaseToken, diaryController.searchDiaries);

// 日付範囲で日記取得（認証必須）
router.get('/range/date', verifyFirebaseToken, diaryController.getDiariesByDateRange);

module.exports = router;