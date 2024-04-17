import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: '100%',
    overflow: 'hidden'
  },
  scrollViewContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    width: "100%",
  },
  scrollViewContent: {
    width: "100%",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  inputTextContainer: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
  },
});

export default styles;
