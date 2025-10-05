// app/study/[id].tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import type { Study } from '@/lib/types';
import { apiClient } from '@/lib/api';

function sanitizeImageUri(uri?: string | null) {
  if (!uri) return null;
  if (uri.startsWith('blob:')) return null;
  return uri;
}

export default function StudyDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // ← /study/xxx の xxx を取得
  const [study, setStudy] = useState<Study | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudy = useCallback(async () => {
    if (!id) return;
    setError(null);
    try {
      const res = await apiClient.getStudy(id as string);
      const s = res.data || res.item || null;
      if (!s) {
        setError('勉強記録が見つかりませんでした');
        setStudy(null);
      } else {
        setStudy({ ...s, image: sanitizeImageUri(s.image) });
      }
    } catch (e: any) {
      console.error('❌ Fetch study failed:', e);
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
      fetchStudy();
    });
    return () => unsub();
  }, [fetchStudy, router]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStudy();
  }, [fetchStudy]);

  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} />;

  return (
    <View style={styles.container}>
      <Header title="勉強記録" onAvatarPress={() => router.back()} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {error && <Text style={styles.error}>{error}</Text>}

        {!error && study && (
          <Card
            title={study.title}
            subtitle={study.content}
            date={study.createdAt ?? study.date /* どちらでも表示できるように */}
            image={study.image}
            tags={study.tags}
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
