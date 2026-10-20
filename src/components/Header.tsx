import { View, Text, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>BookStore</Text>
      <View style={styles.rightIcons}>
        <Text>🔍</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: "#3f51b5",
  },
  logo: { color: "white", fontSize: 20, fontWeight: "bold" },
  rightIcons: { flexDirection: "row", gap: 16 },
});
