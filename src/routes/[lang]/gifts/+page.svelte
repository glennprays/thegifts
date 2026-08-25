<script lang="ts">
  import { getAllCategoryExplanations } from "$lib/utils/category-explanation";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { _ } from "svelte-i18n";
  import GiftMark from "$lib/components/illustrations/GiftMark.svelte";
  import { giftColor } from "$lib/data/gift-colors";

  const lang = $page.params.lang as "en" | "id";
  const categories = getAllCategoryExplanations(lang);

  let searchQuery = "";

  $: filtered = searchQuery.trim()
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : categories;

  function viewCategory(categoryKey: string) {
    goto(`/${lang}/gifts/${categoryKey}`);
  }
</script>

<svelte:head>
  <title>{$_("pages.gifts.title")} - TheGifts</title>
  <meta name="description" content={$_("pages.gifts.subtitle")} />
</svelte:head>

<div class="page">
  <div class="max-w-5xl mx-auto px-6 py-16 pb-24">
    <!-- Header -->
    <div class="mb-10 press-in">
      <h1 class="display text-4xl sm:text-5xl text-ink font-bold leading-tight mb-4">
        {$_("pages.gifts.title")}
      </h1>

      <p class="text-base sm:text-lg text-ink-faint max-w-xl leading-relaxed mb-8">
        {$_("pages.gifts.subtitle")}
      </p>

      <!-- Search -->
      <div class="search-wrap">
        <span class="search-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
        </span>
        <input
          class="search-input"
          type="search"
          placeholder={lang === "id" ? "Cari karunia…" : "Search gifts…"}
          bind:value={searchQuery}
          aria-label={lang === "id" ? "Cari karunia" : "Search gifts"}
        />
      </div>
    </div>

    <!-- Count -->
    <div class="mb-5 press-in press-in-d1">
      <span class="count-chip">
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

    <!-- Grid -->
    {#if filtered.length > 0}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each filtered as category, i (category.key)}
          {@const gc = giftColor(category.key)}
          <button
            class="gift-card press-in press-in-d{Math.min(i, 4)}"
            on:click={() => viewCategory(category.key)}
            style="background: {gc.pale};"
          >
            <div class="card-illo">
              <GiftMark glyph={gc.glyph} color={gc.accent} />
            </div>
            <h3 class="card-title display">{category.name}</h3>
            <p class="card-desc">{category.description}</p>
            <span class="card-go">{$_("pages.gifts.learnMore")} →</span>
          </button>
        {/each}
      </div>
    {:else}
      <div class="empty press-in press-in-d1">
        <p class="display empty-text">
          {lang === "id"
            ? `Tidak ada karunia yang cocok dengan "${searchQuery}"`
            : `No gifts match "${searchQuery}"`}
        </p>
      </div>
    {/if}
  </div>
</div>

<style>
  .page {
    background: var(--color-paper);
    min-height: 100vh;
  }

  /* Search */
  .search-wrap {
    position: relative;
    max-width: 420px;
  }
  .search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-ink-faint);
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    padding: 14px 18px 14px 46px;
    border: 2px solid var(--color-line);
    border-radius: 999px;
    background: #ffffff;
    font-size: 14px;
    font-family: var(--font-sans);
    color: var(--color-ink);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .search-input::placeholder {
    color: var(--color-ink-faint);
  }
  .search-input:focus {
    border-color: var(--color-amber);
    box-shadow: 0 0 0 4px var(--color-amber-pale);
  }

  /* Count chip */
  .count-chip {
    display: inline-flex;
    align-items: center;
    padding: 5px 14px;
    border-radius: 999px;
    background: var(--color-paper-deep);
    font-size: 12px;
    font-weight: 700;
    color: var(--color-ink-soft);
  }

  /* Gift cards */
  .gift-card {
    border-radius: 22px;
    padding: 26px 24px 22px;
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .gift-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 36px rgba(27, 27, 27, 0.1);
  }
  .card-illo {
    width: 52px;
    height: 52px;
    margin-bottom: 14px;
  }
  .card-title {
    font-size: 21px;
    font-weight: 700;
    color: var(--color-ink);
    margin-bottom: 8px;
    line-height: 1.2;
  }
  .card-desc {
    font-size: 13px;
    color: var(--color-ink-soft);
    line-height: 1.6;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .card-go {
    font-size: 13px;
    font-weight: 700;
    color: var(--color-ink);
    margin-top: 16px;
    transition: transform 0.2s;
  }
  .gift-card:hover .card-go {
    transform: translateX(3px);
  }

  /* Empty state */
  .empty {
    padding: 60px 0;
  }
  .empty-text {
    font-style: italic;
    font-size: 20px;
    color: var(--color-ink-faint);
  }
</style>
