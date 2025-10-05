// api/src/repositories/study-repo.js
const admin = require('firebase-admin');
const { db } = require('../services/firebase'); // 既存の初期化を利用
const { FieldValue, Timestamp } = admin.firestore;

// Firestoreの値をAPI返却用に整形（Timestamp → ISO文字列など）
function serializeDoc(doc) {
  const data = doc.data ? doc.data() : doc; // docSnapshot or plain obj
  const toIso = (v) =>
    v instanceof Timestamp ? v.toDate().toISOString()
    : typeof v === 'string' ? v
    : v && v.toDate ? v.toDate().toISOString()
    : null;

  return {
    id: doc.id || data.id,
    title: data.title ?? null,
    content: data.content ?? null,
    image: data.image ?? null,
    userId: data.userId ?? null,
    createdAt: toIso(data.createdAt),
    updatedAt: toIso(data.updatedAt),
  };
}

class StudyRepository {
  // 追加
  async createStudy(studyData) {
    try {
      const { id, title, content, image, userId } = studyData;
      if (!title || !content || !userId) {
        throw new Error('タイトル、内容、ユーザーIDは必須です');
      }

      const ref = id
        ? db.collection('studies').doc(id)
        : db.collection('studies').doc(); // id未指定なら自動採番

      await ref.set({
        title,
        content,
        image: image || null,
        userId,
        createdAt: FieldValue.serverTimestamp(), // ← ISOではなくTimestampで保存
      });

      const snap = await ref.get();
      return serializeDoc(snap);
    } catch (error) {
      console.error('Error creating study:', error);
      throw error;
    }
  }

  // 単一取得
  async getStudyById(id) {
    try {
      const doc = await db.collection('studies').doc(id).get();
      if (!doc.exists) throw new Error('勉強記録が見つかりません');
      return serializeDoc(doc);
    } catch (error) {
      console.error('Error getting study:', error);
      throw error;
    }
  }

    async getStudiesByUserId(userId, limit = 50) {
      console.log('[repo] getStudiesByUserId uid=', userId, 'limit=', limit);
      try {
        const ref = db.collection('studies');
        const q = ref
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .limit(limit);

        const snapshot = await q.get();                 // ← 取得結果は snapshot に統一
        console.log('[repo] snapshot.size =', snapshot.size);

        if (snapshot.empty) return [];

        const studies = snapshot.docs.map((doc) => {
          const data = doc.data();
          const toIso = (v) =>
            v && typeof v.toDate === 'function' ? v.toDate().toISOString() :
            typeof v === 'string' ? v : null;

          return {
            id: doc.id,
            ...data,
            createdAt: toIso(data.createdAt),
            updatedAt: toIso(data.updatedAt),
          };
        });

        console.log('[repo] first doc =', studies[0]);
        return studies;
      } catch (error) {
        console.error('[repo] Firestore error:', error.code, error.message || error);
        throw error;
      }
    }

  // 更新
  async updateStudy(id, updateData) {
    try {
      const ref = db.collection('studies').doc(id);
      const doc = await ref.get();
      if (!doc.exists) throw new Error('勉強記録が見つかりません');

      const payload = {
        ...updateData,
        updatedAt: FieldValue.serverTimestamp(), // ← Timestampで更新時刻
      };
      await ref.update(payload);

      const updated = await ref.get();
      return serializeDoc(updated);
    } catch (error) {
      console.error('Error updating study:', error);
      throw error;
    }
  }

  // 削除
  async deleteStudy(id) {
    try {
      const ref = db.collection('studies').doc(id);
      const doc = await ref.get();
      if (!doc.exists) throw new Error('勉強記録が見つかりません');

      await ref.delete();
      return { id };
    } catch (error) {
      console.error('Error deleting study:', error);
      throw error;
    }
  }
}

module.exports = new StudyRepository();
