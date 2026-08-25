<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { _ } from "svelte-i18n";
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import GiftMark from "$lib/components/illustrations/GiftMark.svelte";
  import { giftColor } from "$lib/data/gift-colors";

  let { data }: { data: PageData } = $props();
  const lang = $page.params.lang;
  const { category } = data;

  const gc = giftColor(category.key);

  const fromResult = $page.url.searchParams.get("from") === "result";
  const resultId = $page.url.searchParams.get("id");

  let showModal = $state(false);
  let selectedReference = $state<{ verse: string; text: string } | null>(null);

  function goBack() {
    if (fromResult && resultId)
      goto(`/${lang}/questionnaire/result/${resultId}`);
    else goto(`/${lang}/gifts`);
  }

  function viewAllGifts() {
    goto(`/${lang}/gifts`);
  }

  function openModal(reference: { verse: string; text: string }) {
    selectedReference = reference;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedReference = null;
  }

  onMount(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });
</script>

<svelte:head>
  <title>{category.name} - {$_("pages.gifts.title")} - TheGifts</title>
  <meta name="description" content={category.description} />
</svelte:head>

<div class="page">
  <div class="max-w-2xl mx-auto px-6 py-12 pb-24">
    <!-- Nav row -->
    <div class="flex items-center gap-3 mb-8 press-in">
      <button class="back-btn smallcaps" onclick={goBack}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        {fromResult ? $_("pages.gifts.backToResults") : $_("pages.gifts.back")}
      </button>
      {#if fromResult}
        <button class="all-gifts-btn smallcaps" onclick={viewAllGifts}>
          {$_("pages.gifts.viewAllGifts")}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      {/if}
    </div>

    <!-- Hero card in gift color -->
    <div class="hero-card press-in press-in-d1 mb-10" style="background: {gc.pale};">
      <div class="hero-mark">
        <GiftMark glyph={gc.glyph} color={gc.accent} />
      </div>
      <div class="smallcaps hero-eyebrow mb-3" style="color: {gc.accent};">
        {$_("pages.gifts.title")}
      </div>
      <h1 class="display text-4xl sm:text-5xl text-ink font-bold leading-[1.05]">
        {category.name}
      </h1>
    </div>

    <!-- Description -->
    <section class="chapter-section press-in press-in-d2">
      <h2 class="section-title display">{$_("pages.gifts.sections.description")}</h2>
      <p class="text-base text-ink-soft leading-relaxed max-w-xl">
        {category.description}
      </p>
    </section>

    <!-- Characteristics -->
    {#if category.characteristics.length > 0}
      <section class="chapter-section press-in press-in-d3">
        <h2 class="section-title display">
          {$_("pages.gifts.sections.characteristics")}
        </h2>
        <div class="char-grid">
          {#each category.characteristics as char (char)}
            <div class="char-item">{char}</div>
          {/each}
        </div>
      </section>
    {/if}

    <!-- Biblical references -->
    {#if category.biblical_references.length > 0}
      <section class="chapter-section press-in press-in-d3">
        <h2 class="section-title display">
          {$_("pages.gifts.sections.biblical_references")}
        </h2>
        <div class="flex flex-col gap-3">
          {#each category.biblical_references as reference (reference.verse)}
            <button
              type="button"
              class="scripture-btn"
              style="--gift: {gc.accent};"
              onclick={() => openModal(reference)}
            >
              <span class="scripture-book-icon" style="background: {gc.pale};">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gc.accent} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </span>
              <span class="flex-1 text-left">
                <span class="block text-sm font-bold text-ink mb-0.5">
                  {reference.verse}
                </span>
                <span class="block text-xs text-ink-faint">
                  {$_("pages.gifts.clickToRead")}
                </span>
              </span>
              <svg class="flex-shrink-0" style="color:var(--color-ink-faint);" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          {/each}
        </div>
      </section>
    {/if}

    <!-- Practical applications -->
    {#if category.practical_applications.length > 0}
      <section class="chapter-section press-in press-in-d4">
        <h2 class="section-title display">
          {$_("pages.gifts.sections.practical_applications")}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          {#each category.practical_applications as app, i (app)}
            <div class="app-card">
              <span class="app-num" style="background: {gc.pale}; color: {gc.accent};">{i + 1}</span>
              <p class="app-text">{app}</p>
            </div>
          {/each}
        </div>
      </section>
    {/if}
  </div>
</div>

<!-- Scripture modal -->
{#if showModal && selectedReference}
  <div
    class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-5"
    style="background:rgba(27,27,27,0.45);"
    role="button"
    tabindex="-1"
    aria-label="Close modal"
    onclick={closeModal}
    onkeydown={(e) => e.key === "Escape" && closeModal()}
    transition:fade={{ duration: 150 }}
  >
    <div
      class="modal-sheet"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      in:fade={{ duration: 180 }}
      out:fade={{ duration: 130 }}
    >
      <!-- Header -->
      <div class="modal-header">
        <div>
          <div class="smallcaps mb-2" style="color: {gc.accent};">Scripture</div>
          <h3 class="modal-verse display">{selectedReference.verse}</h3>
        </div>
        <button class="modal-close" onclick={closeModal} aria-label={$_("common.close")}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <blockquote class="modal-text">{selectedReference.text}</blockquote>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button type="button" class="modal-close-btn smallcaps" onclick={closeModal}>
          {$_("common.close")}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .page {
    background: var(--color-paper);
    min-height: 100vh;
  }

  /* Back nav */
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--color-ink-soft);
    background: #ffffff;
    border: 1.5px solid var(--color-line);
    border-radius: 999px;
    padding: 10px 18px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .back-btn:hover {
    border-color: var(--color-ink-faint);
    color: var(--color-ink);
  }

  .all-gifts-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--color-ink-faint);
    cursor: pointer;
    background: none;
    border: none;
    transition: color 0.15s;
  }
  .all-gifts-btn:hover {
    color: var(--color-ink);
  }

  /* Hero card */
  .hero-card {
    border-radius: 28px;
    padding: 36px 36px 32px;
  }
  .hero-mark {
    width: 84px;
    height: 84px;
    background: #ffffff;
    border-radius: 22px;
    padding: 15px;
    margin-bottom: 20px;
    box-shadow: 0 4px 14px rgba(27, 27, 27, 0.06);
  }
  .hero-eyebrow {
    letter-spacing: 0.16em;
  }

  /* Chapter sections */
  .chapter-section {
    background: #ffffff;
    border: 1px solid var(--color-line);
    border-radius: 24px;
    padding: 30px 30px;
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 21px;
    font-weight: 700;
    color: var(--color-ink);
    margin-bottom: 16px;
    line-height: 1.2;
  }

  /* Characteristics — soft chips */
  .char-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .char-item {
    padding: 12px 16px;
    border-radius: 14px;
    background: var(--color-paper);
    font-size: 14px;
    font-weight: 500;
    color: var(--color-ink-soft);
    line-height: 1.55;
  }

  /* Scripture cards */
  .scripture-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 14px;
    background: var(--color-paper);
    border: 1px solid var(--color-line);
    border-radius: 16px;
    padding: 16px 18px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
  }
  .scripture-btn:hover {
    border-color: var(--gift);
    background: #ffffff;
  }
  .scripture-book-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* Application cards */
  .app-card {
    background: var(--color-paper);
    border-radius: 16px;
    padding: 18px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .app-num {
    width: 30px;
    height: 30px;
    border-radius: 999px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
  }
  .app-text {
    font-size: 14px;
    color: var(--color-ink-soft);
    line-height: 1.6;
    font-weight: 500;
  }

  /* Modal */
  .modal-sheet {
    background: var(--color-paper);
    border-radius: 24px;
    max-width: 520px;
    width: 100%;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 24px 64px rgba(27, 27, 27, 0.24);
  }
  .modal-header {
    padding: 26px 28px 18px;
    border-bottom: 1px solid var(--color-line);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .modal-verse {
    font-size: 21px;
    font-weight: 700;
    color: var(--color-ink);
    line-height: 1.25;
  }
  .modal-close {
    width: 34px;
    height: 34px;
    border: 1.5px solid var(--color-line);
    border-radius: 999px;
    background: #ffffff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-ink-soft);
    flex-shrink: 0;
    transition: border-color 0.15s, color 0.15s;
  }
  .modal-close:hover {
    border-color: var(--color-ink-faint);
    color: var(--color-ink);
  }
  .modal-body {
    padding: 24px 28px;
    overflow-y: auto;
    flex: 1;
  }
  .modal-text {
    margin: 0;
    font-family: var(--font-display);
    font-style: italic;
    font-size: 18px;
    line-height: 1.75;
    color: var(--color-ink);
  }
  .modal-footer {
    padding: 16px 28px;
    border-top: 1px solid var(--color-line);
  }
  .modal-close-btn {
    display: inline-flex;
    align-items: center;
    padding: 12px 24px;
    border: none;
    border-radius: 999px;
    background: var(--color-ink);
    color: var(--color-paper);
    cursor: pointer;
    transition: background 0.15s;
  }
  .modal-close-btn:hover {
    background: var(--color-ink-soft);
  }
</style>
