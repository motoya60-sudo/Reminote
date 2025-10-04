import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

function todayYMD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export default function CreateDiary() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(todayYMD());
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('エラー', '写真へのアクセスが許可されていません。');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) setImage(result.assets[0].uri);
    } catch (e) {
      console.log(e);
    }
  };

  const submit = () => {
    if (!title.trim()) return Alert.alert('未入力', 'タイトルを入力してください。');
    if (!content.trim()) return Alert.alert('未入力', '本文を入力してください。');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return Alert.alert('日付形式', 'YYYY-MM-DD の形式で入力してください。');

    const payload = { title: title.trim(), content: content.trim(), date, image };
    Alert.alert('プレビュー送信', JSON.stringify(payload, null, 2));
    // ここを実API/Firestore保存に置き換えればOK
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>日記を作成</Text>

      {/* 日付 */}
      <Text style={styles.label}>日付</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
        inputMode="numeric"
        maxLength={10}
      />

      {/* タイトル */}
      <Text style={styles.label}>タイトル</Text>
      <TextInput
        style={styles.input}
        placeholder="タイトルを入力"
        value={title}
        onChangeText={setTitle}
      />

      {/* 本文 */}
      <Text style={styles.label}>本文</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="本文を入力"
        value={content}
        onChangeText={setContent}
        multiline
      />

      {/* 画像 */}
      <Text style={styles.label}>画像（任意）</Text>
      {image ? (
        <View style={styles.imageFrame}>
          <Image source={{ uri: image }} style={styles.imageFill} resizeMode="contain" />
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>画像を選択</Text>
        </TouchableOpacity>
      )}

      {/* 投稿ボタン */}
      <TouchableOpacity style={[styles.button, styles.submitBtn]} onPress={submit}>
        <Text style={styles.buttonText}>投稿する</Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },
  header: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#ffffff',
    color: '#111827',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,                 // ← ボーダー追加
    borderColor: '#e5e7eb',         // ← 薄いグレー
  },
  textarea: {
    height: 160,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtn: {
    backgroundColor: '#10b981',     // 投稿は緑で区別
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  imageFrame: {
    width: '100%',
    height: 220,
    backgroundColor: '#f3f4f6',     // 画像の余白が分かる薄グレー
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,                  // 画像枠にもボーダー
    borderColor: '#e5e7eb',
  },
  imageFill: {
    width: '100%',
    height: '100%',
  },
});
