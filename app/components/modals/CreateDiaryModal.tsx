import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (payload: {
    title: string;
    content: string;
    date: string;
    image: string | null;
  }) => void;
};

function todayYMD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export default function CreateDiaryModal({ visible, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(todayYMD());
  const [image, setImage] = useState<string | null>(null);
  const [contentHeight, setContentHeight] = useState(180);

  const reset = () => {
    setTitle('');
    setContent('');
    setDate(todayYMD());
    setImage(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('写真にアクセスできません', '設定から写真へのアクセスを許可してください。');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          (ImagePicker as any).MediaTypeOptions?.Images ??
          (ImagePicker as any).MediaType?.Images ??
          ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [2, 1],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (e) {
      console.log('画像選択エラー:', e);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return Alert.alert('未入力', 'タイトルを入力してください。');
    if (!content.trim()) return Alert.alert('未入力', '本文を入力してください。');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Alert.alert('日付形式', 'YYYY-MM-DD の形式で入力してください。');
    }
    const payload = { title: title.trim(), content: content.trim(), date, image };
    if (onSubmit) {
      onSubmit(payload);
    } else {
      Alert.alert('プレビュー送信', JSON.stringify(payload, null, 2));
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.root}
        >
          {/* フルスクリーンの白背景（カードや影は使わない） */}
          <View style={styles.sheet}>
            {/* 上部ナビ（テキストのみ） */}
            <View style={styles.nav}>
              <Pressable onPress={handleClose} hitSlop={8}>
                <Text style={styles.navText}>閉じる</Text>
              </Pressable>
              <View style={{ flex: 1 }} />
              <Pressable onPress={handleSubmit} hitSlop={8}>
                <Text style={[styles.navText, styles.navPrimary]}>保存</Text>
              </Pressable>
            </View>

            {/* コンテンツ */}
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {/* 日付（控えめなピル） */}
              <View style={styles.dateRow}>
                <TextInput
                  style={styles.datePill}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#b6b6b6"
                  inputMode="numeric"
                  maxLength={10}
                />
              </View>

              {/* タイトル（大きめ） */}
              <TextInput
                style={styles.title}
                placeholder="タイトル"
                placeholderTextColor="#b6b6b6"
                value={title}
                onChangeText={setTitle}
                returnKeyType="next"
              />

              {/* うっすら下線的な区切り（実線は使わず最小限） */}
              <View style={styles.hairline} />

              {/* 本文（行間広め・自動で高さ拡張） */}
              <TextInput
                style={[styles.body, { height: Math.max(180, contentHeight) }]}
                placeholder="ここに書き始める…"
                placeholderTextColor="#b6b6b6"
                value={content}
                onChangeText={setContent}
                multiline
                onContentSizeChange={(e) => {
                  const h = e.nativeEvent.contentSize.height;
                  setContentHeight(h + 12); // 少し余白を足して“詰まらない”見た目に
                }}
              />

              {/* 画像（インライン表示・枠なし） */}
              {image ? (
                <View style={styles.imageBox}>
                  <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
                  <View style={styles.imageActions}>
                    <Pressable onPress={() => setImage(null)} hitSlop={6}>
                      <Text style={styles.ghostLink}>画像を削除</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={styles.inlineActions}>
                  <Pressable onPress={pickImage} hitSlop={6}>
                    <Text style={styles.ghostLink}>画像を挿入</Text>
                  </Pressable>
                </View>
              )}

              {/* 末尾余白 */}
              <View style={{ height: 48 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // 背景は薄い透過のみ（演出最小限）
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  root: {
    flex: 1,
  },
  // フルスクリーンの白いシート
  sheet: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  // 上部ナビ（テキストボタンのみ、影やボーダーなし）
  nav: {
    height: 52,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  navText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  navPrimary: {
    color: '#111827',
  },
  // 本文領域（左右は広めの余白）
  content: {
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  // 日付ピル（枠線でなく淡い背景）
  dateRow: {
    marginTop: 10,
    marginBottom: 12,
  },
  datePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    color: '#111827',
    fontSize: 13,
    minWidth: 120,
  },
  // タイトル：大きく、太くしすぎない
  title: {
    fontSize: 24,
    lineHeight: 32,
    color: '#111827',
    fontWeight: '700',
    paddingVertical: 6,
  },
  // 区切り（実線は目立つので超薄いヘアライン）
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#eee',
    marginTop: 6,
    marginBottom: 10,
  },
  // 本文：行間たっぷり、等幅じゃないシステムフォント想定
  body: {
    fontSize: 17,
    lineHeight: 28,
    color: '#222',
    paddingTop: 8,
    paddingBottom: 2,
    textAlignVertical: 'top',
  },
  // インライン画像
  imageBox: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 220,
  },
  imageActions: {
    marginTop: 8,
  },
  inlineActions: {
    marginTop: 12,
  },
  // 文字だけの“ゴースト”リンク
  ghostLink: {
    fontSize: 14,
    color: '#6b7280',
    textDecorationLine: 'underline',
  },
});
