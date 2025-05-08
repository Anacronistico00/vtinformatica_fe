import ApiURL from '../../Utils/ApiURL';

export const GET_SUBCATEGORIES_LOADING = 'GET_SUBCATEGORIES_LOADING';
export const GET_SUBCATEGORIES_SUCCESS = 'GET_SUBCATEGORIES_SUCCESS';
export const GET_SUBCATEGORIES_ERROR = 'GET_SUBCATEGORIES_ERROR';

export const fetchSubCategories = () => {
  return async (dispatch) => {
    dispatch({ type: GET_SUBCATEGORIES_LOADING });
    try {
      const response = await fetch(`${ApiURL.apiUrl}/SubCategory`);
      if (!response.ok)
        throw new Error('Errore nel caricamento delle sottocategorie');

      const data = await response.json();

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
      const response = await fetch(`${ApiURL.apiUrl}/SubCategory/${id}`);
      if (!response.ok)
        throw new Error('Errore nel caricamento delle categorie');

      const data = await response.json();
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
  const token = localStorage.getItem('token');
  return async (dispatch) => {
    dispatch({ type: CREATE_SUBCATEGORY_LOADING });
    try {
      const response = await fetch(`${ApiURL.apiUrl}/SubCategory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(category),
      });

      if (!response.ok)
        throw new Error('Errore nella creazione della categoria');

      const data = await response.json();
      console.log(data);

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
  const token = localStorage.getItem('token');
  return async (dispatch) => {
    dispatch({ type: UPDATE_SUBCATEGORY_LOADING });
    try {
      const response = await fetch(`${ApiURL.apiUrl}/SubCategory/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCategory),
      });

      if (!response.ok)
        throw new Error("Errore nell'aggiornamento della categoria");

      if (response.status === 204) {
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
  const token = localStorage.getItem('token');
  return async (dispatch) => {
    dispatch({ type: DELETE_SUBCATEGORY_LOADING });
    try {
      const response = await fetch(`${ApiURL.apiUrl}/SubCategory/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error("Errore nell'eliminazione della categoria");

      dispatch({ type: DELETE_SUBCATEGORY_SUCCESS, payload: id });
    } catch (err) {
      dispatch({ type: DELETE_SUBCATEGORY_ERROR, payload: err.message });
    }
  };
};
