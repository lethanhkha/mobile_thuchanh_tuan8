import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import authService from "../services/authService";
import { setLoginData } from "../store/authSlice";

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true); // Chuyển đổi Đăng nhập/Đăng ký
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!email.includes("@")) return "Email không hợp lệ";
    if (password.length < 6) return "Mật khẩu phải từ 6 ký tự"; // Validate pass >= 6
    if (!isLogin && !name) return "Vui lòng nhập tên";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = isLogin
        ? await authService.login(email, password)
        : await authService.register(name, email, password);

      dispatch(setLoginData(data));
      navigation.replace("MainTabs"); // Thành công thì về Home
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? "Đăng Nhập" : "Đăng Ký"}</Text>

      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={name}
          onChangeText={setName}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.btn}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.btnText}>
            {isLogin ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setIsLogin(!isLogin);
          setError("");
        }}
      >
        <Text style={styles.switchText}>
          {isLogin
            ? "Chưa có tài khoản? Đăng ký ngay"
            : "Đã có tài khoản? Đăng nhập"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#3f51b5",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  btn: {
    backgroundColor: "#3f51b5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "bold" },
  switchText: { textAlign: "center", marginTop: 16, color: "#3f51b5" },
  errorText: { color: "red", marginBottom: 16 },
});
