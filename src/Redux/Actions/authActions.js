import { getRoleFromToken } from '../../Utils/jwtUtils';
import ApiURL from '../../Utils/ApiURL';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';

export const loginSuccess = (user, token, isAuthenticated, role) => ({
  type: LOGIN_SUCCESS,
  payload: { user, token, isAuthenticated, role },
});

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const url = ApiURL.apiUrl;
      const response = await fetch(`${url}/Account/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Credenziali non valide');
      }

      const data = await response.json();
      const isAuthenticated = true;
      const role = getRoleFromToken(data.token);

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', role);

      dispatch(loginSuccess(email, data.token, isAuthenticated, role));

      return true;
    } catch (error) {
      console.error('Errore nel login:', error.message);
      return false;
    }
  };
};

export const logout = () => {
  return (dispatch) => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    dispatch({ type: LOGOUT });
  };
};
