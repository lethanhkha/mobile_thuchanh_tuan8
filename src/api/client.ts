import axios from "axios";
import { Platform } from "react-native";

const LAN_IP = "192.168.1.10"; // Chỉ dùng khi bạn chạy trên điện thoại thật
const PORT = 3000;

// Cấu hình linh hoạt theo môi trường đang chạy
let host = LAN_IP;
if (Platform.OS === "web") {
  host = "localhost"; // Bắt buộc là localhost khi chạy bằng Mobile View / Trình duyệt[cite: 16]
} else if (Platform.OS === "android") {
  host = "10.0.2.2"; // Dùng cho máy ảo Android
}

export const api = axios.create({
  baseURL: `http://${host}:${PORT}`,
  timeout: 10000,
});

// Quản lý token
let authToken: string | null = null;
export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// Gắn token vào header của mọi request
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// Lấy thông báo lỗi từ server
export const getServerMessage = (err: any): string | undefined =>
  typeof err?.response?.data === "string" ? err.response.data : undefined;
