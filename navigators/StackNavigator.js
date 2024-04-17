import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { IconButton } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { useLinkProps } from "@react-navigation/native";

import Post from "../screens/Post";
import Moments from "../screens/Moments";
import Messages from "../screens/Messages";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { onPress } = useLinkProps({ to: { screen: "Messages" } });

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RateRestaurant: Restaurants in St. Andrews"
        component={Moments}
        options={{
          headerRight: () => (
            <IconButton icon="chat" onPress={onPress}></IconButton>
          ),
        }}
      />
      <Stack.Screen name="Post" component={Post} />
      <Stack.Screen name="Messages" component={Messages} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  rightHeaderContainer: {
    width: 500,
    flexDirection: "row",
  },
});
