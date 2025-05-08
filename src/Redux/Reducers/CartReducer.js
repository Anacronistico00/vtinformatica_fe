import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_ERROR,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  GET_CART_ERROR,
  REMOVE_FROM_CART_REQUEST,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_ERROR,
  UPDATE_ITEM_QUANTITY_REQUEST,
  UPDATE_ITEM_QUANTITY_SUCCESS,
  UPDATE_ITEM_QUANTITY_ERROR,
  RESET_CART,
} from '../Actions/CartActions';

const initialState = {
  loading: false,
  items: [],
  totalPrice: 0,
  error: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART_REQUEST:
    case GET_CART_REQUEST:
    case REMOVE_FROM_CART_REQUEST:
    case UPDATE_ITEM_QUANTITY_REQUEST:
      return { ...state, loading: true, error: null };

    case ADD_TO_CART_SUCCESS: {
      const existingItemIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return {
          ...state,
          loading: false,
          items: updatedItems,
          totalPrice: updatedItems.reduce(
            (total, item) => total + item.quantity * item.price,
            0
          ),
        };
      } else {
        return {
          ...state,
          loading: false,
          items: [...state.items, action.payload],
          totalPrice:
            state.totalPrice + action.payload.quantity * action.payload.price,
        };
      }
    }

    case REMOVE_FROM_CART_SUCCESS: {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      return {
        ...state,
        loading: false,
        items: updatedItems,
        totalPrice: updatedItems.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        ),
      };
    }

    case UPDATE_ITEM_QUANTITY_SUCCESS: {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: item.quantity - action.payload.quantity }
          : item
      );

      const updatedTotalPrice = updatedItems.reduce(
        (total, item) => total + item.quantity * item.product.price,
        0
      );

      return {
        ...state,
        loading: false,
        items: updatedItems,
        totalPrice: updatedTotalPrice,
      };
    }

    case GET_CART_SUCCESS: {
      return {
        ...state,
        loading: false,
        items: action.payload.items,
        totalPrice: action.payload.totalPrice,
      };
    }

    case ADD_TO_CART_ERROR:
    case GET_CART_ERROR:
    case REMOVE_FROM_CART_ERROR:
    case UPDATE_ITEM_QUANTITY_ERROR:
      return { ...state, loading: false, error: action.payload };

    case RESET_CART:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
