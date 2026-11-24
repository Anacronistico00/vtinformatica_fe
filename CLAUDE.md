# VTInformatica FE – frontend e-commerce prodotti tech per PC

## Stack

- React 19 + Vite 6 (plugin SWC), JavaScript (no TypeScript), React Router 7
- Redux Toolkit + Redux Persist (localStorage, scadenza 1h in
  `Utils/PersistConfig.js`)
- React Bootstrap / Bootstrap 5, React Toastify, Framer Motion
- Test: Vitest + Testing Library + MSW (da introdurre in M4a)

## Comandi

- `npm ci` | `npm run dev` | `npm run build` | `npm run lint` | `npm run preview`
- Test (da M4a): `npm test`
- Backend: repo `../VTInformatica` (ASP.NET Core). URL da `VITE_API_URL` (file
  `.env.local`, mai committato); `.env.example` documenta le variabili.

## Struttura (`src/`)

- `Components/` (pagine e componenti; sotto-cartelle `Admin/`, `Auth/`, `Home/`,
  `NavBar/`, `Products/`)
- `Redux/Actions` (thunk), `Redux/Reducers`, `Redux/Store/index.js`
- `Utils/` (ApiURL, jwtUtils, PersistConfig, ScrollToTop)
- Rotte in `App.jsx`; rotte admin protette da `Components/Auth/roleRoute.jsx`

## Convenzioni

- Le chiamate HTTP stanno SOLO nelle actions, mai nei componenti, e passano tutte
  da un client unico (`Utils/apiClient.js`): base URL, header Authorization,
  parsing degli errori `ProblemDetails`. Mai copiare il blocco `fetch`.
- L'URL del backend viene da `import.meta.env.VITE_API_URL`, mai hardcoded.
- Errori dell'API: decidere in base al campo `code` del `ProblemDetails`, mai sul
  testo del messaggio. I testi mostrati all'utente stanno in un solo punto.
- Identità utente: solo dal token lato BE. Usare le route `/me`, mai l'email
  nell'URL.
- Il controllo ruolo lato FE (`RoleRoute`, `user.role`) è solo UX: la sicurezza è
  nel backend. Non fidarti mai del FE per autorizzare.
- Stato globale in Redux; componenti piccoli, logica fuori dal JSX (hook o
  funzioni pure), stile con classi Bootstrap. Nessun restyling non richiesto.
- I commenti spiegano il perché del codice attuale, mai la sua storia: niente
  "prima era...", "fix di...", riferimenti a milestone.

## Test

- Ogni cambio di logica ha un test. Bug noti: prima un test rosso, poi il fix
  minimo.
- Reducer e funzioni pure: test unitari. Flussi (carrello, checkout, login):
  Testing Library sul componente reale, rete simulata con MSW (mai `fetch`
  mockato a mano).
- Le risposte simulate seguono il contratto reale del BE (ProblemDetails con
  `code`, liste vuote `200 []`, `X-Total-Count`).

## Regole di lavoro

- Prima di modificare codice: proponi un piano e aspetta conferma.
- Un task = un branch = commit piccoli. Modifiche minime e mirate, niente
  riscritture non richieste.
- Dopo ogni modifica: `npm run lint`, `npm test` e `npm run build` devono passare.
- Il backend non si modifica da questo repo: se serve qualcosa lato BE, annotarlo
  come fuori scope.
- Mai committare `.env*` (tranne `.env.example`), token o segreti.
- Se una scelta di architettura è ambigua, chiedi invece di decidere da solo.

## Flusso Git

- Branch di lavoro sempre da `develop`, con nome `fix/...`, `feat/...`, `test/...`
  o `chore/...`.
- PR verso `develop`, merge con "Rebase and merge" a CI verde. `main` riceve solo
  il merge (merge commit) da `develop` a fine milestone, poi tag annotato.
- Mai push o merge diretti su `main` o `develop`, mai force push.
- Non aggiungere mai Co-Authored-By, 'Generated with Claude Code' né link di
  sessione Claude a commit, PR o file.
