import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function BookCard({
  book,
  onPress,
}: {
  book: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Badge Mới (Bài 1 Giờ 3 - Tuần 3-4) */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Mới</Text>
      </View>
      <Image source={{ uri: book.image }} style={styles.image} />
      <Text style={styles.title} numberOfLines={2}>
        {book.title}
      </Text>
      <Text style={styles.author}>{book.author}</Text>
      <Text style={styles.price}>{book.price.toLocaleString()} đ</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: "48%", marginBottom: 16, position: "relative" }, // position relative cho badge
  image: { width: "100%", aspectRatio: 3 / 4, borderRadius: 8 },
  title: { fontWeight: "bold", marginTop: 8 },
  author: { color: "gray", fontSize: 12 },
  price: { color: "green", marginTop: 4 },
  badge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "red",
    padding: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  badgeText: { color: "white", fontSize: 10 },
});
