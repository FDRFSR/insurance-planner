# 📅 Weekly Planner CLI-Style

Un planner settimanale minimalista con stile CLI, perfetto per organizzare le tue attività con un sistema di tag avanzato.

![Demo](https://img.shields.io/badge/demo-live-brightgreen) ![Version](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Caratteristiche

- **🎯 Sistema di tag doppio**: Categorizza le attività per tipo e urgenza
- **📱 Responsive Design**: Funziona perfettamente su desktop e mobile  
- **⚡ CLI-Style**: Design minimalista ispirato ai terminali
- **🔄 Aggiornamento automatico**: La settimana si aggiorna automaticamente
- **💾 Persistenza dati**: I dati vengono salvati automaticamente (localStorage)
- **🌟 UX fluida**: Transizioni smooth e feedback visivi

## 🏷️ Sistema di Tag

### Categoria (Tipo di attività)
- **📋 Task** - Attività generiche
- **📞 Call** - Chiamate da effettuare  
- **💰 Quote** - Preventivi e offerte
- **⚠️ Claims** - Reclami e pratiche urgenti

### Urgenza (Priorità)
- **🟢 Bassa** - Non urgente
- **🟡 Media** - Priorità normale
- **🔴 Alta** - Urgente e importante

## 🚀 Come usare

1. **Seleziona la categoria** dal primo menu a tendina
2. **Scegli il livello di urgenza** dal secondo menu
3. **Scrivi l'attività** nel campo di testo
4. **Premi Invio** per aggiungere
5. **Click sulla checkbox** per marcare come completata
6. **Click sulla ✕** per eliminare

## 📦 Installazione

### Opzione 1: Download diretto
```bash
git clone https://github.com/tuousername/weekly-planner-cli.git
cd weekly-planner-cli
# Apri index.html nel browser
```

### Opzione 2: Hosting locale
```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx serve .

# Visita http://localhost:8000
```

## 🛠️ Tecnologie utilizzate

- **HTML5** - Struttura semantica
- **CSS3** - Styling moderno con transizioni
- **Vanilla JavaScript** - Logica dell'applicazione
- **LocalStorage API** - Persistenza dei dati
- **Responsive Design** - Compatibilità mobile

## 📱 Compatibilità

- ✅ Chrome/Chromium 70+
- ✅ Firefox 65+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Personalizzazione

### Aggiungere nuove categorie
Modifica l'array delle categorie nel JavaScript:

```javascript
// Nel codice, cerca la sezione delle categorie
const categories = {
    'meeting': '🤝 Meeting',
    'email': '📧 Email',
    // Aggiungi le tue categorie
};
```

### Modificare i colori
I colori dei tag sono definiti nel CSS:

```css
.category-nuova {
    background-color: #tuo-colore;
    color: #tuo-testo;
    border: 1px solid #tuo-bordo;
}
```

## 🤝 Contribuire

I contributi sono benvenuti! Per contribuire:

1. Fork del progetto
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push del branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

### 🐛 Bug Reports

Se trovi un bug, apri una [issue](https://github.com/tuousername/weekly-planner-cli/issues) includendo:

- Descrizione del problema
- Passi per riprodurlo
- Browser e versione
- Screenshots se possibile

### 💡 Feature Requests

Per nuove funzionalità, apri una [issue](https://github.com/tuousername/weekly-planner-cli/issues) con:

- Descrizione della funzionalità
- Caso d'uso
- Mockup/esempi se disponibili

## 📝 Roadmap

- [ ] Export/Import dati (JSON, CSV)
- [ ] Temi personalizzabili (dark mode)
- [ ] Notifiche browser
- [ ] Sincronizzazione cloud
- [ ] Statistiche settimanali
- [ ] Drag & drop per riordinare
- [ ] PWA (Progressive Web App)

## 📄 Licenza

Distribuito sotto licenza MIT. Vedi `LICENSE` per maggiori informazioni.

## 👨‍💻 Autore

**Il tuo nome**
- GitHub: [@tuousername](https://github.com/tuousername)
- Email: tua-email@esempio.com

## 🙏 Ringraziamenti

- Ispirato dal design CLI/terminale
- Font Courier New per l'estetica retro
- Community open source per feedback e contributi

---

### ⭐ Se ti è piaciuto questo progetto, lascia una stella!

Made with ❤️ and ☕
