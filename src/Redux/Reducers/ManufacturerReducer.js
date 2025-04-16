import {
  GET_MANUFACTURERS_LOADING,
  GET_MANUFACTURERS_SUCCESS,
  GET_MANUFACTURERS_ERROR,
} from '../Actions/ManufacturersActions';

const initialState = {
  manufacturers: [],
  loading: false,
  error: null,
};

const manufacturerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MANUFACTURERS_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_MANUFACTURERS_SUCCESS:
      return {
        ...state,
        loading: false,
        manufacturers: action.payload,
        error: null,
      };
    case GET_MANUFACTURERS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default manufacturerReducer;
