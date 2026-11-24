import { getEmailFromToken } from '../../Utils/jwtUtils';
import { api } from '../../Utils/apiClient';

const currentEmail = (getState) => getEmailFromToken(getState().auth.token);

export const ADD_TO_CART_REQUEST = 'ADD_TO_CART_REQUEST';
export const ADD_TO_CART_SUCCESS = 'ADD_TO_CART_SUCCESS';
export const ADD_TO_CART_ERROR = 'ADD_TO_CART_ERROR';

export const addToCart = (productId, quantity) => {
  return async (dispatch, getState) => {
    dispatch({ type: ADD_TO_CART_REQUEST });

    try {
      const userEmail = currentEmail(getState);
      if (!userEmail) throw new Error('Utente non autenticato');

      const { data } = await api
        .post(`/Cart/${userEmail}/add`, { productId, quantity })
        .catch(() => {
          throw new Error("Errore durante l'aggiunta al carrello");
        });

      dispatch({
        type: ADD_TO_CART_SUCCESS,
        payload: data,
      });
      dispatch(getCart());
    } catch (error) {
      dispatch({
        type: ADD_TO_CART_ERROR,
        payload: error.message,
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
      const userEmail = currentEmail(getState);
      if (!userEmail) throw new Error('Utente non autenticato');

      const { data } = await api.get(`/Cart/${userEmail}`).catch(() => {
        throw new Error('Errore durante il recupero del carrello');
      });

      dispatch({
        type: GET_CART_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: GET_CART_ERROR,
        payload: error.message,
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
      if (!currentEmail(getState)) throw new Error('Utente non autenticato');

      await api.delete(`/Cart/${itemId}/delete`).catch(() => {
        throw new Error("Errore durante la rimozione dell'articolo dal carrello");
      });

      dispatch({ type: REMOVE_FROM_CART_SUCCESS, payload: { id: itemId } });
      dispatch(getCart());
    } catch (error) {
      dispatch({
        type: REMOVE_FROM_CART_ERROR,
        payload: error.message,
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
      if (!currentEmail(getState)) throw new Error('Utente non autenticato');

      const { data } = await api
        .patch(
          `/Cart/${cartItemId}/delete/byquantity?quantityToRemove=${Math.abs(quantityToRemove)}`
        )
        .catch(() => {
          throw new Error("Errore durante l'aggiornamento della quantità");
        });

      dispatch({ type: UPDATE_ITEM_QUANTITY_SUCCESS, payload: data });

      dispatch(getCart());
    } catch (error) {
      dispatch({
        type: UPDATE_ITEM_QUANTITY_ERROR,
        payload: error.message,
      });
    }
  };
};

export const RESET_CART = 'RESET_CART';

export const resetCart = () => ({
  type: RESET_CART,
});
