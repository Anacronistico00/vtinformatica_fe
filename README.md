# VT Informatica – front end

🇮🇹 Italiano · [🇬🇧 English](README.en.md)

Front end di un e-commerce di prodotti tech per PC: catalogo, ricerca, carrello, checkout, ordini, recensioni, area account e backoffice per `Admin`. Parla con l'API in [VTInformatica](https://github.com/Anacronistico00/VTInformatica) (ASP.NET Core + SQL Server).

Nato come progetto di fine corso (tag `v1-epicode`), è stato poi sottoposto a un audit e riallineato al contratto dell'API (`v2-m4`). Le sezioni [Prima / dopo](#prima--dopo) e [Come ho lavorato con l'AI](#come-ho-lavorato-con-lai) raccontano come.

## Stack

- React 19, Vite 6 (plugin SWC), JavaScript, React Router 7
- Redux Toolkit + Redux Persist (localStorage, scadenza 1 h), React Bootstrap / Bootstrap 5, React Toastify, Framer Motion
- Test: Vitest + Testing Library + MSW (rete simulata sul contratto reale dell'API); E2E: Playwright
- CI: GitHub Actions (lint, test, build)

## Architettura

```mermaid
flowchart LR
    B["Browser<br/>React SPA (questo repo)"] -- "HTTPS + JWT Bearer<br/>JSON / ProblemDetails" --> A["API ASP.NET Core<br/>(VTInformatica)"]
    A -- "EF Core" --> D[("SQL Server")]
```

- `src/Components/`: pagine e componenti (`Admin/`, `Auth/`, `Home/`, `NavBar/`, `Products/`). Le rotte stanno in `App.jsx`; quelle admin passano da `Auth/roleRoute.jsx`.
- `src/Redux/`: `Actions` (thunk), `Reducers`, `Store`. Le chiamate HTTP stanno **solo** nelle actions.
- `src/Utils/apiClient.js`: unico client HTTP (base URL da `VITE_API_URL`, header `Authorization`, 204, errori di rete, `ProblemDetails` → `ApiError { status, code, detail, errors }`). 401 su una richiesta con token → logout.
- Gli errori dell'API si distinguono dal campo `code`, mai dal testo; i messaggi per l'utente stanno in un solo file.
- L'identità viene dal token lato BE (route `/me`): il controllo di ruolo nel FE (`RoleRoute`) è solo UX, la sicurezza è nell'API.
- I test stanno accanto al file che verificano (`*.test.js[x]`); setup, server MSW e JWT di test in `src/test/`.

## Avvio in locale

Prerequisiti: Node 22, e l'API in esecuzione (vedi [README del BE](https://github.com/Anacronistico00/VTInformatica#readme): database, chiave JWT con User Secrets, primo admin).

1. **Clona i due repo** uno accanto all'altro:

   ```bash
   git clone https://github.com/Anacronistico00/vtinformatica_fe.git
   git clone https://github.com/Anacronistico00/VTInformatica.git
   ```

2. **Avvia il BE** (dalla cartella `VTInformatica`): database da `DatabaseScript.sql` + `dotnet ef database update`, chiave con `dotnet user-secrets set "Jwt:SecurityKey" "<almeno 32 caratteri>" --project VTInformatica`, poi:

   ```bash
   dotnet run --project VTInformatica --launch-profile https   # https://localhost:7286
   ```

3. **Configura il FE.** L'URL dell'API viene da `VITE_API_URL`; non è mai nel codice. Il file `.env.local` non si committa (`.env.example` documenta le variabili):

   ```bash
   cd vtinformatica_fe
   npm ci
   cp .env.example .env.local   # VITE_API_URL=https://localhost:7286
   ```

4. **Avvia il FE:**

   ```bash
   npm run dev                  # http://localhost:5173
   ```

   `http://localhost:5173` è l'origine ammessa dal CORS del BE di default.

5. **Primo admin, via DB.** Ogni registrazione crea un `Customer`; per avere il backoffice registra l'utente dal FE e assegnagli il ruolo (il BE non ha ancora un endpoint per creare admin):

   ```sql
   INSERT INTO AspNetUserRoles (UserId, RoleId)
   SELECT u.Id, r.Id
   FROM AspNetUsers u, AspNetRoles r
   WHERE u.Email = 'tua@email.it' AND r.Name = 'Admin';
   ```

   Poi rifai il login: il ruolo sta nel token.

## Test

```bash
npm test          # Vitest + Testing Library + MSW
npm run lint
npm run build
```

Sono gli stessi controlli della CI (nessun backend né segreto: la rete è simulata con MSW). Ogni cambio di logica ha un test; per i bug noti prima un test rosso, poi il fix.

## E2E (Playwright)

Flussi completi nel browser contro il **BE e il DB SQL Server locali** (login → carrello → checkout → ordine, account, backoffice, recensioni). Non girano in CI.

```bash
npx playwright install chromium   # una volta
npm run e2e
```

La porta del FE degli E2E è **fissa: 5174**, con `--strictPort` (se è occupata il test fallisce invece di spostarsi); la 5173 resta libera per lo sviluppo. Per questo il BE deve ammettere quell'origine nel CORS. Se lo lasci avviare a Playwright lo fa da solo; se è già acceso (viene riusato) **riavvialo con**:

```bash
Cors__AllowedOrigins__1=http://localhost:5174 dotnet run --project VTInformatica --launch-profile https
```

(PowerShell: `$env:Cors__AllowedOrigins__1='http://localhost:5174'` prima di `dotnet run`.) Non serve toccare `appsettings.json` del BE. Senza questa origine il login negli E2E fallisce con "Server non raggiungibile".

Variabili (autenticazione Windows a SQL Server, nessuna password nel repo):

| Variabile          | Default                  | Uso                                                          |
| ------------------ | ------------------------ | ------------------------------------------------------------ |
| `E2E_API_URL`      | `https://localhost:7286` | URL del BE                                                   |
| `E2E_FE_PORT`      | `5174`                   | Porta del FE degli E2E                                       |
| `E2E_SQLCMD`       | `sqlcmd`                 | Eseguibile sqlcmd                                            |
| `E2E_SQL_SERVER`   | `(local)`                | Server (es. `np:\\.\pipe\MSSQL$SQLEXPRESS\sql\query`)        |
| `E2E_SQL_DATABASE` | `VTInformatica`          | Database                                                     |

Da Git Bash i backslash della named pipe vanno raddoppiati e conviene `MSYS_NO_PATHCONV=1`, ad esempio `MSYS_NO_PATHCONV=1 E2E_SQL_SERVER='np:\\\\.\\pipe\\MSSQL$SQLEXPRESS\\sql\\query' npm run e2e`.

Gli E2E creano utenti `e2e.*@example.test` e prodotti `E2E …` e li cancellano a fine run (solo quelli, in una transazione). **Fai un backup del DB prima della prima esecuzione.** Dettagli in [`e2e/README.md`](e2e/README.md).

## Prima / dopo

Numeri **ricalcolati dai tag** (worktree pulito per tag: `npm ci`, `npm run lint`, `npm test`, `npm run build`, `npm audit`; lato BE `dotnet build --no-incremental`, `dotnet test`; `git diff --shortstat v1-epicode <tag>`), non copiati dai report. Il FE ha solo i tag `v1-epicode` e `v2-m4` (tutte le sue modifiche sono M4), quindi nelle colonne intermedie non c'è una misura FE.

| | `v1-epicode` | `v2-m1` | `v2-m2` | `v2-m3` | `v2-m4-be` / FE `v2-m4` |
|---|---:|---:|---:|---:|---:|
| Test BE (xUnit) | 0 | 42 | 54 | 240 | **243** |
| Test FE (Vitest) | 0 | – | – | – | **93** (+ 8 flussi E2E) |
| Avvisi `dotnet build` (Release, da zero) | 114 | 112 | 110 | **0** | **0** |
| Lint FE (`npm run lint`) | 5 problemi (2 errori, 3 avvisi) | – | – | – | **0** |
| Avvisi build FE | 1 (chunk > 500 kB) | – | – | – | 1 (invariato) |
| `npm audit` FE | 16 (12 high, 2 moderate, 2 low) | – | – | – | **0** |
| CI | nessuna | build + test BE | idem | idem | BE: build + test; FE: lint + test + build |
| File `.cs` BE (tracciati) | 96 | 108 | 117 | 174 | 176 |
| File `.js/.jsx` FE in `src/` | 52 | – | – | – | 86 |
| Diff vs `v1-epicode` (BE) | – | 27 file, +1620 −12 | 41 file, +3520 −93 | 172 file, +14558 −1459 | 175 file, +14720 −1457 |
| Diff vs `v1-epicode` (FE) | – | – | – | – | 87 file, +8418 −1505 |

Note:

- Le righe di diff includono i test (gran parte dell'aumento). Componenti grandi: `ManageProductsComponent` 361 → 160 righe, `ProductInfo` 313 → 339 (non ancora spezzato).
- Gli 8 flussi E2E non sono rieseguiti per questa tabella: girano solo in locale. La CI non li esegue (servirebbe SQL Server nel runner).

Voci dell'audit FE chiuse in `v2-m4` (dettaglio in [`docs/AUDIT-prima.md`](docs/AUDIT-prima.md)): URL del backend hardcoded → `VITE_API_URL`; boilerplate `fetch` → `apiClient` unico (33 chiamate migrate); token duplicato in localStorage → uno solo nello slice `auth`, token scaduto non ripristinato; gestione 401 → logout; email nell'URL → route `/me`; zero test e nessuna CI → Vitest/MSW/Playwright e GitHub Actions; lint (2 errori → 0); `npm audit` (16 → 0); backoffice prodotti con paginazione dal server (`X-Total-Count`) e `expectedQuantity` (409 `stock_conflict`).
Le voci BE chiuse per tag (sicurezza, ordini, errori, query) sono nel [README del BE](https://github.com/Anacronistico00/VTInformatica#prima--dopo).

## Come ho lavorato con l'AI

Ho usato Claude Code per la maggior parte del codice. Il processo è cambiato nel tempo.

- **Audit iniziale come fonte di verità.** Prima di toccare codice ho fatto produrre e rivedere [`docs/AUDIT-prima.md`](docs/AUDIT-prima.md): problemi per gravità e metriche di partenza. La baseline non si riscrive. Ogni fetta aggiunge sotto una sezione di stato: chiuso, spostato, fuori scope.
- **Milestone e fette.** Dall'audit sono uscite le milestone (M0–M4), divise in fette piccole (per il FE M4a–M4g): un task, un branch, commit piccoli, PR verso `develop` a CI verde con "Rebase and merge", `main` solo a fine milestone con merge commit e tag annotato.
- **M1–M2: tutto approvato a mano, piani rivisti da un secondo modello.** Ogni azione dell'agente passava dalla mia approvazione. Ogni piano (`docs/PIANO-*.md`, per il FE [`docs/PIANO-M4.md`](docs/PIANO-M4.md)) lo rivedevo in una conversazione separata con un altro modello usato come reviewer, e solo dopo davo l'ok all'agente. La revisione ha prodotto correzioni concrete (lato BE):
  - **Drift del seed dei ruoli.** I ruoli erano seminati con `Guid.NewGuid()`: una nuova migration avrebbe cancellato e reinserito i ruoli, svuotando `AspNetUserRoles`. Scoperto prima di generare la migration. GUID fissi, uguali a quelli dei DB esistenti, più un test che confronta modello e snapshot.
  - **Test di concorrenza sbagliato.** Misurava lo stock dopo il rollback, quindi non provava che il decremento fosse atomico. Riscritto per verificare l'esito di due richieste in parallelo.
  - **Fette troppo grandi.** M3 era un blocco solo. L'ho divisa (a1, a2, b, c1, c2, d) perché ogni pezzo si potesse rivedere e annullare da solo.
  - **Route `/me` in parallelo.** Per portare l'identità nel token non ho rotto il FE: `/Cart/me` e `/Order/me` sono nate accanto alle route con `{email}`, che restano `[Obsolete]` finché il FE non è migrato. Il FE è passato alle route `/me` in M4.
- **Test-first con commit rosso → fix.** Per ogni falla o bug: prima un test che fallisce (commit `test: red - …`), poi il fix minimo. La storia git mostra le coppie, ad esempio `test(store): red - …` seguito da `fix(store): …`.
- **Verifica manuale delle migration su SQL Server** (lato BE). I test girano su SQLite, che non è SQL Server. Ogni migration: backup con `RESTORE VERIFYONLY`, `database update`, `Down` e `Up` su una copia con dati reali.
- **Da M3c: autonomia con deny list.** Quando regole e processo si sono stabilizzati, l'agente ha lavorato in autonomia dentro limiti espliciti. La deny list sta in `.claude/settings.json` (force push, `git reset --hard`, `git filter-repo`, `rm -rf`, lettura di `.env`, `.env.local` e dei segreti). Le regole di `CLAUDE.md` vietano push e merge diretti su `main` e `develop`: tutto passa da PR.
- **Gli E2E hanno trovato il crash della NavBar.** Era già annotato nell'audit iniziale, ma i test con rete simulata non lo riproducevano. Playwright contro BE e DB reali sì. Quando la persistenza scartava uno slice scaduto (token scaduto, carrello inattivo da oltre un'ora), `autoMergeLevel1` di redux-persist copiava `undefined` sullo stato iniziale e `state.auth` e `state.cart` erano `undefined` all'avvio. Corretto test-first: gli slice scartati tornano allo stato iniziale.

Cosa l'AI non ha sostituito: decidere cosa è in scope, verificare i numeri, provare le migration sul DB vero, leggere il diff prima del merge.

## Limiti noti e prossimi passi

Dall'audit (sezioni "fuori scope" e lavoro futuro):

- **Test su SQL Server reale in CI.** Gli E2E e la corsa reale sullo stock girano solo in locale: servono SQL Server nel runner (container `mssql` in GitHub Actions) o Testcontainers, come previsto per il BE.
- **SuperAdmin ed email.** Oggi gli admin si creano a mano via DB. Previsto lato BE: ruolo `SuperAdmin`, creazione admin con invito via email, "password dimenticata". Il FE non ha ancora una pagina di gestione admin.
- **Email → id.** Il FE usa già solo le route `/me`; nel BE restano le vecchie route con `{email}` come `[Obsolete]`, da rimuovere.
- **Cookie httpOnly.** Il token sta in localStorage (via redux-persist): un XSS può leggerlo. La soluzione è cookie httpOnly + refresh token, che richiede modifiche al BE. Al deploy va impostata una CSP come header HTTP (indicativamente `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; connect-src 'self' <VITE_API_URL>`).
- **Seller nel backoffice.** Il BE consente a `Seller` prodotti e categorie; il backoffice del FE è solo per `Admin`.
- **Componenti ancora grandi.** `ProductInfo` (339 righe) non è stato spezzato.

## Contatti

- 📧 viktoryturiaci2323@gmail.com
- 💼 [Vittorio Turiaci](https://www.linkedin.com/in/vittorio-turiaci-2646a9333/)
