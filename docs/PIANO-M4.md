# Piano M4 – Frontend

Baseline in `docs/AUDIT-prima.md` (copia della baseline del BE). Stato e "Impatto
FE" delle milestone del BE: `../VTInformatica/docs/AUDIT-prima.md`.

## Metriche di partenza (tag `v1-epicode`)

- Test: 0. Lint: 2 errori, 3 warning. `npm audit`: 16 (2 low, 2 moderate, 12
  high). Componente più grande: `ManageProductsComponent` 361 righe.

## Fette

- **M4a Infrastruttura**: lint a 0 errori (i 3 warning `exhaustive-deps` si
  sistemano nella fetta che tocca quei componenti, dopo i test di
  caratterizzazione), Vitest + Testing Library + MSW, CI GitHub Actions (lint,
  test, build), `VITE_API_URL`, `apiClient` unico (base URL, Authorization,
  `ProblemDetails` con `code`, 401 → logout e pulizia persist), token unico nello
  slice `auth` persistito con scadenza da `exp`, CSP via meta solo se non rompe
  nulla. `npm audit` su branch dedicato.
- **M4b Contratto**: route `/me`, paginazione server nella lista prodotti admin
  (`X-Total-Count`), liste vuote `200 []`, messaggi per `code`, registrazione senza
  `fiscalCode`, `RoleRoute` → `/account`, `CustomerComment` al checkout, crash
  NavBar.
- **M4c Account**: `account_deactivated` → riattivazione → benvenuto;
  `account_suspended` → negazione; disattivazione self con motivo; backoffice
  utenti (lista, sospendi con nota, riattiva).
- **M4d Backoffice**: `ExpectedQuantity` + 409 `stock_conflict`, restore ordine
  con 409, 409 `resource_in_use` su categorie/sottocategorie/produttori.
- **M4e Refactor**: dentro la fetta che tocca il componente, dopo i suoi test.
- **M4f Recensioni**: lista, crea, modifica ed elimina (solo le proprie, tramite
  `GET /Review/me` aggiunto al BE in `feat/review-mine`).

## Decisioni

1. Token: un'unica copia nello slice `auth` persistito; scadenza letta da `exp`
   del JWT; 401 con token → logout. Cookie httpOnly + refresh token richiedono il
   BE: fuori scope.
2. Niente monorepo: repo separati, link reciproci nei README.
3. Backoffice solo Admin; Seller annotato come gap.
4. Paginazione server solo nella lista prodotti admin (20 per pagina).
5. Release: `develop` → `main` (merge commit), tag `v2-m4`.

## Fuori scope

- Pagina admin degli ordini (il BE offre `GET /Order` paginato, il FE non ha la
  schermata).
- Token in cookie httpOnly (richiede il BE).

## Dettaglio M4b (branch `feat/m4b-api-contract`)

1. Route `/me`: carrello (`GET /Cart/me`, `POST /Cart/me/add`), ordini
   (`GET /Order/me`, `POST /Order/me/from-cart`); l'email non serve più alle
   actions né ai componenti.
2. Errori per `code` (`Utils/errorMessages.js`, un solo punto per i testi):
   aggiunta al carrello e checkout mostrano un toast con il motivo (oggi
   falliscono in silenzio). `ADD_TO_CART_SUCCESS` non inserisce più la risposta
   del BE (`{ message }`) tra le righe del carrello.
3. Checkout con nota facoltativa (`customerComment`, max 500).
4. Registrazione: niente `fiscalCode` (campo inesistente nel BE), errore per
   `code`.
5. `RoleRoute` senza login → `/account` (oggi `/login`, rotta inesistente).
6. NavBar: nessuna richiesta del carrello senza login; non va in crash con lo
   stato iniziale.
7. Lista prodotti admin paginata dal server (`page`, `pageSize` 20,
   `X-Total-Count`).
8. Liste vuote `200 []` sulle pagine catalogo; warning `exhaustive-deps` dei tre
   componenti catalogo dopo i loro test.
