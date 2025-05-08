# 🖥️ VT Informatica

**VT Informatica FE** è il front-end ufficiale del progetto VT Informatica, una piattaforma di e-shop moderna e reattiva progettata per offrire un'esperienza utente fluida e intuitiva.

## Qui il link per il backend
- [Link alla repo del BackEnd](https://github.com/Anacronistico00/VTInformatica)
## 🚀 Tecnologie Utilizzate

- **React 19**: Per la creazione di interfacce utente moderne e performanti.
- **React Router DOM 7**: Per la gestione delle rotte e della navigazione.
- **Redux Toolkit & React Redux**: Per una gestione centralizzata e scalabile dello stato.
- **Redux Persist**: Per mantenere lo stato dell'app salvato tra le sessioni.
- **React Bootstrap & Bootstrap 5**: Per uno stile responsive con componenti predefiniti.
- **React Icons**: Per l'integrazione di icone moderne e vettoriali.
- **React Toastify**: Per la gestione di notifiche toast personalizzabili.
- **Framer Motion**: Per animazioni fluide e interazioni visive accattivanti.

## 🛠️ Installazione

1. Clona la repository:
   ```bash
   git clone https://github.com/Anacronistico00/vtinformatica_fe.git
   ```
   
2. Naviga nella directory del progetto
   ```bash
   cd vtinformatica_fe
   ```
   
3. Installa le dipendenze
   ```bash
   npm i
   ```
4. Clonare anche la repository del BackEnd
   ```bash
   git clone https://github.com/Anacronistico00/VTInformatica.git
   ```
   
5. Troverete all'interno un file 'DatabaseScript'. Copiare il contenuto e incollarlo su SQL Server Management Studio, eseguire la query e minimizzare la pagina, non ci servirà più.
   
6. Aprire il file .sln della repo BE
   
7. **Modifica e sostuisci la stringa di connessione nell' appsettings.json**
   "ConnectionStrings": {
  "DefaultConnection": "Server=TUO_SERVER;Database=NomeDatabase;Trusted_Connection=True;MultipleActiveResultSets=true"
}
   
8. Avviare l'applicazione(Lato frontEnd)
   ```bash
   npm run dev
   ~~SHIFT+CLICK sull'URL che appare nella finestra di comando~~
   ```
   L'app sarà disponibile in una porta del localHost
   
## Struttura del progetto
```plaintext
vtinformatica_fe/
├── public/
│   └── images
├── src/
│   ├── components/
│   ├── redux/
│   ├── utils/
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```


## 📬 Contatti

- 📧 Email: viktoryturiaci2323@gmail.com
- 💼 LinkedIn: [Vittorio Turiaci](https://www.linkedin.com/in/vittorio-turiaci-2646a9333/)
