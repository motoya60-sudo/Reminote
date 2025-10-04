import React, { useMemo, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

type Diary = {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  tags?: string[];
};

type Study = {
  id: string;
  title: string;
  summary: string;
  date: string;
  tags?: string[];
};

type TabKey = 'diary' | 'study';

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('diary');
  const [menuVisible, setMenuVisible] = useState(false);
  const [createVisible, setCreateVisible] = useState(false);
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

  const Card = ({
    title,
    subtitle,
    body,
    date,
    image,
    tags,
    onPress,
  }: {
    title: string;
    subtitle?: string;
    body?: string;
    date: string;
    image?: string;
    tags?: string[];
    onPress?: () => void;
  }) => (
    <Pressable style={styles.card} onPress={onPress}>
      {image ? <Image source={{ uri: image }} style={styles.cardImage} /> : null}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.cardDate}>{date}</Text>
        </View>
        {subtitle ? (
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        {body ? (
          <Text style={styles.cardBody} numberOfLines={2}>
            {body}
          </Text>
        ) : null}
        {!!tags?.length && (
          <View style={styles.tagRow}>
            {tags.map((t) => (
              <View key={t} style={styles.tagChip}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>

      {/* ヘッダー：左にアイコン、中央にタイトル */}
      <View style={styles.header}>
        <Pressable
          onPress={() => setMenuVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="ユーザーメニューを開く"
          style={styles.avatarBtn}
        >
          <Text style={styles.avatarEmoji}>👤</Text>
        </Pressable>
        <Text style={styles.headerTitle}>ホーム</Text>
        <View style={{ width: 32 }} /> {/* スペーサー */}
      </View>
      {/* 日記，勉強作成 */}
      <View style={styles.fabContainer}>
        <Pressable
          onPress={() => setCreateVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="日記，または勉強記録を作成する"
          style={styles.fabButton}
        >
          <Text style={styles.fabText}>＋</Text>
        </Pressable>
      </View>


      {/* 上部タブ */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'diary' && styles.tabItemActive]}
          onPress={() => setActiveTab('diary')}
        >
          <Text style={[styles.tabText, activeTab === 'diary' && styles.tabTextActive]}>
            日記
          </Text>
          {activeTab === 'diary' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'study' && styles.tabItemActive]}
          onPress={() => setActiveTab('study')}
        >
          <Text style={[styles.tabText, activeTab === 'study' && styles.tabTextActive]}>
            勉強
          </Text>
          {activeTab === 'study' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      {/* 本文 */}
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

      {/* ユーザーメニュー */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.menuBackdrop} onPress={() => setMenuVisible(false)}>
          <View />
        </Pressable>

        <View style={styles.menuContainer}>
          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>アカウント</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push('/profile');
              }}
            >
              <Text style={styles.menuItemText}>プロフィール</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={[styles.menuItemText, { color: '#ef4444' }]}>ログアウト</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* ▼ 日記・勉強作成モーダル */}
      <Modal
        visible={createVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setCreateVisible(false)}
      >
        {/* 背景タップで閉じる */}
        <Pressable style={styles.createBackdrop} onPress={() => setCreateVisible(false)}>
          <View />
        </Pressable>

        {/* 中央カード部分 */}
        <View style={styles.createContainer}>
          <View style={styles.createCard}>
            <Text style={styles.createTitle}>新規作成</Text>

            <TouchableOpacity
              style={styles.createItem}
              onPress={() => {
                setCreateVisible(false);
                router.push('/createDiary');
              }}
            >
              <Text style={styles.createItemText}>日記を作成</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.createItem}
              onPress={() => {
                setCreateVisible(false);
                router.push('/createStudy');
              }}
            >
              <Text style={styles.createItemText}>勉強を作成</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>




    </View>
  );
}

const CARD_GAP = 12;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fafafa' },

  // ==== ヘッダー ====
  header: {
    paddingTop: 65, 
    paddingHorizontal: 12,
    paddingBottom: 6,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  avatarEmoji: { fontSize: 18 },

  // ==== タブ ====
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    height: 42, // 🔽 タブを低く
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
//   tabItemActive: {
//   backgroundColor: '#f3f4f6', // グレー背景
//   borderBottomWidth: 2,
//   borderBottomColor: '#111827',
// },
  tabText: { fontSize: 15, color: '#6b7280', fontWeight: '600' },
  tabTextActive: { color: '#111827' },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '60%',
    backgroundColor: '#111827',
    borderRadius: 999,
  },

  // ==== コンテンツ ====
  scroll: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -CARD_GAP / 2,
  },
  card: {
    width: '100%',
    marginHorizontal: CARD_GAP / 2,
    marginBottom: CARD_GAP,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardImage: { width: '100%', height: 150, backgroundColor: '#f3f4f6' },
  cardContent: { padding: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  cardTitle: { fontSize: 16, fontWeight: '700', maxWidth: '70%' },
  cardDate: { fontSize: 12, color: '#6b7280' },
  cardSubtitle: { marginTop: 4, fontSize: 13, color: '#4b5563' },
  cardBody: { marginTop: 6, fontSize: 13, color: '#374151' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 6 },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  tagText: { fontSize: 12, color: '#374151' },

  // ==== メニュー ====
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  menuContainer: {
    position: 'absolute',
    top: 58, // 🔽 少し下げてアイコン位置と整列
    left: 8,
  },
  menuCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  menuTitle: {
    fontSize: 12,
    color: '#6b7280',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
    fabContainer: {
    position: 'absolute',
    bottom: 24, // 下からの距離
    right: 24,  // 右からの距離
    zIndex: 999,      // ← iOSで最前面に
    elevation: 999,   // ← Androidで最前面に

  },
  // {日記，勉強作成ボタン}
  fabButton: {
    backgroundColor: '#4CAF50', 
    width: 56,
    height: 56,
    borderRadius: 28, // 丸くする
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // Android影
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 32,
  },
  // {日記，勉強作成モーダル}
    // ▼ 背景（半透明）
  createBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  // ▼ コンテナ（中央にカードを配置）
  createContainer: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    alignItems: 'center',
  },

  // ▼ カード全体
  createCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 28,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },

  // ▼ タイトル
  createTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111',
  },

  // ▼ ボタン項目
  createItem: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  // ▼ ボタン文字
  createItemText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2563eb', // 少しアクセントに青
    fontWeight: '500',
  },
});
