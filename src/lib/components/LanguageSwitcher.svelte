<script lang="ts">
  import { locale } from "svelte-i18n";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";

  let open = false;
  let currentLocale = "en";

  const languages = [
    { code: "en", label: "EN" },
    { code: "id", label: "ID" },
  ];

  onMount(() => {
    if (browser) {
      const userLang =
        window.localStorage.getItem("lang") ||
        // locale.get() ||
        window.navigator.language.split("-")[0];
      currentLocale = userLang === "id" ? "id" : "en"; // fallback safety
      locale.set(currentLocale);
    }
  });

  function changeLanguage(lang: string) {
    currentLocale = lang;
    locale.set(lang);
    if (browser) localStorage.setItem("lang", lang);
    open = false;
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
          on:click={() => changeLanguage(lang.code)}
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
