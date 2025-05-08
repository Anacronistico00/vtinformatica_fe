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

export const GET_MANUFACTURERBYID_LOADING = 'GET_MANUFACTURERBYID_LOADING';
export const GET_MANUFACTURERBYID_SUCCESS = 'GET_MANUFACTURERBYID_SUCCESS';
export const GET_MANUFACTURERBYID_ERROR = 'GET_MANUFACTURERBYID_ERROR';

export const fetchManufacturerById = (id) => {
  return async (dispatch) => {
    dispatch({ type: GET_MANUFACTURERBYID_LOADING });
    try {
      const response = await fetch(`${ApiURL.apiUrl}/Manufacturer/${id}`);
      if (!response.ok) throw new Error('Errore nel caricamento dei brand');

      const data = await response.json();
      dispatch({
        type: GET_MANUFACTURERBYID_SUCCESS,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: GET_MANUFACTURERBYID_ERROR,
        payload: err.message,
      });
    }
  };
};

export const CREATE_MANUFACTURER_LOADING = 'CREATE_MANUFACTURER_LOADING';
export const CREATE_MANUFACTURER_SUCCESS = 'CREATE_MANUFACTURER_SUCCESS';
export const CREATE_MANUFACTURER_ERROR = 'CREATE_MANUFACTURER_ERROR';

export const createManufacturer = (manufacturer) => {
  const token = localStorage.getItem('token');
  return async (dispatch) => {
    dispatch({ type: CREATE_MANUFACTURER_LOADING });
    try {
      const response = await fetch(`${ApiURL.apiUrl}/Manufacturer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(manufacturer),
      });

      if (!response.ok) throw new Error('Errore nella creazione del brand');

      const data = await response.json();
      dispatch({ type: CREATE_MANUFACTURER_SUCCESS, payload: data });
    } catch (err) {
      dispatch({ type: CREATE_MANUFACTURER_ERROR, payload: err.message });
    }
  };
};

export const UPDATE_MANUFACTURER_LOADING = 'UPDATE_MANUFACTURER_LOADING';
export const UPDATE_MANUFACTURER_SUCCESS = 'UPDATE_MANUFACTURER_SUCCESS';
export const UPDATE_MANUFACTURER_ERROR = 'UPDATE_MANUFACTURER_ERROR';

export const updateManufacturer = (id, updatedManufacturer) => {
  const token = localStorage.getItem('token');
  return async (dispatch) => {
    dispatch({ type: UPDATE_MANUFACTURER_LOADING });
    try {
      const response = await fetch(`${ApiURL.apiUrl}/Manufacturer/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedManufacturer),
      });

      if (!response.ok) throw new Error("Errore nell'aggiornamento del brand");

      if (response.status === 204) {
        dispatch({
          type: UPDATE_MANUFACTURER_SUCCESS,
          payload: updatedManufacturer,
        });
      }
    } catch (err) {
      dispatch({ type: UPDATE_MANUFACTURER_ERROR, payload: err.message });
    }
  };
};

export const DELETE_MANUFACTURER_LOADING = 'DELETE_MANUFACTURER_LOADING';
export const DELETE_MANUFACTURER_SUCCESS = 'DELETE_MANUFACTURER_SUCCESS';
export const DELETE_MANUFACTURER_ERROR = 'DELETE_MANUFACTURER_ERROR';

export const deleteManufacturer = (id) => {
  const token = localStorage.getItem('token');
  return async (dispatch) => {
    dispatch({ type: DELETE_MANUFACTURER_LOADING });
    try {
      const response = await fetch(`${ApiURL.apiUrl}/Manufacturer/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Errore nell'eliminazione del brand");

      dispatch({ type: DELETE_MANUFACTURER_SUCCESS, payload: id });
    } catch (err) {
      dispatch({ type: DELETE_MANUFACTURER_ERROR, payload: err.message });
    }
  };
};
