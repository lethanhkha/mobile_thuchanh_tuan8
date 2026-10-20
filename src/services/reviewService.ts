import { api } from "../api/client";

export const reviewService = {
  getByBook: async (bookId: number | string) => {
    // Sắp xếp mới nhất lên đầu
    const res = await api.get("/reviews", {
      params: { bookId, _sort: "createdAt", _order: "desc" },
    });
    return res.data;
  },
  create: async (
    bookId: number | string,
    userId: number,
    userName: string,
    rating: number,
    comment: string,
  ) => {
    // POST /reviews cần token và userId
    const res = await api.post("/reviews", {
      bookId,
      userId,
      userName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    });
    return res.data;
  },
};
