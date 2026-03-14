<script lang="ts">
  import { _ } from "svelte-i18n";
  import logoUrl from "$lib/assets/logo.svg";
  export let logoSrc: string = logoUrl;
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { RESULTS_STORAGE_KEY } from "$lib/constants/constants";
  import Restart from "$lib/icons/Restart.svelte";
  import { RestartTest } from "$lib/utils/utils";
  import LanguageSwitcher from "./LanguageSwitcher.svelte";
  import { fly, fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";

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
        scrolled = window.scrollY > 20;
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

<!-- Navbar -->
<nav class="navbar {scrolled ? 'scrolled' : 'top'}">
  <div class="navbar-inner">
    <!-- Brand -->
    <a href="/" rel="external" class="brand">
      <div class="brand-logo">
        <img
          src={logoSrc}
          alt="TheGifts Logo"
          style="width:100%;height:100%;object-fit:cover;"
        />
      </div>
      <span class="brand-name">TheGifts</span>
    </a>

    <!-- Right side -->
    <div class="nav-right">
      <LanguageSwitcher />

      {#if isHomePage}
        <!-- Desktop actions -->
        <div class="hidden md:flex items-center gap-2">
          {#if isContinueTestVisible}
            <a href="/questionnaire" class="btn-start">
              {$_("components.navbar.continueTest")}
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg
              >
            </a>
            <a href="/onboarding" class="btn-restart" on:click={RestartTest}>
              <Restart />
              {$_("components.navbar.restartTest")}
            </a>
          {:else}
            <a href="/onboarding" class="btn-start">
              {$_("components.navbar.startTest")}
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg
              >
            </a>
          {/if}
        </div>

        <!-- Mobile: hamburger (only when continue test visible) or inline start btn -->
        <div class="md:hidden flex items-center gap-2">
          {#if isContinueTestVisible}
            <button
              class="hamburger"
              on:click={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {#if mobileMenuOpen}
                <!-- X icon -->
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              {:else}
                <!-- Burger icon -->
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              {/if}
            </button>
          {:else}
            <a href="/onboarding" class="btn-start">
              {$_("components.navbar.startTest")}
            </a>
          {/if}
        </div>
      {/if}
    </div>
  </div>
  <div class="navbar-line"></div>
</nav>

<!-- Mobile drawer -->
{#if isHomePage && isContinueTestVisible && mobileMenuOpen}
  <!-- Backdrop -->
  <div
    transition:fade={{ duration: 180 }}
    class="fixed inset-0 z-40 bg-black/10"
    role="button"
    tabindex="-1"
    aria-label="Close menu"
    on:click={closeMenu}
    on:keydown={(e) => e.key === "Escape" && closeMenu()}
  ></div>

  <!-- Drawer panel -->
  <div
    transition:fly={{ y: -12, duration: 260, easing: quintOut }}
    class="mobile-drawer md:hidden"
  >
    <a href="/questionnaire" class="drawer-continue" on:click={closeMenu}>
      {$_("components.navbar.continueTest")}
    </a>
    <a
      href="/onboarding"
      class="drawer-restart"
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
  @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap");

  .navbar {
    font-family: "DM Sans", sans-serif;
    position: sticky;
    top: 0;
    z-index: 50;
    width: 100%;
    /* Starts transparent, gains background on scroll via .scrolled class */
    transition:
      background 0.3s ease,
      box-shadow 0.3s ease,
      backdrop-filter 0.3s ease;
  }

  /* Transparent on top of hero */
  .navbar.top {
    background: rgba(247, 243, 235, 0);
    box-shadow: none;
  }

  /* Frosted glass after scrolling */
  .navbar.scrolled {
    background: rgba(247, 243, 235, 0.88);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow:
      0 1px 0 rgba(107, 143, 39, 0.12),
      0 4px 20px rgba(0, 0, 0, 0.04);
  }

  .navbar-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Brand */
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    flex-shrink: 0;
  }
  .brand-logo {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(74, 101, 24, 0.15);
  }
  .brand-name {
    font-family: "DM Serif Display", serif;
    font-size: 20px;
    color: #1a2e05;
    line-height: 1;
    transition: color 0.2s;
  }
  .brand:hover .brand-name {
    color: #4a6518;
  }

  /* Nav right area */
  .nav-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Desktop buttons */
  .btn-start {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #3d5a12, #6b8f27);
    color: white;
    font-weight: 600;
    font-size: 13px;
    padding: 8px 18px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 0 2px 12px rgba(74, 101, 24, 0.22);
    position: relative;
    overflow: hidden;
    transition:
      transform 0.15s,
      box-shadow 0.15s;
    white-space: nowrap;
    font-family: "DM Sans", sans-serif;
  }
  .btn-start::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -20%;
    width: 60%;
    height: 200%;
    background: radial-gradient(
      ellipse,
      rgba(255, 255, 255, 0.12) 0%,
      transparent 60%
    );
    pointer-events: none;
  }
  .btn-start:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(74, 101, 24, 0.28);
  }

  .btn-restart {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #4a6518;
    font-weight: 500;
    font-size: 13px;
    padding: 7px 14px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    background: rgba(107, 143, 39, 0.08);
    border: 1px solid rgba(107, 143, 39, 0.2);
    transition:
      background 0.15s,
      border-color 0.15s,
      color 0.15s;
    white-space: nowrap;
    font-family: "DM Sans", sans-serif;
  }
  .btn-restart:hover {
    background: rgba(220, 38, 38, 0.07);
    border-color: rgba(220, 38, 38, 0.25);
    color: #dc2626;
  }

  /* Hamburger button */
  .hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: none;
    background: rgba(107, 143, 39, 0.08);
    border: 1px solid rgba(107, 143, 39, 0.15);
    cursor: pointer;
    color: #4a6518;
    transition: background 0.15s;
  }
  .hamburger:hover {
    background: rgba(107, 143, 39, 0.14);
  }

  /* Mobile drawer */
  .mobile-drawer {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: rgba(247, 243, 235, 0.97);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(107, 143, 39, 0.12);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    z-index: 49;
    padding: 16px 20px 20px;
  }

  .drawer-continue {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 13px;
    border-radius: 12px;
    text-decoration: none;
    background: linear-gradient(135deg, #3d5a12, #6b8f27);
    color: white;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 10px;
    box-shadow: 0 3px 14px rgba(74, 101, 24, 0.22);
    font-family: "DM Sans", sans-serif;
  }

  .drawer-restart {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px;
    border-radius: 12px;
    text-decoration: none;
    background: rgba(107, 143, 39, 0.06);
    border: 1px solid rgba(107, 143, 39, 0.15);
    color: #4a6518;
    font-weight: 500;
    font-size: 14px;
    font-family: "DM Sans", sans-serif;
  }

  /* Organic bottom border on navbar when scrolled */
  .navbar-line {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(107, 143, 39, 0.15) 30%,
      rgba(107, 143, 39, 0.15) 70%,
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.3s;
  }
  .scrolled .navbar-line {
    opacity: 1;
  }
</style>
