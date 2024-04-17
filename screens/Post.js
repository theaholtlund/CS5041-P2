import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, TextInput, Text, ActivityIndicator } from "react-native-paper";

import * as ImagePicker from "expo-image-picker";
import { manipulateAsync } from "expo-image-manipulator";

import styles from "../components/Styles";
import { StatusBar } from "expo-status-bar";

import { auth, database } from "../Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, push, child, serverTimestamp } from "firebase/database";
import { signInAnonymously } from "firebase/auth";

export default function Post() {
  const [user, authLoading, authError] = useAuthState(auth);

  useEffect(() => {
    signInAnonymously(auth);
  }, []);

  const [text, setText] = useState("");

  const [image, setImage] = useState(null);

  const navigation = useNavigation();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const manipRes = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 200, height: 200 } }],
        { compress: 0.5 }
      );
      setImage("data:image/jpeg;base64," + manipRes.base64);
    }
  };

  const handleOnPress = () => {
    push(child(user ? ref(database) : null, `/public/${user.uid}`), {
      type: "FoodMo",
      created: serverTimestamp(),
      modified: serverTimestamp(),
      message: text,
      content: image,
    });
    setText("");
    setImage(null);
    navigation.navigate("RateRestaurant: Restaurants in St. Andrews");
  };

  return (
    <SafeAreaView style={styles.container}>
      {authLoading ? (
        <SafeAreaView style={styles.container}>
          <ActivityIndicator size="large"></ActivityIndicator>
          <Text style={{ margin: 10 }}>loading...</Text>
        </SafeAreaView>
      ) : (
        <>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
          <TextInput
            label="Text"
            value={text}
            onChangeText={(text) => setText(text)}
            style={{ margin: 10, width: "50%" }}
          />
          <Button
            icon="camera"
            mode="contained"
            style={{ margin: 10 }}
            onPress={pickImage}
          >
            Pick an image from camera roll
          </Button>
          <Button
            icon="share"
            mode="contained"
            style={{ margin: 10 }}
            onPress={handleOnPress}
          >
            Share
          </Button>
          <StatusBar style="auto" />
        </>
      )}
    </SafeAreaView>
  );
}
