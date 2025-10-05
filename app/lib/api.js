// lib/api.js
import { auth } from './firebase';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {

	// Firebase認証トークンを取得
	async getAuthToken() {
		try {
			const user = auth.currentUser;
			if (user) {
				const token = await user.getIdToken();
				console.log('Auth token obtained:', token ? 'Success' : 'Failed');
				return token;
			}
			console.log('No authenticated user found');
			return null;
		} catch (error) {
			console.error('Failed to get auth token:', error);
			return null;
		}
	}

	async request(endpoint, options = {}) {
		const url = `${API_URL}${endpoint}`;
		
		// 認証トークンを取得
		const token = await this.getAuthToken();
		console.log(token)
		
		const config = {
			headers: {
				'Content-Type': 'application/json',
				...(token && { 'Authorization': `Bearer ${token}` }),
				...options.headers,
			},
			...options,
		};

		console.log('Making API request to:', url);
		console.log('With token:', token ? 'Present' : 'Missing');

		try {
			const response = await fetch(url, config);
			const data = await response.json();

			console.log('API Response status:', response.status);
			console.log('API Response data:', data);

			if (!response.ok) {
				// 認証エラーの場合
				if (response.status === 401) {
					console.error('Authentication failed. Please login again.');
				}
				throw new Error(data.message || 'API request failed');
			}

			return data;
		} catch (error) {
			console.error('API Error:', error);
			throw error;
		}
	}

	// Firebase認証済みユーザーのプロフィール作成
	async createUserProfile(name) {
		return this.request('/users/profile', {
			method: 'POST',
			body: JSON.stringify({ name }),
		});
	}

	// ===== 日記関連のAPIメソッド =====

	// 日記作成
	// 日記作成（クライアントは title, content, image だけ送る）
	async createDiary({ title, content, image }) {
		return this.request('/diaries', {
		method: 'POST',
		body: JSON.stringify({
			title,
			content,
			image: image ?? null,
			// createdAt / userId は送らない（サーバが付ける）
		}),
		});
	}

	// 日記一覧取得（ユーザーの日記）
	async getDiaries(limit = 50) {
		return this.request(`/diaries?limit=${limit}`);
	}

	// 特定の日記取得
	async getDiary(id) {
		return this.request(`/diaries/${id}`);
	}

	// 日記更新
	async updateDiary(id, updateData) {
		const { title, content, image } = updateData;
		
		return this.request(`/diaries/${id}`, {
			method: 'PUT',
			body: JSON.stringify({
				title,
				content,
				image
			}),
		});
	}

	// 日記削除
	async deleteDiary(id) {
		return this.request(`/diaries/${id}`, {
			method: 'DELETE',
		});
	}

	// 日記検索
	async searchDiaries(searchTerm) {
		return this.request(`/diaries/search?q=${encodeURIComponent(searchTerm)}`);
	}

	// 日付範囲で日記取得
	async getDiariesByDateRange(startDate, endDate) {
		return this.request(`/diaries/range/date?startDate=${startDate}&endDate=${endDate}`);
	}

	// 全日記一覧取得（管理者用）
	async getAllDiaries(limit = 50) {
		return this.request(`/diaries/admin/all?limit=${limit}`);
	}

	async createStudy({ title, content, image}) {
		return this.request('/studies', {
			method: 'POST',
			body: JSON.stringify({
				title,
				content,
				image: image ?? null,
			}),
		});
	}

	async getStudies(limit = 50) {
		console.log('api')
		return this.request(`/studies?limit=${limit}`);
	}

	async updateStudy(id, updateData) {
		const { title, content, image} = updateData;

		return this.request(`/studies/${id}`, {
			method: 'PUT',
			body: JSON.stringify({
				title,
				content,
				image
			}),
		});
	}

	async deleteStudy(id) {
		return this.request(`/studies/${id}`, {
			method: 'DELETE',
		})
	}

  /**
   * タグ作成（複数）
   * @param tags string[] タグ名の配列
   */
  async createTags(tags) {
    return this.request('/tags', {
      method: 'POST',
      body: JSON.stringify({ tags }),
    });
  }

  /**
   * タグ一覧取得
   */
  async getAllTags() {
    return this.request('/tags');
  }

  /**
   * タグ更新
   * @param id string タグID
   * @param name string 新しいタグ名
   */
  async updateTag(id, name) {
    return this.request(`/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });
  }


  /**
   * タグ削除
   * @param id string タグID
   */
  async deleteTag(id) {
    return this.request(`/tags/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== 勉強とタグの紐付け =====

  /**
   * 勉強とタグの紐付け作成
   * @param payload { studyId: string, tagIds: string[] }
   */
  async createStudyTagLinks(payload) {
    return this.request('/study-tags', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * 勉強に紐づくタグ一覧取得
   * @param studyId string
   */
  async getTagsByStudy(studyId) {
    return this.request(`/study-tags/${studyId}`);
  }

  /**
   * タグに紐づく勉強一覧取得
   * @param tagId string
   */
  async getStudiesByTag(tagId) {
    return this.request(`/study-tags/tag/${tagId}`);
  }

  // ======================
  // 📘 日記系
  // ======================

  /** 日記作成（サーバーが userId / createdAt を付与） */
  async createDiary({ title, content, image }) {
    return this.request('/diaries', {
      method: 'POST',
      body: JSON.stringify({
        title,
        content,
        image: image ?? null,
      }),
    });
  }

  /** ユーザーの日記一覧取得 */
  async getDiaries(limit = 50) {
    return this.request(`/diaries?limit=${limit}`);
  }

  /** 特定の日記取得 */
  async getDiary(id) {
    return this.request(`/diaries/${id}`);
  }

  /** 日記更新 */
  async updateDiary(id, updateData) {
    const { title, content, date, image } = updateData;
    return this.request(`/diaries/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content, date, image }),
    });
  }

  /** 日記削除 */
  async deleteDiary(id) {
    return this.request(`/diaries/${id}`, {
      method: 'DELETE',
    });
  }

  /** 日記検索 */
  async searchDiaries(searchTerm) {
    return this.request(`/diaries/search?q=${encodeURIComponent(searchTerm)}`);
  }

  /** 日付範囲で日記取得 */
  async getDiariesByDateRange(startDate, endDate) {
    return this.request(`/diaries/range/date?startDate=${startDate}&endDate=${endDate}`);
  }

  /** 管理者全件取得（必要な場合のみ有効化） */
  // async getAllDiaries(limit = 50) {
  //   return this.request(`/diaries/admin/all?limit=${limit}`);
  // }
}

export const apiClient = new ApiClient();
