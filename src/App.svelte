<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Planner Settimanale</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            font-family: 'Courier New', monospace;
            background-color: #ffffff;
            color: #222;
        }
        
        .planner-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
            overflow-y: auto;
            padding: 2rem;
            background-color: #ffffff;
        }
        
        .header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #0056b3;
        }
        
        .header h1 {
            margin: 0;
            color: #0056b3;
            font-size: 1.5rem;
        }
        
        .week-info {
            color: #666;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        
        .day-block {
            margin-bottom: 2rem;
            position: relative;
        }
        
        .day-header {
            font-weight: bold;
            font-size: 1rem;
            color: #0056b3;
            border-bottom: 1px solid #0056b3;
            padding-bottom: 0.25rem;
            margin-bottom: 0.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .today-indicator {
            background-color: #0056b3;
            color: white;
            padding: 0.2rem 0.5rem;
            border-radius: 3px;
            font-size: 0.8rem;
        }
        
        .task-entry {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.9rem;
            margin: 0.3rem 0;
            padding: 0.2rem;
            border-radius: 3px;
            transition: background-color 0.2s;
        }
        
        .task-entry:hover {
            background-color: #f8f9fa;
        }
        
        .task-entry input[type="checkbox"] {
            margin-right: 0.5rem;
            cursor: pointer;
        }
        
        .task-content {
            flex: 1;
            cursor: pointer;
        }
        
        .completed {
            text-decoration: line-through;
            color: #999;
        }
        
        .task-input {
            width: 100%;
            background-color: transparent;
            border: none;
            border-bottom: 1px solid #ccc;
            padding: 0.3rem 0;
            color: #222;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.2s;
        }
        
        .task-input:focus {
            border-color: #0056b3;
        }
        
        .remove-btn {
            background: none;
            border: none;
            color: #d00;
            cursor: pointer;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            opacity: 0.7;
            transition: opacity 0.2s, background-color 0.2s;
        }
        
        .remove-btn:hover {
            opacity: 1;
            background-color: #ffe6e6;
        }
        
        .task-count {
            font-size: 0.8rem;
            color: #666;
            margin-left: 0.5rem;
        }
        
        .empty-day {
            color: #999;
            font-style: italic;
            padding: 0.5rem 0;
        }
        
        @media (max-width: 768px) {
            .planner-container {
                padding: 1rem;
            }
            
            .day-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.3rem;
            }
        }
        
        .keyboard-hint {
            position: fixed;
            bottom: 1rem;
            right: 1rem;
            background-color: #f8f9fa;
            padding: 0.5rem;
            border-radius: 5px;
            font-size: 0.8rem;
            color: #666;
            border: 1px solid #ddd;
        }
        
        .urgency-tag {
            display: inline-block;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-size: 0.7rem;
            font-weight: bold;
            margin-right: 0.5rem;
            text-transform: uppercase;
        }
        
        .urgency-bassa {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .urgency-media {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        
        .urgency-alta {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .category-tag {
            display: inline-block;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-size: 0.7rem;
            font-weight: bold;
            margin-right: 0.3rem;
            text-transform: uppercase;
        }
        
        .category-call {
            background-color: #e3f2fd;
            color: #0d47a1;
            border: 1px solid #bbdefb;
        }
        
        .category-quote {
            background-color: #f3e5f5;
            color: #4a148c;
            border: 1px solid #ce93d8;
        }
        
        .category-claims {
            background-color: #fff8e1;
            color: #e65100;
            border: 1px solid #ffcc02;
        }
        
        .category-task {
            background-color: #f1f8e9;
            color: #33691e;
            border: 1px solid #c8e6c9;
        }
        
        .task-input-container {
            display: flex;
            gap: 0.5rem;
            align-items: center;
            margin-top: 0.5rem;
        }
        
        .urgency-select, .category-select {
            padding: 0.3rem;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.8rem;
            background-color: white;
        }
        
        .urgency-select:focus, .category-select:focus {
            border-color: #0056b3;
            outline: none;
        }
    </style>
</head>
<body>
    <div class="planner-container">
        <div class="header">
            <h1>📅 Planner Settimanale</h1>
            <div class="week-info" id="weekInfo"></div>
        </div>
        
        <div id="weekContainer"></div>
        
        <div class="keyboard-hint">
            💡 Premi Invio per aggiungere • Click per completare
        </div>
    </div>

    <script>
        const WEEKDAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
        
        // Stato dell'applicazione
        let tasks = {};
        let weekDates = [];
        
        // Inizializzazione
        function init() {
            loadTasks();
            generateWeekDates();
            renderWeek();
            updateWeekInfo();
        }
        
        // Caricamento tasks (simulato, senza localStorage per compatibilità)
        function loadTasks() {
            // In un ambiente reale, qui caricheresti da localStorage
            // tasks = JSON.parse(localStorage.getItem('cli_planner') || '{}');
        }
        
        // Salvataggio tasks (simulato)
        function saveTasks() {
            // In un ambiente reale, qui salveresti su localStorage
            // localStorage.setItem('cli_planner', JSON.stringify(tasks));
        }
        
        // Generazione date della settimana
        function generateWeekDates() {
            const today = new Date();
            const dayOfWeek = (today.getDay() + 6) % 7; // Lunedì = 0
            const monday = new Date(today);
            monday.setDate(today.getDate() - dayOfWeek);
            
            weekDates = Array.from({ length: 7 }, (_, i) => {
                const d = new Date(monday);
                d.setDate(monday.getDate() + i);
                return d.toISOString().split('T')[0];
            });
        }
        
        // Aggiornamento info settimana
        function updateWeekInfo() {
            const firstDate = new Date(weekDates[0]);
            const lastDate = new Date(weekDates[6]);
            const weekInfo = document.getElementById('weekInfo');
            
            weekInfo.textContent = `${formatDate(firstDate)} - ${formatDate(lastDate)}`;
        }
        
        // Formattazione data
        function formatDate(date) {
            return date.toLocaleDateString('it-IT', { 
                day: 'numeric', 
                month: 'short' 
            });
        }
        
        // Controllo se è oggi
        function isToday(dateString) {
            const today = new Date().toISOString().split('T')[0];
            return dateString === today;
        }
        
        // Rendering della settimana
        function renderWeek() {
            const container = document.getElementById('weekContainer');
            container.innerHTML = '';
            
            weekDates.forEach((date, i) => {
                const dayBlock = createDayBlock(date, i);
                container.appendChild(dayBlock);
            });
        }
        
        // Creazione blocco giorno
        function createDayBlock(date, dayIndex) {
            const dayBlock = document.createElement('div');
            dayBlock.className = 'day-block';
            
            const dayTasks = tasks[date] || [];
            const completedCount = dayTasks.filter(task => task.done).length;
            
            dayBlock.innerHTML = `
                <div class="day-header">
                    <span>
                        ${WEEKDAYS[dayIndex]} - ${formatDate(new Date(date))}
                        ${isToday(date) ? '<span class="today-indicator">OGGI</span>' : ''}
                    </span>
                    <span class="task-count">${completedCount}/${dayTasks.length}</span>
                </div>
                
                <div class="tasks-container" data-date="${date}">
                    ${dayTasks.length === 0 ? 
                        '<div class="empty-day">Nessuna attività pianificata</div>' : 
                        dayTasks.map((task, index) => createTaskHTML(task, index, date)).join('')
                    }
                </div>
                
                <div class="task-input-container">
                    <select class="category-select" data-date="${date}">
                        <option value="task">📋 Task</option>
                        <option value="call">📞 Call</option>
                        <option value="quote">💰 Quote</option>
                        <option value="claims">⚠️ Claims</option>
                    </select>
                    <select class="urgency-select" data-date="${date}">
                        <option value="bassa">🟢 Bassa</option>
                        <option value="media">🟡 Media</option>
                        <option value="alta">🔴 Alta</option>
                    </select>
                    <input
                        class="task-input"
                        type="text"
                        placeholder="➤ Aggiungi attività e premi Invio..."
                        data-date="${date}"
                        onkeydown="handleTaskInput(event)"
                        onfocus="clearPlaceholder(this)"
                        style="flex: 1;"
                    />
                </div>
            `;
            
            return dayBlock;
        }
        
        // Creazione HTML task
        function createTaskHTML(task, index, date) {
            const urgencyClass = `urgency-${task.urgency || 'bassa'}`;
            const urgencyLabel = {
                'bassa': '🟢 Bassa',
                'media': '🟡 Media', 
                'alta': '🔴 Alta'
            }[task.urgency || 'bassa'];
            
            const categoryClass = `category-${task.category || 'task'}`;
            const categoryLabel = {
                'task': '📋 Task',
                'call': '📞 Call',
                'quote': '💰 Quote',
                'claims': '⚠️ Claims'
            }[task.category || 'task'];
            
            return `
                <div class="task-entry">
                    <label class="task-content">
                        <input 
                            type="checkbox" 
                            ${task.done ? 'checked' : ''} 
                            onchange="toggleTaskStatus('${date}', ${index})"
                        />
                        <span class="category-tag ${categoryClass}">${categoryLabel}</span>
                        <span class="urgency-tag ${urgencyClass}">${urgencyLabel}</span>
                        <span class="${task.done ? 'completed' : ''}">${escapeHtml(task.text)}</span>
                    </label>
                    <button 
                        class="remove-btn" 
                        onclick="removeTask('${date}', ${index})"
                        title="Rimuovi attività"
                    >
                        ✕
                    </button>
                </div>
            `;
        }
        
        // Escape HTML per sicurezza
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        // Gestione input task
        function handleTaskInput(event) {
            if (event.key === 'Enter') {
                const input = event.target;
                const text = input.value.trim();
                const date = input.dataset.date;
                
                // Trova i select corrispondenti
                const dayBlock = input.closest('.day-block');
                const categorySelect = dayBlock.querySelector('.category-select');
                const urgencySelect = dayBlock.querySelector('.urgency-select');
                const category = categorySelect.value;
                const urgency = urgencySelect.value;
                
                if (text) {
                    addTask(date, text, urgency, category);
                    input.value = '';
                    categorySelect.value = 'task'; // Reset a task
                    urgencySelect.value = 'bassa'; // Reset a bassa priorità
                }
            }
        }
        
        // Aggiunta task
        function addTask(date, text, urgency = 'bassa', category = 'task') {
            if (!tasks[date]) {
                tasks[date] = [];
            }
            
            tasks[date].push({
                text: text,
                done: false,
                urgency: urgency,
                category: category,
                created: new Date().toISOString()
            });
            
            saveTasks();
            renderWeek();
        }
        
        // Toggle stato task
        function toggleTaskStatus(date, index) {
            if (tasks[date] && tasks[date][index]) {
                tasks[date][index].done = !tasks[date][index].done;
                saveTasks();
                renderWeek();
            }
        }
        
        // Rimozione task
        function removeTask(date, index) {
            if (tasks[date] && tasks[date][index]) {
                tasks[date].splice(index, 1);
                saveTasks();
                renderWeek();
            }
        }
        
        // Clear placeholder
        function clearPlaceholder(input) {
            // Funzione chiamata al focus, per eventuali future implementazioni
        }
        
        // Avvio applicazione
        document.addEventListener('DOMContentLoaded', init);
        
        // Funzioni globali per i click handler
        window.toggleTaskStatus = toggleTaskStatus;
        window.removeTask = removeTask;
        window.handleTaskInput = handleTaskInput;
        window.clearPlaceholder = clearPlaceholder;
    </script>
</body>
</html>
