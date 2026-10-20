import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { logout } from "../store/authSlice";
import { RootState } from "../store";
import { bookService } from "../services/bookService";
import { reviewService } from "../services/reviewService";

export default function BookDetailScreen({ route, navigation }: any) {
  const { bookId } = route.params;
  const dispatch = useDispatch();

  // Lấy thông tin user từ Redux store[cite: 29]
  const user = useSelector((state: RootState) => state.auth.user);

  const [book, setBook] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State cho form đánh giá
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5); // Mặc định 5 sao

  // Tính điểm đánh giá trung bình[cite: 30]
  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(
        1,
      )
    : "0.0";

  useEffect(() => {
    let cancelled = false;
    const fetchBookAndReviews = async () => {
      try {
        setLoading(true);
        // Gọi song song API thông tin sách và danh sách review[cite: 29]
        const [bookData, reviewData] = await Promise.all([
          bookService.getBookById(bookId),
          reviewService.getByBook(bookId),
        ]);
        if (!cancelled) {
          setBook(bookData);
          setReviews(reviewData);
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết sách:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchBookAndReviews();

    return () => {
      cancelled = true;
    };
  }, [bookId]);

  const handlePostReview = async () => {
    if (!user) {
      Alert.alert("Thông báo", "Bạn cần đăng nhập để đánh giá!");
      navigation.navigate("Login"); // Điều hướng sang màn Đăng nhập[cite: 32]
      return;
    }

    if (!comment.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      // POST review lên server (yêu cầu phải có token)[cite: 27, 30]
      const newReview = await reviewService.create(
        bookId,
        user.id,
        user.name,
        rating,
        comment,
      );

      // Chèn review mới vào đầu danh sách, cập nhật UI ngay lập tức không cần tải lại[cite: 18, 31]
      setReviews([newReview, ...reviews]);
      setComment("");
      setRating(5);
    } catch (err: any) {
      // Xử lý lỗi token hết hạn (401)[cite: 31]
      if (err?.response?.status === 401) {
        Alert.alert("Phiên hết hạn", "Vui lòng đăng nhập lại để tiếp tục.");
        dispatch(logout());
        navigation.navigate("Login");
      } else {
        Alert.alert("Lỗi", "Không thể gửi đánh giá lúc này.");
      }
    }
  };

  if (loading)
    return (
      <ActivityIndicator
        style={{ flex: 1, justifyContent: "center" }}
        size="large"
        color="#3f51b5"
      />
    );
  if (!book)
    return (
      <Text style={{ textAlign: "center", marginTop: 50 }}>
        Không tìm thấy sách
      </Text>
    );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Phần thông tin sách */}
        <Image source={{ uri: book.image }} style={styles.image} />
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
        <Text style={styles.category}>{book.category}</Text>
        <Text style={styles.price}>{book.price.toLocaleString("vi-VN")} đ</Text>
        <Text style={styles.desc}>{book.description}</Text>

        {/* Phần Đánh giá & Nhận xét[cite: 32] */}
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Đánh giá & Nhận xét</Text>
          <View style={styles.avgRow}>
            <Text style={styles.avgNumber}>{avgRating}</Text>
            <Text style={styles.countText}>⭐ ({reviews.length} đánh giá)</Text>
          </View>

          {/* Form viết đánh giá hoặc nút Yêu cầu đăng nhập[cite: 32] */}
          {user ? (
            <View style={styles.formContainer}>
              <View style={styles.ratingRow}>
                <Text style={{ marginRight: 8 }}>Chấm điểm:</Text>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: star <= rating ? "#f39c12" : "#ccc",
                      }}
                    >
                      ⭐
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Viết đánh giá của bạn..."
                value={comment}
                onChangeText={setComment}
                multiline
              />
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handlePostReview}
              >
                <Text style={styles.submitBtnText}>Gửi đánh giá</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.loginReqBtn}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginReqText}>
                Đăng nhập để viết đánh giá
              </Text>
            </TouchableOpacity>
          )}

          {/* Danh sách review[cite: 33] */}
          {reviews.length === 0 ? (
            <Text style={styles.emptyText}>
              Chưa có đánh giá nào. Hãy là người đầu tiên!
            </Text>
          ) : (
            reviews.map((r) => (
              <View key={r.id} style={styles.reviewItem}>
                <Text style={styles.reviewUser}>{r.userName}</Text>
                <Text style={{ color: "#f39c12", marginBottom: 4 }}>
                  {"⭐".repeat(r.rating)}
                </Text>
                <Text style={styles.reviewComment}>{r.comment}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Thanh cố định phía dưới không nằm trong ScrollView[cite: 1] */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={() => {
            dispatch(addToCart(book));
            Alert.alert("Thành công", "Đã thêm vào giỏ hàng");
          }}
        >
          <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 160,
    height: 240,
    alignSelf: "center",
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  title: { fontSize: 24, fontWeight: "bold" },
  author: { color: "gray", fontSize: 16, marginTop: 4 },
  category: { color: "#3f51b5", marginTop: 4 },
  price: { color: "#c62828", fontSize: 22, fontWeight: "bold", marginTop: 12 },
  desc: { marginTop: 16, lineHeight: 22, color: "#333" },

  reviewSection: {
    marginTop: 32,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  avgRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avgNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#3f51b5",
    marginRight: 8,
  },
  countText: { color: "#666", fontSize: 16 },

  formContainer: {
    marginBottom: 24,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    minHeight: 60,
    textAlignVertical: "top",
  },
  submitBtn: {
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  submitBtnText: { color: "white", fontWeight: "bold" },

  loginReqBtn: {
    borderColor: "#3f51b5",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  loginReqText: { color: "#3f51b5", fontWeight: "bold" },

  emptyText: { fontStyle: "italic", color: "#888", marginTop: 8 },
  reviewItem: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  reviewUser: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  reviewComment: { color: "#444", lineHeight: 20 },
  reviewDate: { fontSize: 12, color: "#999", marginTop: 8, textAlign: "right" },

  bottomBar: {
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  addToCartBtn: {
    backgroundColor: "#3f51b5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addToCartText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
