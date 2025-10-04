import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { TabKey } from '@/lib/types';

type Props = {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export default function TopTabs({ activeTab, onChange }: Props) {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tabItem, activeTab === 'diary' && styles.tabItemActive]}
        onPress={() => onChange('diary')}
      >
        <Text style={[styles.tabText, activeTab === 'diary' && styles.tabTextActive]}>日記</Text>
        {activeTab === 'diary' && <View style={styles.tabIndicator} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabItem, activeTab === 'study' && styles.tabItemActive]}
        onPress={() => onChange('study')}
      >
        <Text style={[styles.tabText, activeTab === 'study' && styles.tabTextActive]}>勉強</Text>
        {activeTab === 'study' && <View style={styles.tabIndicator} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    height: 42, // 少し低め
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    backgroundColor: '#f9fafb',
  },
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
});
