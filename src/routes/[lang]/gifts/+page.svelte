<script lang="ts">
  import { getAllCategoryExplanations } from "$lib/utils/category-explanation";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { _ } from "svelte-i18n";
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  const lang = $page.params.lang as "en" | "id";
  const categories = getAllCategoryExplanations(lang);

  let visible = false;
  let searchQuery = "";

  $: filtered = searchQuery.trim()
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : categories;

  onMount(() =>
    requestAnimationFrame(() => {
      visible = true;
    }),
  );

  function viewCategory(categoryKey: string) {
    goto(`/${lang}/gifts/${categoryKey}`);
  }

  // Assign a soft accent color per card for visual variety within the green palette
  const cardAccents = [
    { bg: "#eef5e4", dot: "#6b8f27" },
    { bg: "#e8f0d8", dot: "#4a6518" },
    { bg: "#f4f9ec", dot: "#7ea832" },
    { bg: "#eaf3de", dot: "#5a7a1f" },
  ];
  function accentFor(i: number) {
    return cardAccents[i % cardAccents.length];
  }
</script>

<svelte:head>
  <title>{$_("pages.gifts.title")} - TheGifts</title>
  <meta name="description" content={$_("pages.gifts.subtitle")} />
</svelte:head>

<div class="page">
  <div class="relative z-10 max-w-7xl mx-auto px-6 py-16 pb-24">
    <!-- Header -->
    <div class="text-center mb-14">
      <div class="eyebrow reveal {visible ? 'in' : ''}">All Gifts</div>

      <h1
        class="serif reveal d1 {visible ? 'in' : ''}
                 text-4xl sm:text-5xl md:text-6xl text-[#1a2e05] leading-tight mb-4"
      >
        {$_("pages.gifts.title")}
      </h1>

      <p
        class="reveal d2 {visible ? 'in' : ''}
                text-base sm:text-lg text-[#4a5e2a]/65 max-w-xl mx-auto leading-relaxed mb-8"
      >
        {$_("pages.gifts.subtitle")}
      </p>

      <!-- Search -->
      <div class="reveal d3 {visible ? 'in' : ''}">
        <div class="search-wrap">
          <span class="search-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><circle cx="11" cy="11" r="8" /><path
                d="m21 21-4.35-4.35"
              /></svg
            >
          </span>
          <input
            class="search-input"
            type="search"
            placeholder={lang === "id" ? "Cari karunia…" : "Search gifts…"}
            bind:value={searchQuery}
          />
        </div>
      </div>
    </div>

    <!-- Count + divider -->
    {#if visible}
      <div
        class="flex items-center justify-center gap-3 mb-10"
        in:fade={{ duration: 300, delay: 300 }}
      >
        <span class="count-badge">
          {filtered.length}
          {filtered.length === 1
            ? lang === "id"
              ? "karunia"
              : "gift"
            : lang === "id"
              ? "karunia"
              : "gifts"}
        </span>
      </div>
    {/if}

    <!-- Grid -->
    {#if filtered.length > 0}
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
      >
        {#each filtered as category, i (category.key)}
          {@const accent = accentFor(i)}
          <button
            class="gift-card"
            on:click={() => viewCategory(category.key)}
            in:fly={{
              y: 20,
              duration: 380,
              delay: Math.min(i * 40, 400),
              easing: quintOut,
            }}
          >
            <!-- Subtle bg tint -->
            <div
              style="position:absolute;inset:0;border-radius:22px;background:{accent.bg};opacity:0.35;pointer-events:none;"
            ></div>

            <!-- Number -->
            <span class="card-num">{String(i + 1).padStart(2, "0")}</span>

            <!-- Dot accent -->
            <div
              class="card-dot"
              style="background:{accent.dot};opacity:0.7;"
            ></div>

            <!-- Name -->
            <h3 class="card-title">{category.name}</h3>

            <!-- Description -->
            <p class="card-desc">{category.description}</p>

            <!-- Footer -->
            <div class="card-footer">
              <span>{$_("pages.gifts.learnMore")}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg
              >
            </div>
          </button>
        {/each}
      </div>
    {:else}
      <div class="empty" in:fade={{ duration: 200 }}>
        <div class="empty-icon">✦</div>
        <p class="empty-text">
          {lang === "id"
            ? `Tidak ada karunia yang cocok dengan "${searchQuery}"`
            : `No gifts match "${searchQuery}"`}
        </p>
      </div>
    {/if}
  </div>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap");

  .page {
    font-family: "DM Sans", sans-serif;
    background: linear-gradient(160deg, #f7f3eb 0%, #eef5e4 55%, #f2efe6 100%);
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }

  /* Background blobs */
  .page::before {
    content: "";
    position: fixed;
    top: -100px;
    right: -120px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(107, 143, 39, 0.08) 0%,
      transparent 65%
    );
    pointer-events: none;
    z-index: 0;
  }
  .page::after {
    content: "";
    position: fixed;
    bottom: 0;
    left: -80px;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(143, 184, 64, 0.06) 0%,
      transparent 65%
    );
    pointer-events: none;
    z-index: 0;
  }

  .serif {
    font-family: "DM Serif Display", serif;
  }

  /* Page reveal */
  .reveal {
    opacity: 0;
    transform: translateY(20px);
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

  /* Search input */
  .search-wrap {
    position: relative;
    max-width: 440px;
    margin: 0 auto;
  }
  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #8aab52;
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    padding: 13px 20px 13px 46px;
    border-radius: 14px;
    background: white;
    border: 1.5px solid #e0ebb8;
    font-size: 14px;
    font-family: "DM Sans", sans-serif;
    color: #1a2e05;
    outline: none;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
    box-shadow: 0 2px 12px rgba(107, 143, 39, 0.06);
  }
  .search-input::placeholder {
    color: #a8bc80;
  }
  .search-input:focus {
    border-color: #8fb840;
    box-shadow:
      0 0 0 3px rgba(107, 143, 39, 0.1),
      0 2px 12px rgba(107, 143, 39, 0.08);
  }

  /* Gift card */
  .gift-card {
    background: white;
    border-radius: 22px;
    border: 1.5px solid #e8f0d8;
    padding: 28px 24px 22px;
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease,
      border-color 0.25s ease;
  }
  .gift-card::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #4a6518, #8fb840);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  .gift-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 36px rgba(74, 101, 24, 0.12);
    border-color: #c8e0a0;
  }
  .gift-card:hover::after {
    transform: scaleX(1);
  }

  /* Top accent dot */
  .card-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-bottom: 16px;
    flex-shrink: 0;
  }

  /* Card number badge */
  .card-num {
    position: absolute;
    top: 18px;
    right: 20px;
    font-family: "DM Serif Display", serif;
    font-style: italic;
    font-size: 13px;
    color: rgba(107, 143, 39, 0.3);
    pointer-events: none;
  }

  /* Card title */
  .card-title {
    font-family: "DM Serif Display", serif;
    font-size: 22px;
    color: #1a2e05;
    margin-bottom: 10px;
    line-height: 1.2;
    transition: color 0.2s;
  }
  .gift-card:hover .card-title {
    color: #4a6518;
  }

  /* Card description */
  .card-desc {
    font-size: 13px;
    color: rgba(74, 94, 42, 0.65);
    line-height: 1.65;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Card footer */
  .card-footer {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 18px;
    font-size: 13px;
    font-weight: 600;
    color: #6b8f27;
    transition: gap 0.2s;
  }
  .gift-card:hover .card-footer {
    gap: 8px;
  }

  /* Section eyebrow */
  .eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #8aab52;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  .eyebrow::before,
  .eyebrow::after {
    content: "";
    display: block;
    width: 28px;
    height: 1px;
    background: rgba(138, 171, 82, 0.4);
  }

  /* Empty state */
  .empty {
    text-align: center;
    padding: 60px 20px;
    color: #8aab52;
  }
  .empty-icon {
    font-size: 36px;
    margin-bottom: 12px;
  }
  .empty-text {
    font-size: 15px;
  }

  /* Count badge */
  .count-badge {
    display: inline-flex;
    align-items: center;
    padding: 3px 12px;
    border-radius: 999px;
    background: rgba(107, 143, 39, 0.1);
    border: 1px solid rgba(107, 143, 39, 0.2);
    font-size: 12px;
    font-weight: 600;
    color: #4a6518;
  }

  /* Organic divider */
  .organic-divider {
    height: 1px;
    margin: 32px 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(107, 143, 39, 0.15) 30%,
      rgba(107, 143, 39, 0.15) 70%,
      transparent
    );
  }
</style>
