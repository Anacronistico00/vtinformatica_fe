import { getBirthDateFromToken, getRoleFromToken, getUserIdFromToken } from '../../Utils/jwtUtils';
import { api } from '../../Utils/apiClient';
import { messageFor } from '../../Utils/errorMessages';
import { resetCart } from './CartActions';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';

export const loginSuccess = (user, token, isAuthenticated, role) => ({
  type: LOGIN_SUCCESS,
  payload: { user, token, isAuthenticated, role },
});

const startSession = (dispatch, email, token) => {
  const user = { email, role: getRoleFromToken(token), birthDate: getBirthDateFromToken(token) };
  dispatch(loginSuccess(user, token, true));
};

// Esito per la pagina: { ok } oppure { ok: false, code, message }. Il code decide il flusso
// (es. account_deactivated → riattivazione), il message è il testo da mostrare.
const failure = (error, fallback) => ({
  ok: false,
  code: error?.code ?? null,
  message: messageFor(error, fallback),
});

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const { data } = await api.post('/Account/login', { email, password }, { auth: false });
      startSession(dispatch, email, data.token);
      return { ok: true };
    } catch (error) {
      return failure(error, 'Accesso non riuscito.');
    }
  };
};

/** Riattivazione self-service: il BE riverifica la password e restituisce un nuovo token. */
export const reactivate = (email, password) => {
  return async (dispatch) => {
    try {
      const { data } = await api.post('/Account/reactivate', { email, password }, { auth: false });
      startSession(dispatch, email, data.token);
      return { ok: true };
    } catch (error) {
      return failure(error, 'Riattivazione non riuscita.');
    }
  };
};

/** Il cliente disattiva il proprio account (id dal token); la sessione si chiude subito. */
export const deactivateSelf = (note) => {
  return async (dispatch, getState) => {
    try {
      const userId = getUserIdFromToken(getState().auth.token);
      const trimmed = note?.trim();
      await api.delete(`/Account/${userId}`, trimmed ? { note: trimmed } : undefined);
      dispatch(logout());
      return { ok: true };
    } catch (error) {
      return failure(error, "Disattivazione dell'account non riuscita.");
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
