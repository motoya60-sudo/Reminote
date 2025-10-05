const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

// Firebase Admin SDK初期化
admin.initializeApp();

const db = admin.firestore();

// エビングハウスの忘却曲線に基づく復習間隔（日数）
const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

// LINE Notify API設定
const LINE_NOTIFY_URL = 'https://notify-api.line.me/api/notify';

/**
 * 復習リマインダーの定期実行関数
 * 毎日午前9時に実行される
 */
exports.scheduledReviewReminder = functions.pubsub
  .schedule('0 9 * * *') // 毎日午前9時（UTC時間）
  .timeZone('Asia/Tokyo')
  .onRun(async (context) => {
    console.log('復習リマインダーの定期実行を開始');
    
    try {
      const today = new Date();
      console.log('実行日:', today.toISOString());
      
      // 各復習間隔でリマインダーを送信
      for (const interval of REVIEW_INTERVALS) {
        await sendReviewReminders(today, interval);
      }
      
      console.log('復習リマインダーの定期実行を完了');
      return null;
    } catch (error) {
      console.error('復習リマインダー実行エラー:', error);
      throw error;
    }
  });

/**
 * 指定された復習間隔のリマインダーを送信
 * @param {Date} today - 今日の日付
 * @param {number} interval - 復習間隔（日数）
 */
async function sendReviewReminders(today, interval) {
  console.log(`${interval}日後の復習リマインダーを処理中`);
  
  try {
    // 復習対象の勉強記録を取得
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - interval);
    
    // 対象日付の範囲を設定（1日の範囲）
    const startDate = new Date(targetDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999);
    
    console.log(`対象日付範囲: ${startDate.toISOString()} - ${endDate.toISOString()}`);
    
    // 勉強記録を取得
    const studiesSnapshot = await db.collection('studies')
      .where('createdAt', '>=', startDate.toISOString())
      .where('createdAt', '<=', endDate.toISOString())
      .get();
    
    console.log(`${interval}日後の復習対象: ${studiesSnapshot.size}件`);
    
    if (studiesSnapshot.empty) {
      console.log('復習対象の勉強記録がありません');
      return;
    }
    
    // 各勉強記録についてリマインダーを送信
    for (const studyDoc of studiesSnapshot.docs) {
      const study = { id: studyDoc.id, ...studyDoc.data() };
      await sendStudyReminder(study, interval);
    }
    
  } catch (error) {
    console.error(`${interval}日後の復習リマインダー処理エラー:`, error);
  }
}

/**
 * 個別の勉強記録のリマインダーを送信
 * @param {Object} study - 勉強記録オブジェクト
 * @param {number} interval - 復習間隔
 */
async function sendStudyReminder(study, interval) {
  try {
    console.log(`勉強記録 ${study.id} の${interval}日後リマインダーを送信中`);
    
    // ユーザー情報を取得
    const userDoc = await db.collection('users').doc(study.userId).get();
    if (!userDoc.exists) {
      console.log(`ユーザー ${study.userId} が見つかりません`);
      return;
    }
    
    const user = userDoc.data();
    if (!user.lineNotifyToken) {
      console.log(`ユーザー ${study.userId} にLINE Notifyトークンが設定されていません`);
      return;
    }
    
    // 復習回数に応じたメッセージを作成
    const reviewCount = getReviewCount(interval);
    const message = createReminderMessage(study, reviewCount, interval);
    
    // LINE Notify APIに送信
    await sendLineNotification(user.lineNotifyToken, message);
    
    console.log(`勉強記録 ${study.id} のリマインダーを送信完了`);
    
  } catch (error) {
    console.error(`勉強記録 ${study.id} のリマインダー送信エラー:`, error);
  }
}

/**
 * 復習間隔から復習回数を取得
 * @param {number} interval - 復習間隔
 * @returns {number} 復習回数（1-5回目）
 */
function getReviewCount(interval) {
  const index = REVIEW_INTERVALS.indexOf(interval);
  return index + 1;
}

/**
 * リマインダーメッセージを作成
 * @param {Object} study - 勉強記録
 * @param {number} reviewCount - 復習回数
 * @param {number} interval - 復習間隔
 * @returns {string} メッセージ
 */
function createReminderMessage(study, reviewCount, interval) {
  const frontendUrl = process.env.FRONTEND_URL || 'https://your-app.com';
  const studyUrl = `${frontendUrl}/study/${study.id}`;
  
  const reviewTexts = [
    '1回目の復習',
    '2回目の復習', 
    '3回目の復習',
    '4回目の復習',
    '5回目の復習'
  ];
  
  const message = `
📚 復習リマインダー

${reviewTexts[reviewCount - 1]}の時間です！

📖 タイトル: ${study.title}
📅 作成日: ${formatDate(study.createdAt)}
⏰ 復習間隔: ${interval}日後

内容を確認して記憶を定着させましょう！
詳細を見る: ${studyUrl}

#復習 #エビングハウスの忘却曲線 #勉強記録
  `.trim();
  
  return message;
}

/**
 * 日付をフォーマット
 * @param {string} dateString - ISO日付文字列
 * @returns {string} フォーマットされた日付
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * LINE Notify APIに通知を送信
 * @param {string} token - LINE Notifyトークン
 * @param {string} message - 送信メッセージ
 */
async function sendLineNotification(token, message) {
  try {
    const response = await axios.post(LINE_NOTIFY_URL, {
      message: message
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    console.log('LINE通知送信成功:', response.status);
    
  } catch (error) {
    console.error('LINE通知送信エラー:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * テスト用の手動実行関数
 */
exports.testReviewReminder = functions.https.onRequest(async (req, res) => {
  try {
    console.log('テスト用復習リマインダーを実行');
    
    const today = new Date();
    await sendReviewReminders(today, 1); // 1日後のリマインダーをテスト
    
    res.status(200).json({
      success: true,
      message: '復習リマインダーのテスト実行が完了しました',
      timestamp: today.toISOString()
    });
    
  } catch (error) {
    console.error('テスト実行エラー:', error);
    res.status(500).json({
      success: false,
      message: 'テスト実行中にエラーが発生しました',
      error: error.message
    });
  }
});

/**
 * ユーザーのLINE Notifyトークンを設定
 */
exports.setLineNotifyToken = functions.https.onCall(async (data, context) => {
  try {
    // 認証チェック
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', '認証が必要です');
    }
    
    const { token } = data;
    const userId = context.auth.uid;
    
    if (!token) {
      throw new functions.https.HttpsError('invalid-argument', 'トークンが必要です');
    }
    
    // ユーザードキュメントを更新
    await db.collection('users').doc(userId).update({
      lineNotifyToken: token,
      lineNotifyUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return {
      success: true,
      message: 'LINE Notifyトークンを設定しました'
    };
    
  } catch (error) {
    console.error('LINE Notifyトークン設定エラー:', error);
    throw error;
  }
});
