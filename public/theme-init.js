// Applica il tema prima del primo paint (niente lampo chiaro in modalità scura).
// Script esterno e non inline: una CSP con script-src 'self' lo ammette.
// Stessa logica di src/Utils/theme.js: le due vanno tenute allineate.
(function () {
  var preference = 'auto';
  try {
    preference = localStorage.getItem('vt-theme') || 'auto';
  } catch {
    // Storage bloccato: vale il tema del sistema.
  }
  var dark =
    preference === 'dark' ||
    (preference !== 'light' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
})();
