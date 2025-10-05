const express = require('express');
const { verifyFirebaseToken } = require('../middleware/auth');
const lineController = require('../controllers/line-controller');

const router = express.Router();

// LINE Notifyトークンを設定
router.post('/notify-token', verifyFirebaseToken, lineController.setLineNotifyToken);

// LINE Notifyトークンを削除
router.delete('/notify-token', verifyFirebaseToken, lineController.removeLineNotifyToken);

// LINE Notifyトークンの状態を取得
router.get('/notify-status', verifyFirebaseToken, lineController.getLineNotifyStatus);

// テスト用：LINE通知を送信
router.post('/test-notification', verifyFirebaseToken, lineController.sendTestNotification);

module.exports = router;
