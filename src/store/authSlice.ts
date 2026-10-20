import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken } from "../api/client";

export const AUTH_STORAGE_KEY = "bookstore_auth";

// Auto-login: đọc từ AsyncStorage khi mở app và export hàm này để App.tsx gọi được[cite: 24]
export const restoreSession = createAsyncThunk("auth/restore", async () => {
  try {
    const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);

    // Kiểm tra token còn hạn không (expiresAt lưu thời gian mili-giây)[cite: 25]
    if (saved.token && saved.expiresAt > Date.now()) {
      setAuthToken(saved.token);
      return saved;
    }
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  } catch {
    return null;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
    token: null,
    isRestoring: true,
  },
  reducers: {
    setLoginData: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      setAuthToken(action.payload.token);
      AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      setAuthToken(null);
      AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    // Xử lý state sau khi restoreSession chạy xong[cite: 24]
    builder.addCase(restoreSession.fulfilled, (state, action) => {
      if (action.payload) {
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      }
      state.isRestoring = false;
    });
    // Đảm bảo ẩn màn hình chờ kể cả khi lỗi
    builder.addCase(restoreSession.rejected, (state) => {
      state.isRestoring = false;
    });
  },
});

export const { setLoginData, logout } = authSlice.actions;
export default authSlice.reducer;
