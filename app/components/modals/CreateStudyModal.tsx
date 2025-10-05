import React, { useState } from 'react';
import { auth } from '../../lib/firebase';
import { apiClient } from '../../lib/api';
import {
  Modal,
  View,
  Text,
  TextInput,
  Image,
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
    image: string | null;
    tags: string[];
  }) => void;
};

type CreateStudyTagLinksPayload = {
  studyId: string,
  tagIds: string[];
};

function todayYMD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export default function CreateStudyModal({ visible, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(todayYMD());
  const [image, setImage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const reset = () => {
    setTitle('');
    setContent('');
    setDate(todayYMD());
    setImage(null);
    setTags([]);
    setTagInput('');
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
        mediaTypes:
          (ImagePicker as any).MediaTypeOptions?.Images ??
          (ImagePicker as any).MediaType?.Images ??
          ['images'],
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

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const saveStudy = async (studyData: any) => {
    try {
      setIsLoading(true);
      console.log('Saving study data:', studyData);
      
      // バックエンドAPIに保存（user_idとcreatedAtはバックエンドで自動設定）
      const response = await apiClient.request('/studies', {
        method: 'POST',
        body: JSON.stringify(studyData),
      });

      if (response.success) {
        Alert.alert('保存完了', '勉強記録が保存されました。');
        reset();
        onClose();
      } else {
        Alert.alert('エラー', response.message || '保存中にエラーが発生しました。');
      }
    } catch (error: any) {
      console.error('Study save error:', error);
      Alert.alert('エラー', '保存中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async() => {
    if (!title.trim()) return Alert.alert('未入力', 'タイトルを入力してください。');
    if (!content.trim()) return Alert.alert('未入力', '本文を入力してください。');
    
    try {
      const responseStudy = await apiClient.createStudy({
        title: title.trim(),
        content: content.trim(),
        image: image,
      });

      if (!responseStudy.success) {
        return Alert.alert('保存エラー', '学びの保存に失敗しました');
      }

      const studyId = responseStudy.data.id;
      console.log('front : ',tags)

    if (tags.length > 0) {
      const responseTags = await apiClient.createTags(tags);
      if (!responseTags.success) {
        return Alert.alert('保存エラー', 'タグの保存に失敗しました');
      }
      const tagIds = responseTags.data.map((tag: any) => tag.id);
      const payload: CreateStudyTagLinksPayload = { studyId, tagIds }; 
      const responseLinks = await apiClient.createStudyTagLinks(payload);
      if (!responseLinks.success) {
        return Alert.alert('保存エラー', '学びとタグの紐付けに失敗しました');
      }
    }
      Alert.alert('保存完了', '学びが正常に保存されました', [
        {
          text: 'OK',
          onPress: () => {
            reset();
            onClose();
          },
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('保存エラー', '通信中にエラーが発生しました');
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
              <Pressable onPress={handleSubmit} hitSlop={8} disabled={isLoading}>
                <Text style={[styles.navText, styles.navPrimary, isLoading && { opacity: 0.5 }]}>
                  {isLoading ? '保存中...' : '保存'}
                </Text>
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
                <Text style={styles.datePill}>{date}</Text>
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

              {/* タグ入力エリア */}
              <View style={styles.tagContainer}>
                <Text style={styles.tagLabel}>タグ</Text>
                <View style={styles.tagInputRow}>
                  <TextInput
                    style={styles.tagInput}
                    placeholder="タグを入力..."
                    placeholderTextColor="#b6b6b6"
                    value={tagInput}
                    onChangeText={setTagInput}
                    onSubmitEditing={addTag}
                    returnKeyType="done"
                  />
                  <Pressable onPress={addTag} style={styles.addTagButton}>
                    <Text style={styles.addTagText}>追加</Text>
                  </Pressable>
                </View>
                
                {/* タグ表示エリア */}
                {tags.length > 0 && (
                  <View style={styles.tagsRow}>
                    {tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                        <Pressable onPress={() => removeTag(tag)} style={styles.removeTagButton}>
                          <Text style={styles.removeTagText}>×</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* うっすら下線的な区切り（実線は使わず最小限） */}
              <View style={styles.hairline} />

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
              {/* 本文（行間広め・固定高さ） */}
              <TextInput
                style={[styles.body, { height: 300 }]}
                placeholder="ここに書き始める…"
                placeholderTextColor="#b6b6b6"
                value={content}
                onChangeText={setContent}
                multiline
              />


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
  // 文字だけの"ゴースト"リンク
  ghostLink: {
    fontSize: 14,
    color: '#6b7280',
    textDecorationLine: 'underline',
  },
  // タグ関連のスタイル
  tagContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  tagLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  addTagButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 20,
  },
  addTagText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#0891b2',
  },
  tagText: {
    fontSize: 13,
    color: '#0c4a6e',
    fontWeight: '500',
    marginRight: 6,
    marginBottom: 2,
  },
  removeTagButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0891b2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeTagText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 12,
  },
});
