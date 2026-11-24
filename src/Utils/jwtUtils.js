export const getRoleFromToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));

    return (
      decodedPayload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ] || null
    );
  } catch (error) {
    console.error('Errore nella decodifica del token:', error);
    return null;
  }
};

export const getEmailFromToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));

    return (
      decodedPayload[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ] || null
    );
  } catch (error) {
    console.error('Errore nella decodifica del token:', error);
    return null;
  }
};

/** true se il token manca, non è leggibile o il suo exp (secondi) è già passato. */
export const isTokenExpired = (token, now = Date.now()) => {
  if (!token) return true;
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload));
    return typeof exp !== 'number' || exp * 1000 <= now;
  } catch {
    return true;
  }
};

export const getBirthDateFromToken = (token) => {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));

    return (
      decodedPayload[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth'
      ] || null
    );
  } catch (error) {
    console.error('Errore nella decodifica del token:', error);
    return null;
  }
};
