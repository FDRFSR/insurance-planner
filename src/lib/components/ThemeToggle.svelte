<script>
  import { themePreference, currentTheme, themeActions, THEMES } from '../../stores/themeStore.js';

  // Props
  export let showLabel = true;
  export let size = 'medium'; // small, medium, large
  export let style = 'button'; // button, switch, cycle

  // Theme icons
  const icons = {
    [THEMES.LIGHT]: 'fas fa-sun',
    [THEMES.DARK]: 'fas fa-moon',
    [THEMES.AUTO]: 'fas fa-circle-half-stroke'
  };

  // Theme labels
  const labels = {
    [THEMES.LIGHT]: 'Chiaro',
    [THEMES.DARK]: 'Scuro', 
    [THEMES.AUTO]: 'Auto'
  };

  // Handle theme change based on style
  function handleThemeChange() {
    if (style === 'cycle') {
      themeActions.cycleTheme();
    } else {
      themeActions.toggleTheme();
    }
  }

  // Get button title/tooltip
  $: buttonTitle = style === 'cycle' 
    ? `Tema corrente: ${labels[$themePreference]} - Clicca per cambiare`
    : `Cambia a tema ${$currentTheme === THEMES.DARK ? 'chiaro' : 'scuro'}`;

  // Size classes
  $: sizeClass = {
    small: 'size-small',
    medium: 'size-medium', 
    large: 'size-large'
  }[size];

  // Animation class for theme transitions
  $: themeClass = `theme-${$currentTheme}`;
</script>

<div class="theme-toggle-container">
  {#if style === 'switch'}
    <!-- Switch Style Toggle -->
    <label class="theme-switch {sizeClass}" title={buttonTitle}>
      <input 
        type="checkbox" 
        checked={$currentTheme === THEMES.DARK}
        on:change={handleThemeChange}
      />
      <span class="slider">
        <i class="icon-light {icons[THEMES.LIGHT]}"></i>
        <i class="icon-dark {icons[THEMES.DARK]}"></i>
      </span>
      {#if showLabel}
        <span class="label">{labels[$currentTheme]}</span>
      {/if}
    </label>
  {:else if style === 'cycle'}
    <!-- Cycle Style Toggle (3 themes) -->
    <button 
      class="theme-button cycle {sizeClass} {themeClass}"
      on:click={handleThemeChange}
      title={buttonTitle}
    >
      <span class="icon-container">
        <i class="{icons[$themePreference]} theme-icon"></i>
      </span>
      {#if showLabel}
        <span class="label">{labels[$themePreference]}</span>
      {/if}
    </button>
  {:else}
    <!-- Default Button Style Toggle -->
    <button 
      class="theme-button {sizeClass} {themeClass}"
      on:click={handleThemeChange}
      title={buttonTitle}
    >
      <span class="icon-container">
        <i class="{icons[$currentTheme]} theme-icon"></i>
      </span>
      {#if showLabel}
        <span class="label">{labels[$currentTheme]}</span>
      {/if}
    </button>
  {/if}
</div>

<style>
  .theme-toggle-container {
    display: inline-flex;
    align-items: center;
  }

  /* Button Styles */
  .theme-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 2px solid var(--color-border);
    border-radius: 10px;
    background: var(--color-surface);
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: inherit;
    font-weight: 500;
  }

  .theme-button:hover {
    border-color: var(--color-primary);
    background: var(--color-surface-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--shadow-color);
  }

  .theme-button:active {
    transform: translateY(0);
  }

  .theme-button.cycle {
    border-color: var(--color-accent);
  }

  .theme-button.cycle:hover {
    border-color: var(--color-accent-hover);
    background: var(--color-accent-surface);
  }

  /* Icon Styles */
  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
  }

  .theme-icon {
    font-size: 1.1em;
    transition: all 0.3s ease;
  }

  .theme-button:hover .theme-icon {
    transform: rotate(15deg) scale(1.1);
  }

  .theme-button.cycle:hover .theme-icon {
    transform: rotate(180deg) scale(1.1);
  }

  /* Switch Styles */
  .theme-switch {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .theme-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: relative;
    width: 60px;
    height: 30px;
    background: var(--color-surface-alt);
    border: 2px solid var(--color-border);
    border-radius: 20px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
  }

  .slider::before {
    content: '';
    position: absolute;
    width: 22px;
    height: 22px;
    left: 2px;
    background: var(--color-primary);
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .theme-switch input:checked + .slider::before {
    transform: translateX(28px);
    background: var(--color-accent);
  }

  .theme-switch input:checked + .slider {
    background: var(--color-surface-dark);
    border-color: var(--color-accent);
  }

  .icon-light,
  .icon-dark {
    font-size: 12px;
    z-index: 1;
    transition: all 0.3s ease;
  }

  .icon-light {
    color: var(--color-warning);
  }

  .icon-dark {
    color: var(--color-info);
  }

  .theme-switch input:checked + .slider .icon-light {
    opacity: 0.5;
  }

  .theme-switch input:not(:checked) + .slider .icon-dark {
    opacity: 0.5;
  }

  /* Size Variants */
  .size-small {
    font-size: 12px;
  }

  .size-small.theme-button {
    padding: 6px 10px;
    gap: 6px;
  }

  .size-small .slider {
    width: 50px;
    height: 25px;
  }

  .size-small .slider::before {
    width: 19px;
    height: 19px;
  }

  .size-medium {
    font-size: 14px;
  }

  .size-large {
    font-size: 16px;
  }

  .size-large.theme-button {
    padding: 12px 16px;
    gap: 10px;
  }

  .size-large .slider {
    width: 70px;
    height: 35px;
  }

  .size-large .slider::before {
    width: 27px;
    height: 27px;
  }

  /* Label */
  .label {
    font-weight: 500;
    white-space: nowrap;
  }

  /* Theme Transitions */
  .theme-light .theme-icon {
    color: var(--color-warning);
  }

  .theme-dark .theme-icon {
    color: var(--color-info);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .theme-button {
      padding: 10px;
    }

    .label {
      display: none;
    }
  }
</style>