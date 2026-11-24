import { api } from '../../Utils/apiClient';
import { withMessage } from '../../Utils/errorMessages';

export const GET_CATEGORIES_LOADING = 'GET_CATEGORIES_LOADING';
export const GET_CATEGORIES_SUCCESS = 'GET_CATEGORIES_SUCCESS';
export const GET_CATEGORIES_ERROR = 'GET_CATEGORIES_ERROR';

export const fetchCategories = () => {
  return async (dispatch) => {
    dispatch({ type: GET_CATEGORIES_LOADING });
    try {
      const { data } = await api.get('/Category', { auth: false }).catch(() => {
        throw new Error('Errore nel caricamento delle categorie');
      });
      dispatch({
        type: GET_CATEGORIES_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: GET_CATEGORIES_ERROR,
        payload: err.message,
      });
    }
  };
};

export const GET_CATEGORY_LOADING = 'GET_CATEGORY_LOADING';
export const GET_CATEGORY_SUCCESS = 'GET_CATEGORY_SUCCESS';
export const GET_CATEGORY_ERROR = 'GET_CATEGORY_ERROR';

export const fetchCategoryById = (id) => {
  return async (dispatch) => {
    dispatch({ type: GET_CATEGORY_LOADING });
    try {
      const { data } = await api.get(`/Category/${id}`, { auth: false }).catch(() => {
        throw new Error('Errore nel caricamento delle categorie');
      });
      dispatch({
        type: GET_CATEGORY_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: GET_CATEGORY_ERROR,
        payload: err.message,
      });
    }
  };
};

export const CREATE_CATEGORY_LOADING = 'CREATE_CATEGORY_LOADING';
export const CREATE_CATEGORY_SUCCESS = 'CREATE_CATEGORY_SUCCESS';
export const CREATE_CATEGORY_ERROR = 'CREATE_CATEGORY_ERROR';

export const createCategory = (category) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_CATEGORY_LOADING });
    try {
      const { data } = await api.post('/Category', category).catch(withMessage('Errore nella creazione della categoria'));
      dispatch({ type: CREATE_CATEGORY_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: CREATE_CATEGORY_ERROR, payload: err.message });
    }
  };
};

export const UPDATE_CATEGORY_LOADING = 'UPDATE_CATEGORY_LOADING';
export const UPDATE_CATEGORY_SUCCESS = 'UPDATE_CATEGORY_SUCCESS';
export const UPDATE_CATEGORY_ERROR = 'UPDATE_CATEGORY_ERROR';

export const updateCategory = (id, updatedCategory) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_CATEGORY_LOADING });
    try {
      const { status } = await api
        .put(`/Category/${id}`, updatedCategory)
        .catch(withMessage("Errore nell'aggiornamento della categoria"));

      if (status === 204) {
        dispatch({
          type: UPDATE_CATEGORY_SUCCESS,
          payload: updatedCategory,
        });
      }
    } catch (err) {
      dispatch({ type: UPDATE_CATEGORY_ERROR, payload: err.message });
    }
  };
};

export const DELETE_CATEGORY_LOADING = 'DELETE_CATEGORY_LOADING';
export const DELETE_CATEGORY_SUCCESS = 'DELETE_CATEGORY_SUCCESS';
export const DELETE_CATEGORY_ERROR = 'DELETE_CATEGORY_ERROR';

export const deleteCategory = (id) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_CATEGORY_LOADING });
    try {
      await api.delete(`/Category/${id}`).catch(withMessage("Errore nell'eliminazione della categoria"));

      dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: id });
    } catch (err) {
      dispatch({ type: DELETE_CATEGORY_ERROR, payload: err.message });
    }
  };
};
