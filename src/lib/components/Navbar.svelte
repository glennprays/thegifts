<script lang="ts">
  import logoUrl from "$lib/assets/logo.svg";
  export let logoSrc: string = logoUrl;
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { RESULTS_STORAGE_KEY } from "$lib/constants/constants";
  import Restart from "$lib/icons/Restart.svelte";
  import { RestartTest } from "$lib/utils/utils";
  import LanguageSwitcher from "./LanguageSwitcher.svelte";

  let isContinueTestVisible = false;
  let mobileMenuOpen = false;

  onMount(() => {
    if (typeof window !== "undefined") {
      const savedResults = localStorage.getItem(RESULTS_STORAGE_KEY);
      isContinueTestVisible = savedResults !== null;
    }
  });

  function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
</script>

<nav
  class="w-full bg-white px-4 md:px-5 py-3 flex justify-between items-center z-50 relative"
>
  <a href="/" rel="external" class="flex items-center gap-2">
    <img src={logoSrc} alt="TheGifts Logo" class="h-9 w-9 rounded-full" />
    <span
      class="text-xl md:text-2xl font-sans font-medium select-none text-gray-800"
    >
      TheGifts
    </span>
  </a>

  <div class="flex items-center gap-3">
    <LanguageSwitcher />
    {#if $page.url.pathname === "/"}
      <div class="hidden md:flex items-center gap-3">
        {#if isContinueTestVisible}
          <a
            href="/questionnaire"
            class="bg-primary hover:bg-secondary text-white rounded-md text-sm font-semibold px-4 py-2 transition-colors duration-200 shadow-md"
          >
            Continue Test
          </a>
          <a
            href="/onboarding"
            class="text-secondary hover:text-white hover:bg-red-400 rounded-md text-sm font-semibold px-4 py-2 transition-colors duration-200 flex items-center gap-1 border border-secondary hover:border-accent"
            on:click={RestartTest}
          >
            Restart Test
            <Restart />
          </a>
        {:else}
          <a
            href="/onboarding"
            class="bg-primary hover:bg-secondary text-white rounded-md text-sm font-semibold px-4 py-2 transition-colors duration-200 shadow-md"
          >
            Start Test
          </a>
        {/if}
      </div>

      <div class="md:hidden flex items-center gap-2">
        {#if isContinueTestVisible}
          <button
            on:click={toggleMenu}
            class="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="currentColor"
            >
              <!-- Toggle between X and Burger Icon -->
              {#if mobileMenuOpen}
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              {:else}
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              {/if}
            </svg>
          </button>
        {:else}
          <a
            href="/onboarding"
            class="bg-primary hover:bg-secondary text-white rounded-md text-sm font-semibold px-3 py-1.5 transition-colors duration-200 shadow-sm"
          >
            Start Test
          </a>
        {/if}
      </div>
    {/if}
  </div>
</nav>

{#if $page.url.pathname === "/" && isContinueTestVisible}
  <div
    class="md:hidden absolute top-[60px] left-0 w-full bg-white shadow-lg transition-transform duration-300 ease-in-out z-40"
    class:transform={true}
    class:translate-y-0={mobileMenuOpen}
    class:translate-y-[-100%]={!mobileMenuOpen}
  >
    <!-- Menu items container -->
    <div class="flex flex-col p-4 space-y-2">
      <a
        href="/questionnaire"
        on:click={toggleMenu}
        class="text-base text-gray-700 font-medium p-2 rounded-lg hover:bg-primary/75 bg-primary text-white transition-colors"
      >
        Continue Test
      </a>
      <a
        href="/onboarding"
        on:click={RestartTest}
        class="text-base text-gray-700 font-medium p-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Restart Test
      </a>
    </div>
  </div>
{/if}
