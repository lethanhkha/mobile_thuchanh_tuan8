import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import BookCard from "../components/BookCard";
import { bookService } from "../services/bookService";
import useDebounce from "../hooks/useDebounce";
import FloatingCart from "../components/FloatingCard";

export default function HomeScreen({ navigation }: any) {
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States cho Tìm kiếm & Lọc
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400); // Trì hoãn 400ms
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Gọi API dựa trên tham số tìm kiếm và lọc[cite: 11]
      const params: any = {};
      if (debouncedSearch) params.q = debouncedSearch;
      if (selectedCategory) params.category = selectedCategory;

      // Gọi song song danh sách sách và danh mục
      const [booksData, categoriesData] = await Promise.all([
        bookService.getBooks(params),
        bookService.getCategories(),
      ]);

      setBooks(booksData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Lỗi kết nối mạng. Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, selectedCategory]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Header />

      {/* Ô tìm kiếm[cite: 2] */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sách, tác giả..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Category Chips (Bài 2 & 4 Tuần 6)[cite: 2] */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
        >
          <TouchableOpacity
            style={[styles.chip, !selectedCategory && styles.chipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={
                !selectedCategory ? styles.chipTextActive : styles.chipText
              }
            >
              Tất cả
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.chip,
                selectedCategory === cat.name && styles.chipActive,
              ]}
              onPress={() => setSelectedCategory(cat.name)}
            >
              <Text
                style={
                  selectedCategory === cat.name
                    ? styles.chipTextActive
                    : styles.chipText
                }
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Hiển thị Trạng thái (Bài 1 & 3 Tuần 6) */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#3f51b5"
            style={{ marginTop: 50 }}
          />
        ) : error ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchData} style={styles.retryBtn}>
              <Text style={styles.retryText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : books.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              Không tìm thấy cuốn sách nào phù hợp.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onPress={() =>
                  navigation.navigate("BookDetail", { bookId: book.id })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
      <FloatingCart onPress={() => navigation.navigate("Cart")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 100 },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#f5f5f5",
  },
  searchInput: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  chipScroll: { flexDirection: "row", marginBottom: 16 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3f51b5",
    marginRight: 8,
    height: 38,
  },
  chipActive: { backgroundColor: "#3f51b5" },
  chipText: { color: "#3f51b5" },
  chipTextActive: { color: "white", fontWeight: "bold" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  center: { alignItems: "center", marginTop: 50 },
  errorText: { color: "red", marginBottom: 12 },
  retryBtn: {
    backgroundColor: "#3f51b5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: "white" },
  emptyText: { color: "gray", fontStyle: "italic" },
});
