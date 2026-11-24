import { api } from '../../Utils/apiClient';

// Recensioni di un prodotto: lo stato vive nel componente della pagina prodotto.

/** Le review pubbliche arrivano con il prodotto (senza autore). */
export const fetchProductReviews = async (productId) => {
  const { data } = await api.get(`/Product/${productId}`, { auth: false });
  return data.reviews ?? [];
};

/** Le recensioni dell'utente del token: servono a capire quali può modificare o eliminare. */
export const fetchMyReviews = async () => {
  const { data } = await api.get('/Review/me');
  return data;
};

export const createReview = (productId, { rating, comment }) =>
  api.post('/Review', { productId, reviewRating: rating, reviewComment: comment });

export const updateReview = (reviewId, { rating, comment }) =>
  api.put(`/Review/${reviewId}`, { reviewRating: rating, reviewComment: comment });

export const deleteReview = (reviewId) => api.delete(`/Review/${reviewId}`);
