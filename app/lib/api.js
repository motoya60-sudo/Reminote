// lib/api.js
import { auth } from './firebase';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  /** 🔑 Firebase 認証トークンを取得（強制更新あり） */
  async getAuthToken(forceRefresh = false) {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('[api] No authenticated user');
        return null;
      }
      // 開発中は true で強制更新が安定（期限切れを避ける）
      const token = await user.getIdToken(forceRefresh);
      console.log('[api] Token acquired:', token ? 'Yes' : 'No');
      return token;
    } catch (err) {
      console.error('[api] Failed to get auth token:', err);
      return null;
    }
  }

  /** 🔁 共通リクエスト関数 */
  async request(endpoint, options = {}, retry = true) {
    const url = `${API_URL}${endpoint}`;
    let token = await this.getAuthToken();

    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    };

    console.log(`[api] Request → ${url} (${config.method})`);
    console.log('[api] Auth header:', token ? 'Present' : 'Missing');

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      console.log('[api] Response status:', response.status);

      // 401 の場合はトークン再取得 → 1回だけリトライ
      if (response.status === 401 && retry && auth.currentUser) {
        console.warn('[api] 401 Unauthorized → refreshing token and retrying...');
        token = await this.getAuthToken(true); // 強制更新
        return this.request(endpoint, options, false);
      }

      if (!response.ok) {
        throw new Error(data.message || `API Error ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error('[api] Request failed:', err);
      throw err;
    }
  }

  // ======================
  // 👤 ユーザー系
  // ======================
  async createUserProfile(name) {
    return this.request('/users/profile', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
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
