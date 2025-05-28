<script>
  // Imports
  import { createTask, setTaskIdCounter } from './lib/tasks/taskModel.js';
  import { saveTasks, loadTasks, loadTaskCounter } from './lib/tasks/taskStorage.js';
  import {
    removeTaskById,
    toggleTaskById,
    getTaskStats,
    sortTasksByStatus
  } from './lib/tasks/taskUtils.js';
  import { processTaskInput } from './lib/validation/validateInput.js';
  import { getFriendlyDate } from './lib/date/formatDate.js';


  // State
  let tasks = [];
  let newTaskText = '';
  let validationMessage = '';
  let isValidInput = true;
  let isProcessing = false; // Aggiunto per prevenire click multipli

  // Reactive statements - Aggiunta protezione per evitare loop infiniti
  $: stats = tasks.length > 0 ? getTaskStats(tasks) : { total: 0, completed: 0, completionRate: 0 };
  $: sortedTasks = tasks.length > 0 ? sortTasksByStatus(tasks) : [];

  // Auto-save con debounce per evitare salvataggi eccessivi
  let saveTimeout;
  $: {
    if (tasks && tasks.length >= 0) { // Verifica che tasks sia definito
      // Cancella il timeout precedente
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      // Imposta un nuovo timeout per il salvataggio
      saveTimeout = setTimeout(() => {
        try {
          saveTasks(tasks);
        } catch (error) {
          console.error('Errore nel salvataggio dei task:', error);
        }
      }, 100); // Salva dopo 100ms di inattività
    }
  }

  // Initialize app
  function initializeApp() {
    try {
      const savedTasks = loadTasks();
      const savedCounter = loadTaskCounter();

      if (savedTasks && savedTasks.length > 0) {
        tasks = savedTasks;
        // Find the highest ID and set counter
        const maxId = Math.max(...savedTasks.map(t => t.id)) + 1;
        setTaskIdCounter(Math.max(maxId, savedCounter));
      } else {
        tasks = []; // Assicurati che tasks sia sempre un array
        setTaskIdCounter(savedCounter || 1);
      }
    } catch (error) {
      console.error('Errore nell\'inizializzazione:', error);
      tasks = [];
      setTaskIdCounter(1);
    }
  }

  // Add new task - Aggiunta protezione contro click multipli
  async function addTask() {
    // Previeni click multipli
    if (isProcessing || !newTaskText.trim()) {
      return;
    }

    isProcessing = true;

    try {
      const validation = processTaskInput(newTaskText, tasks);

      if (!validation.isValid) {
        validationMessage = validation.errors[0];
        isValidInput = false;
        return;
      }

      const newTask = createTask(validation.sanitizedText);

      // Usa una funzione per aggiornare tasks in modo sicuro
      tasks = [...tasks, newTask];

      // Reset form
      newTaskText = '';
      validationMessage = '';
      isValidInput = true;
    } catch (error) {
      console.error('Errore nell\'aggiunta del task:', error);
      validationMessage = 'Errore nell\'aggiunta del task';
      isValidInput = false;
    } finally {
      isProcessing = false;
    }
  }

  // Toggle task completion
  function toggleTask(id) {
    if (isProcessing) return;

    try {
      tasks = toggleTaskById(tasks, id);
    } catch (error) {
      console.error('Errore nel toggle del task:', error);
    }
  }

  // Delete task
  function deleteTask(id) {
    if (isProcessing) return;

    try {
      tasks = removeTaskById(tasks, id);
    } catch (error) {
      console.error('Errore nella cancellazione del task:', error);
    }
  }

  // Handle input changes - Aggiunto debounce per le validazioni
  let validationTimeout;
  function handleInputChange() {
    // Cancella il timeout precedente
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }

    if (newTaskText.trim() === '') {
      validationMessage = '';
      isValidInput = true;
      return;
    }

    // Debounce della validazione per evitare validazioni eccessive
    validationTimeout = setTimeout(() => {
      try {
        const validation = processTaskInput(newTaskText, tasks);
        validationMessage = validation.warnings[0] || '';
        isValidInput = validation.isValid;
      } catch (error) {
        console.error('Errore nella validazione:', error);
        validationMessage = 'Errore nella validazione';
        isValidInput = false;
      }
    }, 150); // Valida dopo 150ms di inattività
  }

  // Handle keyboard events
  function handleKeydown(event) {
    if (event.key === 'Enter' && !isProcessing) {
      event.preventDefault();
      addTask();
    }
  }

  // Cleanup timeouts quando il componente viene distrutto
  import { onDestroy } from 'svelte';
  onDestroy(() => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }
  });

  // Initialize when component mounts
  initializeApp();
</script>

<main class="container">
  <header class="app-header">
    <h1><i class="fas fa-clipboard-list"></i> To-Do List</h1>
  </header>

  <div class="input-container">
    <div class="input-wrapper">
      <input
              type="text"
              bind:value={newTaskText}
              on:input={handleInputChange}
              on:keydown={handleKeydown}
              placeholder="Aggiungi un nuovo task..."
              maxlength="100"
              class:error={!isValidInput}
              disabled={isProcessing}
      />
      {#if validationMessage}
        <div class="validation-message" class:error={!isValidInput}>
          {validationMessage}
        </div>
      {/if}
    </div>
    <button
            class="add-button"
            on:click={addTask}
            disabled={!isValidInput || !newTaskText.trim() || isProcessing}
            class:processing={isProcessing}
    >
      {#if isProcessing}
        <i class="fas fa-spinner fa-spin"></i>
      {:else}
        <i class="fas fa-plus"></i>
      {/if}
      <span class="button-text">
        {isProcessing ? 'Aggiunta...' : 'Aggiungi'}
      </span>
    </button>
  </div>

  <div class="task-counter">
    <span>{stats.total} task</span> •
    <span>{stats.completed} completati</span>
    {#if stats.total > 0}
      • <span>{stats.completionRate}% completato</span>
    {/if}
  </div>

  <div class="tasks-container">
    {#if tasks.length === 0}
      <div class="empty-state">
        <i class="fas fa-inbox"></i>
        <p>Nessun task ancora.<br>Inizia aggiungendo il tuo primo task!</p>
      </div>
    {:else}
      {#each sortedTasks as task (task.id)}
        <div class="task-item" class:completed={task.completed}>
          <div
                  class="task-checkbox"
                  class:checked={task.completed}
                  on:click={() => toggleTask(task.id)}
                  role="button"
                  tabindex="0"
                  on:keydown={(e) => e.key === 'Enter' && toggleTask(task.id)}
          >
            {#if task.completed}
              <i class="fas fa-check"></i>
            {/if}
          </div>

          <div class="task-content">
            <div class="task-text" class:completed={task.completed}>
              {task.text}
            </div>
            <div class="task-meta">
              Creato {getFriendlyDate(new Date(task.createdAt))}
            </div>
          </div>

          <button
                  class="delete-button"
                  on:click={() => deleteTask(task.id)}
                  title="Elimina task"
                  disabled={isProcessing}
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      {/each}
    {/if}
  </div>
</main>

<!-- Mantieni tutto il CSS originale, aggiungendo solo questi stili -->
<style>
  /* CSS Variables - Dark Theme Only */
  :global(:root) {
    --color-primary: #7c3aed;
    --color-primary-hover: #6d28d9;
    --color-primary-light: rgba(124, 58, 237, 0.15);
    --color-primary-shadow: rgba(124, 58, 237, 0.4);

    --color-secondary: #8b5cf6;
    --color-accent: #10b981;
    --color-accent-hover: #059669;
    --color-accent-surface: rgba(16, 185, 129, 0.15);
    --color-danger: #ef4444;
    --color-danger-hover: #dc2626;
    --color-warning: #f59e0b;
    --color-info: #3b82f6;

    --color-background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
    --color-surface: rgba(31, 41, 55, 0.95);
    --color-surface-hover: rgba(31, 41, 55, 1);
    --color-surface-alt: #374151;
    --color-surface-dark: #4b5563;

    --color-text: #f9fafb;
    --color-text-muted: #d1d5db;
    --color-text-light: #9ca3af;
    --color-border: #4b5563;
    --color-border-hover: #6b7280;

    --shadow-color: rgba(0, 0, 0, 0.3);
    --shadow-hover: rgba(0, 0, 0, 0.4);
    --backdrop-blur: blur(20px);

    --transition-smooth: all 0.3s ease;
  }

  /* Smooth transitions */
  :global(*) {
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: var(--color-background);
    min-height: 100vh;
    margin: 0;
    padding: 20px 10px;
    color: var(--color-text);
    transition: var(--transition-smooth);
    box-sizing: border-box;
  }

  .container {
    max-width: 700px;
    margin: 0 auto;
    background: var(--color-surface);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 20px 40px var(--shadow-color);
    backdrop-filter: var(--backdrop-blur);
    transition: var(--transition-smooth);
  }

  .container:hover {
    box-shadow: 0 25px 50px var(--shadow-hover);
  }

  .app-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
    padding: 0 5px;
  }

  h1 {
    margin: 0;
    font-size: 2em;
    background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
    text-align: center;
  }

  h1 i {
    margin-right: 10px;
  }

  .input-container {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    position: relative;
  }

  .input-wrapper {
    flex: 1;
    position: relative;
  }

  input[type="text"] {
    width: 100%;
    padding: 15px 20px;
    border: 2px solid var(--color-border);
    border-radius: 15px;
    font-size: 16px;
    transition: var(--transition-smooth);
    background: var(--color-surface-hover);
    outline: none;
    color: var(--color-text);
    box-sizing: border-box;
  }

  input[type="text"]:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px var(--color-primary-light);
    transform: translateY(-1px);
  }

  input[type="text"].error {
    border-color: var(--color-danger);
  }

  input[type="text"]::placeholder {
    color: var(--color-text-light);
  }

  .validation-message {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    padding: 5px 10px;
    font-size: 12px;
    color: var(--color-text-muted);
    background: var(--color-surface);
    border-radius: 5px;
    margin-top: 2px;
    z-index: 10;
    box-shadow: 0 2px 8px var(--shadow-color);
  }

  .validation-message.error {
    color: var(--color-danger);
    background: var(--color-surface-alt);
  }

  .add-button {
    padding: 15px 20px;
    background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
    color: white;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: var(--transition-smooth);
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .add-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px var(--color-primary-shadow);
  }

  .add-button:active {
    transform: translateY(0);
  }

  .add-button.processing {
    opacity: 0.7;
    cursor: wait;
  }

  .add-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .button-text {
    display: inline;
  }

  .task-counter {
    text-align: center;
    margin-bottom: 20px;
    color: var(--color-text-muted);
    font-size: 14px;
  }

  .tasks-container {
    max-height: 500px;
    overflow-y: auto;
    padding-right: 5px;
  }

  .tasks-container::-webkit-scrollbar {
    width: 6px;
  }

  .tasks-container::-webkit-scrollbar-track {
    background: var(--color-surface-alt);
    border-radius: 10px;
  }

  .tasks-container::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: 10px;
  }

  .tasks-container::-webkit-scrollbar-thumb:hover {
    background: var(--color-border-hover);
  }

  .task-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 15px 20px;
    margin-bottom: 10px;
    background: var(--color-surface-hover);
    border-radius: 15px;
    border: 2px solid var(--color-border);
    transition: var(--transition-smooth);
    animation: slideIn 0.5s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .task-item:hover {
    border-color: var(--color-primary);
    box-shadow: 0 5px 15px var(--color-primary-light);
    transform: translateY(-1px);
  }

  .task-item.completed {
    background: var(--color-surface-alt);
    opacity: 0.7;
    border-color: var(--color-accent);
  }

  .task-checkbox {
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-border);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-smooth);
    background: var(--color-surface-hover);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .task-checkbox.checked {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: white;
  }

  .task-checkbox:hover {
    border-color: var(--color-accent);
    transform: scale(1.1);
  }

  .task-content {
    flex: 1;
    min-width: 0;
  }

  .task-text {
    font-size: 16px;
    transition: var(--transition-smooth);
    word-wrap: break-word;
    word-break: break-word;
    margin-bottom: 4px;
    color: var(--color-text);
    line-height: 1.4;
  }

  .task-text.completed {
    text-decoration: line-through;
    color: var(--color-text-muted);
  }

  .task-meta {
    font-size: 12px;
    color: var(--color-text-light);
    opacity: 0.8;
  }

  .delete-button {
    background: var(--color-danger);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 8px 12px;
    cursor: pointer;
    transition: var(--transition-smooth);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .delete-button:hover:not(:disabled) {
    background: var(--color-danger-hover);
    transform: scale(1.1);
  }

  .delete-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--color-text-muted);
    font-size: 18px;
  }

  .empty-state i {
    font-size: 4em;
    margin-bottom: 20px;
    opacity: 0.3;
  }

  input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .fa-spin {
    animation: fa-spin 1s infinite linear;
  }

  @keyframes fa-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Media Queries */
  @media (max-width: 768px) {
    .container {
      margin: 10px;
      padding: 20px;
    }

    h1 {
      font-size: 1.8em;
    }

    .input-container {
      flex-direction: column;
    }

    .add-button {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 1.5em;
    }

    h1 i {
      display: none;
    }

    .add-button {
      padding: 12px 16px;
      font-size: 14px;
    }

    .button-text {
      display: none;
    }

    .container {
      padding: 15px;
    }

    .task-item {
      gap: 10px;
      padding: 12px 15px;
    }

    .delete-button {
      padding: 6px 10px;
      font-size: 12px;
    }
  }
</style>