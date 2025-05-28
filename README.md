# 🏢 Dashboard Assicurativa

Una **dashboard professionale per il settore assicurativo** sviluppata in Svelte, che combina la gestione di attività quotidiane con analytics avanzate e funzionalità specifiche per agenti e broker assicurativi.

## ✨ Caratteristiche Principali

### 📊 **Dashboard Analytics**
- **5 KPI Cards** con metriche in tempo reale
- **Analisi per categoria** con progress bar animate
- **Attività recenti** con indicatori di stato
- **Statistiche di completamento** per ogni tipologia

### 🛡️ **Categorie Assicurative Specifiche**
- **Polizze** 🛡️ - Gestione contratti assicurativi
- **Sinistri** ⚠️ - Pratiche di risarcimento e liquidazioni
- **Rinnovi** 🔄 - Scadenze e rinnovi polizze
- **Preventivi** 💰 - Quotazioni e offerte commerciali
- **Controlli** 📋 - Verifiche documentali e audit
- **Clienti** 👥 - Gestione relazioni e follow-up

### 🎯 **Sistema di Priorità Intelligente**
- **Alta** (🔴) - Attività urgenti e scadenze critiche
- **Media** (🟡) - Attività standard da completare
- **Bassa** (🟢) - Attività di routine e follow-up

### 📅 **Gestione Avanzata Scadenze**
- **Alert automatici** per attività scadute
- **Campo cliente** per collegare attività a specifici assicurati
- **Date di scadenza** con indicatori visivi
- **Ordinamento intelligente** per priorità e urgenza

## 🚀 Funzionalità Tecniche

### ⚡ **Ottimizzazioni Prestazionali**
- **Debounce** per salvataggio automatico e validazione
- **Protezione anti-freeze** browser
- **Gestione errori** completa
- **Cleanup automatico** di timeout e listener

### 🎨 **Design Moderno**
- **Tema scuro** elegante e professionale
- **Animazioni fluide** per interazioni
- **Design responsive** per desktop e mobile
- **Componenti glassmorphism** con backdrop blur

### 💾 **Persistenza Dati**
- **Local Storage** per mantenere dati tra sessioni
- **Auto-save** con debounce per evitare sovraccarichi
- **Backup automatico** delle attività
- **Ripristino** dati in caso di errori

## 🏗️ Installazione e Setup

### Prerequisiti
```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

### Installazione
```bash
# Clona il repository
git clone https://github.com/tuo-username/dashboard-assicurativa.git

# Entra nella directory del progetto
cd dashboard-assicurativa

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

### Build per Produzione
```bash
# Crea la build ottimizzata
npm run build

# Avvia l'anteprima della build
npm run preview
```

## 📁 Struttura del Progetto

```
src/
├── App.svelte                 # Componente principale con dashboard
├── lib/
│   ├── components/
│   │   └── ThemeToggle.svelte # Componente toggle tema (se necessario)
│   ├── tasks/
│   │   ├── taskModel.js       # Modello dati task
│   │   ├── taskStorage.js     # Gestione localStorage
│   │   └── taskUtils.js       # Utilità per manipolazione task
│   ├── validation/
│   │   └── validateInput.js   # Validazione input utente
│   └── date/
│       └── formatDate.js      # Formattazione date
├── stores/                    # Store Svelte per stato globale
└── main.js                    # Entry point applicazione
```

## 🎮 Come Utilizzare

### 1. **Vista Dashboard**
- Visualizza **metriche aggregate** di tutte le attività
- Monitora **statistiche per categoria** con progress bar
- Controlla **attività recenti** e il loro stato
- Identifica rapidamente **attività urgenti e scadute**

### 2. **Gestione Attività**
- **Aggiungi nuove attività** con categoria, priorità, cliente e scadenza
- **Completa attività** con un semplice click
- **Elimina attività** non più necessarie
- **Visualizza dettagli completi** per ogni attività

### 3. **Funzionalità Avanzate**
- **Filtraggio automatico** per priorità e scadenze
- **Ordinamento intelligente** delle attività
- **Indicatori visivi** per stato e urgenza
- **Validazione input** in tempo reale

## 📊 Metriche Monitorate

| Metrica | Descrizione |
|---------|-------------|
| **Totale Attività** | Numero complessivo di attività nel sistema |
| **Completate** | Attività portate a termine con successo |
| **In Sospeso** | Attività ancora da completare |
| **Urgenti** | Attività con priorità alta non completate |
| **Scadute** | Attività con data di scadenza superata |

## 🛠️ Tecnologie Utilizzate

- **[Svelte](https://svelte.dev/)** - Framework frontend reattivo
- **[Vite](https://vitejs.dev/)** - Build tool veloce
- **CSS3** - Styling moderno con variabili e animazioni
- **LocalStorage API** - Persistenza dati lato client
- **JavaScript ES6+** - Logica applicazione moderna

## 🎨 Sistema di Design

### Palette Colori (Tema Scuro)
```css
--color-primary: #7c3aed     /* Viola principale */
--color-secondary: #8b5cf6   /* Viola secondario */
--color-accent: #10b981      /* Verde accento */
--color-danger: #ef4444      /* Rosso pericolo */
--color-warning: #f59e0b     /* Giallo avviso */
--color-info: #3b82f6        /* Blu informazioni */
```

### Tipografia
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Font Weights**: 400 (normale), 500 (medium), 600 (semi-bold), 700 (bold)

## 🔧 Configurazione Avanzata

### Personalizzazione Categorie
Per aggiungere nuove categorie assicurative, modifica l'oggetto `categories` in `App.svelte`:

```javascript
const categories = {
  tuaCategoria: { 
    name: 'Nome Categoria', 
    icon: '🔍', 
    color: '#hexcolor' 
  }
};
```

### Personalizzazione Priorità
Per modificare i livelli di priorità:

```javascript
const priorities = {
  tuaPriorita: { 
    name: 'Nome Priorità', 
    color: '#hexcolor', 
    urgency: 4 
  }
};
```

## 🐛 Risoluzione Problemi

### Problemi Comuni

**Q: L'applicazione non salva i dati**
A: Verifica che il browser supporti localStorage e che non sia in modalità privata.

**Q: Le animazioni sono lente**
A: Controlla le prestazioni del browser e disabilita temporaneamente le animazioni CSS.

**Q: I dati non si caricano all'avvio**
A: Verifica la console per errori JavaScript e controlla l'integrità dei dati in localStorage.

### Debug Mode
Per attivare il debug mode, aggiungi alla console:
```javascript
localStorage.setItem('debug', 'true');
```

## 🤝 Contribuire

1. **Fork** il progetto
2. **Crea** un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** le modifiche (`git commit -m 'Add some AmazingFeature'`)
4. **Push** al branch (`git push origin feature/AmazingFeature`)
5. **Apri** una Pull Request

### Linee Guida Contribuzione
- Mantieni lo **stile di codice** consistente
- Aggiungi **test** per nuove funzionalità
- Aggiorna la **documentazione** quando necessario
- Segui i **conventional commits** per i messaggi

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## 📞 Contatti

**Sviluppatore**: 
- **Email**: iscrizioni.fusarri at gmail.com
- **LinkedIn**: [Il Tuo Profilo](https://linkedin.com/in/federico-fusarri)
- **GitHub**: [@tuo-username](https://github.com/FDRFSR)

---

**💡 Suggerimento**: Per un'esperienza ottimale, utilizza la dashboard su schermo grande per visualizzare tutte le metriche contemporaneamente.

**🚀 Prossime Funzionalità**:
- Export dati in Excel/PDF
- Integrazione calendario
- Notifiche push
- Modalità collaborativa multi-utente