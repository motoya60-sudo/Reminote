const { db } = require('../services/firebase');

class StudyTagLinkRepository {
  async createLinks(studyId, tagIds) {
    try {
      const batch = db.batch();

      tagIds.forEach(tagId => {
        const ref = db.collection('study_tag_links').doc();
        batch.set(ref, { studyId, tagId });
      });

      await batch.commit();
      return { studyId, tagIds };
    } catch (error) {
      console.error('Error creating study-tag links:', error);
      throw error;
    }
  }

  async getTagsByStudy(studyId) {
    try {
      const query = await db.collection('study_tag_links')
        .where('studyId', '==', studyId)
        .get();

      const tagIds = [];
      query.forEach(doc => tagIds.push(doc.data().tagId));
      return tagIds;
    } catch (error) {
      console.error('Error getting tags by study:', error);
      throw error;
    }
  }

  async getStudiesByTag(tagId) {
    try {
      const query = await db.collection('study_tag_links')
        .where('tagId', '==', tagId)
        .get();

      const studyIds = [];
      query.forEach(doc => studyIds.push(doc.data().studyId));
      return studyIds;
    } catch (error) {
      console.error('Error getting studies by tag:', error);
      throw error;
    }
  }
}

module.exports = new StudyTagLinkRepository();
