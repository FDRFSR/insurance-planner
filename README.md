# 📝 Modern To-Do List

Una to-do list elegante e moderna con interfaccia grafica accattivante, costruita con Svelte, TypeScript e Vite.

![Modern To-Do List](https://img.shields.io/badge/Status-Completed-brightgreen) ![Svelte](https://img.shields.io/badge/Svelte-FF3E00?logo=svelte&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

## ✨ Caratteristiche

- **Design Moderno**: Interfaccia glassmorphism con gradiente di sfondo
- **Animazioni Fluide**: Transizioni smooth per ogni interazione
- **Responsive**: Completamente ottimizzata per dispositivi mobili
- **Contatori Dinamici**: Tracciamento dei task totali e completati
- **Stato Vuoto**: Messaggio incoraggiante quando non ci sono task
- **Icone FontAwesome**: Interfaccia visivamente accattivante
- **Feedback Visivo**: Hover effects e animazioni per ogni azione

## 🚀 Demo

Dopo aver installato le dipendenze e avviato il server di sviluppo, l'applicazione sarà disponibile su `http://localhost:5173`

## 🎨 Caratteristiche UI/UX

### Design Visivo
- Sfondo con gradiente blu-viola
- Card con effetto glassmorphism e ombre dinamiche
- Palette di colori coerente (blu per azioni, verde per completati, rosso per eliminazione)
- Typography elegante con font Segoe UI

### Animazioni
- **Slide-in**: Nuovi task appaiono con animazione fluida
- **Slide-out**: Task eliminati scompaiono con transizione
- **Hover Effects**: Pulsanti e elementi interattivi con effetti al passaggio del mouse
- **Scale Effects**: Checkbox e pulsanti con effetto zoom

### Responsive Design
- Layout adattivo per schermi di tutte le dimensioni
- Input e pulsanti ottimizzati per dispositivi touch
- Scrollbar personalizzata per lista task lunga

## 🛠️ Tecnologie Utilizzate

- **Svelte**: Framework JavaScript moderno e reattivo
- **TypeScript**: Superset tipizzato di JavaScript
- **Vite**: Build tool veloce per sviluppo e produzione
- **HTML5**: Struttura semantica
- **CSS3**: Styling avanzato con Flexbox, animazioni e transizioni
- **Font Awesome 6**: Libreria di icone

## 📱 Funzionalità

### Gestione Task
- ✅ **Aggiungi Task**: Inserisci un nuovo task tramite input o premendo Invio
- ✅ **Completa Task**: Clicca sul checkbox circolare per segnare come completato
- ✅ **Elimina Task**: Rimuovi task con animazione di uscita
- ✅ **Contatori**: Visualizza numero di task totali e completati

### Controlli
- Input con placeholder e validazione
- Limite di 100 caratteri per task
- Gestione dello stato vuoto
- Prevenzione di task vuoti

## 🏗️ Struttura del Progetto

```
modern-todo-list/
│
├── index.html              # File principale HTML
├── package.json            # Dipendenze e script npm
├── package-lock.json       # Lock file delle dipendenze
├── README.md               # Documentazione del progetto
├── vite.config.ts          # Configurazione Vite
├── svelte.config.js        # Configurazione Svelte
├── tsconfig.json           # Configurazione TypeScript
├── tsconfig.app.json       # Config TypeScript per l'app
├── tsconfig.node.json      # Config TypeScript per Node
├── node_modules/           # Dipendenze installate
├── public/                 # Asset statici
└── src/                    # Codice sorgente dell'applicazione
```

## 🚀 Come Usare

1. **Clona il repository**:
   ```bash
   git clone https://github.com/FDRFSR/modern-todo-list.git
   ```

2. **Naviga nella cartella**:
   ```bash
   cd modern-todo-list
   ```

3. **Installa le dipendenze**:
   ```bash
   npm install
   ```

4. **Avvia il server di sviluppo**:
   ```bash
   npm run dev
   ```

5. **Apri nel browser**:
   L'applicazione sarà disponibile su `http://localhost:5173`

### Build per produzione

```bash
npm run build
```

### Preview della build

```bash
npm run preview
```

## 💡 Funzionalità Future

- [ ] Persistenza dati con localStorage
- [ ] Categorizzazione dei task
- [ ] Date di scadenza
- [ ] Ricerca e filtri
- [ ] Modalità dark/light
- [ ] Sincronizzazione cloud
- [ ] Notifiche desktop
- [ ] Drag & drop per riordinare

## 🤝 Contribuire

I contributi sono benvenuti! Se vuoi migliorare il progetto:

1. Fai un fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/nuova-feature`)
3. Committa le modifiche (`git commit -am 'Aggiunge nuova feature'`)
4. Pusha sul branch (`git push origin feature/nuova-feature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per maggiori dettagli.

## 👨‍💻 Autore

**Il Tuo Nome**
- GitHub: [@FDRFSR](https://github.com/FDRFSR)
- Email: f.fusarri at gmail.com

## 🙏 Ringraziamenti

- [Font Awesome](https://fontawesome.com/) per le icone
- Ispirazione dal design moderno delle app mobile

---

⭐ **Se ti è piaciuto questo progetto, lascia una stella!** ⭐