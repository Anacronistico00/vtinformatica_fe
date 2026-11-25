import { toast } from 'react-toastify';
import { api } from '../../Utils/apiClient';
import { messageFor } from '../../Utils/errorMessages';

export const FETCH_PRODUCTS_LOADING = 'FETCH_PRODUCTS_LOADING';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_ERROR = 'FETCH_PRODUCTS_ERROR';

export const fetchProducts = () => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_LOADING });

  try {
    const { data } = await api.get('/Product', { auth: false });
    dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_PRODUCTS_ERROR,
      payload: error.message,
    });
  }
};

export const fetchProductById = async (id) => {
  const { data } = await api.get(`/Product/${id}`, { auth: false });
  return data;
};

export const searchProducts = async (query) => {
  const { data } = await api.get(`/Product/search?query=${query}`, { auth: false }).catch(() => {
    throw new Error('Errore nel recupero dei prodotti');
  });
  return data;
};

export const FETCH_PRODUCTS_BY_CATEGORY_LOADING =
  'FETCH_PRODUCTS_BY_CATEGORY_REQUEST';
export const FETCH_PRODUCTS_BY_CATEGORY_SUCCESS =
  'FETCH_PRODUCTS_BY_CATEGORY_SUCCESS';
export const FETCH_PRODUCTS_BY_CATEGORY_ERROR =
  'FETCH_PRODUCTS_BY_CATEGORY_FAILURE';

export const fetchProductsByCategory = (categoryId) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_BY_CATEGORY_LOADING });

  try {
    const { data } = await api.get(`/Product/category/${categoryId}`, { auth: false });
    dispatch({ type: FETCH_PRODUCTS_BY_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_PRODUCTS_BY_CATEGORY_ERROR,
      payload: error.message,
    });
  }
};

export const FETCH_PRODUCTS_BY_SUBCATEGORY_LOADING =
  'FETCH_PRODUCTS_BY_SUBCATEGORY_REQUEST';
export const FETCH_PRODUCTS_BY_SUBCATEGORY_SUCCESS =
  'FETCH_PRODUCTS_BY_SUBCATEGORY_SUCCESS';
export const FETCH_PRODUCTS_BY_SUBCATEGORY_ERROR =
  'FETCH_PRODUCTS_BY_SUBCATEGORY_FAILURE';

export const fetchProductsBySubCategory =
  (subCategoryId) => async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_BY_SUBCATEGORY_LOADING });

    try {
      const { data } = await api.get(`/Product/subcategory/${subCategoryId}`, { auth: false });
      dispatch({ type: FETCH_PRODUCTS_BY_SUBCATEGORY_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: FETCH_PRODUCTS_BY_SUBCATEGORY_ERROR,
        payload: error.message,
      });
    }
  };

export const FETCH_PRODUCTS_BY_MANUFACTURER_LOADING =
  'FETCH_PRODUCTS_BY_MANUFACTURER_REQUEST';
export const FETCH_PRODUCTS_BY_MANUFACTURER_SUCCESS =
  'FETCH_PRODUCTS_BY_MANUFACTURER_SUCCESS';
export const FETCH_PRODUCTS_BY_MANUFACTURER_ERROR =
  'FETCH_PRODUCTS_BY_MANUFACTURER_FAILURE';

export const fetchProductsByManufacturer =
  (manufacturerId) => async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_BY_MANUFACTURER_LOADING });

    try {
      const { data } = await api.get(`/Product/manufacturer/${manufacturerId}`, { auth: false });
      dispatch({ type: FETCH_PRODUCTS_BY_MANUFACTURER_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: FETCH_PRODUCTS_BY_MANUFACTURER_ERROR,
        payload: error.message,
      });
    }
  };

export const ADMIN_PAGE_SIZE = 20;
export const FETCH_PRODUCTS_PAGE_SUCCESS = 'FETCH_PRODUCTS_PAGE_SUCCESS';

/**
 * Lista prodotti del backoffice, paginata dal server: il totale arriva da X-Total-Count.
 * Con `categoryId` il BE restituisce tutti i prodotti della categoria (senza paginazione): una sola pagina.
 */
export const fetchProductsPage = (page, categoryId = null) => async (dispatch) => {
  dispatch({ type: FETCH_PRODUCTS_LOADING });

  try {
    if (categoryId) {
      const { data } = await api.get(`/Product/category/${categoryId}`);
      dispatch({
        type: FETCH_PRODUCTS_PAGE_SUCCESS,
        payload: { items: data, total: data.length, page: 1, pageSize: Math.max(data.length, ADMIN_PAGE_SIZE) },
      });
      return;
    }

    const { data, headers } = await api.get(`/Product?page=${page}&pageSize=${ADMIN_PAGE_SIZE}`);
    dispatch({
      type: FETCH_PRODUCTS_PAGE_SUCCESS,
      payload: {
        items: data,
        total: Number(headers.get('X-Total-Count') ?? data.length),
        page,
        pageSize: ADMIN_PAGE_SIZE,
      },
    });
  } catch (error) {
    dispatch({
      type: FETCH_PRODUCTS_ERROR,
      payload: messageFor(error, 'Errore nel caricamento dei prodotti'),
    });
  }
};

// Le modifiche del backoffice restituiscono l'esito alla pagina, che decide cosa ricaricare.
const productFailure = (dispatch, type, error, fallback) => {
  const message = messageFor(error, fallback);
  toast.error(message);
  dispatch({ type, payload: message });
  return { ok: false, code: error?.code ?? null, message };
};

export const ADD_PRODUCT_LOADING = 'ADD_PRODUCT_LOADING';
export const ADD_PRODUCT_SUCCESS = 'ADD_PRODUCT_SUCCESS';
export const ADD_PRODUCT_ERROR = 'ADD_PRODUCT_ERROR';

export const addProduct = (productData) => async (dispatch) => {
  dispatch({ type: ADD_PRODUCT_LOADING });

  try {
    const { data } = await api.post('/Product', productData);

    dispatch({
      type: ADD_PRODUCT_SUCCESS,
      payload: data,
    });
    return { ok: true };
  } catch (error) {
    return productFailure(dispatch, ADD_PRODUCT_ERROR, error, "Errore durante l'aggiunta del prodotto");
  }
};

export const UPDATE_PRODUCT_LOADING = 'UPDATE_PRODUCT_LOADING';
export const UPDATE_PRODUCT_SUCCESS = 'UPDATE_PRODUCT_SUCCESS';
export const UPDATE_PRODUCT_ERROR = 'UPDATE_PRODUCT_ERROR';

export const updateProduct = (productId, updatedData) => async (dispatch) => {
  dispatch({ type: UPDATE_PRODUCT_LOADING });

  try {
    await api.put(`/Product/${productId}`, updatedData);

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: updatedData,
    });
    return { ok: true };
  } catch (error) {
    return productFailure(dispatch, UPDATE_PRODUCT_ERROR, error, "Errore durante l'aggiornamento del prodotto");
  }
};

export const DELETE_PRODUCT_LOADING = 'DELETE_PRODUCT_LOADING';
export const DELETE_PRODUCT_SUCCESS = 'DELETE_PRODUCT_SUCCESS';
export const DELETE_PRODUCT_ERROR = 'DELETE_PRODUCT_ERROR';

export const deleteProduct = (productId) => async (dispatch) => {
  dispatch({ type: DELETE_PRODUCT_LOADING });

  try {
    await api.delete(`/Product/${productId}`);

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: productId,
    });
    return { ok: true };
  } catch (error) {
    return productFailure(dispatch, DELETE_PRODUCT_ERROR, error, "Errore durante l'eliminazione del prodotto");
  }
};
