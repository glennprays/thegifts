<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { _ } from "svelte-i18n";
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import { fly, fade, scale } from "svelte/transition";
  import { quintOut, cubicOut } from "svelte/easing";

  let { data }: { data: PageData } = $props();
  const lang = $page.params.lang;
  const { category } = data;

  const fromResult = $page.url.searchParams.get("from") === "result";
  const resultId = $page.url.searchParams.get("id");

  let showModal = $state(false);
  let selectedReference = $state<{ verse: string; text: string } | null>(null);
  let visible = $state(false);

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
    requestAnimationFrame(() => {
      visible = true;
    });
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
  <div class="relative z-10 max-w-3xl mx-auto px-5 py-14 pb-24">
    <!-- Nav row -->
    <div class="flex items-center gap-3 mb-10 reveal {visible ? 'in' : ''}">
      <button class="back-btn" onclick={goBack}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg
        >
        {fromResult ? $_("pages.gifts.backToResults") : $_("pages.gifts.back")}
      </button>
      {#if fromResult}
        <span style="color:#d8ebb0;">·</span>
        <button class="all-gifts-btn" onclick={viewAllGifts}>
          {$_("pages.gifts.viewAllGifts")}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg
          >
        </button>
      {/if}
    </div>

    <!-- Hero block -->
    <div class="hero-block mb-8 reveal d1 {visible ? 'in' : ''}">
      <div
        class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-xs font-semibold tracking-widest"
        style="background:rgba(255,255,255,0.16);color:rgba(255,255,255,0.88);"
      >
        ✦ {$_("pages.gifts.title")}
      </div>
      <h1
        class="serif text-5xl md:text-6xl text-white leading-tight mb-0"
        style="position:relative;z-index:1;"
      >
        {category.name}
      </h1>
    </div>

    <!-- Description -->
    <div class="section-card mb-6 reveal d2 {visible ? 'in' : ''}">
      <div class="section-eyebrow">
        {$_("pages.gifts.sections.description")}
      </div>
      <p class="text-base text-[#2a4010]/80 leading-relaxed">
        {category.description}
      </p>
    </div>

    <!-- Characteristics -->
    {#if category.characteristics.length > 0}
      <div class="section-card mb-6 reveal d3 {visible ? 'in' : ''}">
        <div class="section-eyebrow">
          {$_("pages.gifts.sections.characteristics")}
        </div>
        <h2 class="section-title">
          {$_("pages.gifts.sections.characteristics")}
        </h2>
        <div>
          {#each category.characteristics as char}
            <div class="char-item">
              <div class="char-dot"></div>
              <span class="text-sm text-[#2a4010]/75 leading-relaxed"
                >{char}</span
              >
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Biblical references -->
    {#if category.biblical_references.length > 0}
      <div class="section-card mb-6 reveal d3 {visible ? 'in' : ''}">
        <div class="section-eyebrow">
          {$_("pages.gifts.sections.biblical_references")}
        </div>
        <h2 class="section-title">
          {$_("pages.gifts.sections.biblical_references")}
        </h2>
        <div class="flex flex-col gap-3">
          {#each category.biblical_references as reference}
            <button
              type="button"
              class="scripture-btn"
              onclick={() => openModal(reference)}
            >
              <div class="scripture-icon">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4a6518"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div>
                <div class="text-sm font-semibold text-[#4a6518] mb-1">
                  {reference.verse}
                </div>
                <div class="text-xs text-[#8aab52]">
                  {$_("pages.gifts.clickToRead")}
                </div>
              </div>
              <svg
                class="ml-auto flex-shrink-0 mt-1"
                style="color:#c8daa8;"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg
              >
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Practical applications -->
    {#if category.practical_applications.length > 0}
      <div class="section-card reveal d4 {visible ? 'in' : ''}">
        <div class="section-eyebrow">
          {$_("pages.gifts.sections.practical_applications")}
        </div>
        <h2 class="section-title">
          {$_("pages.gifts.sections.practical_applications")}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          {#each category.practical_applications as app, i}
            <div class="app-card">
              <div class="app-num">{i + 1}</div>
              <p class="app-text">{app}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<!-- Scripture modal -->
{#if showModal && selectedReference}
  <div
    class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-5"
    style="background:rgba(15,25,5,0.55);backdrop-filter:blur(4px);"
    role="button"
    tabindex="-1"
    aria-label="Close modal"
    onclick={closeModal}
    onkeydown={(e) => e.key === "Escape" && closeModal()}
    transition:fade={{ duration: 180 }}
  >
    <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
    <div
      class="modal-sheet"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      in:fly={{ y: 24, duration: 320, easing: quintOut }}
      out:fly={{ y: 20, duration: 200, easing: cubicOut }}
    >
      <!-- Header -->
      <div class="modal-header">
        <div>
          <div
            class="text-xs font-semibold tracking-widest uppercase text-[#8aab52] mb-2"
          >
            Scripture
          </div>
          <h3 class="modal-verse">{selectedReference.verse}</h3>
        </div>
        <button class="modal-close" onclick={closeModal} aria-label="Close">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg
          >
        </button>
      </div>

      <!-- Body -->
      <div class="modal-body">
        <p class="modal-text">{selectedReference.text}</p>
      </div>

      <!-- Footer -->
      <div class="modal-footer">
        <button type="button" class="modal-close-btn" onclick={closeModal}>
          {$_("common.close")}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap");

  .page {
    font-family: "DM Sans", sans-serif;
    background: linear-gradient(160deg, #f7f3eb 0%, #eef5e4 55%, #f2efe6 100%);
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }
  .page::before {
    content: "";
    position: fixed;
    top: -100px;
    right: -100px;
    width: 480px;
    height: 480px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(107, 143, 39, 0.09) 0%,
      transparent 65%
    );
    pointer-events: none;
    z-index: 0;
  }
  .page::after {
    content: "";
    position: fixed;
    bottom: -60px;
    left: -80px;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(143, 184, 64, 0.07) 0%,
      transparent 65%
    );
    pointer-events: none;
    z-index: 0;
  }

  .serif {
    font-family: "DM Serif Display", serif;
  }

  /* Reveal */
  .reveal {
    opacity: 0;
    transform: translateY(18px);
    transition:
      opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal.in {
    opacity: 1;
    transform: translateY(0);
  }
  .d1 {
    transition-delay: 0.06s;
  }
  .d2 {
    transition-delay: 0.14s;
  }
  .d3 {
    transition-delay: 0.22s;
  }
  .d4 {
    transition-delay: 0.3s;
  }

  /* Back nav */
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #4a6518;
    background: rgba(107, 143, 39, 0.08);
    border: 1px solid rgba(107, 143, 39, 0.18);
    border-radius: 10px;
    padding: 7px 14px;
    cursor: pointer;
    text-decoration: none;
    transition:
      background 0.15s,
      transform 0.15s;
    font-family: "DM Sans", sans-serif;
  }
  .back-btn:hover {
    background: rgba(107, 143, 39, 0.14);
    transform: translateX(-2px);
  }

  .all-gifts-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #8aab52;
    text-decoration: none;
    cursor: pointer;
    background: none;
    border: none;
    transition: color 0.15s;
    font-family: "DM Sans", sans-serif;
  }
  .all-gifts-btn:hover {
    color: #4a6518;
  }

  /* Hero block */
  .hero-block {
    background: linear-gradient(
      145deg,
      #3d5a12 0%,
      #5a7c1a 40%,
      #6b8f27 75%,
      #7ea832 100%
    );
    border-radius: 28px;
    padding: 48px 44px 40px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(61, 90, 18, 0.2);
  }
  .hero-block::before {
    content: "";
    position: absolute;
    top: -60px;
    right: -60px;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.07);
    pointer-events: none;
  }
  .hero-block::after {
    content: "";
    position: absolute;
    bottom: -50px;
    left: -30px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    pointer-events: none;
  }

  /* Section */
  .section-card {
    background: white;
    border-radius: 24px;
    padding: 36px 32px;
    border: 1.5px solid #e8f0d8;
  }

  .section-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #8aab52;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .section-eyebrow::before {
    content: "";
    display: block;
    width: 20px;
    height: 1px;
    background: rgba(138, 171, 82, 0.4);
  }

  .section-title {
    font-family: "DM Serif Display", serif;
    font-size: 26px;
    color: #1a2e05;
    margin-bottom: 20px;
    line-height: 1.2;
  }

  /* Characteristics */
  .char-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid #f0f5e8;
  }
  .char-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  .char-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4a6518, #8fb840);
    flex-shrink: 0;
    margin-top: 6px;
  }

  /* Scripture cards */
  .scripture-btn {
    width: 100%;
    text-align: left;
    background: white;
    border-radius: 18px;
    padding: 22px 24px;
    border: 1.5px solid #e8f0d8;
    cursor: pointer;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    position: relative;
    overflow: hidden;
    transition:
      transform 0.2s,
      box-shadow 0.2s,
      border-color 0.2s;
    font-family: "DM Sans", sans-serif;
  }
  .scripture-btn::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #4a6518, #8fb840);
    border-radius: 4px 0 0 4px;
    transform: scaleY(0);
    transform-origin: top;
    transition: transform 0.25s ease;
  }
  .scripture-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(74, 101, 24, 0.1);
    border-color: #c8e0a0;
  }
  .scripture-btn:hover::after {
    transform: scaleY(1);
  }

  .scripture-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    flex-shrink: 0;
    background: linear-gradient(135deg, #f0f8e0, #e0f0c0);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Application cards */
  .app-card {
    background: white;
    border-radius: 18px;
    padding: 20px 22px;
    border: 1.5px solid #e8f0d8;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    position: relative;
    overflow: hidden;
  }
  .app-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 18px;
    background: linear-gradient(135deg, #f4f9ec, #eef5e4);
    opacity: 0.5;
    pointer-events: none;
  }
  .app-num {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    flex-shrink: 0;
    background: linear-gradient(135deg, #4a6518, #6b8f27);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: white;
    position: relative;
    z-index: 1;
  }
  .app-text {
    font-size: 14px;
    color: #1a2e05;
    line-height: 1.6;
    font-weight: 500;
    position: relative;
    z-index: 1;
  }

  /* Organic divider */
  .divider {
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(107, 143, 39, 0.15) 30%,
      rgba(107, 143, 39, 0.15) 70%,
      transparent
    );
  }

  /* Scripture modal */
  .modal-overlay {
    font-family: "DM Sans", sans-serif;
  }
  .modal-sheet {
    background: linear-gradient(170deg, #f9f6ef, #f4f9ec);
    border-radius: 28px;
    max-width: 540px;
    width: 100%;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
  }
  .modal-header {
    padding: 28px 28px 20px;
    border-bottom: 1px solid rgba(107, 143, 39, 0.12);
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  .modal-verse {
    font-family: "DM Serif Display", serif;
    font-size: 22px;
    color: #1a2e05;
    line-height: 1.25;
  }
  .modal-close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    background: rgba(107, 143, 39, 0.1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4a6518;
    flex-shrink: 0;
    transition:
      background 0.15s,
      transform 0.2s;
    font-family: "DM Sans", sans-serif;
  }
  .modal-close:hover {
    background: rgba(107, 143, 39, 0.18);
    transform: rotate(90deg);
  }
  .modal-body {
    padding: 24px 28px;
    overflow-y: auto;
    flex: 1;
  }
  .modal-text {
    font-size: 16px;
    font-style: italic;
    line-height: 1.8;
    color: #2a4010;
    padding: 20px 24px;
    border-radius: 16px;
    background: rgba(107, 143, 39, 0.06);
    border-left: 3px solid rgba(107, 143, 39, 0.3);
  }
  .modal-footer {
    padding: 16px 28px;
    border-top: 1px solid rgba(107, 143, 39, 0.1);
  }
  .modal-close-btn {
    display: inline-flex;
    align-items: center;
    padding: 10px 22px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #3d5a12, #6b8f27);
    color: white;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition:
      transform 0.15s,
      box-shadow 0.15s;
    font-family: "DM Sans", sans-serif;
    box-shadow: 0 2px 12px rgba(74, 101, 24, 0.22);
  }
  .modal-close-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(74, 101, 24, 0.28);
  }
</style>
