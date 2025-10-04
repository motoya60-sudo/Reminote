// app/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase"; // 作ったファイルのパスに合わせて調整
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/home"); // ログイン成功後にタブ画面へ
    } catch (error: any) {
      Alert.alert("ログインエラー", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20, textAlign: "center" }}>
        ログイン
      </Text>

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

      <Button title="ログイン" onPress={handleLogin} />
      <Button title="新規登録はこちら" onPress={() => router.push('/register')} />	
    </View>
  );
}
