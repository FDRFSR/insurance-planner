<!-- Streamlined CLI-Style Weekly Planner (Svelte, Fullscreen Desktop Layout, Light Theme) -->
<script>
  import { onMount } from 'svelte';

  const WEEKDAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  let tasks = {};
  let newTask = '';
  let selectedDay = new Date().toISOString().split('T')[0];

  $: weekDates = getWeekDates();

  function getWeekDates() {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.toISOString().split('T')[0];
    });
  }

  function addTask() {
    if (!newTask.trim()) return;
    tasks = {
      ...tasks,
      [selectedDay]: [...(tasks[selectedDay] || []), { text: newTask.trim(), done: false }]
    };
    newTask = '';
  }

  function toggleTaskStatus(day, index) {
    tasks[day][index].done = !tasks[day][index].done;
    tasks = { ...tasks };
  }

  function removeTask(day, index) {
    tasks[day].splice(index, 1);
    tasks = { ...tasks };
  }

  onMount(() => {
    const saved = localStorage.getItem('cli_planner');
    if (saved) tasks = JSON.parse(saved);
  });

  $: localStorage.setItem('cli_planner', JSON.stringify(tasks));
</script>

<style>
  :global(html), :global(body) {
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

  .day-block {
    margin-bottom: 2rem;
  }

  .day-header {
    font-weight: bold;
    font-size: 1rem;
    color: #0056b3;
    border-bottom: 1px solid #0056b3;
    padding-bottom: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .task-entry {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.9rem;
    margin: 0.3rem 0;
  }

  .task-entry input[type="checkbox"] {
    margin-right: 0.5rem;
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
  }
</style>

<div class="planner-container">
  {#each weekDates as date, i}
    <div class="day-block">
      <div class="day-header">{WEEKDAYS[i]} - {date}</div>

      {#each tasks[date] || [] as task, ti}
        <div class="task-entry">
          <label>
            <input type="checkbox" checked={task.done} on:change={() => toggleTaskStatus(date, ti)} />
            <span class:completed={task.done}>{task.text}</span>
          </label>
          <button on:click={() => removeTask(date, ti)} style="background:none;border:none;color:#d00;cursor:pointer">x</button>
        </div>
      {/each}

      <input
        class="task-input"
        type="text"
        placeholder="➤ Aggiungi attività e premi Invio..."
        bind:value={newTask}
        on:focus={() => { selectedDay = date; newTask = ''; }}
        on:keydown={(e) => e.key === 'Enter' && selectedDay === date && addTask()}
      />
    </div>
  {/each}
</div>
