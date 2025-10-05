// app/diary/[id].tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import type { Diary } from '@/lib/types';
import { apiClient } from '@/lib/api';

function sanitizeImageUri(uri?: string | null) {
  if (!uri) return null;
  if (uri.startsWith('blob:')) return null;
  return uri;
}

export default function DiaryDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // ← /diary/xxx の xxx を取得
  const [diary, setDiary] = useState<Diary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiary = useCallback(async () => {
    if (!id) return;
    setError(null);
    try {
      const res = await apiClient.getDiary(id as string);
      const d = res.data || res.item || null;
      if (!d) {
        setError('日記が見つかりませんでした');
        setDiary(null);
      } else {
        setDiary({ ...d, image: sanitizeImageUri(d.image) });
      }
    } catch (e: any) {
      console.error('❌ Fetch diary failed:', e);
      setError('読み込みに失敗しました');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/'); // 未ログインならトップへ
        return;
      }
      fetchDiary();
    });
    return () => unsub();
  }, [fetchDiary, router]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDiary();
  }, [fetchDiary]);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <View style={styles.container}>
      <Header title="日記" onAvatarPress={() => router.back()} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {error && <Text style={styles.error}>{error}</Text>}

        {!error && diary && (
          <Card
            title={diary.title}
            body={diary.content}
            date={diary.createdAt ?? diary.date /* どちらでも表示できるように */}
            image={diary.image}
            tags={diary.tags}
            // 詳細画面なので onPress は不要
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  scroll: { padding: 16, paddingBottom: 40 },
  error: { color: '#ef4444', marginTop: 10 },
});
