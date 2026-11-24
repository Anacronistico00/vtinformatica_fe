import { configureApiClient } from '../../Utils/apiClient';

/** Collega il client HTTP allo store: il token è solo quello dello slice auth. */
export const connectApiClient = (store) => {
  configureApiClient({
    getToken: () => store.getState().auth.token,
  });
};
