import { api } from '../../Utils/apiClient';

export const GET_SUBCATEGORIES_LOADING = 'GET_SUBCATEGORIES_LOADING';
export const GET_SUBCATEGORIES_SUCCESS = 'GET_SUBCATEGORIES_SUCCESS';
export const GET_SUBCATEGORIES_ERROR = 'GET_SUBCATEGORIES_ERROR';

export const fetchSubCategories = () => {
  return async (dispatch) => {
    dispatch({ type: GET_SUBCATEGORIES_LOADING });
    try {
      const { data } = await api.get('/SubCategory', { auth: false }).catch(() => {
        throw new Error('Errore nel caricamento delle sottocategorie');
      });
      dispatch({
        type: GET_SUBCATEGORIES_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: GET_SUBCATEGORIES_ERROR,
        payload: err.message,
      });
    }
  };
};

export const GET_SUBCATEGORY_LOADING = 'GET_SUBCATEGORY_LOADING';
export const GET_SUBCATEGORY_SUCCESS = 'GET_SUBCATEGORY_SUCCESS';
export const GET_SUBCATEGORY_ERROR = 'GET_SUBCATEGORY_ERROR';

export const fetchSubCategoryById = (id) => {
  return async (dispatch) => {
    dispatch({ type: GET_SUBCATEGORY_LOADING });
    try {
      const { data } = await api.get(`/SubCategory/${id}`, { auth: false }).catch(() => {
        throw new Error('Errore nel caricamento delle categorie');
      });
      dispatch({
        type: GET_SUBCATEGORY_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: GET_SUBCATEGORY_ERROR,
        payload: err.message,
      });
    }
  };
};

export const CREATE_SUBCATEGORY_LOADING = 'CREATE_SUBCATEGORY_LOADING';
export const CREATE_SUBCATEGORY_SUCCESS = 'CREATE_SUBCATEGORY_SUCCESS';
export const CREATE_SUBCATEGORY_ERROR = 'CREATE_SUBCATEGORY_ERROR';

export const createSubCategory = (category) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_SUBCATEGORY_LOADING });
    try {
      const { data } = await api.post('/SubCategory', category).catch(() => {
        throw new Error('Errore nella creazione della categoria');
      });
      dispatch({ type: CREATE_SUBCATEGORY_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: CREATE_SUBCATEGORY_ERROR, payload: err.message });
    }
  };
};

export const UPDATE_SUBCATEGORY_LOADING = 'UPDATE_SUBCATEGORY_LOADING';
export const UPDATE_SUBCATEGORY_SUCCESS = 'UPDATE_SUBCATEGORY_SUCCESS';
export const UPDATE_SUBCATEGORY_ERROR = 'UPDATE_SUBCATEGORY_ERROR';

export const updateSubCategory = (id, updatedCategory) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_SUBCATEGORY_LOADING });
    try {
      const { status } = await api.put(`/SubCategory/${id}`, updatedCategory).catch(() => {
        throw new Error("Errore nell'aggiornamento della categoria");
      });

      if (status === 204) {
        dispatch({
          type: UPDATE_SUBCATEGORY_SUCCESS,
          payload: updatedCategory,
        });
      }
    } catch (err) {
      dispatch({ type: UPDATE_SUBCATEGORY_ERROR, payload: err.message });
    }
  };
};

export const DELETE_SUBCATEGORY_LOADING = 'DELETE_SUBCATEGORY_LOADING';
export const DELETE_SUBCATEGORY_SUCCESS = 'DELETE_SUBCATEGORY_SUCCESS';
export const DELETE_SUBCATEGORY_ERROR = 'DELETE_SUBCATEGORY_ERROR';

export const deleteSubCategory = (id) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_SUBCATEGORY_LOADING });
    try {
      await api.delete(`/SubCategory/${id}`).catch(() => {
        throw new Error("Errore nell'eliminazione della categoria");
      });

      dispatch({ type: DELETE_SUBCATEGORY_SUCCESS, payload: id });
    } catch (err) {
      dispatch({ type: DELETE_SUBCATEGORY_ERROR, payload: err.message });
    }
  };
};
