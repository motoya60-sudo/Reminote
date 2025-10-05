import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

import Header from '@/components/ui/Header';
import TopTabs from '@/components/ui/TopTabs';
import FAB from '@/components/ui/FAB';
import Card from '@/components/ui/Card';
import UserMenu from '@/components/modals/UserMenu';
import CreatePicker from '@/components/modals/CreatePicker';
import CreateDiaryModal from '@/components/modals/CreateDiaryModal';

import type { Diary, Study, TabKey } from '@/lib/types';

import CreateStudyModal from '@/components/modals/CreateStudyModal';

import { apiClient } from '@/lib/api';


export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('diary');
  const [menuVisible, setMenuVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [diaryModalVisible, setDiaryModalVisible] = useState(false);
  const [studyModalVisible, setStudyModalVisible] = useState(false);
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebaseのログイン状態が確定するまで待つ
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log('🚫 未ログイン');
        setLoading(false);
        return;
      }

      console.log('✅ ログイン済み UID:', user.uid);

      try {
        // ここは任意件数でOK（2件以上入っていれば「さらに見る」表示に使える）
        const res = await apiClient.getDiaries(5);
        console.log('📗 diaries:', res);
        setDiaries(res.data || res.items || []);
      } catch (err) {
        console.error('❌ Fetch diaries failed:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuVisible(false);
      router.replace('/');
    } catch (error) {
      console.log(error);
    }
  };

  const studies: Study[] = useMemo(
    () => [
      {
        id: 's1',
        title: '回帰分析入門（可視化付き）',
        summary: 'Kumamoto Free Wi-Fiの地点データから距離要因を仮説検証。',
        date: '2025-10-01',
        tags: ['#統計', '#Pandas'],
      },
      {
        id: 's2',
        title: 'CLTと近似分布の確認',
        summary: '正規・ベータ・カイ二乗の比較をPythonで実装。',
        date: '2025-09-28',
        tags: ['#確率', '#Python'],
      },
    ],
    []
  );

  // ▼ 2件だけプレビュー表示
  const previewDiaries = diaries.slice(0, 2);
  const hasMoreDiaries = diaries.length > 2;

  if (loading) return <ActivityIndicator style={{ marginTop: 32 }} />;

  return (
    <View style={styles.container}>
      <Header title="ホーム" onAvatarPress={() => setMenuVisible(true)} />

      <TopTabs activeTab={activeTab} onChange={setActiveTab} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {activeTab === 'diary' ? (
          <>
            <Text style={styles.sectionTitle}>日記</Text>

            {/* ▼ プレビュー(2件) */}
            <View style={styles.grid}>
              {previewDiaries.map((d) => (
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

            {/* ▼ 3件目以降は一覧へ */}
            {hasMoreDiaries && (
              <View style={{ marginTop: 12 }}>
                <SeeMoreButton onPress={() => router.push('/diariesView')} />
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>勉強</Text>
            <View style={styles.grid}>
              {studies.map((s) => (
                <Card
                  key={s.id}
                  title={s.title}
                  subtitle={s.summary}
                  date={s.date}
                  tags={s.tags}
                  onPress={() => router.push(`/study/${s.id}`)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>

      <FAB onPress={() => setCreateVisible(true)} />

      <UserMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onProfile={() => {
          setMenuVisible(false);
          router.push('/profile');
        }}
        onLogout={handleLogout}
      />

      <CreatePicker
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onCreateDiary={() => {
          setCreateVisible(false); // 「新規作成」モーダルを閉じる
          setDiaryModalVisible(true); // 日記作成モーダル
        }}
        onCreateStudy={() => {
          setCreateVisible(false);
          setStudyModalVisible(true); 
        }}
      />

      <CreateDiaryModal
        visible={diaryModalVisible}
        onClose={() => setDiaryModalVisible(false)}
      />
      <CreateStudyModal
        visible={studyModalVisible}
        onClose={() => setStudyModalVisible(false)}
      />
    </View>
  );
}

function SeeMoreButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={seeMoreStyles.btn}>
      <Text style={seeMoreStyles.text}>さらに見る</Text>
    </TouchableOpacity>
  );
}

const CARD_GAP = 12;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },
  scroll: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -CARD_GAP / 2,
  },
});

const seeMoreStyles = StyleSheet.create({
  btn: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
