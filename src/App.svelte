<script>
  // Imports esistenti (mantieni quelli che hai)
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

  // State esistente + nuovi campi per dashboard assicurativa
  let tasks = [];
  let newTaskText = '';
  let newTaskCategory = 'polizze';
  let newTaskPriority = 'media';
  let newTaskClient = '';
  let newTaskDueDate = '';
  let validationMessage = '';
  let isValidInput = true;
  let isProcessing = false;
  let activeView = 'dashboard'; // dashboard o tasks

  // Categorie assicurative
  const categories = {
    polizze: { name: 'Polizze', icon: '🛡️', color: '#3b82f6' },
    sinistri: { name: 'Sinistri', icon: '⚠️', color: '#ef4444' },
    rinnovi: { name: 'Rinnovi', icon: '🔄', color: '#f59e0b' },
    preventivi: { name: 'Preventivi', icon: '💰', color: '#10b981' },
    controlli: { name: 'Controlli', icon: '📋', color: '#8b5cf6' },
    clienti: { name: 'Clienti', icon: '👥', color: '#06b6d4' }
  };

  const priorities = {
    alta: { name: 'Alta', color: '#ef4444', urgency: 3 },
    media: { name: 'Media', color: '#f59e0b', urgency: 2 },
    bassa: { name: 'Bassa', color: '#10b981', urgency: 1 }
  };

  // Reactive statements
  $: stats = getTaskStats(tasks);
  $: sortedTasks = sortTasksByStatus(tasks);
  $: categoryStats = getCategoryStats();
  $: urgentTasks = tasks.filter(t => t.priority === 'alta' && !t.completed).length;
  $: overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && !t.completed).length;

  // Auto-save con debounce
  let saveTimeout;
  $: {
    if (tasks && tasks.length >= 0) {
      if (saveTimeout) clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        try {
          saveTasks(tasks);
        } catch (error) {
          console.error('Errore nel salvataggio dei task:', error);
        }
      }, 100);
    }
  }

  // Funzioni per statistiche categorie
  function getCategoryStats() {
    return Object.entries(categories).map(([key, category]) => {
      const categoryTasks = tasks.filter(t => t.category === key);
      const completed = categoryTasks.filter(t => t.completed).length;
      const pending = categoryTasks.length - completed;

      return {
        key,
        ...category,
        total: categoryTasks.length,
        completed,
        pending,
        percentage: categoryTasks.length > 0 ? Math.round((completed / categoryTasks.length) * 100) : 0
      };
    }).filter(cat => cat.total > 0);
  }

  // Inizializza app con dati di esempio se vuoto
  function initializeApp() {
    try {
      const savedTasks = loadTasks();
      const savedCounter = loadTaskCounter();

      if (savedTasks && savedTasks.length > 0) {
        tasks = savedTasks.map(task => ({
          ...task,
          category: task.category || 'polizze',
          priority: task.priority || 'media',
          client: task.client || '',
          dueDate: task.dueDate || ''
        }));
        const maxId = Math.max(...savedTasks.map(t => t.id)) + 1;
        setTaskIdCounter(Math.max(maxId, savedCounter));
      } else {
        // Dati di esempio per la dashboard
        tasks = [
          {
            id: 1,
            text: 'Rinnovo polizza auto Rossi Mario',
            category: 'rinnovi',
            priority: 'alta',
            client: 'Rossi Mario',
            dueDate: '2025-06-15',
            completed: false,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            text: 'Gestione sinistro danni RCA - Targa AB123CD',
            category: 'sinistri',
            priority: 'alta',
            client: 'Verdi Giuseppe',
            dueDate: '2025-06-02',
            completed: false,
            createdAt: new Date().toISOString()
          },
          {
            id: 3,
            text: 'Preventivo assicurazione casa Bianchi',
            category: 'preventivi',
            priority: 'media',
            client: 'Bianchi Anna',
            dueDate: '2025-06-08',
            completed: true,
            createdAt: new Date().toISOString()
          }
        ];
        setTaskIdCounter(savedCounter || 4);
      }
    } catch (error) {
      console.error('Errore nell\'inizializzazione:', error);
      tasks = [];
      setTaskIdCounter(1);
    }
  }

  // Funzioni per gestione task (modificate per nuovi campi)
  async function addTask() {
    if (isProcessing || !newTaskText.trim()) return;

    isProcessing = true;

    try {
      const validation = processTaskInput(newTaskText, tasks);

      if (!validation.isValid) {
        validationMessage = validation.errors[0];
        isValidInput = false;
        return;
      }

      const newTask = {
        ...createTask(validation.sanitizedText),
        category: newTaskCategory,
        priority: newTaskPriority,
        client: newTaskClient,
        dueDate: newTaskDueDate
      };

      tasks = [...tasks, newTask];

      // Reset form
      newTaskText = '';
      newTaskClient = '';
      newTaskDueDate = '';
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

  function toggleTask(id) {
    if (isProcessing) return;
    try {
      tasks = toggleTaskById(tasks, id);
    } catch (error) {
      console.error('Errore nel toggle del task:', error);
    }
  }

  function deleteTask(id) {
    if (isProcessing) return;
    try {
      tasks = removeTaskById(tasks, id);
    } catch (error) {
      console.error('Errore nella cancellazione del task:', error);
    }
  }

  // Gestione input con debounce
  let validationTimeout;
  function handleInputChange() {
    if (validationTimeout) clearTimeout(validationTimeout);

    if (newTaskText.trim() === '') {
      validationMessage = '';
      isValidInput = true;
      return;
    }

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
    }, 150);
  }

  function handleKeydown(event) {
    if (event.key === 'Enter' && !isProcessing) {
      event.preventDefault();
      addTask();
    }
  }

  // Funzioni helper
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT');
  }

  function isOverdue(dueDate, completed) {
    return dueDate && new Date(dueDate) < new Date() && !completed;
  }

  // Cleanup
  import { onDestroy } from 'svelte';
  onDestroy(() => {
    if (saveTimeout) clearTimeout(saveTimeout);
    if (validationTimeout) clearTimeout(validationTimeout);
  });

  // Inizializza
  initializeApp();
</script>

<main class="container">
  <!-- Header con toggle vista -->
  <header class="app-header">
    <div class="header-title">
      <h1><i class="fas fa-building"></i> Dashboard Assicurativa</h1>
      <p class="subtitle">Gestione professionale delle attività assicurative</p>
    </div>
    <div class="header-controls">
      <button
              class="view-toggle"
              class:active={activeView === 'dashboard'}
              on:click={() => activeView = 'dashboard'}
      >
        📊 Dashboard
      </button>
      <button
              class="view-toggle"
              class:active={activeView === 'tasks'}
              on:click={() => activeView = 'tasks'}
      >
        📋 Attività
      </button>
    </div>
  </header>

  {#if activeView === 'dashboard'}
    <!-- Dashboard View -->

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-text">
            <span class="kpi-label">Totale Attività</span>
            <span class="kpi-value">{stats.total}</span>
          </div>
          <div class="kpi-icon blue">📊</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-text">
            <span class="kpi-label">Completate</span>
            <span class="kpi-value green">{stats.completed}</span>
          </div>
          <div class="kpi-icon green">✅</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-text">
            <span class="kpi-label">In Sospeso</span>
            <span class="kpi-value yellow">{stats.total - stats.completed}</span>
          </div>
          <div class="kpi-icon yellow">⏳</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-text">
            <span class="kpi-label">Urgenti</span>
            <span class="kpi-value red">{urgentTasks}</span>
          </div>
          <div class="kpi-icon red">🚨</div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-content">
          <div class="kpi-text">
            <span class="kpi-label">Scadute</span>
            <span class="kpi-value orange">{overdueTasks}</span>
          </div>
          <div class="kpi-icon orange">⚠️</div>
        </div>
      </div>
    </div>

    <!-- Analisi Categorie -->
    <div class="dashboard-card">
      <h3>📈 Analisi per Categoria</h3>
      <div class="category-grid">
        {#each categoryStats as category}
          <div class="category-card">
            <div class="category-header">
              <div class="category-info">
                <span class="category-icon">{category.icon}</span>
                <span class="category-name">{category.name}</span>
              </div>
              <span class="category-percentage" style="background-color: {category.color}20; color: {category.color}">
                {category.percentage}%
              </span>
            </div>

            <div class="category-stats">
              <div class="stat-row">
                <span>Totale:</span>
                <span class="stat-value">{category.total}</span>
              </div>
              <div class="stat-row">
                <span>Completate:</span>
                <span class="stat-value green">{category.completed}</span>
              </div>
              <div class="stat-row">
                <span>In sospeso:</span>
                <span class="stat-value yellow">{category.pending}</span>
              </div>
            </div>

            <div class="progress-bar">
              <div class="progress-fill" style="width: {category.percentage}%; background-color: {category.color}"></div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Attività Recenti -->
    <div class="dashboard-card">
      <h3>🕒 Attività Recenti</h3>
      <div class="recent-activities">
        {#each sortedTasks.slice(0, 5) as task}
          {@const category = categories[task.category]}
          {@const priority = priorities[task.priority]}
          {@const overdue = isOverdue(task.dueDate, task.completed)}

          <div class="activity-item">
            <div class="activity-priority" style="background-color: {priority.color}"></div>
            <span class="activity-icon">{category.icon}</span>
            <div class="activity-content">
              <p class="activity-text" class:completed={task.completed}>{task.text}</p>
              <div class="activity-meta">
                {#if task.client}<span>👤 {task.client}</span>{/if}
                {#if task.dueDate}<span class:overdue>📅 {formatDate(task.dueDate)}</span>{/if}
              </div>
            </div>
            {#if task.completed}<span class="activity-status">✅</span>{/if}
            {#if overdue}<span class="overdue-badge">SCADUTO</span>{/if}
          </div>
        {/each}
      </div>
    </div>

  {:else}
    <!-- Tasks View -->

    <!-- Form aggiunta task -->
    <div class="task-form-card">
      <h3>➕ Nuova Attività</h3>

      <div class="form-grid">
        <div class="input-group">
          <input
                  type="text"
                  bind:value={newTaskText}
                  on:input={handleInputChange}
                  on:keydown={handleKeydown}
                  placeholder="Descrizione attività..."
                  class:error={!isValidInput}
                  disabled={isProcessing}
          />
          <input
                  type="text"
                  bind:value={newTaskClient}
                  placeholder="Cliente (opzionale)"
                  disabled={isProcessing}
          />
        </div>

        <div class="select-group">
          <select bind:value={newTaskCategory} disabled={isProcessing}>
            {#each Object.entries(categories) as [key, cat]}
              <option value={key}>{cat.icon} {cat.name}</option>
            {/each}
          </select>

          <select bind:value={newTaskPriority} disabled={isProcessing}>
            {#each Object.entries(priorities) as [key, priority]}
              <option value={key}>{priority.name}</option>
            {/each}
          </select>

          <input
                  type="date"
                  bind:value={newTaskDueDate}
                  disabled={isProcessing}
          />
        </div>

        {#if validationMessage}
          <div class="validation-message" class:error={!isValidInput}>
            {validationMessage}
          </div>
        {/if}

        <button
                class="add-button"
                on:click={addTask}
                disabled={!isValidInput || !newTaskText.trim() || isProcessing}
                class:processing={isProcessing}
        >
          {#if isProcessing}
            <i class="fas fa-spinner fa-spin"></i>
            <span>Aggiunta...</span>
          {:else}
            <i class="fas fa-plus"></i>
            <span>Aggiungi Attività</span>
          {/if}
        </button>
      </div>
    </div>

    <!-- Lista task -->
    <div class="tasks-card">
      <div class="tasks-header">
        <h3>📋 Elenco Attività</h3>
        <span class="task-counter">{tasks.length} attività totali</span>
      </div>

      {#if tasks.length === 0}
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>Nessuna attività presente<br>Aggiungi la tua prima attività assicurativa!</p>
        </div>
      {:else}
        <div class="tasks-list">
          {#each sortedTasks as task (task.id)}
            {@const category = categories[task.category]}
            {@const priority = priorities[task.priority]}
            {@const overdue = isOverdue(task.dueDate, task.completed)}

            <div class="task-item" class:completed={task.completed} class:overdue>
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
                <div class="task-badges">
                  <span class="task-icon">{category.icon}</span>
                  <span class="category-badge" style="background-color: {category.color}20; color: {category.color}">
                    {category.name}
                  </span>
                  <span class="priority-badge" style="background-color: {priority.color}20; color: {priority.color}">
                    {priority.name}
                  </span>
                  {#if overdue}
                    <span class="overdue-badge">SCADUTO</span>
                  {/if}
                </div>

                <div class="task-text" class:completed={task.completed}>
                  {task.text}
                </div>

                <div class="task-meta">
                  {#if task.client}<span>👤 {task.client}</span>{/if}
                  {#if task.dueDate}<span class:overdue>📅 {formatDate(task.dueDate)}</span>{/if}
                  <span>Creato {getFriendlyDate(new Date(task.createdAt))}</span>
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
        </div>
      {/if}
    </div>
  {/if}
</main>

<style>
  /* CSS Variables - Dark Theme */
  :global(:root) {
    --color-primary: #7c3aed;
    --color-primary-hover: #6d28d9;
    --color-primary-light: rgba(124, 58, 237, 0.15);
    --color-primary-shadow: rgba(124, 58, 237, 0.4);
    --color-secondary: #8b5cf6;
    --color-accent: #10b981;
    --color-accent-hover: #059669;
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
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    background: var(--color-surface);
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 20px 40px var(--shadow-color);
    backdrop-filter: var(--backdrop-blur);
    transition: var(--transition-smooth);
  }

  /* Header */
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .header-title h1 {
    margin: 0;
    font-size: 2.2em;
    background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
  }

  .subtitle {
    color: var(--color-text-muted);
    font-size: 0.9em;
    margin: 5px 0 0 0;
  }

  .header-controls {
    display: flex;
    gap: 10px;
  }

  .view-toggle {
    padding: 8px 16px;
    border: 2px solid var(--color-border);
    border-radius: 10px;
    background: var(--color-surface);
    color: var(--color-text);
    cursor: pointer;
    transition: var(--transition-smooth);
    font-weight: 500;
  }

  .view-toggle.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: white;
  }

  .view-toggle:not(.active):hover {
    border-color: var(--color-primary);
    background: var(--color-surface-hover);
  }

  /* Dashboard */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .kpi-card {
    background: var(--color-surface-hover);
    border: 2px solid var(--color-border);
    border-radius: 15px;
    padding: 20px;
    transition: var(--transition-smooth);
  }

  .kpi-card:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px var(--shadow-color);
  }

  .kpi-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .kpi-label {
    display: block;
    font-size: 0.9em;
    color: var(--color-text-muted);
    margin-bottom: 5px;
  }

  .kpi-value {
    display: block;
    font-size: 2em;
    font-weight: bold;
    color: var(--color-text);
  }

  .kpi-value.green { color: #10b981; }
  .kpi-value.yellow { color: #f59e0b; }
  .kpi-value.red { color: #ef4444; }
  .kpi-value.orange { color: #f97316; }

  .kpi-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
  }

  .kpi-icon.blue { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
  .kpi-icon.green { background: rgba(16, 185, 129, 0.2); color: #10b981; }
  .kpi-icon.yellow { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
  .kpi-icon.red { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
  .kpi-icon.orange { background: rgba(249, 115, 22, 0.2); color: #f97316; }

  /* Dashboard Cards */
  .dashboard-card {
    background: var(--color-surface-hover);
    border: 2px solid var(--color-border);
    border-radius: 15px;
    padding: 25px;
    margin-bottom: 25px;
  }

  .dashboard-card h3 {
    margin: 0 0 20px 0;
    font-size: 1.2em;
    color: var(--color-text);
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }

  .category-card {
    background: var(--color-surface-alt);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 20px;
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .category-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .category-icon {
    font-size: 1.5em;
  }

  .category-name {
    font-weight: 600;
    color: var(--color-text);
  }

  .category-percentage {
    padding: 4px 8px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9em;
  }

  .category-stats {
    space-y: 8px;
    margin-bottom: 15px;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
    color: var(--color-text-muted);
    margin-bottom: 8px;
  }

  .stat-value {
    font-weight: 600;
  }

  .stat-value.green { color: #10b981; }
  .stat-value.yellow { color: #f59e0b; }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: var(--color-surface-dark);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    transition: width 0.5s ease;
    border-radius: 4px;
  }

  /* Recent Activities */
  .recent-activities {
    space-y: 15px;
  }

  .activity-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: var(--color-surface-alt);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    margin-bottom: 15px;
  }

  .activity-priority {
    width: 4px;
    height: 40px;
    border-radius: 2px;
  }

  .activity-icon {
    font-size: 1.5em;
  }

  .activity-content {
    flex: 1;
  }

  .activity-text {
    margin: 0 0 5px 0;
    font-weight: 500;
    color: var(--color-text);
  }

  .activity-text.completed {
    text-decoration: line-through;
    opacity: 0.6;
  }

  .activity-meta {
    display: flex;
    gap: 15px;
    font-size: 0.85em;
    color: var(--color-text-muted);
  }

  .activity-meta .overdue {
    color: #ef4444;
    font-weight: 600;
  }

  .activity-status {
    font-size: 1.2em;
  }

  .overdue-badge {
    background: #ef4444;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.7em;
    font-weight: 600;
  }

  /* Task Form */
  .task-form-card {
    background: var(--color-surface-hover);
    border: 2px solid var(--color-border);
    border-radius: 15px;
    padding: 25px;
    margin-bottom: 25px;
  }

  .task-form-card h3 {
    margin: 0 0 20px 0;
    font-size: 1.2em;
    color: var(--color-text);
  }

  .form-grid {
    display: grid;
    gap: 15px;
  }

  .input-group, .select-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .select-group {
    grid-template-columns: 1fr 1fr 1fr;
  }

  input[type="text"], input[type="date"], select {
    padding: 12px 15px;
    border: 2px solid var(--color-border);
    border-radius: 10px;
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 14px;
    transition: var(--transition-smooth);
  }

  input[type="text"]:focus, input[type="date"]:focus, select:focus {
    border-color: var(--color-primary);
    outline: none;
    box-shadow: 0 0 0 3px var(--color-primary-light);
  }

  input[type="text"].error {
    border-color: var(--color-danger);
  }

  input[type="text"]::placeholder {
    color: var(--color-text-light);
  }

  input:disabled, select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .validation-message {
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.85em;
    background: var(--color-surface-alt);
    color: var(--color-text-muted);
  }

  .validation-message.error {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .add-button {
    padding: 12px 20px;
    background: linear-gradient(45deg, var(--color-primary), var(--color-secondary));
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: var(--transition-smooth);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .add-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px var(--color-primary-shadow);
  }

  .add-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .add-button.processing {
    opacity: 0.8;
  }

  /* Tasks List */
  .tasks-card {
    background: var(--color-surface-hover);
    border: 2px solid var(--color-border);
    border-radius: 15px;
    padding: 25px;
  }

  .tasks-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .tasks-header h3 {
    margin: 0;
    font-size: 1.2em;
    color: var(--color-text);
  }

  .task-counter {
    font-size: 0.9em;
    color: var(--color-text-muted);
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--color-text-muted);
  }

  .empty-state i {
    font-size: 4em;
    margin-bottom: 20px;
    opacity: 0.3;
  }

  .tasks-list {
    space-y: 15px;
  }

  .task-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 20px;
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: 12px;
    transition: var(--transition-smooth);
    animation: slideIn 0.5s ease-out;
    margin-bottom: 15px;
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
    opacity: 0.75;
  }

  .task-item.overdue {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
  }

  .task-checkbox {
    width: 24px;
    height: 24px;
    border: 2px solid var(--color-border);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition-smooth);
    background: var(--color-surface);
    flex-shrink: 0;
    margin-top: 2px;
  }

  .task-checkbox:hover {
    border-color: var(--color-accent);
    transform: scale(1.1);
  }

  .task-checkbox.checked {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: white;
  }

  .task-content {
    flex: 1;
    min-width: 0;
  }

  .task-badges {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }

  .task-icon {
    font-size: 1.2em;
  }

  .category-badge, .priority-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75em;
    font-weight: 600;
  }

  .task-text {
    font-size: 16px;
    font-weight: 500;
    color: var(--color-text);
    margin-bottom: 8px;
    line-height: 1.4;
    word-break: break-word;
  }

  .task-text.completed {
    text-decoration: line-through;
    opacity: 0.6;
  }

  .task-meta {
    display: flex;
    gap: 15px;
    font-size: 0.85em;
    color: var(--color-text-light);
    flex-wrap: wrap;
  }

  .task-meta .overdue {
    color: #ef4444;
    font-weight: 600;
  }

  .delete-button {
    background: var(--color-danger);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
    transition: var(--transition-smooth);
    flex-shrink: 0;
  }

  .delete-button:hover:not(:disabled) {
    background: var(--color-danger-hover);
    transform: scale(1.05);
  }

  .delete-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Animations */
  .fa-spin {
    animation: fa-spin 1s infinite linear;
  }

  @keyframes fa-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .container {
      margin: 10px;
      padding: 20px;
    }

    .app-header {
      flex-direction: column;
      align-items: stretch;
    }

    .header-controls {
      justify-content: center;
    }

    .input-group, .select-group {
      grid-template-columns: 1fr;
    }

    .category-grid {
      grid-template-columns: 1fr;
    }

    .kpi-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .header-title h1 {
      font-size: 1.5em;
    }

    .kpi-grid {
      grid-template-columns: 1fr;
    }

    .task-badges {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>