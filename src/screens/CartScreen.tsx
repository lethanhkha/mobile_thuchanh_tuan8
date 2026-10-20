import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function CartScreen({ navigation }: any) {
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={{ flex: 1 }}>{item.title}</Text>
            <Text>SL: {item.quantity}</Text>
            <Text style={{ marginLeft: 16 }}>
              {(item.price * item.quantity).toLocaleString()} đ
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.bottomBar}>
        <Text style={styles.total}>Tổng: {totalPrice.toLocaleString()} đ</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Checkout", { total: totalPrice })}
        >
          <Text style={styles.btnText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  bottomBar: {
    padding: 16,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: { fontSize: 18, fontWeight: "bold" },
  btn: {
    backgroundColor: "#3f51b5",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnText: { color: "white", fontWeight: "bold" },
});
