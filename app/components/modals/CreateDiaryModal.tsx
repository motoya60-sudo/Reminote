import React, { useState } from 'react';
import{useRouter} from 'expo-router';
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
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { apiClient } from '../../lib/api';
import {auth} from '../../lib/firebase';

type Props = {
  visible: boolean;
  onClose: () => void;
};

function todayYMD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export default function CreateDiaryModal({ visible, onClose}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(todayYMD());
  const [image, setImage] = useState<string | null>(null);
  const [contentHeight, setContentHeight] = useState(180);
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => {
    setTitle('');
    setContent('');
    setDate(todayYMD());
    setImage(null);
    setIsLoading(false);
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
        mediaTypes: ['images', 'videos'],
        allowsEditing: false,
        quality: 1,
        selectionLimit: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0]?.uri ?? null);
      }
  
      console.log(result);
    } catch (e) {
      console.log('画像選択エラー:', e);
      Alert.alert('画像選択エラー', '画像の読み込みに失敗しました。もう一度お試しください。');
    }
  };

  const handleSubmit = async () => {
    // バリデーション
    if (!title.trim()) return Alert.alert('未入力', 'タイトルを入力してください。');
    if (!content.trim()) return Alert.alert('未入力', '本文を入力してください。');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return Alert.alert('日付形式', 'YYYY-MM-DD の形式で入力してください。');
    }

    setIsLoading(true);
    try {
      // APIを呼び出して日記を保存
      const response = await apiClient.createDiary({
        title: title.trim(),
        content: content.trim(),
        image: image,

      });

      if (response.success) {
        Alert.alert(
          '保存完了',
          '日記が正常に保存されました。',
          [
            {
              text: 'OK',
              onPress: () => {
                reset();
                onClose();
                router.replace('/home'); 
              }
            }
          ]
        );
      } else {
        Alert.alert('保存エラー', response.message || '日記の保存に失敗しました。');
      }
    } catch (error: any) {
      console.error('日記保存エラー:', error);
      Alert.alert(
        '保存エラー', 
        error.message || '日記の保存中にエラーが発生しました。'
      );
    } finally {
      setIsLoading(false);
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
          <View style={styles.sheet}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[styles.content, { paddingBottom: 160 }]}
              showsVerticalScrollIndicator={false}
            >
              {/* 🔼 上余白 */}
              <View style={{ height: 40 }} />

              {/* 📅 日付（編集不可） */}
              <View style={styles.dateRow}>
                <View style={styles.datePill}>
                  <Text style={styles.dateText}>{date}</Text>
                </View>
              </View>

              {/* 📝 タイトル */}
              <TextInput
                style={styles.title}
                placeholder="タイトルを入力"
                placeholderTextColor="#b6b6b6"
                value={title}
                onChangeText={setTitle}
                returnKeyType="next"
              />
                            {/* 🖼 画像（あれば表示） */}
              {image && (
                <View style={styles.imageBox}>
                  <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
                </View>
              )}

              {/* 🖋 本文 */}
              <TextInput
                style={[styles.body, { height: 300 }]}
                placeholder="ここに日記を書いていく…"
                placeholderTextColor="#b6b6b6"
                value={content}
                onChangeText={setContent}
                multiline
              />




              {/* 📎 画像追加ボタン（下部に配置） */}
              <View style={styles.addImageContainer}>
                {image ? (
                  // 画像があるとき：削除ボタン
                  <Pressable
                    onPress={() => setImage(null)}
                    hitSlop={6}
                    style={[styles.addImageButton, { backgroundColor: '#fff1f2', borderColor: '#fecdd3' }]} // うっすら赤系
                  >
                    <Text style={[styles.addImageText, { color: '#dc2626' }]}>画像を削除</Text>
                  </Pressable>
                ) : (
                  // 画像がないとき：追加ボタン
                  <Pressable onPress={pickImage} hitSlop={6} style={styles.addImageButton}>
                    <Text style={styles.addImageText}>＋ 画像を追加</Text>
                  </Pressable>
                )}
              </View>
            </ScrollView>

            {/* 📌 下部固定フッター */}
            <View style={styles.footer}>
              <Pressable onPress={handleClose} hitSlop={8} style={styles.footerGhost}>
                <Text style={styles.footerGhostText}>閉じる</Text>
              </Pressable>

              <View style={{ width: 12 }} />

              <TouchableOpacity 
                onPress={handleSubmit} 
                activeOpacity={0.8} 
                style={[styles.footerPrimary, isLoading && styles.footerPrimaryDisabled]}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.footerPrimaryText}>保存</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  root: {
    flex: 1,
  },
  sheet: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },

  // タイトル
  title: {
    fontSize: 24,
    lineHeight: 32,
    color: '#111827',
    fontWeight: '700',
    paddingVertical: 8,
    marginTop: 12,
  },

  // 本文
  body: {
    fontSize: 17,
    lineHeight: 28,
    color: '#222',
    paddingTop: 8,
    paddingBottom: 2,
    textAlignVertical: 'top',
  },

  // 日付
  dateRow: {
    marginTop: 16,
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

  // 画像
  imageBox: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 400,
  },
  imageActions: {
    marginTop: 8,
    alignItems: 'center',
  },
  ghostLink: {
    fontSize: 14,
    color: '#6b7280',
    textDecorationLine: 'underline',
  },

  // 「画像を追加」ボタン（下部）
  addImageContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  addImageButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#f9fafb',
  },
  addImageText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
  },

  // フッター
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.select({ ios: 24, android: 16 }),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  footerGhost: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerGhostText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  footerPrimary: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  footerPrimaryText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  footerPrimaryDisabled: {
    backgroundColor: '#9ca3af',
  },
  dateText: {
    color: '#111827',
    fontSize: 13,
  },

});
