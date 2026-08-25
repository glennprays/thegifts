<script lang="ts">
  import { page } from '$app/stores';
  import { browser } from '$app/environment';

  let open = false;

  const languages = [
    { code: "en", label: "EN" },
    { code: "id", label: "ID" },
  ];

  $: currentLocale = $page.params.lang || 'en';

  function switchLanguage(newLang: 'en' | 'id') {
    if (!browser) return;  // Guard for SSR

    // Compute new URL
    const currentPath = $page.url.pathname;
    const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${newLang}`);

    // Set cookie (client-side)
    document.cookie = `lang=${newLang}; path=/; max-age=31536000; SameSite=Lax`;

    // Force full page reload to re-initialize i18n with new locale
    window.location.href = newPath;
  }
</script>

<div class="relative inline-block text-left">
  <button
    type="button"
    class="lang-btn smallcaps"
    on:click={() => (open = !open)}
    aria-expanded={open}
  >
    <span>{languages.find((l) => l.code === currentLocale)?.label}</span>
    <svg
      class="w-3 h-3 transition-transform"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      class:rotate-180={open}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2.5"
        d="M19 9l-7 7-7-7"
      ></path>
    </svg>
  </button>

  {#if open}
    <div class="absolute right-0 mt-2 w-28 z-50 lang-sheet">
      {#each languages as lang (lang.code)}
        <button
          on:click={() => switchLanguage(lang.code as 'en' | 'id')}
          class="lang-option"
          class:active={lang.code === currentLocale}
        >
          {lang.label}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .lang-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 10px 14px;
    background: transparent;
    border: 1.5px solid var(--color-line);
    border-radius: 999px;
    color: var(--color-ink-soft);
    cursor: pointer;
    font-size: 10px;
    transition: border-color 0.15s, color 0.15s;
  }
  .lang-btn:hover {
    border-color: var(--color-ink-faint);
    color: var(--color-ink);
  }

  .lang-sheet {
    background: #ffffff;
    border: 1px solid var(--color-line);
    border-radius: 14px;
    box-shadow: 0 12px 32px rgba(27, 27, 27, 0.1);
    overflow: hidden;
    padding: 4px;
  }

  .lang-option {
    display: block;
    width: 100%;
    padding: 9px 12px;
    text-align: left;
    background: transparent;
    border: none;
    border-radius: 10px;
    color: var(--color-ink-soft);
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: color 0.15s, background 0.15s;
  }
  .lang-option:hover,
  .lang-option.active {
    color: var(--color-ink);
    background: var(--color-paper-deep);
  }

  button:focus {
    outline: none;
  }
</style>
