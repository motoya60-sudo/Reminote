const express = require('express');
const userController = require('../controllers/user-controller');
const { verifyFirebaseToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// ユーザー作成（非認証 - 従来の方法）
router.post('/', userController.createUser);

// Firebase認証済みユーザーのプロフィール作成
router.post('/profile', verifyFirebaseToken, userController.createUserProfile);

// ユーザー取得（認証不要）
router.get('/:id', optionalAuth, userController.getUser);

// ユーザー更新（認証必須）
router.put('/:id', verifyFirebaseToken, userController.updateUser);

// ユーザー削除（認証必須）
router.delete('/:id', verifyFirebaseToken, userController.deleteUser);

// 初期データ作成（開発用）
router.post('/init', userController.createInitialData);

module.exports = router;
