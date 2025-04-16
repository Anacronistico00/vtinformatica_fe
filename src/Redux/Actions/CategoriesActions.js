import ApiURL from '../../Utils/ApiURL';

export const GET_CATEGORIES_LOADING = 'GET_CATEGORIES_LOADING';
export const GET_CATEGORIES_SUCCESS = 'GET_CATEGORIES_SUCCESS';
export const GET_CATEGORIES_ERROR = 'GET_CATEGORIES_ERROR';

export const fetchCategories = () => {
  return async (dispatch) => {
    dispatch({ type: GET_CATEGORIES_LOADING });
    try {
      const response = await fetch(`${ApiURL.apiUrl}/Category`);
      if (!response.ok)
        throw new Error('Errore nel caricamento delle categorie');

      const data = await response.json();
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
