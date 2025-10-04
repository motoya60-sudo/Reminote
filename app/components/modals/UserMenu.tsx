import React from 'react';
import { Modal, Pressable, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onProfile: () => void;
  onLogout: () => void;
};

export default function UserMenu({ visible, onClose, onProfile, onLogout }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.menuBackdrop} onPress={onClose}>
        <View />
      </Pressable>

      <View style={styles.menuContainer}>
        <View style={styles.menuCard}>
          <Text style={styles.menuTitle}>アカウント</Text>

          <TouchableOpacity style={styles.menuItem} onPress={onProfile}>
            <Text style={styles.menuItemText}>プロフィール</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onLogout}>
            <Text style={[styles.menuItemText, { color: '#ef4444' }]}>ログアウト</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  menuContainer: {
    position: 'absolute',
    top: 58,
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
});
