import {
  FETCH_PRODUCTS_BY_CATEGORY_LOADING,
  FETCH_PRODUCTS_BY_CATEGORY_SUCCESS,
  FETCH_PRODUCTS_BY_CATEGORY_ERROR,
  FETCH_PRODUCTS_BY_SUBCATEGORY_LOADING,
  FETCH_PRODUCTS_BY_SUBCATEGORY_SUCCESS,
  FETCH_PRODUCTS_BY_SUBCATEGORY_ERROR,
  FETCH_PRODUCTS_BY_MANUFACTURER_LOADING,
  FETCH_PRODUCTS_BY_MANUFACTURER_SUCCESS,
  FETCH_PRODUCTS_BY_MANUFACTURER_ERROR,
} from '../Actions/ProductsAction';

const initialState = {
  products: [],
  loading: false,
  error: null,
};

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_BY_CATEGORY_LOADING:
    case FETCH_PRODUCTS_BY_SUBCATEGORY_LOADING:
    case FETCH_PRODUCTS_BY_MANUFACTURER_LOADING:
      return { ...state, loading: true, error: null };

    case FETCH_PRODUCTS_BY_CATEGORY_SUCCESS:
    case FETCH_PRODUCTS_BY_SUBCATEGORY_SUCCESS:
    case FETCH_PRODUCTS_BY_MANUFACTURER_SUCCESS:
      return { ...state, loading: false, products: action.payload };

    case FETCH_PRODUCTS_BY_CATEGORY_ERROR:
    case FETCH_PRODUCTS_BY_SUBCATEGORY_ERROR:
    case FETCH_PRODUCTS_BY_MANUFACTURER_ERROR:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default productsReducer;
