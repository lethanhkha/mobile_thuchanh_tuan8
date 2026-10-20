import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./src/store";
import { restoreSession } from "./src/store/authSlice";

// Import các màn hình
import HomeScreen from "./src/screens/HomeScreen";
import BookDetailScreen from "./src/screens/BookDetailScreen";
import CartScreen from "./src/screens/CartScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import LoginScreen from "./src/screens/LoginScreen"; // Màn hình Đăng nhập mới của Tuần 7
import AccountScreen from "./src/screens/AccountScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Màn hình giả cho các Tab chưa code tới
const DummyScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Chưa phát triển</Text>
  </View>
);

// Custom Tab Bar (Tuần 5)[cite: 1, 2]
function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={() => navigation.navigate(route.name)}
          >
            <Text
              style={{
                color: isFocused ? "#3f51b5" : "gray",
                fontWeight: isFocused ? "bold" : "normal",
              }}
            >
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Danh mục" component={DummyScreen} />
      <Tab.Screen name="Giỏ hàng" component={CartScreen} />
      <Tab.Screen name="Tài khoản" component={AccountScreen} />
      {/* Ghi chú: Sau này tab Tài khoản sẽ kiểm tra isLoggedIn để điều hướng sang LoginScreen hoặc UserProfile */}
    </Tab.Navigator>
  );
}

// Component chứa logic điều hướng và kiểm tra phiên đăng nhập
function RootNavigator() {
  const dispatch = useDispatch<any>();
  const isRestoring = useSelector((state: any) => state.auth.isRestoring);

  useEffect(() => {
    // Tự động đọc AsyncStorage để khôi phục phiên khi mở app[cite: 24]
    dispatch(restoreSession());
  }, [dispatch]);

  // Hiển thị màn hình chờ trong lúc kiểm tra token[cite: 25]
  if (isRestoring) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3f51b5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{ title: "Chi tiết sách" }}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: "Giỏ hàng của bạn" }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ title: "Thanh toán" }}
        />

        {/* Thêm LoginScreen vào luồng điều hướng[cite: 2] */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Đăng nhập / Đăng ký" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center" },
});
