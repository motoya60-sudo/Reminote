const { db } = require('../services/firebase');

class DiaryRepository {
	async createDiary(diaryData) {
		try {
			const {id, title, content, date, image, userId} = diaryData;

			// バリデーション
			if (!title || !content || !userId) {
				throw new Error('タイトル、内容、ユーザーIDは必須です');
			}

			// 日記作成
			await db.collection('diaries').doc(id).set({
				title,
				content,
				image: image || null,
				userId,
				createdAt: new Date().toISOString(),
			});

			console.log(`Diary ${title} created successfully!`);
			return { id, title, content, date, image, userId };
		} catch (error) {
			console.error('Error creating diary:', error);
			throw error;
		}
	}

	async getDiaryById(id) {
		try {
			const diaryDoc = await db.collection('diaries').doc(id).get();
			if (!diaryDoc.exists) {
				throw new Error('日記が見つかりません');
			}
			return { id: diaryDoc.id, ...diaryDoc.data() };
		} catch (error) {
			console.error('Error getting diary:', error);
			throw error;
		}
	}

	async getDiariesByUserId(userId, limit = 50) {
		try {
			const diariesQuery = await db.collection('diaries')
				.where('userId', '==', userId)
				.orderBy('date', 'desc')
				.limit(limit)
				.get();

			const diaries = [];
			diariesQuery.forEach(doc => {
				diaries.push({ id: doc.id, ...doc.data() });
			});

			return diaries;
		} catch (error) {
			console.error('Error getting diaries by user:', error);
			throw error;
		}
	}

	async getAllDiaries(limit = 50) {
		try {
			const diariesQuery = await db.collection('diaries')
				.orderBy('date', 'desc')
				.limit(limit)
				.get();

			const diaries = [];
			diariesQuery.forEach(doc => {
				diaries.push({ id: doc.id, ...doc.data() });
			});

			return diaries;
		} catch (error) {
			console.error('Error getting all diaries:', error);
			throw error;
		}
	}

	async updateDiary(id, updateData) {
		try {
			// 日記の存在確認
			const diaryDoc = await db.collection('diaries').doc(id).get();
			if (!diaryDoc.exists) {
				throw new Error('日記が見つかりません');
			}

			await db.collection('diaries').doc(id).update({
				...updateData,
				updatedAt: new Date().toISOString()
			});

			console.log(`Diary ${id} updated successfully!`);
			return { id, ...updateData };
		} catch (error) {
			console.error('Error updating diary:', error);
			throw error;
		}
	}

	async deleteDiary(id) {
		try {
			// 日記の存在確認
			const diaryDoc = await db.collection('diaries').doc(id).get();
			if (!diaryDoc.exists) {
				throw new Error('日記が見つかりません');
			}

			await db.collection('diaries').doc(id).delete();
			console.log(`Diary ${id} deleted successfully!`);
			return { id };
		} catch (error) {
			console.error('Error deleting diary:', error);
			throw error;
		}
	}

	async searchDiaries(userId, searchTerm) {
		try {
			// Firestoreでは部分一致検索が制限されているため、
			// タイトルと内容で検索する場合は複数のクエリを実行
			const titleQuery = await db.collection('diaries')
				.where('userId', '==', userId)
				.where('title', '>=', searchTerm)
				.where('title', '<=', searchTerm + '\uf8ff')
				.get();

			const contentQuery = await db.collection('diaries')
				.where('userId', '==', userId)
				.where('content', '>=', searchTerm)
				.where('content', '<=', searchTerm + '\uf8ff')
				.get();

			const diaries = new Map();
			
			// タイトル検索結果を追加
			titleQuery.forEach(doc => {
				diaries.set(doc.id, { id: doc.id, ...doc.data() });
			});

			// 内容検索結果を追加（重複を避ける）
			contentQuery.forEach(doc => {
				if (!diaries.has(doc.id)) {
					diaries.set(doc.id, { id: doc.id, ...doc.data() });
				}
			});

			return Array.from(diaries.values());
		} catch (error) {
			console.error('Error searching diaries:', error);
			throw error;
		}
	}

	async getDiariesByDateRange(userId, startDate, endDate) {
		try {
			const diariesQuery = await db.collection('diaries')
				.where('userId', '==', userId)
				.where('date', '>=', startDate)
				.where('date', '<=', endDate)
				.orderBy('date', 'desc')
				.get();

			const diaries = [];
			diariesQuery.forEach(doc => {
				diaries.push({ id: doc.id, ...doc.data() });
			});

			return diaries;
		} catch (error) {
			console.error('Error getting diaries by date range:', error);
			throw error;
		}
	}
}

module.exports = new DiaryRepository();