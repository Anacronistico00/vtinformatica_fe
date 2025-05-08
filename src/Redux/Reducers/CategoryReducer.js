import {
  GET_CATEGORIES_LOADING,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_ERROR,
  GET_CATEGORY_LOADING,
  GET_CATEGORY_SUCCESS,
  GET_CATEGORY_ERROR,
  CREATE_CATEGORY_LOADING,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_ERROR,
  UPDATE_CATEGORY_LOADING,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_ERROR,
  DELETE_CATEGORY_LOADING,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_ERROR,
} from '../Actions/CategoriesActions';

const initialState = {
  categories: [],
  category: null,
  loading: false,
  error: null,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES_LOADING:
    case GET_CATEGORY_LOADING:
    case CREATE_CATEGORY_LOADING:
    case UPDATE_CATEGORY_LOADING:
    case DELETE_CATEGORY_LOADING:
      return { ...state, loading: true, error: null };

    case GET_CATEGORIES_SUCCESS:
      return { ...state, categories: action.payload, loading: false };

    case GET_CATEGORY_SUCCESS:
      return { ...state, category: action.payload, loading: false };

    case CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: [...state.categories, action.payload],
        loading: false,
      };

    case UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? action.payload : cat
        ),
        loading: false,
      };

    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload),
        loading: false,
      };

    case GET_CATEGORIES_ERROR:
    case GET_CATEGORY_ERROR:
    case CREATE_CATEGORY_ERROR:
    case UPDATE_CATEGORY_ERROR:
    case DELETE_CATEGORY_ERROR:
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export default categoryReducer;
