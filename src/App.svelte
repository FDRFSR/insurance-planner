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
  import ThemeToggle from './lib/components/ThemeToggle.svelte';

  // State
  let tasks = [];
  let newTaskText = '';
  let validationMessage = '';
  let isValidInput = true;

  // Reactive statements
  $: stats = getTaskStats(tasks);
  $: sortedTasks = sortTasksByStatus(tasks);
  $: {
    // Auto-save tasks whenever they change
    if (tasks.length >= 0) {
      saveTasks(tasks);
    }
  }

  // Initialize app
  function initializeApp() {
    const savedTasks = loadTasks();
    const savedCounter = loadTaskCounter();
    
    if (savedTasks.length > 0) {
      tasks = savedTasks;
      // Find the highest ID and set counter
      const maxId = Math.max(...savedTasks.map(t => t.id)) + 1;
      setTaskIdCounter(Math.max(maxId, savedCounter));
    } else {
      setTaskIdCounter(savedCounter);
    }
  }

  // Add new task
  function addTask() {
    const validation = processTaskInput(newTaskText, tasks);
    
    if (!validation.isValid) {
      validationMessage = validation.errors[0];
      isValidInput = false;
      return;
    }

    const newTask = createTask(validation.sanitizedText);
    tasks = [...tasks, newTask];
    newTaskText = '';
    validationMessage = '';
    isValidInput = true;
  }

  // Toggle task completion
  function toggleTask(id) {
    tasks = toggleTaskById(tasks, id);
  }

  // Delete task
  function deleteTask(id) {
    tasks = removeTaskById(tasks, id);
  }

  // Handle input changes
  function handleInputChange() {
    if (newTaskText.trim() === '') {
      validationMessage = '';
      isValidInput = true;
      return;
    }

    const validation = processTaskInput(newTaskText, tasks);
    validationMessage = validation.warnings[0] || '';
    isValidInput = validation.isValid;
  }

  // Handle keyboard events
  function handleKeydown(event) {
    if (event.key === 'Enter') {
      addTask();
    }
  }

  // Initialize when component mounts
  initializeApp();
</script>

<main class="container">
  <header class="app-header">
    <h1><i class="fas fa-clipboard-list"></i> To-Do List</h1>
    <div class="header-controls">
      <ThemeToggle size="medium" style="cycle" showLabel={false} />
    </div>
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
      />
      {#if validationMessage}
        <div class="validation-message" class:error={!isValidInput}>
          {validationMessage}
        </div>
      {/if}
    </div>
    <button class="add-button" on:click={addTask} disabled={!isValidInput || !newTaskText.trim()}>
      <i class="fas fa-plus"></i>
      Aggiungi
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
          >
            <i class="fas fa-trash"></i>
          </button>
        </div>
      {/each}
    {/if}
  </div>
</main>

<style>
  /* CSS Variables for Theme System */
  :global(:root) {
    /* Light Theme (Default) */
    --color-primary: #667eea;
    --color-primary-hover: #5a6fd8;
    --color-primary-light: rgba(102, 126, 234, 0.1);
    --color-primary-shadow: rgba(102, 126, 234, 0.3);
    
    --color-secondary: #764ba2;
    --color-accent: #28a745;
    --color-accent-hover: #218838;
    --color-accent-surface: rgba(40, 167, 69, 0.1);
    --color-danger: #dc3545;
    --color-danger-hover: #c82333;
    --color-warning: #ffc107;
    --color-info: #17a2b8;
    
    --color-background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --color-surface: rgba(255, 255, 255, 0.95);
    --color-surface-hover: rgba(255, 255, 255, 1);
    --color-surface-alt: #f8f9fa;
    --color-surface-dark: #e9ecef;
    
    --color-text: #333;
    --color-text-muted: #6c757d;
    --color-text-light: #adb5bd;
    --color-border: #e0e0e0;
    --color-border-hover: #d0d0d0;
    
    --shadow-color: rgba(0, 0, 0, 0.1);
    --shadow-hover: rgba(0, 0, 0, 0.15);
    --backdrop-blur: blur(10px);
    
    --transition-theme: all 0.3s ease;
  }

  /* Dark Theme */
  :global([data-theme="dark"]) {
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
  }

  /* Smooth theme transitions */
  :global(*) {
    transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: var(--color-background);
    min-height: 100vh;
    margin: 0;
    padding: 20px;
    color: var(--color-text);
    transition: var(--transition-theme);
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
    background: var(--color-surface);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 20px 40px var(--shadow-color);
    backdrop-filter: var(--backdrop-blur);
    transition: var(--transition-theme);
  }

  .container:hover {
    box-shadow: 0 25px 50px var(--shadow-hover);
  }

  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    gap: 20px;
  }

  .header-controls {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  h1 {
    margin: 0;
    font-size: 2.2em;
    background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
    flex: 1;
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
    transition: var(--transition-theme);
    background: var(--color-surface-hover);
    outline: none;
    color: var(--color-text);
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
    padding: 15px 25px;
    background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
    color: white;
    border: none;
    border-radius: 15px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: var(--transition-theme);
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .add-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px var(--color-primary-shadow);
  }

  .add-button:active {
    transform: translateY(0);
  }

  .add-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .task-counter {
    text-align: center;
    margin-bottom: 20px;
    color: var(--color-text-muted);
    font-size: 14px;
  }

  .tasks-container {
    max-height: 450px;
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
    transition: var(--transition-theme);
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
    transition: var(--transition-theme);
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
    transition: var(--transition-theme);
    word-wrap: break-word;
    margin-bottom: 4px;
    color: var(--color-text);
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
    transition: var(--transition-theme);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .delete-button:hover {
    background: var(--color-danger-hover);
    transform: scale(1.1);
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

  @media (max-width: 768px) {
    .container {
      margin: 10px;
      padding: 20px;
      max-width: 100%;
    }

    .app-header {
      gap: 10px;
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

    .header-controls {
      flex-shrink: 0;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 1.5em;
    }

    h1 i {
      display: none;
    }

    .container {
      padding: 15px;
    }

    .task-item {
      gap: 10px;
      padding: 12px 15px;
    }
  }
</style>