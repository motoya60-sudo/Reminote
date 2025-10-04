import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

type Props = {
  onPress?: () => void;
};

export default function FAB({ onPress }: Props) {
  return (
    <View style={styles.fabContainer}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="日記，または勉強記録を作成する"
        style={styles.fabButton}
      >
        <Text style={styles.fabText}>＋</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 999,
    elevation: 999,
  },
  fabButton: {
    backgroundColor: '#4CAF50',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 32,
  },
});
