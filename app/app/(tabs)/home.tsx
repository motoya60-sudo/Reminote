import { auth } from '@/lib/firebase';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Text, View, Button } from 'react-native';

export default function Page() {
  const router = useRouter();
  const handleLogout = async() => {
    try {
      await signOut(auth)
      router.replace('/login');

    }catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Tabs Index page</Text>
      <Button title='ログアウト' onPress={handleLogout} />
    </View>
  );
}