import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type Props = {
  title: string;
  onAvatarPress?: () => void;
  onSearchPress?: () => void;
};

export default function Header({ title, onAvatarPress, onSearchPress }: Props) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onAvatarPress}
        accessibilityRole="button"
        accessibilityLabel="ユーザーメニューを開く"
        style={styles.avatarBtn}
      >
        <Text style={styles.avatarEmoji}>👤</Text>
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerRight}>
        {onSearchPress && (
          <Pressable
            onPress={onSearchPress}
            accessibilityRole="button"
            accessibilityLabel="検索"
            style={styles.searchBtn}
          >
            <Text style={styles.searchEmoji}>🔍</Text>
          </Pressable>
        )}
        <View style={{ width: 8 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  headerRight: { flexDirection: 'row', alignItems: 'center' },
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
  searchBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  searchEmoji: { fontSize: 18 },
});
