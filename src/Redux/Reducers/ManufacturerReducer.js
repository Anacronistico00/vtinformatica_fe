import {
  GET_MANUFACTURERS_LOADING,
  GET_MANUFACTURERS_SUCCESS,
  GET_MANUFACTURERS_ERROR,
  GET_MANUFACTURERBYID_LOADING,
  GET_MANUFACTURERBYID_SUCCESS,
  GET_MANUFACTURERBYID_ERROR,
  CREATE_MANUFACTURER_LOADING,
  CREATE_MANUFACTURER_SUCCESS,
  CREATE_MANUFACTURER_ERROR,
  UPDATE_MANUFACTURER_LOADING,
  UPDATE_MANUFACTURER_SUCCESS,
  UPDATE_MANUFACTURER_ERROR,
  DELETE_MANUFACTURER_LOADING,
  DELETE_MANUFACTURER_SUCCESS,
  DELETE_MANUFACTURER_ERROR,
} from '../Actions/ManufacturersActions';

const initialState = {
  manufacturers: [],
  manufacturer: null,
  loading: false,
  error: null,
};

const manufacturerReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MANUFACTURERS_LOADING:
    case GET_MANUFACTURERBYID_LOADING:
    case CREATE_MANUFACTURER_LOADING:
    case UPDATE_MANUFACTURER_LOADING:
    case DELETE_MANUFACTURER_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_MANUFACTURERS_SUCCESS:
      return {
        ...state,
        loading: false,
        manufacturers: action.payload.manufacturers || [], // Assicurati che il payload contenga 'manufacturers' come array
        error: null,
      };
    case GET_MANUFACTURERBYID_SUCCESS:
      return {
        ...state,
        loading: false,
        manufacturer: action.payload, // Dovrebbe essere direttamente il singolo produttore
        error: null,
      };
    case CREATE_MANUFACTURER_SUCCESS:
      return {
        ...state,
        manufacturers: [...state.manufacturers, action.payload], // Assicurati che 'action.payload' contenga un singolo produttore
        loading: false,
      };

    case UPDATE_MANUFACTURER_SUCCESS:
      return {
        ...state,
        manufacturers: state.manufacturers.map((man) =>
          man.manufacturerId === action.payload.manufacturerId
            ? action.payload
            : man
        ), // Assicurati di usare 'manufacturerId'
        loading: false,
      };

    case DELETE_MANUFACTURER_SUCCESS:
      return {
        ...state,
        manufacturers: state.manufacturers.filter(
          (man) => man.manufacturerId !== action.payload // Usa 'manufacturerId' come chiave
        ),
        loading: false,
      };
    case GET_MANUFACTURERS_ERROR:
    case GET_MANUFACTURERBYID_ERROR:
    case CREATE_MANUFACTURER_ERROR:
    case UPDATE_MANUFACTURER_ERROR:
    case DELETE_MANUFACTURER_ERROR:
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
