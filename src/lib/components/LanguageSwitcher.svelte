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
    class="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all select-none"
    on:click={() => (open = !open)}
  >
    <span>{languages.find((l) => l.code === currentLocale)?.label}</span>
    <svg
      class="w-4 h-4 ml-1 transition-transform"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      class:rotate-180={open}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 9l-7 7-7-7"
      ></path>
    </svg>
  </button>

  {#if open}
    <div
      class="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg z-50"
    >
      {#each languages as lang}
        <button
          on:click={() => switchLanguage(lang.code as 'en' | 'id')}
          class="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-all"
        >
          <span>{lang.label}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  button:focus {
    outline: none;
  }
</style>
