import { api } from "../api/client";

export const bookService = {
  // Lấy danh sách sách, hỗ trợ lọc theo danh mục và tìm kiếm bằng "q"[cite: 11]
  getBooks: async (params?: { category?: string; q?: string }) => {
    const res = await api.get("/books", { params });
    return res.data;
  },
  // Lấy danh mục
  getCategories: async () => {
    const res = await api.get("/categories");
    return res.data;
  },
  // Lấy chi tiết 1 cuốn sách[cite: 26]
  getBookById: async (id: string | number) => {
    const res = await api.get(`/books/${id}`);
    return res.data;
  },
};
