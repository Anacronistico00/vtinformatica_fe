import {
  GET_SUBCATEGORIES_ERROR,
  GET_SUBCATEGORIES_LOADING,
  GET_SUBCATEGORIES_SUCCESS,
  GET_SUBCATEGORY_ERROR,
  GET_SUBCATEGORY_LOADING,
  GET_SUBCATEGORY_SUCCESS,
} from '../Actions/SubCategoriesActions';

const initialState = {
  subcategories: [],
  subCategory: null,
  loading: false,
  error: null,
};

const subCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SUBCATEGORY_LOADING:
    case GET_SUBCATEGORIES_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_SUBCATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        subcategories: action.payload,
      };
    case GET_SUBCATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        subCategory: action.payload,
      };
    case GET_SUBCATEGORY_ERROR:
    case GET_SUBCATEGORIES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default subCategoryReducer;
