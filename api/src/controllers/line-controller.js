const userRepo = require('../repositories/user-repo');

class LineController {
  // LINE Notifyトークンを設定
  async setLineNotifyToken(req, res) {
    try {
      const { token } = req.body;
      const userId = req.user.uid;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'LINE Notifyトークンが必要です'
        });
      }

      // トークンの形式を簡易チェック
      if (typeof token !== 'string' || token.length < 20) {
        return res.status(400).json({
          success: false,
          message: '無効なLINE Notifyトークンです'
        });
      }

      const result = await userRepo.setLineNotifyToken(userId, token);

      res.status(200).json({
        success: true,
        message: 'LINE Notifyトークンを設定しました',
        data: result
      });

    } catch (error) {
      console.error('Set LINE Notify token error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'LINE Notifyトークン設定中にエラーが発生しました'
      });
    }
  }

  // LINE Notifyトークンを削除
  async removeLineNotifyToken(req, res) {
    try {
      const userId = req.user.uid;
      console.log('Removing LINE Notify token for user:', userId);

      await userRepo.setLineNotifyToken(userId, null);

      console.log('LINE Notify token removed successfully');
      res.status(200).json({
        success: true,
        message: 'LINE Notifyトークンを削除しました'
      });

    } catch (error) {
      console.error('Remove LINE Notify token error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'LINE Notifyトークン削除中にエラーが発生しました'
      });
    }
  }

  // LINE Notifyトークンの状態を取得
  async getLineNotifyStatus(req, res) {
    try {
      const userId = req.user.uid;
      const user = await userRepo.getUserById(userId);

      res.status(200).json({
        success: true,
        data: {
          isLineNotifyEnabled: !!user.lineNotifyToken,
          lineNotifyUpdatedAt: user.lineNotifyUpdatedAt
        }
      });

    } catch (error) {
      console.error('Get LINE Notify status error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'LINE Notify状態取得中にエラーが発生しました'
      });
    }
  }

  // テスト用：LINE通知を送信
  async sendTestNotification(req, res) {
    console.log('🚀 Test notification endpoint called');
    
    try {
      const userId = req.user.uid;
      console.log('👤 User ID:', userId);
      
      const user = await userRepo.getUserById(userId);
      console.log('👤 User data:', {
        id: user?.id,
        email: user?.email,
        hasToken: !!user?.lineNotifyToken
      });

      // LINE Messaging API用のアクセストークン（固定値を使用）
      const LINE_MESSAGING_API_TOKEN = "VuhrjGat6vDt1Hjz6KHJede3qNcPDELq2xOV6GM7jimx0yKhw89jaqurOCvpZwszlzGz2AWtO1iE4onxh86Uk26VXcdd7cksKrC90PFbBLkynutX98aUJ7zntuTlfaEMsTCQ+tN5karWv3cvpeIXNQdB04t89/1O/w1cDnyilFU=";

      const axios = require('axios');
      const LINE_API_URL = 'https://api.line.me/v2/bot/message/push';
      
      // ユーザーのLINE User IDが必要（現在は固定値を使用）
      const TO_USER_ID = "U87e8220792562efd7142487f0314f97d";

      const testMessage = `
🧪 テスト通知

これは復習リマインダーのテスト送信です！

📚 テスト勉強記録
📅 作成日: ${new Date().toLocaleDateString('ja-JP')}
🔗 詳細: https://your-app.com/study/test123

設定が正常に動作しています！
#テスト #復習リマインダー
      `.trim();

      const messageData = {
        to: TO_USER_ID,
        messages: [{ type: "text", text: testMessage }]
      };

      console.log('📤 Sending LINE notification...');
      console.log('🔑 Token (first 10 chars):', LINE_MESSAGING_API_TOKEN.substring(0, 10) + '...');
      console.log('📝 Message:', testMessage);
      console.log('🌐 URL:', LINE_API_URL);

      const response = await axios.post(LINE_API_URL, messageData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LINE_MESSAGING_API_TOKEN}`
        }
      });

      console.log('✅ LINE API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });

      res.status(200).json({
        success: true,
        message: 'テスト通知を送信しました',
        data: {
          status: response.status,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('❌ Test notification error:', error);
      console.error('🔍 Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers
      });
      
      res.status(500).json({
        success: false,
        message: error.response?.data?.message || error.message || 'テスト通知送信中にエラーが発生しました'
      });
    }
  }
}

module.exports = new LineController();
