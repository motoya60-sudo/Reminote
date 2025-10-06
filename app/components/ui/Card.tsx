// components/ui/Card.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;        // 一覧用
  body?: string;            // 詳細用でもOK
  date?: string | null;
  image?: string | null;
  tags?: string[];
  onPress?: () => void;
  /** ← 追加: 本文を省略せず全文表示したいとき true */
  noTruncateBody?: boolean;
  /** ← 追加: 一覧での行数を調整したい場合（デフォ3行） */
  bodyLines?: number;
};

export default function Card({
  title,
  subtitle,
  body,
  date,
  image,
  tags,
  onPress,
  noTruncateBody = false,
  bodyLines = 3,
}: Props) {
  const content = body ?? subtitle ?? '';

  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper onPress={onPress} style={styles.card}>
      {image ? <Image source={{ uri: image }} style={styles.thumb} /> : null}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {!!date && <Text style={styles.date}>{date}</Text>}
        </View>

        {/* 本文：noTruncateBody が true のときは numberOfLines を指定しない */}
        <Text
          style={styles.body}
          {...(noTruncateBody ? {} : { numberOfLines: bodyLines })}
        >
          {content}
        </Text>

        {!!tags?.length && (
          <View style={styles.tagsRow}>
            {tags.map((t) => (
              <View key={t} style={styles.tagPill}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  thumb: { width: '100%', height: 140 },
  content: { padding: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 16, fontWeight: '700', color: '#111827', flex: 1 },
  date: { fontSize: 11, color: '#6b7280' },
  body: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#374151',
    // ※ maxHeight など高さ制限がある場合は外してください
  },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tagText: { fontSize: 11, color: '#374151' },
});
