import { NavigationContainer } from "@react-navigation/native";

import StackNavigator from "./navigators/StackNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator></StackNavigator>
    </NavigationContainer>
  );
}
