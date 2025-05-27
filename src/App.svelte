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
        
        .analytics-btn {
            position: fixed;
            top: 1rem;
            right: 1rem;
            background-color: #0056b3;
            color: white;
            border: none;
            padding: 0.7rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            transition: background-color 0.2s;
        }
        
        .analytics-btn:hover {
            background-color: #004494;
        }
        
        .analytics-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
        }
        
        .analytics-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 2rem;
            border-radius: 10px;
            width: 90%;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .analytics-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            border-bottom: 2px solid #0056b3;
            padding-bottom: 1rem;
        }
        
        .analytics-header h2 {
            margin: 0;
            color: #0056b3;
        }
        
        .close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background-color: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            border-left: 4px solid #0056b3;
        }
        
        .stat-value {
            font-size: 2rem;
            font-weight: bold;
            color: #0056b3;
            margin-bottom: 0.5rem;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9rem;
        }
        
        .chart-container {
            margin: 2rem 0;
            padding: 1rem;
            background-color: #f8f9fa;
            border-radius: 8px;
        }
        
        .chart-title {
            font-weight: bold;
            margin-bottom: 1rem;
            color: #0056b3;
        }
        
        .progress-bar {
            background-color: #e9ecef;
            border-radius: 10px;
            height: 20px;
            margin: 0.5rem 0;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            border-radius: 10px;
            transition: width 0.3s ease;
        }
        
        .category-stats {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0.5rem 0;
        }
        
        .category-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .productivity-score {
            text-align: center;
            padding: 1.5rem;
            background: linear-gradient(135deg, #0056b3, #007bff);
            color: white;
            border-radius: 10px;
            margin: 1rem 0;
        }
        
        .score-value {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        
        .score-label {
            font-size: 1.1rem;
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
        
        // Analytics Functions
        function openAnalytics() {
            generateAnalytics();
            document.getElementById('analyticsModal').style.display = 'block';
        }
        
        function closeAnalytics() {
            document.getElementById('analyticsModal').style.display = 'none';
        }
        
        function generateAnalytics() {
            const stats = calculateStats();
            updateStatsGrid(stats);
            updateCategoryChart(stats);
            updateUrgencyChart(stats);
            updateWeeklyTrend(stats);
            updateProductivityScore(stats);
        }
        
        function calculateStats() {
            const allTasks = [];
            let totalCompleted = 0;
            let totalTasks = 0;
            
            const categoryStats = {
                'task': { total: 0, completed: 0 },
                'call': { total: 0, completed: 0 },
                'quote': { total: 0, completed: 0 },
                'claims': { total: 0, completed: 0 }
            };
            
            const urgencyStats = {
                'bassa': { total: 0, completed: 0 },
                'media': { total: 0, completed: 0 },
                'alta': { total: 0, completed: 0 }
            };
            
            const dailyStats = weekDates.map(date => {
                const dayTasks = tasks[date] || [];
                const completed = dayTasks.filter(t => t.done).length;
                return {
                    date: date,
                    total: dayTasks.length,
                    completed: completed,
                    completionRate: dayTasks.length > 0 ? (completed / dayTasks.length) * 100 : 0
                };
            });
            
            // Calcola statistiche per tutte le date
            Object.keys(tasks).forEach(date => {
                const dayTasks = tasks[date] || [];
                dayTasks.forEach(task => {
                    totalTasks++;
                    allTasks.push(task);
                    
                    if (task.done) totalCompleted++;
                    
                    // Stats per categoria
                    const category = task.category || 'task';
                    if (categoryStats[category]) {
                        categoryStats[category].total++;
                        if (task.done) categoryStats[category].completed++;
                    }
                    
                    // Stats per urgenza
                    const urgency = task.urgency || 'bassa';
                    if (urgencyStats[urgency]) {
                        urgencyStats[urgency].total++;
                        if (task.done) urgencyStats[urgency].completed++;
                    }
                });
            });
            
            return {
                totalTasks,
                totalCompleted,
                completionRate: totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0,
                categoryStats,
                urgencyStats,
                dailyStats,
                allTasks
            };
        }
        
        function updateStatsGrid(stats) {
            const grid = document.getElementById('statsGrid');
            
            const avgTasksPerDay = (stats.totalTasks / 7).toFixed(1);
            const mostProductiveDay = stats.dailyStats.reduce((max, day) => 
                day.completed > max.completed ? day : max, stats.dailyStats[0]);
            
            const highUrgencyCompleted = stats.urgencyStats.alta.completed;
            const totalHighUrgency = stats.urgencyStats.alta.total;
            
            grid.innerHTML = `
                <div class="stat-card">
                    <div class="stat-value">${stats.totalTasks}</div>
                    <div class="stat-label">Task Totali</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.totalCompleted}</div>
                    <div class="stat-label">Completati</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.completionRate.toFixed(0)}%</div>
                    <div class="stat-label">Tasso Completamento</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${avgTasksPerDay}</div>
                    <div class="stat-label">Media/Giorno</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${WEEKDAYS[weekDates.indexOf(mostProductiveDay.date)]}</div>
                    <div class="stat-label">Giorno Top</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${highUrgencyCompleted}/${totalHighUrgency}</div>
                    <div class="stat-label">Urgenti Risolti</div>
                </div>
            `;
        }
        
        function updateCategoryChart(stats) {
            const chart = document.getElementById('categoryChart');
            const categories = [
                { key: 'task', label: '📋 Task', color: '#33691e' },
                { key: 'call', label: '📞 Call', color: '#0d47a1' },
                { key: 'quote', label: '💰 Quote', color: '#4a148c' },
                { key: 'claims', label: '⚠️ Claims', color: '#e65100' }
            ];
            
            chart.innerHTML = categories.map(cat => {
                const stat = stats.categoryStats[cat.key];
                const percentage = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;
                
                return `
                    <div class="category-stats">
                        <div class="category-label">
                            <span>${cat.label}</span>
                            <span>(${stat.completed}/${stat.total})</span>
                        </div>
                        <div style="flex: 1; margin-left: 1rem;">
                            <div class="progress-bar">
                                <div class="progress-fill" 
                                     style="width: ${percentage}%; background-color: ${cat.color};">
                                </div>
                            </div>
                        </div>
                        <div style="margin-left: 0.5rem; font-weight: bold;">
                            ${percentage.toFixed(0)}%
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        function updateUrgencyChart(stats) {
            const chart = document.getElementById('urgencyChart');
            const urgencies = [
                { key: 'alta', label: '🔴 Alta', color: '#721c24' },
                { key: 'media', label: '🟡 Media', color: '#856404' },
                { key: 'bassa', label: '🟢 Bassa', color: '#155724' }
            ];
            
            chart.innerHTML = urgencies.map(urg => {
                const stat = stats.urgencyStats[urg.key];
                const percentage = stat.total > 0 ? (stat.completed / stat.total) * 100 : 0;
                
                return `
                    <div class="category-stats">
                        <div class="category-label">
                            <span>${urg.label}</span>
                            <span>(${stat.completed}/${stat.total})</span>
                        </div>
                        <div style="flex: 1; margin-left: 1rem;">
                            <div class="progress-bar">
                                <div class="progress-fill" 
                                     style="width: ${percentage}%; background-color: ${urg.color};">
                                </div>
                            </div>
                        </div>
                        <div style="margin-left: 0.5rem; font-weight: bold;">
                            ${percentage.toFixed(0)}%
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        function updateWeeklyTrend(stats) {
            const chart = document.getElementById('weeklyTrend');
            
            chart.innerHTML = stats.dailyStats.map((day, index) => {
                return `
                    <div class="category-stats">
                        <div class="category-label">
                            <span>${WEEKDAYS[index]}</span>
                            <span>(${day.completed}/${day.total})</span>
                        </div>
                        <div style="flex: 1; margin-left: 1rem;">
                            <div class="progress-bar">
                                <div class="progress-fill" 
                                     style="width: ${day.completionRate}%; background-color: #0056b3;">
                                </div>
                            </div>
                        </div>
                        <div style="margin-left: 0.5rem; font-weight: bold;">
                            ${day.completionRate.toFixed(0)}%
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        function updateProductivityScore(stats) {
            const scoreElement = document.getElementById('productivityScore');
            
            // Calcolo score basato su vari fattori
            let score = 0;
            
            // Completion rate (40% del punteggio)
            score += stats.completionRate * 0.4;
            
            // Bonus per task ad alta priorità completati (30% del punteggio)
            const highPriorityRate = stats.urgencyStats.alta.total > 0 ? 
                (stats.urgencyStats.alta.completed / stats.urgencyStats.alta.total) * 100 : 100;
            score += highPriorityRate * 0.3;
            
            // Consistenza giornaliera (30% del punteggio)
            const daysWithTasks = stats.dailyStats.filter(d => d.total > 0).length;
            const consistencyBonus = (daysWithTasks / 7) * 100 * 0.3;
            score += consistencyBonus;
            
            score = Math.min(100, Math.max(0, score));
            
            let emoji = '🔥';
            let message = 'Eccellente!';
            
            if (score < 50) {
                emoji = '📈';
                message = 'Puoi migliorare';
            } else if (score < 75) {
                emoji = '👍';
                message = 'Buon lavoro!';
            }
            
            scoreElement.innerHTML = `
                <div class="score-value">${emoji} ${score.toFixed(0)}%</div>
                <div class="score-label">${message}</div>
            `;
        }
        
        // Chiudi modal cliccando fuori
        window.onclick = function(event) {
            const modal = document.getElementById('analyticsModal');
            if (event.target === modal) {
                closeAnalytics();
            }
        }
        
        // Funzioni globali per i click handler
        window.toggleTaskStatus = toggleTaskStatus;
        window.removeTask = removeTask;
        window.handleTaskInput = handleTaskInput;
        window.clearPlaceholder = clearPlaceholder;
        window.openAnalytics = openAnalytics;
        window.closeAnalytics = closeAnalytics;
    </script>
</body>
</html>
