const express = require('express');
const router = express.Router();
const { generateWeeklySummaryForUser } = require('../services/weekly-summary');

function checkCronAuth(req, res, next) {
  const token = req.headers['x-internal-cron-token'];
  if (!token || token !== process.env.INTERNAL_CRON_TOKEN) {
    return res.status(401).json({ ok:false, error:'unauthorized' });
  }
  next();
}

// 単一ユーザー用
router.post('/cron/weekly-summary', checkCronAuth, async (req, res) => {
  try {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ ok:false, error:'userId required' });
    const r = await generateWeeklySummaryForUser(userId);
    res.json({ ok:true, ...r });
  } catch (e) {
    console.error('weekly-summary error', e);
    res.status(500).json({ ok:false, error: e?.message });
  }
});

// 全ユーザー一括（任意）
router.post('/cron/weekly-summary-all', checkCronAuth, async (req, res) => {
  try {
    const admin = require('firebase-admin');
    const snap = await admin.firestore().collection('users').get();
    const uids = snap.docs.map(d => d.id);
    const results = [];
    for (const uid of uids) {
      try {
        const r = await generateWeeklySummaryForUser(uid);
        results.push({ uid, ok:true, ...r });
      } catch (e) {
        results.push({ uid, ok:false, error: e?.message });
      }
    }
    res.json({ ok:true, results });
  } catch (e) {
    res.status(500).json({ ok:false, error: e?.message });
  }
});

module.exports = router;
