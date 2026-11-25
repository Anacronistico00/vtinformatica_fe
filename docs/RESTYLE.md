# Restyle

Cambio d'aspetto del FE: tema sopra React-Bootstrap, tema chiaro e scuro, font self-hosted.
Struttura, rotte, logica e Redux restano quelli di prima. La fonte di verità è
[`DESIGN.md`](../DESIGN.md).

## Screenshot

Le foto escono da `npm run screenshots` (vedi [`e2e/README.md`](../e2e/README.md)), con gli
stessi dati di seed degli E2E:

- `docs/restyle/before/`: prima del restyle, tema chiaro;
- `docs/restyle/directions/`: le tre direzioni proposte, solo layout, home e scheda prodotto;
- `docs/restyle/after/`: dopo il restyle, tema chiaro e scuro.

Data e numero dell'ordine cambiano a ogni esecuzione: il setup crea un ordine nuovo ogni
volta. Nel confronto prima/dopo contano layout, colori e tipografia, non quei due valori.
