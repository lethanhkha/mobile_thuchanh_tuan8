import { api, getServerMessage } from "../api/client";

function getJwtExpiry(token: string): number {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload.exp * 1000;
  } catch {
    return Date.now() + 60 * 60 * 1000;
  }
}

const MESSAGES: Record<string, string> = {
  "Cannot find user": "Email hoặc mật khẩu không đúng",
  "Incorrect password": "Email hoặc mật khẩu không đúng",
  "Email already exists": "Email đã được sử dụng",
  "Email format is invalid": "Email không đúng định dạng",
  "Password is too short": "Mật khẩu quá ngắn",
};

const toAppError = (err: unknown) => {
  const msg = getServerMessage(err);
  if (msg) return new Error(MESSAGES[msg] ?? msg);
  return new Error("Lỗi kết nối máy chủ.");
};

const login = async (email: string, password: string) => {
  try {
    const res = await api.post("/login", { email: email.trim(), password });
    return {
      token: res.data.accessToken,
      user: res.data.user,
      expiresAt: getJwtExpiry(res.data.accessToken),
    };
  } catch (err) {
    throw toAppError(err);
  }
};

const register = async (name: string, email: string, password: string) => {
  try {
    const res = await api.post("/register", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
    return {
      token: res.data.accessToken,
      user: res.data.user,
      expiresAt: getJwtExpiry(res.data.accessToken),
    };
  } catch (err) {
    throw toAppError(err);
  }
};

// Sử dụng export default để xuất cả 2 hàm[cite: 24]
export default { login, register };
