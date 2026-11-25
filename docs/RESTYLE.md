# Restyle

Il frontend ha un tema chiaro e scuro, un font Geist ospitato nel repo e un logo in SVG. Il tema sta
sopra React-Bootstrap: token CSS, un foglio di stile dedicato e pochi ritocchi al markup. Struttura dei
componenti, rotte, logica e Redux sono rimasti quelli di prima. Le regole di design stanno in
[`DESIGN.md`](../DESIGN.md).

## Numeri

| | Prima | Dopo |
| --- | --- | --- |
| Violazioni axe serious e critical (24 pagine, WCAG 2.1 A e AA) | 74 (46 serious, 28 critical), solo tema chiaro | 0, in tema chiaro e in tema scuro |
| Peso del logo | 9.008.286 B: SVG con 8 PNG incorporati | Lockup 2.886 B, VT con ombra 498 B, favicon 1.018 B (SVG) |
| Chunk JS | 572.697 B | 586.449 B (+13.752 B), 184,8 kB gzip |
| CSS | 249.666 B | 267.429 B (+17.763 B), 38,1 kB gzip |
| Font | Franklin Gothic e Arial di sistema | Geist variabile, solo latin, 29.400 B, nel repo |
| Icone | Bootstrap Icons da CDN | `react-icons`, nessuna richiesta a CDN |
| `dist/assets` | 9,60 MB | 0,88 MB |
| Banner della home | 3 PNG (700 kB), 2 caricati da `media.ldlc.com` | Nessuna immagine: titolo, link e illustrazioni SVG nel codice |
| Test unitari | 98 (20 file) | 125 (25 file) |
| Test E2E | 8 | 32, di cui 22 controlli axe in tema chiaro e scuro |

Il chunk JS cresce di 13,7 kB: selettore del tema, `MotionConfig`, il Modal di React-Bootstrap,
le icone e le illustrazioni dei banner. Il CSS cresce per i token e per il tema.

Prima, axe segnalava questi problemi su quasi ogni pagina: bottoni senza nome (critical), contrasto
insufficiente (serious), link senza nome (serious), immagini senza `alt` e campi senza etichetta
(critical). Il rapporto grezzo sta in [`axe-before.json`](restyle/axe-before.json) e
[`axe-after.json`](restyle/axe-after.json).

## Mappa delle pagine

| Gruppo | Pagina | Rotta |
| --- | --- | --- |
| Layout, banner e logo (#22, #30, #32) | Home | `/` |
| Catalogo e ricerca (#23) | Categoria | `/products/category/:id` |
| Catalogo e ricerca (#23) | Sottocategoria | `/products/subcategory/:id` |
| Catalogo e ricerca (#23) | Tutti i marchi | `/manufacturers` |
| Catalogo e ricerca (#23) | Marchio | `/products/manufacturer/:id` |
| Catalogo e ricerca (#23) | Ricerca | `/search/:query` |
| Scheda prodotto e recensioni (#24) | Scheda prodotto | `/product/:id` |
| Scheda prodotto e recensioni (#24) | Scheda prodotto da loggato, con il modulo recensione | `/product/:id` |
| Carrello, checkout e ordini (#25) | Carrello da anonimo | `/cart` |
| Carrello, checkout e ordini (#25) | Carrello pieno | `/cart` |
| Carrello, checkout e ordini (#25) | I miei ordini | `/orders` |
| Carrello, checkout e ordini (#25) | Dettaglio ordine | `/orderInfo/:id` |
| Account e riattivazione (#26) | Accesso | `/account` |
| Account e riattivazione (#26) | Registrazione | `/register` |
| Account e riattivazione (#26) | Riattivazione | `/reactivate` |
| Account e riattivazione (#26) | Profilo | `/accountInfo` |
| Account e riattivazione (#26) | Accesso negato | `/not-authorized` |
| Account e riattivazione (#26) | Pagina non trovata | `*` |
| Backoffice (#27) | Pannello | `/admin` |
| Backoffice (#27) | Prodotti | `/admin/products` |
| Backoffice (#27) | Categorie | `/admin/categories` |
| Backoffice (#27) | Sottocategorie | `/admin/subcategories` |
| Backoffice (#27) | Marchi | `/admin/manufacturers` |
| Backoffice (#27) | Utenti | `/admin/users` |

Le fette sono state unite una alla volta in `develop`, ognuna con test, E2E e controllo axe verdi.

## Logo

![Testata desktop e mobile, tema chiaro e scuro, e monogramma](restyle/logo-final.png)

- Lockup B1 in testata da 992 px in su (220 px di larghezza) e nel footer.
- Sotto 992 px la testata mostra la sola VT con l'ombra (104 px): la parola non si legge a quella
  larghezza e resta nel footer.
- La variante impilata (C) serve per gli spazi quadrati e per `public/og-image.png`.
- Il monogramma è la stessa VT in un quadrato arrotondato: favicon, apple-touch-icon.
- Il meta `og:image` non c'è ancora: vuole un URL assoluto e il dominio non è deciso.

Disegno, colori e file sono descritti nella sezione Logo di [`DESIGN.md`](../DESIGN.md). Le proposte
scartate (altre due serie di banner, altri trattamenti della parola) sono in
[`restyle/proposals/`](restyle/proposals/).

## Prima e dopo, desktop (1440 px)

Le foto "prima" esistono solo in tema chiaro, perché il tema scuro non c'era.

| Pagina | Prima (chiaro) | Dopo (chiaro) | Dopo (scuro) |
| --- | --- | --- | --- |
| Home | <img src="restyle/before/public-home-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-home-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-home-desktop-dark.png" width="230" alt=""> |
| Categoria | <img src="restyle/before/public-category-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-category-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-category-desktop-dark.png" width="230" alt=""> |
| Sottocategoria | <img src="restyle/before/public-subcategory-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-subcategory-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-subcategory-desktop-dark.png" width="230" alt=""> |
| Tutti i marchi | <img src="restyle/before/public-manufacturers-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-manufacturers-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-manufacturers-desktop-dark.png" width="230" alt=""> |
| Marchio | <img src="restyle/before/public-manufacturer-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-manufacturer-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-manufacturer-desktop-dark.png" width="230" alt=""> |
| Ricerca | <img src="restyle/before/public-search-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-search-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-search-desktop-dark.png" width="230" alt=""> |
| Scheda prodotto | <img src="restyle/before/public-product-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-product-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-product-desktop-dark.png" width="230" alt=""> |
| Scheda prodotto da loggato, con il modulo recensione | <img src="restyle/before/account-product-reviews-desktop-light.png" width="230" alt=""> | <img src="restyle/after/account-product-reviews-desktop-light.png" width="230" alt=""> | <img src="restyle/after/account-product-reviews-desktop-dark.png" width="230" alt=""> |
| Carrello da anonimo | <img src="restyle/before/public-cart-empty-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-cart-empty-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-cart-empty-desktop-dark.png" width="230" alt=""> |
| Carrello pieno | <img src="restyle/before/account-cart-desktop-light.png" width="230" alt=""> | <img src="restyle/after/account-cart-desktop-light.png" width="230" alt=""> | <img src="restyle/after/account-cart-desktop-dark.png" width="230" alt=""> |
| I miei ordini | <img src="restyle/before/account-orders-desktop-light.png" width="230" alt=""> | <img src="restyle/after/account-orders-desktop-light.png" width="230" alt=""> | <img src="restyle/after/account-orders-desktop-dark.png" width="230" alt=""> |
| Dettaglio ordine | <img src="restyle/before/account-order-detail-desktop-light.png" width="230" alt=""> | <img src="restyle/after/account-order-detail-desktop-light.png" width="230" alt=""> | <img src="restyle/after/account-order-detail-desktop-dark.png" width="230" alt=""> |
| Accesso | <img src="restyle/before/public-login-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-login-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-login-desktop-dark.png" width="230" alt=""> |
| Registrazione | <img src="restyle/before/public-register-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-register-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-register-desktop-dark.png" width="230" alt=""> |
| Riattivazione | <img src="restyle/before/public-reactivate-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-reactivate-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-reactivate-desktop-dark.png" width="230" alt=""> |
| Profilo | <img src="restyle/before/account-info-desktop-light.png" width="230" alt=""> | <img src="restyle/after/account-info-desktop-light.png" width="230" alt=""> | <img src="restyle/after/account-info-desktop-dark.png" width="230" alt=""> |
| Accesso negato | <img src="restyle/before/public-not-authorized-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-not-authorized-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-not-authorized-desktop-dark.png" width="230" alt=""> |
| Pagina non trovata | <img src="restyle/before/public-not-found-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-not-found-desktop-light.png" width="230" alt=""> | <img src="restyle/after/public-not-found-desktop-dark.png" width="230" alt=""> |
| Pannello | <img src="restyle/before/admin-dashboard-desktop-light.png" width="230" alt=""> | <img src="restyle/after/admin-dashboard-desktop-light.png" width="230" alt=""> | <img src="restyle/after/admin-dashboard-desktop-dark.png" width="230" alt=""> |
| Prodotti | <img src="restyle/before/admin-products-desktop-light.png" width="230" alt=""> | <img src="restyle/after/admin-products-desktop-light.png" width="230" alt=""> | <img src="restyle/after/admin-products-desktop-dark.png" width="230" alt=""> |
| Categorie | <img src="restyle/before/admin-categories-desktop-light.png" width="230" alt=""> | <img src="restyle/after/admin-categories-desktop-light.png" width="230" alt=""> | <img src="restyle/after/admin-categories-desktop-dark.png" width="230" alt=""> |
| Sottocategorie | <img src="restyle/before/admin-subcategories-desktop-light.png" width="230" alt=""> | <img src="restyle/after/admin-subcategories-desktop-light.png" width="230" alt=""> | <img src="restyle/after/admin-subcategories-desktop-dark.png" width="230" alt=""> |
| Marchi | <img src="restyle/before/admin-manufacturers-desktop-light.png" width="230" alt=""> | <img src="restyle/after/admin-manufacturers-desktop-light.png" width="230" alt=""> | <img src="restyle/after/admin-manufacturers-desktop-dark.png" width="230" alt=""> |
| Utenti | <img src="restyle/before/admin-users-desktop-light.png" width="230" alt=""> | <img src="restyle/after/admin-users-desktop-light.png" width="230" alt=""> | <img src="restyle/after/admin-users-desktop-dark.png" width="230" alt=""> |

## Prima e dopo, mobile (390 px)

| Pagina | Prima (chiaro) | Dopo (chiaro) | Dopo (scuro) |
| --- | --- | --- | --- |
| Home | <img src="restyle/before/public-home-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-home-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-home-mobile-dark.png" width="110" alt=""> |
| Categoria | <img src="restyle/before/public-category-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-category-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-category-mobile-dark.png" width="110" alt=""> |
| Sottocategoria | <img src="restyle/before/public-subcategory-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-subcategory-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-subcategory-mobile-dark.png" width="110" alt=""> |
| Tutti i marchi | <img src="restyle/before/public-manufacturers-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-manufacturers-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-manufacturers-mobile-dark.png" width="110" alt=""> |
| Marchio | <img src="restyle/before/public-manufacturer-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-manufacturer-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-manufacturer-mobile-dark.png" width="110" alt=""> |
| Ricerca | <img src="restyle/before/public-search-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-search-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-search-mobile-dark.png" width="110" alt=""> |
| Scheda prodotto | <img src="restyle/before/public-product-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-product-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-product-mobile-dark.png" width="110" alt=""> |
| Scheda prodotto da loggato, con il modulo recensione | <img src="restyle/before/account-product-reviews-mobile-light.png" width="110" alt=""> | <img src="restyle/after/account-product-reviews-mobile-light.png" width="110" alt=""> | <img src="restyle/after/account-product-reviews-mobile-dark.png" width="110" alt=""> |
| Carrello da anonimo | <img src="restyle/before/public-cart-empty-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-cart-empty-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-cart-empty-mobile-dark.png" width="110" alt=""> |
| Carrello pieno | <img src="restyle/before/account-cart-mobile-light.png" width="110" alt=""> | <img src="restyle/after/account-cart-mobile-light.png" width="110" alt=""> | <img src="restyle/after/account-cart-mobile-dark.png" width="110" alt=""> |
| I miei ordini | <img src="restyle/before/account-orders-mobile-light.png" width="110" alt=""> | <img src="restyle/after/account-orders-mobile-light.png" width="110" alt=""> | <img src="restyle/after/account-orders-mobile-dark.png" width="110" alt=""> |
| Dettaglio ordine | <img src="restyle/before/account-order-detail-mobile-light.png" width="110" alt=""> | <img src="restyle/after/account-order-detail-mobile-light.png" width="110" alt=""> | <img src="restyle/after/account-order-detail-mobile-dark.png" width="110" alt=""> |
| Accesso | <img src="restyle/before/public-login-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-login-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-login-mobile-dark.png" width="110" alt=""> |
| Registrazione | <img src="restyle/before/public-register-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-register-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-register-mobile-dark.png" width="110" alt=""> |
| Riattivazione | <img src="restyle/before/public-reactivate-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-reactivate-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-reactivate-mobile-dark.png" width="110" alt=""> |
| Profilo | <img src="restyle/before/account-info-mobile-light.png" width="110" alt=""> | <img src="restyle/after/account-info-mobile-light.png" width="110" alt=""> | <img src="restyle/after/account-info-mobile-dark.png" width="110" alt=""> |
| Accesso negato | <img src="restyle/before/public-not-authorized-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-not-authorized-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-not-authorized-mobile-dark.png" width="110" alt=""> |
| Pagina non trovata | <img src="restyle/before/public-not-found-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-not-found-mobile-light.png" width="110" alt=""> | <img src="restyle/after/public-not-found-mobile-dark.png" width="110" alt=""> |
| Pannello | <img src="restyle/before/admin-dashboard-mobile-light.png" width="110" alt=""> | <img src="restyle/after/admin-dashboard-mobile-light.png" width="110" alt=""> | <img src="restyle/after/admin-dashboard-mobile-dark.png" width="110" alt=""> |
| Prodotti | <img src="restyle/before/admin-products-mobile-light.png" width="110" alt=""> | <img src="restyle/after/admin-products-mobile-light.png" width="110" alt=""> | <img src="restyle/after/admin-products-mobile-dark.png" width="110" alt=""> |
| Categorie | <img src="restyle/before/admin-categories-mobile-light.png" width="110" alt=""> | <img src="restyle/after/admin-categories-mobile-light.png" width="110" alt=""> | <img src="restyle/after/admin-categories-mobile-dark.png" width="110" alt=""> |
| Sottocategorie | <img src="restyle/before/admin-subcategories-mobile-light.png" width="110" alt=""> | <img src="restyle/after/admin-subcategories-mobile-light.png" width="110" alt=""> | <img src="restyle/after/admin-subcategories-mobile-dark.png" width="110" alt=""> |
| Marchi | <img src="restyle/before/admin-manufacturers-mobile-light.png" width="110" alt=""> | <img src="restyle/after/admin-manufacturers-mobile-light.png" width="110" alt=""> | <img src="restyle/after/admin-manufacturers-mobile-dark.png" width="110" alt=""> |
| Utenti | <img src="restyle/before/admin-users-mobile-light.png" width="110" alt=""> | <img src="restyle/after/admin-users-mobile-light.png" width="110" alt=""> | <img src="restyle/after/admin-users-mobile-dark.png" width="110" alt=""> |

## Note sulle foto

- Le foto escono da `npm run screenshots` (vedi [`e2e/README.md`](../e2e/README.md)), con gli stessi
  dati di seed degli E2E.
- Data e numero dell'ordine cambiano a ogni esecuzione: il setup crea un ordine nuovo ogni volta.
  Nel confronto contano layout, colori e tipografia, non quei due valori.
- Le tre direzioni grafiche confrontate prima della scelta stanno sui branch `design/dir-a`,
  `design/dir-b` e `design/dir-c`, in `docs/restyle/directions/`. Non sono in `develop`.
- Per rifare le foto "dopo": `SHOTS_DIR=docs/restyle/after SHOTS_THEME=light npm run screenshots`,
  poi con `SHOTS_THEME=dark`.
- Per rifare il rapporto axe: vedi la sezione "Rapporto axe prima/dopo" di
  [`e2e/README.md`](../e2e/README.md).

## Fuori scope

Quello che il restyle ha trovato senza risolverlo sta in
[`AUDIT-prima.md`](AUDIT-prima.md), sezione "Fuori scope emersi": loghi dei marchi con URL rotto o
quasi invisibili, da correggere nei dati con lo script del BE.
