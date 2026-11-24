import { toast } from 'react-toastify';
import { api } from '../../Utils/apiClient';
import { getCart } from './CartActions';

export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_ERROR = 'CREATE_ORDER_ERROR';

export const CreateOrder = (userEmail) => {
  return async (dispatch, getState) => {
    dispatch({ type: CREATE_ORDER_REQUEST });

    try {
      if (!getState().auth.token) throw new Error('Utente non autenticato');

      const { data } = await api.post(`/Order/from-cart/${userEmail}`).catch(() => {
        throw new Error("Errore durante la creazione dell'ordine");
      });

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
  return async (dispatch) => {
    dispatch({ type: GET_ORDERS_LOADING });
    try {
      const { data } = await api.get(`/order/user/${email}`).catch(() => {
        throw new Error('Errore durante il recupero degli ordini');
      });
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

export const DELETE_ORDER_LOADING = 'DELETE_ORDER_LOADING';
export const DELETE_ORDER_SUCCESS = 'DELETE_ORDER_SUCCESS';
export const DELETE_ORDER_ERROR = 'DELETE_ORDER_ERROR';

export const deleteOrder = (id, email) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_ORDER_LOADING });

    try {
      const { data } = await api.put(`/Order/${id}/delete`).catch(() => {
        throw new Error("Errore nell'annullamento ordine");
      });

      dispatch({
        type: DELETE_ORDER_SUCCESS,
        payload: data,
      });

      toast.success('Ordine annullato con successo!');
      dispatch(fetchOrders(email));
    } catch (error) {
      console.error('Errore annullamento ordine:', error);
      dispatch({
        type: DELETE_ORDER_ERROR,
        payload: error.message,
      });
      toast.error("Errore nell'annullamento ordine.");
    }
  };
};

export const RESTORE_ORDER_LOADING = 'RESTORE_ORDER_LOADING';
export const RESTORE_ORDER_SUCCESS = 'RESTORE_ORDER_SUCCESS';
export const RESTORE_ORDER_ERROR = 'RESTORE_ORDER_ERROR';

export const restoreOrder = (id, email) => {
  return async (dispatch) => {
    dispatch({ type: RESTORE_ORDER_LOADING });

    try {
      const { data } = await api.put(`/Order/${id}/restore`).catch(() => {
        throw new Error('Errore nel ripristino ordine');
      });

      dispatch({
        type: RESTORE_ORDER_SUCCESS,
        payload: data,
      });

      toast.success('Ordine ripristinato con successo!');
      dispatch(fetchOrders(email));
    } catch (error) {
      console.error('Errore ripristino ordine:', error);
      dispatch({
        type: RESTORE_ORDER_ERROR,
        payload: error.message,
      });
      toast.error('Errore nel ripristino ordine.');
    }
  };
};
