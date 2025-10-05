const { db } = require('../services/firebase');

class TagRepository {
  async createTag(tagData) {
    try {
      const id = `tag_${Date.now()}`;
      await db.collection('tags').doc(id).set({
        name: tagData.name,
        createdAt: new Date().toISOString()
      });
      console.log(`Tag ${tagData.name} created successfully!`);
      return { id, name: tagData.name };
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  async findTagByName(name) {
    try {
      const tagQuery = await db.collection('tags').where('name', '==', name).limit(1).get();
      if (!tagQuery.empty) {
        const doc = tagQuery.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error finding tag by name:', error);
      throw error;
    }
  }

  async createTags(tags) {
    try {
      const createdTags = [];
      for (const tag of tags) {
        const ref = db.collection('tags').doc();
        await ref.set({ name: tag });
        createdTags.push({ id: ref.id, name: tag });
      }
      return createdTags;
    } catch (error) {
      console.error('Error creating tags:', error);
      throw error;
    }
  }

  async getAllTags(limit = 50) {
    try {
      const query = await db.collection('tags').limit(limit).get();
      const tags = [];
      query.forEach(doc => tags.push({ id: doc.id, ...doc.data() }));
      return tags;
    } catch (error) {
      console.error('Error getting tags:', error);
      throw error;
    }
  }

  async searchTagsByName(name) {
    try {
      const query = await db.collection('tags')
        .where('name', '>=', name)
        .where('name', '<=', name + '\uf8ff')
        .get();
      const tags = [];
      query.forEach(doc => tags.push({ id: doc.id, ...doc.data() }));
      return tags;
    } catch (error) {
      console.error('Error searching tags:', error);
      throw error;
    }
  }
}

module.exports = new TagRepository();
