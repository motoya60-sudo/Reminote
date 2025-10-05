const express = require('express');
const { verifyFirebaseToken } = require('../middleware/auth');
const studyController = require('../controllers/study-controller');

const router = express.Router();

// 勉強作成（認証必須）
router.post('/', verifyFirebaseToken, studyController.createStudy);

// 勉強一覧取得（ユーザーの勉強記録）
router.get('/', verifyFirebaseToken, studyController.getStudies);

// 特定の勉強取得
router.get('/:id', verifyFirebaseToken, studyController.getStudy);

// 勉強更新
router.put('/:id', verifyFirebaseToken, studyController.updateStudy);

// 勉強削除
router.delete('/:id', verifyFirebaseToken, studyController.deleteStudy);


module.exports = router;
