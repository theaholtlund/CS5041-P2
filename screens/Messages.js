import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInAnonymously } from "firebase/auth";
import { useEffect, useState } from "react";
import { useList } from "react-firebase-hooks/database";
import { ActivityIndicator, Text, TextInput, Button } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import { useLinkProps } from "@react-navigation/native";

import styles from "../components/Styles";
import { auth, database } from "../Firebase";
import Message from "../components/Message";
import { ref, push, child, serverTimestamp } from "firebase/database";

export default function Messages() {
  const [user, authLoading, authError] = useAuthState(auth);
  const { onPress } = useLinkProps({ to: { screen: "Post" } });
  const [text, setText] = useState("");

  useEffect(() => {
    signInAnonymously(auth);
  }, []);

  const [snapshots, dbLoading, dbError] = useList(
    user ? ref(database, "/public") : null
  );

  useEffect(() => {
    console.log(snapshots);
  }, [snapshots]);

  const handleOnPress = () => {
    push(child(user ? ref(database) : null, `/public/${user.uid}`), {
      type: "Messages",
      created: serverTimestamp(),
      modified: serverTimestamp(),
      message: text,
      content: "",
    });
    setText("");
  };

  return (
    <SafeAreaView style={styles.container}>
      {authLoading || dbLoading || !snapshots ? (
        <SafeAreaView
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large"></ActivityIndicator>
          <Text style={{ margin: 10 }}>loading...</Text>
        </SafeAreaView>
      ) : (
        <View style={styles.scrollViewContainer}>
          <ScrollView
            style={styles.scrollView}
            
          >
            {snapshots
              .flatMap((el) => Object.entries(el.val()))
              .sort((a, b) => b[1].created - a[1].created)
              .filter((el) => el[1].type == "Messages")
              .map((el, i) => (
                <Message
                  key={el[0]}
                  i={i}
                  iMax={
                    snapshots.flatMap((el) => Object.entries(el.val())).length
                  }
                  message={el[1]}
                ></Message>
              ))}
          </ScrollView>
          <View style={styles.scrollViewContainer}>
            <TextInput style={{ width: "50%" }} value={text} onChangeText={(text) => setText(text)} />
            <Button icon="send" mode="contained" onPress={handleOnPress}>
              Submit Comment
            </Button>
          </View>
        </View>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
