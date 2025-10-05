// app/studiesView.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Header from '@/components/ui/Header';
import Card from '@/components/ui/Card';
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
  const [filteredStudies, setFilteredStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');

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
        const list: Study[] = (res?.data || res?.items || []).map((s: Study) => ({
          ...s,
          image: sanitizeImageUri(s.image),
        }));

        setStudies(list);
        setFilteredStudies(list);

        // 全タグを抽出
        const tags = new Set<string>();
        list.forEach((study) => {
          study.tags?.forEach((tag) => tags.add(tag));
        });
        setAllTags(Array.from(tags));
      } catch (e) {
        console.error('❌ Fetch studies failed:', e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  // 検索・フィルタリング
  useEffect(() => {
    let filtered = studies;

    // タグフィルタ
    if (selectedTag) {
      filtered = filtered.filter((study) =>
        study.tags?.some((tag) => tag.includes(selectedTag))
      );
    }

    // テキスト検索
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (study) =>
          study.title.toLowerCase().includes(q) ||
          study.content?.toLowerCase().includes(q) ||
          study.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    setFilteredStudies(filtered);
  }, [studies, selectedTag, searchQuery]);

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;

  const handleTagSelect = (tag: string) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag('');
  };

  return (
    <View style={styles.container}>
      <Header
        title="勉強記録一覧"
        onAvatarPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 検索・フィルターエリア */}
        <View style={styles.searchSection}>
          <TextInput
            style={styles.searchInput}
            placeholder="タイトル、内容、タグで検索..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* タグフィルター */}
          {allTags.length > 0 && (
            <View style={styles.tagFilterSection}>
              <View style={styles.tagFilterHeader}>
                <Text style={styles.tagFilterTitle}>タグで絞り込み</Text>
                {(searchQuery || selectedTag) && (
                  <Pressable onPress={clearFilters}>
                    <Text style={styles.clearButton}>クリア</Text>
                  </Pressable>
                )}
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll}>
                <View style={styles.tagGrid}>
                  {allTags.map((tag) => (
                    <Pressable
                      key={tag}
                      style={[styles.tagFilter, selectedTag === tag && styles.tagFilterSelected]}
                      onPress={() => handleTagSelect(tag)}
                    >
                      <Text
                        style={[
                          styles.tagFilterText,
                          selectedTag === tag && styles.tagFilterTextSelected,
                        ]}
                      >
                        {tag}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>

        <Text style={styles.count}>
          {filteredStudies.length} 件
          {(selectedTag || searchQuery) && ` (全${studies.length}件中)`}
        </Text>

        {filteredStudies.length === 0 ? (
          <Text style={styles.empty}>
            {studies.length === 0 ? 'まだ勉強記録がありません' : '検索結果がありません'}
          </Text>
        ) : (
          <View>
            {filteredStudies.map((s) => (
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
  // 検索・フィルター関連
  searchSection: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  tagFilterSection: {
    marginTop: 8,
  },
  tagFilterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagFilterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  clearButton: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  tagScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  tagGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  tagFilter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  tagFilterSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  tagFilterText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  tagFilterTextSelected: {
    color: '#fff',
  },
});
