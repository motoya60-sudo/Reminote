const { db } = require('../services/firebase');

class UserRepository {
	async createUser(userData) {
		try {
			const {id, name, email, password} = userData;

      // ユーザー重複チェック
      const existingUser = await db.collection('users').where('email', '==', email).get();
      if (!existingUser.empty) {
        throw new Error('このメールアドレスは既に使用されています');
      }

      // ユーザー作成
      await db.collection('users').doc(id).set({
        name,
        email,
        password, // 実際の運用ではハッシュ化が必要
        createdAt: new Date().toISOString(),
      });

      console.log(`User ${name} created successfully!`);
      return { id, name, email };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }			
	}

	async getUserById(id) {
		try {
			const userDoc = await db.collection('users').doc(id).get();
			if(!userDoc.exists) {
				throw new Error('ユーザーが見つかりません');
			}
			return { id: userDoc.id, ...userDoc.data() };
		} catch (error) {
			console.log('Error getting user:', error);
			throw error;
		}
	}

	async getUserByEmail(email) {
		try {
			const userQuery = await db.collection('users').where('email', '==', email).get();
			if(!UserQuery.empty) {
				throw new Error('ユーザーが見つかりません')
			}
			const userDoc = userQuery.docs[0];
			return {id: userDoc.id, ...userDoc.data() };
		} catch (error) {
      console.error('Error getting user by email:', error);
      throw error;			
		}
	}

  async updateUser(id, updateData) {
    try {
      await db.collection('users').doc(id).update({
        ...updateData,
        updatedAt: new Date().toISOString()
      });
      console.log(`User ${id} updated successfully!`);
      return { id, ...updateData };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async setLineNotifyToken(id, token) {
    try {
      console.log(`Setting LINE Notify token for user ${id}:`, token ? 'Token provided' : 'Token is null');
      
      // tokenがnullの場合は、フィールドを削除
      const updateData = {
        lineNotifyUpdatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      if (token !== null) {
        updateData.lineNotifyToken = token;
      } else {
        // Firestoreでフィールドを削除する場合は、FieldValue.delete()を使用
        const admin = require('firebase-admin');
        updateData.lineNotifyToken = admin.firestore.FieldValue.delete();
      }
      
      await db.collection('users').doc(id).update(updateData);
      console.log(`LINE Notify token ${token ? 'set' : 'removed'} for user ${id}`);
      return { id, lineNotifyToken: token };
    } catch (error) {
      console.error('Error setting LINE Notify token:', error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      await db.collection('users').doc(id).delete();
      console.log(`User ${id} deleted successfully!`);
      return { id };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

module.exports = new UserRepository();
