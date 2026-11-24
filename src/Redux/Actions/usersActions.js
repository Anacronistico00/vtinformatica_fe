import { api } from '../../Utils/apiClient';

// Backoffice utenti (solo Admin). Lo stato vive nella pagina: l'elenco non serve altrove.

export const fetchUsers = async () => {
  const { data } = await api.get('/Account/UsersList');
  return data.users;
};

/** La nota è obbligatoria (il BE la rifiuta vuota) e non viene mai mostrata al cliente. */
export const suspendUser = (id, note) => api.put(`/Account/${id}/suspend`, { note });

export const unsuspendUser = (id) => api.put(`/Account/${id}/unsuspend`);
