import { auth } from './firebase';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
	// Firebase認証トークンを取得
	async getAuthToken() {
		try {
			const user = auth.currentUser;
			if (user) {
				return await user.getIdToken();
			}
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
		
		const config = {
			headers: {
				'Content-Type': 'application/json',
				...(token && { 'Authorization': `Bearer ${token}` }),
				...options.headers,
			},
			...options,
		};

		try {
			const response = await fetch(url, config);
			const data = await response.json();

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
}

export const apiClient = new ApiClient();