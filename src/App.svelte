<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern To-Do List</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            color: #333;
        }

        .container {
            max-width: 500px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        .container:hover {
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 700;
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
            border: 2px solid #e0e0e0;
            border-radius: 15px;
            font-size: 16px;
            transition: all 0.3s ease;
            background: white;
            outline: none;
            color: #333;
        }

        input[type="text"]:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            transform: translateY(-1px);
        }

        .add-button {
            padding: 15px 25px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 15px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
        }

        .add-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .add-button:active {
            transform: translateY(0);
        }

        .tasks-container {
            max-height: 400px;
            overflow-y: auto;
            padding-right: 5px;
        }

        .tasks-container::-webkit-scrollbar {
            width: 6px;
        }

        .tasks-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }

        .tasks-container::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
        }

        .tasks-container::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }

        .task-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px 20px;
            margin-bottom: 10px;
            background: white;
            border-radius: 15px;
            border: 2px solid #f0f0f0;
            transition: all 0.3s ease;
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
            border-color: #667eea;
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
            transform: translateY(-1px);
        }

        .task-item.completed {
            background: #f8f9fa;
            opacity: 0.7;
            border-color: #28a745;
        }

        .task-checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid #ddd;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            background: white;
        }

        .task-checkbox.checked {
            background: #28a745;
            border-color: #28a745;
            color: white;
        }

        .task-checkbox:hover {
            border-color: #28a745;
            transform: scale(1.1);
        }

        .task-text {
            flex: 1;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        .task-text.completed {
            text-decoration: line-through;
            color: #6c757d;
        }

        .delete-button {
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 10px;
            padding: 8px 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .delete-button:hover {
            background: #c82333;
            transform: scale(1.1);
        }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #6c757d;
            font-size: 18px;
        }

        .empty-state i {
            font-size: 4em;
            margin-bottom: 20px;
            opacity: 0.3;
        }

        .task-counter {
            text-align: center;
            margin-bottom: 20px;
            color: #6c757d;
            font-size: 14px;
        }

        @media (max-width: 768px) {
            .container {
                margin: 10px;
                padding: 20px;
            }

            h1 {
                font-size: 2em;
            }

            .input-container {
                flex-direction: column;
            }

            .add-button {
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1><i class="fas fa-clipboard-list"></i> To-Do List</h1>
        
        <div class="input-container">
            <div class="input-wrapper">
                <input type="text" id="taskInput" placeholder="Aggiungi un nuovo task..." maxlength="100">
            </div>
            <button class="add-button" id="addButton">
                <i class="fas fa-plus"></i>
                Aggiungi
            </button>
        </div>

        <div class="task-counter">
            <span id="taskCounter">0 task</span> • <span id="completedCounter">0 completati</span>
        </div>

        <div class="tasks-container" id="tasksContainer">
            <div class="empty-state" id="emptyState">
                <i class="fas fa-inbox"></i>
                <p>Nessun task ancora.<br>Inizia aggiungendo il tuo primo task!</p>
            </div>
        </div>
    </div>

    <script>
        let tasks = [];
        let taskIdCounter = 0;

        const taskInput = document.getElementById('taskInput');
        const tasksContainer = document.getElementById('tasksContainer');
        const emptyState = document.getElementById('emptyState');
        const taskCounter = document.getElementById('taskCounter');
        const completedCounter = document.getElementById('completedCounter');

        // Event listeners
        taskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        document.querySelector('.add-button').addEventListener('click', addTask);

        function addTask() {
            const taskText = taskInput.value.trim();
            if (taskText === '') return;

            const newTask = {
                id: taskIdCounter++,
                text: taskText,
                completed: false,
                createdAt: new Date()
            };

            tasks.push(newTask);
            taskInput.value = '';
            renderTasks();
            updateCounters();
        }

        function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                renderTasks();
                updateCounters();
            }
        }

        function deleteTask(id) {
            const taskElement = document.querySelector(`[data-task-id="${id}"]`);
            if (taskElement) {
                taskElement.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    tasks = tasks.filter(t => t.id !== id);
                    renderTasks();
                    updateCounters();
                }, 300);
            }
        }

        function renderTasks() {
            if (tasks.length === 0) {
                tasksContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <p>Nessun task ancora.<br>Inizia aggiungendo il tuo primo task!</p>
                    </div>
                `;
                return;
            }

            tasksContainer.innerHTML = tasks.map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-task-id="${task.id}">
                        ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                    </div>
                    <div class="task-text ${task.completed ? 'completed' : ''}">${task.text}</div>
                    <button class="delete-button" data-task-id="${task.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');

            // Add event listeners to the newly created elements
            document.querySelectorAll('.task-checkbox').forEach(checkbox => {
                checkbox.addEventListener('click', (e) => {
                    const taskId = parseInt(e.currentTarget.dataset.taskId);
                    toggleTask(taskId);
                });
            });

            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const taskId = parseInt(e.currentTarget.dataset.taskId);
                    deleteTask(taskId);
                });
            });
        }

        function updateCounters() {
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(t => t.completed).length;
            
            taskCounter.textContent = `${totalTasks} task${totalTasks !== 1 ? '' : ''}`;
            completedCounter.textContent = `${completedTasks} completati`;
        }

        // CSS animation for slide out
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-100%);
                }
            }
        `;
        document.head.appendChild(style);

        // Initialize
        renderTasks();
        updateCounters();
    </script>
</body>
</html>