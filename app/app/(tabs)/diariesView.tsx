// app/diariesView.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
import type { Diary } from '@/lib/types';
import { apiClient } from '@/lib/api';

// blob形式のURIはRNでは読めないので除外
function sanitizeImageUri(uri?: string | null) {
  if (!uri) return null;
  if (uri.startsWith('blob:')) return null;
  return uri;
}

export default function DiariesView() {
  const router = useRouter();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        router.replace('/');
        return;
      }

      try {
        // 📥 APIから全件取得
        const res = await apiClient.getDiaries();
        const list: Diary[] = (res.data || res.items || []).map((d: Diary) => ({
          ...d,
          image: sanitizeImageUri(d.image),
        }));
        setDiaries(list);
      } catch (e) {
        console.error('❌ Fetch diaries failed:', e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />;

  return (
    <View style={styles.container}>
      {/* ▼ タイトルを「勉強記録一覧」に変更 */}
      <Header title="日記一覧" onAvatarPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.count}>{diaries.length} 件</Text>

        {diaries.length === 0 ? (
          <Text style={styles.empty}>まだ日記がありません</Text>
        ) : (
          <View>
            {diaries.map((d) => (
              <Card
                key={d.id}
                title={d.title}
                body={d.content}
                date={d.createdAt}
                image={d.image}
                tags={d.tags}
                onPress={() => router.push(`/diary/${d.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  scroll: {
    // ▼ 余白を少し削って全体を上に押し上げる
    paddingHorizontal: 16,
    paddingTop: 8,          // ← 16 から 8 に
    paddingBottom: 32,      // ← 40 から 32 に
  },
  count: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  empty: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 10,          // ← 12 から 10 に
  },
});
