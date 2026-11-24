import { api } from '../../Utils/apiClient';

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
  'FETCH_PRODUCTS_BY_SUBCATEGORY_REQUEST';
export const FETCH_PRODUCTS_BY_MANUFACTURER_SUCCESS =
  'FETCH_PRODUCTS_BY_SUBCATEGORY_SUCCESS';
export const FETCH_PRODUCTS_BY_MANUFACTURER_ERROR =
  'FETCH_PRODUCTS_BY_SUBCATEGORY_FAILURE';

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

export const ADD_PRODUCT_LOADING = 'ADD_PRODUCT_LOADING';
export const ADD_PRODUCT_SUCCESS = 'ADD_PRODUCT_SUCCESS';
export const ADD_PRODUCT_ERROR = 'ADD_PRODUCT_ERROR';

export const addProduct = (productData) => async (dispatch) => {
  dispatch({ type: ADD_PRODUCT_LOADING });

  try {
    const { data } = await api.post('/Product', productData).catch(() => {
      throw new Error("Errore durante l'aggiunta del prodotto");
    });

    dispatch({
      type: ADD_PRODUCT_SUCCESS,
      payload: data,
    });
    dispatch(fetchProducts());
  } catch (error) {
    dispatch({
      type: ADD_PRODUCT_ERROR,
      payload: error.message,
    });
  }
};

export const UPDATE_PRODUCT_LOADING = 'UPDATE_PRODUCT_LOADING';
export const UPDATE_PRODUCT_SUCCESS = 'UPDATE_PRODUCT_SUCCESS';
export const UPDATE_PRODUCT_ERROR = 'UPDATE_PRODUCT_ERROR';

export const updateProduct = (productId, updatedData) => async (dispatch) => {
  dispatch({ type: UPDATE_PRODUCT_LOADING });

  try {
    await api.put(`/Product/${productId}`, updatedData).catch(() => {
      throw new Error("Errore durante l'aggiornamento del prodotto");
    });

    dispatch({
      type: UPDATE_PRODUCT_SUCCESS,
      payload: updatedData,
    });
    dispatch(fetchProducts());
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_ERROR,
      payload: error.message,
    });
  }
};

export const DELETE_PRODUCT_LOADING = 'DELETE_PRODUCT_LOADING';
export const DELETE_PRODUCT_SUCCESS = 'DELETE_PRODUCT_SUCCESS';
export const DELETE_PRODUCT_ERROR = 'DELETE_PRODUCT_ERROR';

export const deleteProduct = (productId) => async (dispatch) => {
  dispatch({ type: DELETE_PRODUCT_LOADING });

  try {
    await api.delete(`/Product/${productId}`).catch(() => {
      throw new Error("Errore durante l'eliminazione del prodotto");
    });

    dispatch({
      type: DELETE_PRODUCT_SUCCESS,
      payload: productId,
    });
    dispatch(fetchProducts());
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_ERROR,
      payload: error.message,
    });
  }
};
