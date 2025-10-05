import { auth } from "@/lib/firebase";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { apiClient } from "../lib/api";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

export default function RegisterScreen() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const router = useRouter();
	const handleRegister = async() => {
		// ここに登録処理を実装
		try {
			console.log('Starting registration process...');
			console.log('apiClient:', apiClient);
			console.log('createUserProfile method:', apiClient?.createUserProfile);
			
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			console.log('Firebase user created:', user.uid);
	
			const response = await apiClient.createUserProfile(name);
			console.log('Profile creation response:', response);

			if(response.success) {
				Alert.alert("登録完了", "登録が完了しました。");
				router.replace('/home')
			}else {
				Alert.alert("エラー", response.message || "プロフィール作成中にエラーが発生しました。");
			}
		}catch(error: any) {
			console.error("Registration error:", error);
			
			// Firebase認証エラーの場合
			if (error.code === 'auth/email-already-in-use') {
				Alert.alert("登録エラー", "このメールアドレスは既に使用されています。");
			} else if (error.code === 'auth/weak-password') {
				Alert.alert("登録エラー", "パスワードが弱すぎます。6文字以上で入力してください。");
			} else if (error.code === 'auth/invalid-email') {
				Alert.alert("登録エラー", "無効なメールアドレスです。");
			} else {
				Alert.alert("登録エラー", error.message || "登録中にエラーが発生しました。");
			}
		}

	}


	return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20, textAlign: "center" }}>
        新規登録
      </Text>

			<TextInput 
				placeholder="ユーザー名"
				value={name}
				onChangeText={setName}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}				
			/>
			<TextInput 
				placeholder="メールアドレス"
				value={email}
				onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}
        autoCapitalize="none"
			/>
      <TextInput
        placeholder="パスワード"
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 5,
          marginBottom: 20,
        }}
        secureTextEntry
      />

			<Button title="登録" onPress={handleRegister}/>	
			<Button title="ログインはこちら" onPress={() => router.push('/login')} />	
		</View>
	)
}