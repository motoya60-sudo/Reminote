import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

import Header from '@/components/ui/Header';
import TopTabs from '@/components/ui/TopTabs';
import FAB from '@/components/ui/FAB';
import Card from '@/components/ui/Card';
import UserMenu from '@/components/modals/UserMenu';
import CreatePicker from '@/components/modals/CreatePicker';
import CreateDiaryModal from '@/components/modals/CreateDiaryModal';

import type { Diary, Study, TabKey } from '@/lib/types';
import CreateStudyModal from '@/components/modals/CreateStudyModal';

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('diary');
  const [menuVisible, setMenuVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
  const [diaryModalVisible, setDiaryModalVisible] = useState(false);
  const [studyModalVisible, setStudyModalVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuVisible(false);
      router.replace('/');
    } catch (error) {
      console.log(error);
    }
  };

  const diaries: Diary[] = useMemo(
    () => [
      {
        id: 'd1',
        title: 'ハッカソン準備',
        content: 'Expo Routerでタブの骨組み作成。睡眠UIの微調整も。',
        date: '2025-10-03',
        image: 'https://picsum.photos/seed/diary1/600/400',
        tags: ['#開発', '#日記'],
      },
      {
        id: 'd2',
        title: '研究メモ',
        content: 'YOLOv8でテキスト検出の実験。mAPと推論速度を計測。',
        date: '2025-10-02',
        image: 'https://picsum.photos/seed/diary2/600/400',
        tags: ['#研究', '#CV'],
      },
    ],
    []
  );

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

  return (
    <View style={styles.container}>
      <Header title="ホーム" onAvatarPress={() => setMenuVisible(true)} />

      <TopTabs activeTab={activeTab} onChange={setActiveTab} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {activeTab === 'diary' ? (
          <>
            <Text style={styles.sectionTitle}>日記</Text>
            <View style={styles.grid}>
              {diaries.map((d) => (
                <Card
                  key={d.id}
                  title={d.title}
                  body={d.content}
                  date={d.date}
                  image={d.image}
                  tags={d.tags}
                  onPress={() => router.push(`/diary/${d.id}`)}
                />
              ))}
            </View>
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
          setCreateVisible(false);      // 「新規作成」モーダルを閉じる
          setDiaryModalVisible(true);   // 日記作成モーダル
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
