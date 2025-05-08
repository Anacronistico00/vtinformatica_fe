import ApiURL from '../../Utils/ApiURL';
import { getCart } from './CartActions';

export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_ERROR = 'CREATE_ORDER_ERROR';

export const CreateOrder = (userEmail) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_ORDER_REQUEST });

    try {
      const token = localStorage.getItem('token');

      if (!token) throw new Error('Utente non autenticato');

      const response = await fetch(
        `${ApiURL.apiUrl}/Order/from-cart/${userEmail}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Errore durante la creazione dell'ordine");

      const data = await response.json();

      dispatch({
        type: CREATE_ORDER_SUCCESS,
        payload: data,
      });
      dispatch(getCart());
    } catch (error) {
      dispatch({
        type: CREATE_ORDER_ERROR,
        payload: error.message,
      });
    }
  };
};

export const GET_ORDERS_LOADING = 'GET_ORDERS_LOADING';
export const GET_ORDERS_SUCCESS = 'GET_ORDERS_SUCCESS';
export const GET_ORDERS_ERROR = 'GET_ORDERS_ERROR';

export const fetchOrders = (email) => {
  const token = localStorage.getItem('token');

  return async (dispatch) => {
    dispatch({ type: GET_ORDERS_LOADING });
    try {
      const response = await fetch(`${ApiURL.apiUrl}/order/user/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error('Errore durante il recupero degli ordini');

      const data = await response.json();
      dispatch({
        type: GET_ORDERS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_ORDERS_ERROR,
        payload: error.message,
      });
    }
  };
};

import { toast } from 'react-toastify'; // Importa la libreria

export const DELETE_ORDER_LOADING = 'DELETE_ORDER_LOADING';
export const DELETE_ORDER_SUCCESS = 'DELETE_ORDER_SUCCESS';
export const DELETE_ORDER_ERROR = 'DELETE_ORDER_ERROR';

export const deleteOrder = (id, email) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_ORDER_LOADING });

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${ApiURL.apiUrl}/Order/${id}/delete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Errore nell'annullamento ordine");
      }

      const data = await response.json();

      dispatch({
        type: DELETE_ORDER_SUCCESS,
        payload: data,
      });

      toast.success('Ordine annullato con successo!'); // Toast di successo
      dispatch(fetchOrders(email));
    } catch (error) {
      console.error('Errore annullamento ordine:', error);
      dispatch({
        type: DELETE_ORDER_ERROR,
        payload: error.message,
      });
      toast.error("Errore nell'annullamento ordine."); // Toast di errore
    }
  };
};

export const RESTORE_ORDER_LOADING = 'RESTORE_ORDER_LOADING';
export const RESTORE_ORDER_SUCCESS = 'RESTORE_ORDER_SUCCESS';
export const RESTORE_ORDER_ERROR = 'RESTORE_ORDER_ERROR';

export const restoreOrder = (id, email) => {
  return async (dispatch) => {
    dispatch({ type: RESTORE_ORDER_LOADING });

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${ApiURL.apiUrl}/Order/${id}/restore`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Errore nel ripristino ordine');
      }

      const data = await response.json();

      dispatch({
        type: RESTORE_ORDER_SUCCESS,
        payload: data,
      });

      toast.success('Ordine ripristinato con successo!'); // Toast di successo
      dispatch(fetchOrders(email));
    } catch (error) {
      console.error('Errore ripristino ordine:', error);
      dispatch({
        type: RESTORE_ORDER_ERROR,
        payload: error.message,
      });
      toast.error('Errore nel ripristino ordine.'); // Toast di errore
    }
  };
};
