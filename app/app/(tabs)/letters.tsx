import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permission from "expo-permissions";


export default function LetterPostScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [deliverAt, setDeliverAt] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);



  const handleSubmit = () => {
    const newLetter = {
      title,
      content,
      image,
      deliverAt: deliverAt.toISOString().split("T")[0], // "YYYY-MM-DD"
      createdAt: new Date().toISOString().split("T")[0],
      userId: "jfoejfoe2joBfjof", // 本来はログインユーザーID
    };

    console.log("投稿データ:", newLetter);
    // Firestore などに保存処理を書く
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [2, 1],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
      console.log(result);
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff"}}>
      <Text>手紙を投稿する</Text>
      {image !== "" && (
        <View style={{ alignItems: "center"}}>
          <Image 
            source={{ uri: image}}
            style={{ width: 200, height: 200, marginVertical: 12}}
          />
        </View>
      )} 
      <View style={{ marginTop: 12 }}>
        <Button
          title="画像を選択"
          onPress={pickImage}
        />
      </View>
      <TextInput
        placeholder="タイトル"
        value={title}
        onChangeText={setTitle}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          marginBottom: 12,
          marginTop: 12,
          borderRadius: 8,
        }}
      />

      <TextInput
        placeholder="本文"
        value={content}
        onChangeText={setContent}
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          height: 100,
          marginBottom: 12,
          borderRadius: 8,
          textAlignVertical: "top",
        }}
      />


      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <Text>お届け日: {deliverAt.toISOString().split("T")[0]}</Text>
      </TouchableOpacity>


      <Button title="投稿する" onPress={handleSubmit} />
    </View>
  );
}
