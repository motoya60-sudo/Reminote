import React from 'react';
import { Modal, Pressable, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreateDiary: () => void;
  onCreateStudy: () => void;
};

export default function CreatePicker({
  visible,
  onClose,
  onCreateDiary,
  onCreateStudy,
}: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <Pressable style={styles.createBackdrop} onPress={onClose}>
        <View />
      </Pressable>

      <View style={styles.createContainer}>
        <View style={styles.createCard}>
          <Text style={styles.createTitle}>新規作成</Text>

          <TouchableOpacity style={styles.createItem} onPress={onCreateDiary}>
            <Text style={styles.createItemText}>日記を作成</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.createItem} onPress={onCreateStudy}>
            <Text style={styles.createItemText}>勉強を作成</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  createBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  createContainer: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    alignItems: 'center',
  },
  createCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 28,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  createTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111',
  },
  createItem: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  createItemText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#2563eb',
    fontWeight: '500',
  },
});
