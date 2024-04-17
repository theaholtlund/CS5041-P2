import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInAnonymously } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useList } from "react-firebase-hooks/database";
import { ref, set } from "firebase/database";
import { ActivityIndicator, Text, FAB, Searchbar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import { useLinkProps } from "@react-navigation/native";

import styles from "../components/Styles";
import { auth, database } from "../Firebase";
import PostCard from "../components/PostCard";

export default function Moments() {
  const [user, authLoading, authError] = useAuthState(auth);
  const { onPress } = useLinkProps({ to: { screen: "Post" } });

  const [searchQuery, setSearchQuery] = useState('');
  const onChangeSearch = query => setSearchQuery(query);
  
  useEffect(() => {
    signInAnonymously(auth);
  }, []);

  const [snapshots, dbLoading, dbError] = useList(
    user ? ref(database, "/public") : null
  );

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
          <Searchbar 
            style={{ margin: 10, width: 300 }}
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
          >
            {snapshots
              .flatMap((el) => Object.entries(el.val()))
              .sort((a, b) => b[1].created - a[1].created)
              .filter((el) => el[1].type == "FoodMo")
              .filter((el) => el[1].message.includes(searchQuery))
              .map((el) => (
                <PostCard
                  content={ el[1].content }
                  message={ el[1].message }
                ></PostCard>
              ))}
          </ScrollView>
          <FAB icon="plus" style={styles.fab} onPress={onPress} />
        </View>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
