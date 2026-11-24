import { ApiError } from './apiClient';

// Testi mostrati all'utente per ogni "code" stabile del BE (ProblemDetails). Un solo punto:
// i componenti e le actions non decidono mai in base al testo dell'errore.
const MESSAGES = {
  network_error: 'Server non raggiungibile. Riprova tra poco.',
  internal_error: 'Errore del server. Riprova tra poco.',
  unauthorized: 'Sessione scaduta: accedi di nuovo.',
  forbidden: 'Operazione non consentita.',
  not_found: 'Elemento non trovato.',
  invalid_credentials: 'Email o password non corretti.',
  account_deactivated: 'Il tuo account è disattivato.',
  account_suspended: 'Il tuo account è sospeso. Per informazioni contatta l\'assistenza.',
  email_already_registered: 'Email già registrata.',
  weak_password: 'La password non rispetta i requisiti di sicurezza.',
  registration_failed: 'Registrazione non riuscita. Riprova.',
  product_not_found: 'Il prodotto non è più disponibile.',
  insufficient_stock: 'Quantità non disponibile: lo stock del prodotto non è sufficiente.',
  invalid_quantity: 'Quantità non valida.',
  cart_empty: 'Il carrello è vuoto.',
  stock_conflict: 'Lo stock è stato modificato nel frattempo: ricarica il prodotto e riprova.',
  resource_in_use: 'Impossibile eliminare: ci sono prodotti collegati (anche eliminati, per lo storico ordini).',
  category_not_found: 'La categoria scelta non esiste.',
  subcategory_not_found: 'La sottocategoria scelta non esiste.',
  manufacturer_not_found: 'Il produttore scelto non esiste.',
  cannot_suspend_self: 'Non puoi sospendere il tuo account.',
  cannot_suspend_admin: 'Un amministratore non può essere sospeso.',
  not_suspended: 'L\'account non è sospeso.',
};

const firstFieldError = (errors) => {
  const messages = errors && Object.values(errors).flat();
  return messages && messages.length > 0 ? messages[0] : null;
};

/** Per i .catch delle actions: rilancia un Error con il testo per l'utente (code del BE o fallback). */
export const withMessage = (fallback) => (error) => {
  throw new Error(messageFor(error, fallback));
};

/** Testo per l'utente: dal code del BE, altrimenti il fallback del chiamante. */
export const messageFor = (error, fallback = 'Si è verificato un errore.') => {
  if (!(error instanceof ApiError)) return fallback;
  if (error.code === 'validation_failed') {
    return firstFieldError(error.errors) || 'Alcuni dati non sono validi.';
  }
  return MESSAGES[error.code] || fallback;
};
