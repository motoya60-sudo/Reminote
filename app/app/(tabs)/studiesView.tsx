// app/studiesView.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card'; // ✅ さっきのCardを使用
import type { Study } from '@/lib/types';
import { apiClient } from '@/lib/api';

// blob形式のURIはRNでは読めないので除外
function sanitizeImageUri(uri?: string | null) {
  if (!uri) return null;
  if (uri.startsWith('blob:')) return null;
  return uri;
}

export default function StudiesView() {
  const router = useRouter();
  const [studies, setStudies] = useState<Study[]>([]);
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
        const res = await apiClient.getStudies();
        const list: Study[] = (res.data || []).map((s: Study) => ({
          ...s,
          image: sanitizeImageUri(s.image),
        }));
        setStudies(list);
      } catch (e) {
        console.error('❌ Fetch studies failed:', e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;

  return (
    <View style={styles.container}>
      <Header title="勉強記録一覧" onAvatarPress={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.count}>{studies.length} 件</Text>

        {studies.length === 0 ? (
          <Text style={styles.empty}>まだ勉強記録がありません</Text>
        ) : (
          <View>
            {studies.map((s) => (
              <Card
                key={s.id}
                title={s.title}
                subtitle={s.content}
                date={s.createdAt}
                image={s.image}
                tags={s.tags}
                onPress={() => router.push(`/study/${s.id}`)}
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
    padding: 16,
    paddingBottom: 40,
  },
  count: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  empty: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
  },
});
