// index.js
const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const axios = require("axios");

const LINE_ACCESS_TOKEN = "VuhrjGat6vDt1Hjz6KHJede3qNcPDELq2xOV6GM7jimx0yKhw89jaqurOCvpZwszlzGz2AWtO1iE4onxh86Uk26VXcdd7cksKrC90PFbBLkynutX98aUJ7zntuTlfaEMsTCQ+tN5karWv3cvpeIXNQdB04t89/1O/w1cDnyilFU=";
const LINE_API_URL = "https://api.line.me/v2/bot/message/push";
const TO_USER_ID = "U87e8220792562efd7142487f0314f97d";

// 定期実行用（3分間隔でテスト）
exports.sendLineMessage = onSchedule({
  schedule: "*/3 * * * *",
  timeZone: "Asia/Tokyo"
}, async (event) => {
  await sendMessage();
});

// テスト用に関数化
async function sendMessage() {
  logger.info("LINE通知送信テスト開始");

  const messageData = {
    to: TO_USER_ID,
    messages: [{ 
      type: "text", 
      text: `🧪 テスト通知

これは復習リマインダーのテスト送信です！

📚 テスト勉強記録
📅 作成日: ${new Date().toLocaleDateString('ja-JP')}
🔗 詳細: https://your-app.com/study/test123

設定が正常に動作しています！
#テスト #復習リマインダー` 
    }]
  };

  try {
    const res = await axios.post(LINE_API_URL, messageData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
      },
    });
    logger.info("LINE通知送信成功:", res.data);
  } catch (error) {
    if (error.response) {
      // サーバーから返ってきたエラー詳細
      logger.error("LINE通知送信エラー:", JSON.stringify(error.response.data));
    } else if (error.request) {
      // リクエスト自体が送れなかった場合
      logger.error("LINE通知リクエスト送信失敗:", error.message);
    } else {
      // その他のエラー
      logger.error("LINE通知不明なエラー:", error.message);
    }
  }
}

// 直接 node で実行するための処理
if (process.argv[2] === "test") {
  sendMessage();
}
