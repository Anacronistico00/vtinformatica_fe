import { configureApiClient } from '../../Utils/apiClient';
import { logout } from '../Actions/authActions';

/**
 * Collega il client HTTP allo store: il token è solo quello dello slice auth.
 * Un 401 su una richiesta autenticata significa sessione non più valida (token scaduto,
 * account disattivato o sospeso): si esce e lo stato persistito viene azzerato dal LOGOUT.
 */
export const connectApiClient = (store) => {
  configureApiClient({
    getToken: () => store.getState().auth.token,
    onUnauthorized: () => store.dispatch(logout()),
  });
};
