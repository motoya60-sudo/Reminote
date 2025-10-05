const { db } = require('../services/firebase');

class StudyRepository {
  async createStudy(studyData) {
    try {
      const { id, title, content, image, userId } = studyData;
      if (!title || !content || !userId) {
        throw new Error('タイトル、内容、ユーザーIDは必須です');
      }

      await db.collection('studies').doc(id).set({
        title,
        content,
        image: image || null,
        userId,
        createdAt: new Date().toISOString(),
      });

      return { id, title, content, image, userId };
    } catch (error) {
      console.error('Error creating study:', error);
      throw error;
    }
  }

  async getStudyById(id) {
    try {
      const doc = await db.collection('studies').doc(id).get();
      if (!doc.exists) throw new Error('勉強記録が見つかりません');
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Error getting study:', error);
      throw error;
    }
  }

  async getStudiesByUserId(userId, limit = 50) {
    try {
      const query = await db.collection('studies')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      const studies = [];
      query.forEach(doc => studies.push({ id: doc.id, ...doc.data() }));
      return studies;
    } catch (error) {
      console.error('Error getting studies by user:', error);
      throw error;
    }
  }

  async updateStudy(id, updateData) {
    try {
      const doc = await db.collection('studies').doc(id).get();
      if (!doc.exists) throw new Error('勉強記録が見つかりません');

      await db.collection('studies').doc(id).update({
        ...updateData,
        updatedAt: new Date().toISOString(),
      });

      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating study:', error);
      throw error;
    }
  }

  async deleteStudy(id) {
    try {
      const doc = await db.collection('studies').doc(id).get();
      if (!doc.exists) throw new Error('勉強記録が見つかりません');

      await db.collection('studies').doc(id).delete();
      return { id };
    } catch (error) {
      console.error('Error deleting study:', error);
      throw error;
    }
  }
}

module.exports = new StudyRepository();
