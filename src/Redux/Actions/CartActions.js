import { toast } from 'react-toastify';
import { api } from '../../Utils/apiClient';
import { messageFor } from '../../Utils/errorMessages';

// Il carrello è sempre quello dell'utente del token (/Cart/me): l'email non viaggia nell'URL.
const requireLogin = (getState, message) => {
  if (!getState().auth.token) throw new Error(message);
};

export const ADD_TO_CART_REQUEST = 'ADD_TO_CART_REQUEST';
export const ADD_TO_CART_SUCCESS = 'ADD_TO_CART_SUCCESS';
export const ADD_TO_CART_ERROR = 'ADD_TO_CART_ERROR';

export const addToCart = (productId, quantity) => {
  return async (dispatch, getState) => {
    dispatch({ type: ADD_TO_CART_REQUEST });

    try {
      requireLogin(getState, 'Accedi per aggiungere prodotti al carrello.');

      const { data } = await api.post('/Cart/me/add', { productId, quantity });

      dispatch({
        type: ADD_TO_CART_SUCCESS,
        payload: data,
      });
      toast.success('Prodotto aggiunto al carrello.');
      dispatch(getCart());
    } catch (error) {
      const message = messageFor(error, error.message || "Errore durante l'aggiunta al carrello");
      toast.error(message);
      dispatch({
        type: ADD_TO_CART_ERROR,
        payload: message,
      });
    }
  };
};

export const GET_CART_REQUEST = 'GET_CART_REQUEST';
export const GET_CART_SUCCESS = 'GET_CART_SUCCESS';
export const GET_CART_ERROR = 'GET_CART_ERROR';

export const getCart = () => {
  return async (dispatch, getState) => {
    dispatch({ type: GET_CART_REQUEST });

    try {
      requireLogin(getState, 'Utente non autenticato');

      const { data } = await api.get('/Cart/me');

      dispatch({
        type: GET_CART_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_CART_ERROR,
        payload: messageFor(error, error.message || 'Errore durante il recupero del carrello'),
      });
    }
  };
};

export const REMOVE_FROM_CART_REQUEST = 'REMOVE_FROM_CART_REQUEST';
export const REMOVE_FROM_CART_SUCCESS = 'REMOVE_FROM_CART_SUCCESS';
export const REMOVE_FROM_CART_ERROR = 'REMOVE_FROM_CART_ERROR';

export const removeItemFromCart = (itemId) => {
  return async (dispatch, getState) => {
    dispatch({ type: REMOVE_FROM_CART_REQUEST });

    try {
      requireLogin(getState, 'Utente non autenticato');

      await api.delete(`/Cart/${itemId}/delete`);

      dispatch({ type: REMOVE_FROM_CART_SUCCESS, payload: { id: itemId } });
      dispatch(getCart());
    } catch (error) {
      dispatch({
        type: REMOVE_FROM_CART_ERROR,
        payload: messageFor(error, error.message || "Errore durante la rimozione dell'articolo dal carrello"),
      });
    }
  };
};

export const UPDATE_ITEM_QUANTITY_REQUEST = 'UPDATE_ITEM_QUANTITY_REQUEST';
export const UPDATE_ITEM_QUANTITY_SUCCESS = 'UPDATE_ITEM_QUANTITY_SUCCESS';
export const UPDATE_ITEM_QUANTITY_ERROR = 'UPDATE_ITEM_QUANTITY_ERROR';

export const updateItemQuantity = (cartItemId, quantityToRemove) => {
  return async (dispatch, getState) => {
    dispatch({ type: UPDATE_ITEM_QUANTITY_REQUEST });

    try {
      requireLogin(getState, 'Utente non autenticato');

      const { data } = await api.patch(
        `/Cart/${cartItemId}/delete/byquantity?quantityToRemove=${Math.abs(quantityToRemove)}`
      );

      dispatch({ type: UPDATE_ITEM_QUANTITY_SUCCESS, payload: data });

      dispatch(getCart());
    } catch (error) {
      dispatch({
        type: UPDATE_ITEM_QUANTITY_ERROR,
        payload: messageFor(error, error.message || "Errore durante l'aggiornamento della quantità"),
      });
    }
  };
};

export const RESET_CART = 'RESET_CART';

export const resetCart = () => ({
  type: RESET_CART,
});
