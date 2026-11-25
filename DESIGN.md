---
version: 1
name: VT Informatica
description: >-
  Negozio di componenti e periferiche per PC. Riferimento di raffinatezza: il reparto vendita
  di Apple; di chiarezza: LDLC e Amazon per catalogo e scheda prodotto. Tono gaming premium ma
  professionale. Un solo accento blu, neutri caldi in chiaro e grafite in scuro, colori di stato
  solo per gli stati.

colors:
  light:
    bg: "#F5F5F7"
    surface: "#FFFFFF"
    surface-2: "#EDEDF0"
    text: "#1D1D1F"
    text-muted: "#5F5F64"
    border: "#D9D9DE"
    border-strong: "#8A8A90"
    accent: "#2F6BFF"
    accent-strong: "#2B62EB"
    accent-hover: "#2457D6"
    on-accent: "#FFFFFF"
    success: "#1E7F45"
    danger: "#C4291C"
    warning: "#8A5A00"
    media-bg: "#FFFFFF"
  dark:
    bg: "#0B0D10"
    surface: "#15181D"
    surface-2: "#1D2127"
    text: "#F5F5F7"
    text-muted: "#A1A1A6"
    border: "#2A2F37"
    border-strong: "#727985"
    accent: "#5B8CFF"
    accent-strong: "#5B8CFF"
    accent-hover: "#7CA3FF"
    on-accent: "#0B0D10"
    success: "#3DD07A"
    danger: "#FF6B5E"
    warning: "#F2B84B"
    media-bg: "#F5F5F7"

spacing: [4, 8, 12, 16, 24, 32, 48, 64, 96]

motion:
  fast: 120ms
  base: 200ms
  ease-out: "cubic-bezier(0.2, 0, 0, 1)"
---

# VT Informatica: design system

Fonte di verità del restyle. Il codice segue questo file; se una scelta cambia, cambia prima
qui. Gerarchia in caso di conflitto: brief del restyle > questo file > impeccable > taste.

## Perimetro

Il restyle cambia l'aspetto, non l'applicazione. Restano React-Bootstrap, struttura dei
componenti, rotte, logica e Redux. Gli strumenti sono quattro:

1. token come custom properties CSS sopra le variabili `--bs-*` di Bootstrap 5.3 (niente Sass);
2. un foglio di tema dedicato (`src/styles/`);
3. classi Bootstrap e poche classi nostre sul markup esistente;
4. testi dell'interfaccia rivisti solo dove sono maiuscoli o ambigui, mai i messaggi mappati
   dai `code` dell'API.

## Colori

I valori sono nel frontmatter. Regole d'uso:

- **Accento.** `accent` (#2F6BFF / #5B8CFF) è il colore del marchio: anelli di focus, bordi
  attivi, indicatori, icone, testo grande. Il testo normale e i riempimenti con testo usano
  `accent-strong`. In chiaro il bianco su #2F6BFF arriva a 4,4988:1, sotto la soglia AA di
  4,5:1; #2B62EB è l'8% più scuro e porta il bianco a 5,19:1 e il testo sul fondo a 4,76:1. In
  scuro #5B8CFF va bene come testo (6,15:1 sul fondo), ma il bottone pieno usa testo scuro
  (`on-accent` #0B0D10, 6,15:1): il bianco arriverebbe a 3,16:1.
- **Stato.** `success`, `danger`, `warning` solo per stati: disponibilità, errori, ordine
  annullato, badge del carrello. Mai come decorazione o come colore di sezione.
- **Superfici.** `bg` è il fondo pagina, `surface` le card e i pannelli, `surface-2` campi in
  sola lettura, righe alterne, hover.
- **Pozzetto immagini.** Foto prodotto e loghi dei brand stanno su `media-bg`, chiaro anche in
  scuro: sono fatti per un fondo bianco, e un logo nero (AMD, Corsair) su grafite sparisce.
- **Bordi.** `border` separa superfici (decorativo). I bordi che identificano un controllo
  (campi, bottoni a contorno, stepper) usano `border-strong`: almeno 3:1 (WCAG 1.4.11),
  3,43 su `surface` in chiaro e 4,06 in scuro.
- **Niente gradienti** su fondi, testi o bottoni. Niente viola.

Contrasti verificati (WCAG 2.1, testo normale ≥ 4,5:1):

| Coppia                         | Chiaro | Scuro |
| ------------------------------ | -----: | ----: |
| `text` su `bg`                 |  15,46 | 17,87 |
| `text` su `surface`            |  16,83 | 16,34 |
| `text-muted` su `bg`           |   5,83 |  7,56 |
| `text-muted` su `surface`      |   6,35 |  6,92 |
| `accent-strong` su `bg`        |   4,76 |  6,15 |
| `on-accent` su `accent-strong` |   5,19 |  6,15 |
| `success` su `surface`         |   5,03 |  8,90 |
| `danger` su `surface`          |   5,70 |  6,37 |
| `warning` su `surface`         |   5,93 |  9,94 |

## Tema chiaro e scuro

- Attributo `data-bs-theme` su `<html>` (color modes di Bootstrap 5.3).
- Preferenza dell'utente in `localStorage`, chiave `vt-theme`: `auto` (predefinito), `light`,
  `dark`. Fuori da Redux Persist, che scade dopo un'ora.
- `public/theme-init.js`, script esterno e bloccante nel `<head>`, applica il tema prima del
  primo paint: niente lampo bianco in scuro. Esterno e non inline, così una CSP con
  `script-src 'self'` lo ammette.
- In `auto` il tema segue `prefers-color-scheme` anche mentre la pagina è aperta.
- Selettore nella barra: Auto / Chiaro / Scuro.

## Tipografia

- Font self-hosted con `@fontsource-variable`, solo subset latin. Nessun CDN.
- Corpo 16px, interlinea 1,5. Misura del testo lungo 65–75 caratteri.
- Prezzi e quantità con cifre tabellari (`font-variant-numeric: tabular-nums`).
- Titoli in minuscolo con iniziale maiuscola. Il maiuscolo, dove serve, lo applica il CSS
  (`text-transform`): il nome accessibile resta leggibile.
- Scala, famiglia e pesi dipendono dalla direzione scelta (sezione Direzioni).

## Spaziature e layout

- Scala a base 4: 4, 8, 12, 16, 24, 32, 48, 64, 96 px.
- Gruppi stretti, separazioni ampie: più spazio sopra un titolo che sotto.
- Container di Bootstrap; bordi sinistro e destro allineati in ogni sezione.
- Breakpoint di Bootstrap. A 390 px una colonna, bersagli tattili di almeno 44 px.

## Componenti

- **Barra.** Logo, ricerca, account, carrello (badge col numero di articoli), admin se il
  ruolo lo prevede, selettore del tema. Seconda riga con le categorie su desktop, menu a
  comparsa su mobile.
- **Card prodotto.** Immagine sul pozzetto `media-bg` con `object-fit: contain`, nome su due
  righe al massimo, prezzo tabellare in evidenza.
  Un solo stile di card in tutto il sito.
- **Bottoni.** Primario pieno `accent-strong`, secondario a contorno. Un bottone primario per
  schermata. Stati: hover, premuto, disabilitato, focus visibile.
- **Campi.** Etichetta visibile sopra il campo, errore sotto il proprio campo.
- **Scheda prodotto.** Galleria a sinistra, a destra nome, marca, prezzo, disponibilità
  (colore di stato), quantità e "Aggiungi al carrello". Sotto: descrizione, correlati,
  recensioni.
- **Superfici del browser.** Selezione del testo, anello di focus, caret e barre di
  scorrimento prendono i colori dal tema.

## Movimento

- Framer Motion, già presente. `MotionConfig reducedMotion="user"` alla radice.
- Durate 120 ms (hover) e 200 ms (comparsa), uscita `cubic-bezier(0.2, 0, 0, 1)`.
- Hover: una card collegata sale di 2 px; nessuna inclinazione, nessuna comparsa allo scroll.
- Con `prefers-reduced-motion: reduce` niente transizioni: tutto resta visibile.

## Accessibilità

- WCAG 2.1 AA ovunque, in chiaro e in scuro.
- `@axe-core/playwright` senza violazioni serious o critical sulle pagine toccate.
- Focus sempre visibile (anello `accent`, 2 px, distanza 2 px).
- Ogni controllo ha un nome; ogni immagine un `alt`; titoli in ordine.

## Direzioni

Tre direzioni applicate solo a layout, home e scheda prodotto, sui branch `design/dir-a`,
`design/dir-b`, `design/dir-c`. Colori, tema, movimento e accessibilità sono comuni; cambiano
tipografia, densità, card e barra. Dopo la scelta, questa sezione tiene solo la direzione
scelta.

| Asse       | A · Vetrina                            | B · Catalogo                                 | C · Arena                                           |
| ---------- | -------------------------------------- | -------------------------------------------- | --------------------------------------------------- |
| Font       | Geist, titoli 600 con tracking -0,02em | Inter, pesi 400–700, titoli compatti         | Archivo, titoli larghi (wdth 112) in maiuscolo      |
| Densità    | Ariosa: sezioni a 64–96 px             | Compatta: sezioni a 32–48 px, griglia a 12 px | Media: sezioni a 48–64 px                           |
| Card       | Senza bordo, raggio 20, ombra morbida  | Bordo sottile, raggio 8, nessuna ombra       | Superficie rialzata, raggio 14, bordo che si accende |
| Barra      | Chiara su `surface`, ricerca a pillola | Fascia scura in entrambi i temi              | Fascia grafite in entrambi i temi, indicatore blu   |

## Da fare e da non fare

Da fare: un accento, superfici neutre, prodotto grande, prezzo leggibile, stato con colore e
testo insieme.

Da non fare: gradienti, testo in gradiente, vetro e sfocature decorative, ombre a blocco senza
sfocatura, barre colorate su un solo lato di una card, emoji al posto delle icone, etichette
sopra i titoli, effetti che si muovono durante lo scroll.

## Lacune note

- `VT.svg` pesa 9 MB e il percorso relativo si rompe fuori dalla home: si sistemano nella
  fetta layout.
- Icone `bootstrap-icons` da CDN in `index.html`: vanno self-hosted come i font.
- Logo ASUS: URL rotto nei dati, non nel FE.
