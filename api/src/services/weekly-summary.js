const admin = require('firebase-admin');
const { DateTime } = require('luxon');
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!admin.apps.length) {
  admin.initializeApp(); // 既にどこかで初期化してるなら通過
}
const db = admin.firestore();

function tokyoNow() { return DateTime.now().setZone('Asia/Tokyo'); }

function lastWeekRangeJST(nowJst = tokyoNow()) {
  // 先週（日→土）
  const thisSunday0 = nowJst.startOf('week');   // 今週日曜00:00
  const start = thisSunday0.minus({ weeks: 1 }); // 先週日曜00:00
  const end = thisSunday0.minus({ seconds: 1 }); // 先週土曜23:59:59
  return { start, end };
}

function isoWeekKey(dtJst = tokyoNow().minus({ weeks: 1 })) {
  const weekNumber = dtJst.weekNumber.toString().padStart(2, '0');
  return `${dtJst.weekYear}-W${weekNumber}`;
}

async function fetchDiariesOfLastWeek(userId) {
  const { start, end } = lastWeekRangeJST();
  const snap = await db.collection('diaries')
    .where('userId', '==', userId)
    .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(start.toJSDate()))
    .where('createdAt', '<=', admin.firestore.Timestamp.fromDate(end.toJSDate()))
    .orderBy('createdAt', 'asc')
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

function buildPromptJp(diaries, weekLabel, range) {
  const items = diaries.map(d => {
    const dt = d.createdAt?.toDate?.() ?? new Date();
    const title = d.title ?? '（無題）';
    const body = (d.content ?? '').slice(0, 1200);
    return `- ${dt.toISOString().slice(0,10)}「${title}」: ${body}`;
  }).join('\n');

  return `あなたはユーザーの1週間の日記を読み、**日本語**で簡潔に振り返りレポートを作成します。

【対象週】${weekLabel}
【期間】${range.start.toISO()} 〜 ${range.end.toISO()}

【日記一覧】
${items || '（該当日記なし）'}

# 出力要件
1. 見出し: 「${weekLabel} のふりかえり」
2. 3〜7行の要約本文
3. 箇条書きハイライト (3〜6項目)
4. 来週の提案TODO (2〜5項目)
5. 絵文字は1〜3個まで
6. Markdown整形
`;
}

async function callGemini(prompt) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const res = await model.generateContent(prompt);
  return res.response.text();
}

async function saveSummary(userId, weekLabel, range, text) {
  const ref = db.collection('summaries').doc(userId).collection('weekly').doc(weekLabel);
  await ref.set({
    weekLabel,
    range: {
      start: admin.firestore.Timestamp.fromDate(range.start.toJSDate()),
      end: admin.firestore.Timestamp.fromDate(range.end.toJSDate()),
    },
    summaryText: text,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  return ref.id;
}

async function generateWeeklySummaryForUser(userId) {
  const now = tokyoNow();
  const weekLabel = isoWeekKey(now);
  const range = lastWeekRangeJST(now);
  const diaries = await fetchDiariesOfLastWeek(userId);
  const prompt = buildPromptJp(diaries, weekLabel, range);
  const text = await callGemini(prompt);
  const docId = await saveSummary(userId, weekLabel, range, text);
  return { docId, weekLabel, count: diaries.length };
}

module.exports = { generateWeeklySummaryForUser };
