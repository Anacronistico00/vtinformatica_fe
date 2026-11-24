import { getBirthDateFromToken, getRoleFromToken } from '../../Utils/jwtUtils';
import { api } from '../../Utils/apiClient';
import { resetCart } from './CartActions';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';

export const loginSuccess = (user, token, isAuthenticated, role) => ({
  type: LOGIN_SUCCESS,
  payload: { user, token, isAuthenticated, role },
});

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const { data } = await api
        .post('/Account/login', { email, password }, { auth: false })
        .catch(() => {
          throw new Error('Credenziali non valide');
        });

      const isAuthenticated = true;
      const role = getRoleFromToken(data.token);
      const birthDate = getBirthDateFromToken(data.token);

      const user = { email, role, birthDate };

      dispatch(loginSuccess(user, data.token, isAuthenticated));

      return true;
    } catch (error) {
      console.error('Errore nel login:', error.message);
      return false;
    }
  };
};

export const registerUser = (registration) =>
  api.post('/Account/register', registration, { auth: false });

export const logout = () => {
  return (dispatch) => {
    dispatch({ type: LOGOUT });
    dispatch(resetCart());
  };
};
