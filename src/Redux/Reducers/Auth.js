import { getRoleFromToken } from '../../Utils/jwtUtils.js';
import { LOGIN_SUCCESS, LOGOUT } from '../Actions/authActions.js';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  role: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: action.payload.isAuthenticated,
        role: getRoleFromToken(action.payload.token),
      };

    case LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        role: null,
      };

    default:
      return state;
  }
};

export default authReducer;
