import {
  CREATE_ORDER_ERROR,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  GET_ORDERS_LOADING,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_ERROR,
  DELETE_ORDER_LOADING,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_ERROR,
  RESTORE_ORDER_LOADING,
  RESTORE_ORDER_SUCCESS,
  RESTORE_ORDER_ERROR,
} from '../Actions/OrderAction';

const initialState = {
  loading: false,
  order: null,
  orders: [],
  error: null,
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
    case GET_ORDERS_LOADING:
    case DELETE_ORDER_LOADING:
    case RESTORE_ORDER_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
      };

    case GET_ORDERS_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload,
      };

    case DELETE_ORDER_SUCCESS:
    case RESTORE_ORDER_SUCCESS:
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        ),
      };

    case CREATE_ORDER_ERROR:
    case GET_ORDERS_ERROR:
    case DELETE_ORDER_ERROR:
    case RESTORE_ORDER_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default ordersReducer;
