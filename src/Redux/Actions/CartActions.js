// src/redux/actions/cartActions.js
import { getEmailFromToken } from '../../Utils/jwtUtils';
import ApiURL from '../../Utils/ApiURL';

export const ADD_TO_CART_REQUEST = 'ADD_TO_CART_REQUEST';
export const ADD_TO_CART_SUCCESS = 'ADD_TO_CART_SUCCESS';
export const ADD_TO_CART_ERROR = 'ADD_TO_CART_ERROR';

export const addToCart = (productId, quantity) => {
  return async (dispatch) => {
    dispatch({ type: ADD_TO_CART_REQUEST });

    try {
      const token = localStorage.getItem('token');
      const userEmail = getEmailFromToken(token);

      if (!userEmail) throw new Error('Utente non autenticato');

      const response = await fetch(`${ApiURL.apiUrl}/Cart/${userEmail}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok)
        throw new Error("Errore durante l'aggiunta al carrello");

      const data = await response.json();

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
  return async (dispatch) => {
    dispatch({ type: GET_CART_REQUEST });

    try {
      const token = localStorage.getItem('token');
      const userEmail = getEmailFromToken(token);

      if (!userEmail) throw new Error('Utente non autenticato');

      const response = await fetch(`${ApiURL.apiUrl}/Cart/${userEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error('Errore durante il recupero del carrello');

      const data = await response.json();

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
  return async (dispatch) => {
    dispatch({ type: REMOVE_FROM_CART_REQUEST });

    try {
      const token = localStorage.getItem('token');
      const userEmail = getEmailFromToken(token);

      if (!userEmail) throw new Error('Utente non autenticato');

      const response = await fetch(`${ApiURL.apiUrl}/Cart/${itemId}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(
          "Errore durante la rimozione dell'articolo dal carrello"
        );

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
  return async (dispatch) => {
    dispatch({ type: UPDATE_ITEM_QUANTITY_REQUEST });

    try {
      const token = localStorage.getItem('token');
      const userEmail = getEmailFromToken(token);

      if (!userEmail) throw new Error('Utente non autenticato');

      const response = await fetch(
        `${
          ApiURL.apiUrl
        }/Cart/${cartItemId}/delete/byquantity?quantityToRemove=${Math.abs(
          quantityToRemove
        )}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error("Errore durante l'aggiornamento della quantità");

      let data = null;
      if (response.status !== 204) {
        data = await response.json();
      }

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
