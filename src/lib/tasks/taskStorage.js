// taskStorage.js - Gestione localStorage per i task

const TASKS_KEY = 'tasks';
const COUNTER_KEY = 'taskCounter';

/**
 * Salva i task nel localStorage
 * @param {Array} tasks - Array di task da salvare
 */
export function saveTasks(tasks) {
  try {
    console.log('💾 Salvando tasks nel localStorage...', tasks.length, 'tasks');
    const jsonData = JSON.stringify(tasks);
    localStorage.setItem(TASKS_KEY, jsonData);

    // Verifica che il salvataggio sia andato a buon fine
    const saved = localStorage.getItem(TASKS_KEY);
    if (saved) {
      console.log('✅ Tasks salvati con successo nel localStorage');
    } else {
      console.error('❌ Errore: Tasks non salvati nel localStorage');
    }
  } catch (error) {
    console.error('❌ Errore nel salvataggio dei tasks:', error);
    // In caso di errore, proviamo con una strategia alternativa
    try {
      // Fallback: prova a salvare come stringa semplice
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks || []));
    } catch (fallbackError) {
      console.error('❌ Anche il fallback è fallito:', fallbackError);
    }
  }
}

/**
 * Carica i task dal localStorage
 * @returns {Array} Array di task caricati
 */
export function loadTasks() {
  try {
    console.log('📥 Caricando tasks dal localStorage...');
    const jsonData = localStorage.getItem(TASKS_KEY);

    if (!jsonData) {
      console.log('📭 Nessun task trovato nel localStorage');
      return [];
    }

    const tasks = JSON.parse(jsonData);
    console.log('✅ Tasks caricati dal localStorage:', tasks.length, 'tasks');
    return Array.isArray(tasks) ? tasks : [];
  } catch (error) {
    console.error('❌ Errore nel caricamento dei tasks:', error);
    return [];
  }
}

/**
 * Salva il contatore degli ID nel localStorage
 * @param {number} counter - Valore del contatore da salvare
 */
export function saveTaskCounter(counter) {
  try {
    console.log('📊 Salvando contatore task:', counter);
    localStorage.setItem(COUNTER_KEY, counter.toString());
  } catch (error) {
    console.error('❌ Errore nel salvataggio del contatore:', error);
  }
}

/**
 * Carica il contatore degli ID dal localStorage
 * @returns {number} Valore del contatore caricato
 */
export function loadTaskCounter() {
  try {
    const saved = localStorage.getItem(COUNTER_KEY);
    const counter = saved ? parseInt(saved, 10) : 1;
    console.log('📊 Contatore task caricato:', counter);
    return counter;
  } catch (error) {
    console.error('❌ Errore nel caricamento del contatore:', error);
    return 1;
  }
}

/**
 * Cancella tutti i dati dal localStorage (per debug)
 */
export function clearAllData() {
  try {
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(COUNTER_KEY);
    console.log('🗑️ Tutti i dati sono stati cancellati dal localStorage');
  } catch (error) {
    console.error('❌ Errore nella cancellazione dei dati:', error);
  }
}

/**
 * Verifica lo stato del localStorage (per debug)
 * @returns {Object} Oggetto con info sullo stato del localStorage
 */
export function getStorageInfo() {
  try {
    const tasks = localStorage.getItem(TASKS_KEY);
    const counter = localStorage.getItem(COUNTER_KEY);

    return {
      tasksExists: !!tasks,
      tasksLength: tasks ? JSON.parse(tasks).length : 0,
      counter: counter ? parseInt(counter, 10) : null,
      storageSupported: typeof(Storage) !== "undefined"
    };
  } catch (error) {
    console.error('❌ Errore nella verifica dello storage:', error);
    return {
      tasksExists: false,
      tasksLength: 0,
      counter: null,
      storageSupported: false,
      error: error.message
    };
  }
}