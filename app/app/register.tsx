import { auth, db } from "@/lib/firebase";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
	
			await setDoc(doc(db, "user", user.uid), {
				uid: user.uid,
				createdAt: new Date(),
				email: user.email,
				name: name,
				password: password,
			})
	
			Alert.alert("登録完了", "登録が完了しました。");
			router.replace('/home');
		}catch(error: any) {
			const errorCode = error.code;
    	const errorMessage = error.message;
			console.log(errorCode, errorMessage);
			Alert.alert("登録エラー", error.message);
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