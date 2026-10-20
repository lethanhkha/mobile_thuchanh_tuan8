import { View, Text } from "react-native";

export default function CheckoutScreen({ route }: any) {
  const { total } = route.params;
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Màn hình Thanh toán</Text>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Cần thanh toán: {total.toLocaleString()} đ
      </Text>
    </View>
  );
}
