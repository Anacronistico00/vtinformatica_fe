# E2E (Playwright)

Flussi completi nel browser contro il **BE e il DB SQL Server locali**. Non girano in CI
(servirebbe SQL Server nel runner: lavoro futuro insieme a Testcontainers).

```bash
npx playwright install chromium   # una volta
npm run e2e
```

`npm run e2e` avvia da sé:

- il BE (`dotnet run --launch-profile https`, `https://localhost:7286`) con
  `Cors__AllowedOrigins__1` = origine degli E2E. Se il BE è già acceso viene riusato e
  deve ammettere quell'origine;
- un dev server Vite dedicato su `http://localhost:5174` con `VITE_API_URL` del BE (la
  5173 resta libera per lo sviluppo).

## Variabili

| Variabile          | Default                  | Uso                                                       |
| ------------------ | ------------------------ | --------------------------------------------------------- |
| `E2E_API_URL`      | `https://localhost:7286` | URL del BE                                                |
| `E2E_FE_PORT`      | `5174`                   | Porta del FE degli E2E                                    |
| `E2E_SQLCMD`       | `sqlcmd`                 | Eseguibile sqlcmd (es. `C:\Program Files\sqlcmd\sqlcmd.exe`) |
| `E2E_SQL_SERVER`   | `(local)`                | Server (es. `np:\\.\pipe\MSSQL$SQLEXPRESS\sql\query`)     |
| `E2E_SQL_DATABASE` | `VTInformatica`          | Database                                                  |

Autenticazione Windows (`-E`): nessuna password nel repo.

## Dati

- Il setup crea utenti `e2e.*@example.test` e prodotti `E2E ...` tramite l'API; l'admin
  di test riceve il ruolo Admin via SQL (solo la sua riga).
- Il teardown (e il setup, per gli avanzi di esecuzioni interrotte) cancella **solo** quei
  dati, in un'unica transazione, e fallisce se ne resta qualcuno. Se un prodotto `E2E`
  compare in un ordine non di test la pulizia si annulla.
- Fare un backup del DB prima della prima esecuzione.

## Flussi

- `shop`: login → carrello → checkout (con nota) → ordine in "i miei ordini"; 409
  stock insufficiente al checkout.
- `account`: disattivazione self → login → riattivazione → benvenuto; account sospeso;
  sessione scaduta (token con `exp` passato in localStorage) → utente non loggato,
  nessun errore JavaScript.
- `admin`: lista prodotti paginata (`X-Total-Count` letto attraverso il CORS reale);
  modifica con `ExpectedQuantity` superata → 409 `stock_conflict`.
- `reviews`: crea, modifica ed elimina la propria recensione; un altro utente la vede
  senza azioni.
