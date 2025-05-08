import {
  FETCH_PRODUCTS_LOADING,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_ERROR,
  FETCH_PRODUCTS_BY_CATEGORY_LOADING,
  FETCH_PRODUCTS_BY_CATEGORY_SUCCESS,
  FETCH_PRODUCTS_BY_CATEGORY_ERROR,
  FETCH_PRODUCTS_BY_SUBCATEGORY_LOADING,
  FETCH_PRODUCTS_BY_SUBCATEGORY_SUCCESS,
  FETCH_PRODUCTS_BY_SUBCATEGORY_ERROR,
  FETCH_PRODUCTS_BY_MANUFACTURER_LOADING,
  FETCH_PRODUCTS_BY_MANUFACTURER_SUCCESS,
  FETCH_PRODUCTS_BY_MANUFACTURER_ERROR,
  ADD_PRODUCT_LOADING,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_ERROR,
  UPDATE_PRODUCT_LOADING,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_ERROR,
  DELETE_PRODUCT_LOADING,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_ERROR,
} from '../Actions/ProductsAction';

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_LOADING:
    case FETCH_PRODUCTS_BY_CATEGORY_LOADING:
    case FETCH_PRODUCTS_BY_SUBCATEGORY_LOADING:
    case FETCH_PRODUCTS_BY_MANUFACTURER_LOADING:
    case ADD_PRODUCT_LOADING:
    case UPDATE_PRODUCT_LOADING:
    case DELETE_PRODUCT_LOADING:
      return { ...state, loading: true, error: null };

    case FETCH_PRODUCTS_BY_CATEGORY_SUCCESS:
    case FETCH_PRODUCTS_SUCCESS:
    case FETCH_PRODUCTS_BY_SUBCATEGORY_SUCCESS:
    case FETCH_PRODUCTS_BY_MANUFACTURER_SUCCESS:
      return { ...state, loading: false, products: action.payload };

    case ADD_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: [...state.products, action.payload],
      };

    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
      };

    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.filter((p) => p.id !== action.payload),
      };

    case FETCH_PRODUCTS_ERROR:
    case FETCH_PRODUCTS_BY_CATEGORY_ERROR:
    case FETCH_PRODUCTS_BY_SUBCATEGORY_ERROR:
    case FETCH_PRODUCTS_BY_MANUFACTURER_ERROR:
    case ADD_PRODUCT_ERROR:
    case UPDATE_PRODUCT_ERROR:
    case DELETE_PRODUCT_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default productsReducer;
