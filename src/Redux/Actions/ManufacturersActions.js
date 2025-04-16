import ApiURL from '../../Utils/ApiURL';

export const GET_MANUFACTURERS_LOADING = 'GET_MANUFACTURERS_LOADING';
export const GET_MANUFACTURERS_SUCCESS = 'GET_MANUFACTURERS_SUCCESS';
export const GET_MANUFACTURERS_ERROR = 'GET_MANUFACTURERS_ERROR';

export const fetchManufacturers = () => {
  return async (dispatch) => {
    dispatch({ type: GET_MANUFACTURERS_LOADING });
    try {
      const response = await fetch(`${ApiURL.apiUrl}/Manufacturer`);
      if (!response.ok)
        throw new Error('Errore nel caricamento delle categorie');

      const data = await response.json();
      dispatch({
        type: GET_MANUFACTURERS_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: GET_MANUFACTURERS_ERROR,
        payload: err.message,
      });
    }
  };
};
