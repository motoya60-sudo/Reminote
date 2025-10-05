import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator, Modal } from 'react-native';
import { apiClient } from '@/lib/api';

type LineNotifyStatus = {
  isLineNotifyEnabled: boolean;
  lineNotifyUpdatedAt?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function LineNotifySettings({ visible, onClose }: Props) {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<LineNotifyStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadLineNotifyStatus();
  }, []);

  const loadLineNotifyStatus = async () => {
    try {
      setInitialLoading(true);
      const response = await apiClient.getLineNotifyStatus();
      setStatus(response.data);
    } catch (error) {
      console.error('LINE Notify状態取得エラー:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSetToken = async () => {
    if (!token.trim()) {
      Alert.alert('エラー', 'LINE Notifyトークンを入力してください');
      return;
    }

    try {
      setLoading(true);
      await apiClient.setLineNotifyToken(token.trim());
      
      Alert.alert('成功', 'LINE Notifyトークンを設定しました');
      setToken('');
      await loadLineNotifyStatus();
      
    } catch (error) {
      console.error('LINE Notifyトークン設定エラー:', error);
      Alert.alert('エラー', 'トークンの設定に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveToken = async () => {
    console.log('handleRemoveToken called');
    
    // 一時的に直接削除を実行（確認ダイアログをスキップ）
    try {
      setLoading(true);
      console.log('Calling removeLineNotifyToken API directly');
      const response = await apiClient.removeLineNotifyToken();
      console.log('Remove token response:', response);
      
      Alert.alert('成功', 'LINE Notifyトークンを削除しました');
      await loadLineNotifyStatus();
      
    } catch (error) {
      console.error('LINE Notifyトークン削除エラー:', error);
      Alert.alert('エラー', `トークンの削除に失敗しました: ${error.message}`);
    } finally {
      setLoading(false);
    }
    
    // 元の確認ダイアログ版（コメントアウト）
    /*
    Alert.alert(
      '確認',
      'LINE Notifyトークンを削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            console.log('Remove token confirmed');
            try {
              setLoading(true);
              console.log('Calling removeLineNotifyToken API');
              const response = await apiClient.removeLineNotifyToken();
              console.log('Remove token response:', response);
              
              Alert.alert('成功', 'LINE Notifyトークンを削除しました');
              await loadLineNotifyStatus();
              
            } catch (error) {
              console.error('LINE Notifyトークン削除エラー:', error);
              Alert.alert('エラー', `トークンの削除に失敗しました: ${error.message}`);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
    */
  };

  const handleTestNotification = async () => {
    console.log('🧪 Test notification button pressed');
    
    // 確認ダイアログをスキップして直接送信
    try {
      setLoading(true);
      console.log('📤 Sending test notification...');
      
      const response = await apiClient.sendTestNotification();
      console.log('✅ Test notification response:', response);
      
      Alert.alert('成功', 'テスト通知を送信しました！LINEを確認してください。');
      
    } catch (error) {
      console.error('❌ テスト通知送信エラー:', error);
      Alert.alert('エラー', `テスト通知の送信に失敗しました: ${error.message}`);
    } finally {
      setLoading(false);
    }
    
    // 元の確認ダイアログ版（コメントアウト）
    /*
    Alert.alert(
      'テスト通知',
      'LINEにテスト通知を送信しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '送信',
          onPress: async () => {
            try {
              setLoading(true);
              await apiClient.sendTestNotification();
              
              Alert.alert('成功', 'テスト通知を送信しました！LINEを確認してください。');
              
            } catch (error) {
              console.error('テスト通知送信エラー:', error);
              Alert.alert('エラー', 'テスト通知の送信に失敗しました');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
    */
  };

  if (initialLoading) {
    return (
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.container}>
            <ActivityIndicator size="small" />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalBackdrop}>
        <View style={styles.container}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
      <Text style={styles.title}>📱 LINE Notify設定</Text>
      <Text style={styles.description}>
        エビングハウスの忘却曲線に基づいて、復習リマインダーをLINEに送信します
      </Text>

      {status?.isLineNotifyEnabled ? (
        <View style={styles.enabledContainer}>
          <Text style={styles.enabledText}>✅ LINE Notifyが有効です</Text>
          {status.lineNotifyUpdatedAt && (
            <Text style={styles.updatedText}>
              設定日: {new Date(status.lineNotifyUpdatedAt).toLocaleDateString('ja-JP')}
            </Text>
          )}
          
          <View style={styles.buttonRow}>
            <Pressable 
              style={[styles.button, styles.testButton]} 
              onPress={handleTestNotification}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? '送信中...' : '🧪 テスト通知'}
              </Text>
            </Pressable>
            
            <Pressable 
              style={[styles.button, styles.removeButton]} 
              onPress={handleRemoveToken}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? '削除中...' : 'LINE Notifyを無効にする'}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.disabledContainer}>
          <Text style={styles.disabledText}>❌ LINE Notifyが無効です</Text>
          
          <Text style={styles.instructionTitle}>設定手順:</Text>
          <Text style={styles.instruction}>
            1. LINE Notifyの公式サイトでトークンを発行{'\n'}
            2. 下記の入力欄にトークンを入力{'\n'}
            3. 「設定」ボタンを押す
          </Text>

          <TextInput
            style={styles.input}
            placeholder="LINE Notifyトークンを入力"
            value={token}
            onChangeText={setToken}
            secureTextEntry
            multiline={false}
            editable={!loading}
          />

          <Pressable 
            style={[styles.button, styles.setButton]} 
            onPress={handleSetToken}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? '設定中...' : 'LINE Notifyを設定'}
            </Text>
          </Pressable>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>📚 復習スケジュール</Text>
        <Text style={styles.infoText}>
          • 1日後{'\n'}
          • 3日後{'\n'}
          • 1週間後{'\n'}
          • 2週間後{'\n'}
          • 1ヶ月後
        </Text>
        <Text style={styles.infoNote}>
          毎日午前9時に復習リマインダーが送信されます
        </Text>
      </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingTop: 32,
    minHeight: '70%',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6b7280',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1f2937',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  enabledContainer: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    marginBottom: 20,
  },
  enabledText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0c4a6e',
    marginBottom: 8,
  },
  updatedText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
  },
  disabledContainer: {
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fca5a5',
    marginBottom: 20,
  },
  disabledText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991b1b',
    marginBottom: 16,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  instruction: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  setButton: {
    backgroundColor: '#3b82f6',
  },
  testButton: {
    backgroundColor: '#10b981',
  },
  removeButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  infoNote: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});
