import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { logout } from "../store/authSlice";

export default function AccountScreen({ navigation }: any) {
  // Đọc trạng thái đăng nhập từ Redux store
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  // Nếu chưa đăng nhập, hiển thị nút điều hướng sang màn LoginScreen[cite: 2]
  if (!isLoggedIn) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          Bạn chưa đăng nhập để xem thông tin tài khoản.
        </Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.btnText}>Đăng nhập / Đăng ký</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Nếu đã đăng nhập, hiển thị thông tin cơ bản và nút Đăng xuất[cite: 2]
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hồ sơ cá nhân</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Họ và tên:</Text>
        <Text style={styles.value}>{user?.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => dispatch(logout())}
      >
        <Text style={styles.btnText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  message: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#3f51b5",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
    elevation: 2,
  },
  label: { fontSize: 14, color: "gray", marginTop: 10 },
  value: { fontSize: 18, fontWeight: "bold", color: "#333", marginTop: 4 },
  primaryBtn: {
    backgroundColor: "#3f51b5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutBtn: {
    backgroundColor: "#d32f2f",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
