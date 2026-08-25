<script lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { RESULTS_STORAGE_KEY } from "$lib/constants/constants";
  import Restart from "$lib/icons/Restart.svelte";
  import { RestartTest } from "$lib/utils/utils";
  import LanguageSwitcher from "./LanguageSwitcher.svelte";

  let isContinueTestVisible = false;
  let mobileMenuOpen = false;
  let scrolled = false;

  $: isHomePage =
    $page.url.pathname === "/" ||
    $page.url.pathname === "/en" ||
    $page.url.pathname === "/id";

  onMount(() => {
    if (typeof window !== "undefined") {
      const savedResults = localStorage.getItem(RESULTS_STORAGE_KEY);
      isContinueTestVisible = savedResults !== null;

      const onScroll = () => {
        scrolled = window.scrollY > 12;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
  });

  function toggleMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
  function closeMenu() {
    mobileMenuOpen = false;
  }
</script>

<nav class="navbar" class:scrolled>
  <div class="navbar-inner">
    <!-- Brand: slab wordmark + little mark -->
    <a href="/" rel="external" class="brand">
      <svg viewBox="0 0 32 32" class="brand-mark" aria-hidden="true">
        <path
          d="M16 3 L20 12 L29 13 L22 19.5 L24 29 L16 24 L8 29 L10 19.5 L3 13 L12 12 Z"
          fill="#d97706"
          stroke="#1b1b1b"
          stroke-width="2.5"
          stroke-linejoin="round"
        />
      </svg>
      <span class="brand-name display">The&nbsp;Gifts</span>
    </a>

    <!-- Right side -->
    <div class="nav-right">
      <LanguageSwitcher />

      {#if isHomePage}
        <!-- Desktop actions -->
        <div class="hidden md:flex items-center gap-2">
          {#if isContinueTestVisible}
            <a href="/questionnaire" class="btn-start smallcaps">
              {$_("components.navbar.continueTest")}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="/onboarding" class="btn-restart smallcaps" on:click={RestartTest}>
              <Restart />
              {$_("components.navbar.restartTest")}
            </a>
          {:else}
            <a href="/onboarding" class="btn-start smallcaps">
              {$_("components.navbar.startTest")}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          {/if}
        </div>

        <!-- Mobile -->
        <div class="md:hidden flex items-center gap-2">
          {#if isContinueTestVisible}
            <button
              class="hamburger"
              on:click={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {#if mobileMenuOpen}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              {:else}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              {/if}
            </button>
          {:else}
            <a href="/onboarding" class="btn-start smallcaps">
              {$_("components.navbar.startTest")}
            </a>
          {/if}
        </div>
      {/if}
    </div>
  </div>
</nav>

<!-- Mobile drawer -->
{#if isHomePage && isContinueTestVisible && mobileMenuOpen}
  <button
    class="fixed inset-0 z-40 bg-black/10"
    aria-label="Close menu"
    on:click={closeMenu}
  ></button>

  <div class="mobile-drawer md:hidden">
    <a href="/questionnaire" class="drawer-start smallcaps" on:click={closeMenu}>
      {$_("components.navbar.continueTest")}
    </a>
    <a
      href="/onboarding"
      class="drawer-restart smallcaps"
      on:click={() => {
        RestartTest();
        closeMenu();
      }}
    >
      <Restart />
      {$_("components.navbar.restartTest")}
    </a>
  </div>
{/if}

<style>
  .navbar {
    position: sticky;
    top: 0;
    z-index: 50;
    width: 100%;
    background: var(--color-paper);
    transition: box-shadow 0.25s ease;
  }
  .navbar.scrolled {
    box-shadow: 0 1px 0 var(--color-line), 0 4px 16px rgba(27, 27, 27, 0.05);
  }

  .navbar-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Brand */
  .brand {
    display: flex;
    align-items: center;
    gap: 9px;
    text-decoration: none;
    flex-shrink: 0;
  }
  .brand-mark {
    width: 26px;
    height: 26px;
  }
  .brand-name {
    font-size: 21px;
    font-weight: 700;
    color: var(--color-ink);
    line-height: 1;
    transition: color 0.2s;
  }
  .brand:hover .brand-name {
    color: var(--color-amber);
  }

  /* Nav right area */
  .nav-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Primary: ink pill */
  .btn-start {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: var(--color-ink);
    color: var(--color-paper);
    font-size: 10px;
    padding: 11px 20px;
    border-radius: 999px;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    transition: background 0.15s, transform 0.15s;
  }
  .btn-start:hover {
    background: var(--color-ink-soft);
    transform: translateY(-1px);
  }

  /* Secondary: outline pill */
  .btn-restart {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--color-ink-soft);
    font-size: 10px;
    padding: 10px 16px;
    border-radius: 999px;
    cursor: pointer;
    text-decoration: none;
    background: transparent;
    border: 1.5px solid var(--color-line);
    transition: border-color 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .btn-restart:hover {
    border-color: var(--color-ink-faint);
    color: var(--color-ink);
  }

  /* Hamburger */
  .hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    border: 1.5px solid var(--color-line);
    background: transparent;
    cursor: pointer;
    color: var(--color-ink);
    transition: border-color 0.15s;
  }
  .hamburger:hover {
    border-color: var(--color-ink-faint);
  }

  /* Mobile drawer */
  .mobile-drawer {
    position: fixed;
    top: 72px;
    left: 12px;
    right: 12px;
    background: #ffffff;
    border: 1px solid var(--color-line);
    border-radius: 20px;
    box-shadow: 0 16px 40px rgba(27, 27, 27, 0.12);
    z-index: 49;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .drawer-start {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
    text-decoration: none;
    background: var(--color-ink);
    color: var(--color-paper);
    border-radius: 999px;
    font-size: 11px;
  }

  .drawer-restart {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 14px;
    text-decoration: none;
    background: transparent;
    border: 1.5px solid var(--color-line);
    border-radius: 999px;
    color: var(--color-ink-soft);
    font-size: 11px;
  }
</style>
