import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function FloatingCart({ onPress }: { onPress: () => void }) {
  const totalQuantity = useSelector(
    (state: RootState) => state.cart.totalQuantity,
  );

  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.icon}>🛒</Text>
      {totalQuantity > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{totalQuantity}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3f51b5",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: { fontSize: 24, color: "white" },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "white", fontSize: 10 },
});
