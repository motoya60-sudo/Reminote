import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
  body?: string;
  date: string;
  image?: string;
  tags?: string[];
  onPress?: () => void;
};

const CARD_GAP = 12;

export default function Card({
  title,
  subtitle,
  body,
  date,
  image,
  tags,
  onPress,
}: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {image ? <Image source={{ uri: image }} style={styles.cardImage} /> : null}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.cardDate}>{date}</Text>
        </View>
        {subtitle ? <Text style={styles.cardSubtitle} numberOfLines={1}>{subtitle}</Text> : null}
        {body ? <Text style={styles.cardBody} numberOfLines={2}>{body}</Text> : null}
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
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
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
});
