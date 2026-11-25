import { toast } from 'react-toastify';
import { api } from '../../Utils/apiClient';
import { messageFor } from '../../Utils/errorMessages';
import { getCart } from './CartActions';

// Gli ordini sono sempre quelli dell'utente del token (/Order/me): l'email non viaggia nell'URL.

export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_ERROR = 'CREATE_ORDER_ERROR';

export const CreateOrder = ({ customerComment } = {}) => {
  return async (dispatch, getState) => {
    dispatch({ type: CREATE_ORDER_REQUEST });

    try {
      if (!getState().auth.token) throw new Error("Devi essere autenticato per completare l'ordine");

      const comment = customerComment?.trim();
      const { data } = await api.post('/Order/me/from-cart', comment ? { customerComment: comment } : undefined);

      dispatch({
        type: CREATE_ORDER_SUCCESS,
        payload: data,
      });
      toast.success('Ordine creato.');
      dispatch(getCart());
    } catch (error) {
      const message = messageFor(error, error.message || "Errore durante la creazione dell'ordine");
      toast.error(message);
      dispatch({
        type: CREATE_ORDER_ERROR,
        payload: message,
      });
    }
  };
};

export const GET_ORDERS_LOADING = 'GET_ORDERS_LOADING';
export const GET_ORDERS_SUCCESS = 'GET_ORDERS_SUCCESS';
export const GET_ORDERS_ERROR = 'GET_ORDERS_ERROR';

export const fetchOrders = () => {
  return async (dispatch) => {
    dispatch({ type: GET_ORDERS_LOADING });
    try {
      const { data } = await api.get('/Order/me');
      dispatch({
        type: GET_ORDERS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_ORDERS_ERROR,
        payload: messageFor(error, 'Errore durante il recupero degli ordini'),
      });
    }
  };
};

export const DELETE_ORDER_LOADING = 'DELETE_ORDER_LOADING';
export const DELETE_ORDER_SUCCESS = 'DELETE_ORDER_SUCCESS';
export const DELETE_ORDER_ERROR = 'DELETE_ORDER_ERROR';

export const deleteOrder = (id) => {
  return async (dispatch) => {
    dispatch({ type: DELETE_ORDER_LOADING });

    try {
      const { data } = await api.put(`/Order/${id}/delete`);

      dispatch({
        type: DELETE_ORDER_SUCCESS,
        payload: data,
      });

      toast.success('Ordine annullato.');
      dispatch(fetchOrders());
    } catch (error) {
      const message = messageFor(error, "Errore nell'annullamento ordine.");
      dispatch({
        type: DELETE_ORDER_ERROR,
        payload: message,
      });
      toast.error(message);
    }
  };
};

export const RESTORE_ORDER_LOADING = 'RESTORE_ORDER_LOADING';
export const RESTORE_ORDER_SUCCESS = 'RESTORE_ORDER_SUCCESS';
export const RESTORE_ORDER_ERROR = 'RESTORE_ORDER_ERROR';

export const restoreOrder = (id) => {
  return async (dispatch) => {
    dispatch({ type: RESTORE_ORDER_LOADING });

    try {
      const { data } = await api.put(`/Order/${id}/restore`);

      dispatch({
        type: RESTORE_ORDER_SUCCESS,
        payload: data,
      });

      toast.success('Ordine ripristinato.');
      dispatch(fetchOrders());
    } catch (error) {
      const message = messageFor(error, 'Errore nel ripristino ordine.');
      dispatch({
        type: RESTORE_ORDER_ERROR,
        payload: message,
      });
      toast.error(message);
    }
  };
};
