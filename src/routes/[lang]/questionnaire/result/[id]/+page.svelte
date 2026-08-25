<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import Share from "$lib/icons/Share.svelte";
  import { _ } from "svelte-i18n";
  import ShareModal from "$lib/components/ShareModal.svelte";
  import GiftMark from "$lib/components/illustrations/GiftMark.svelte";
  import type { PageData } from "./$types";
  import { getCategoryExplanation } from "$lib/utils/category-explanation";
  import { giftColor } from "$lib/data/gift-colors";

  let { data }: { data: PageData } = $props();

  const lang = $page.params.lang as "en" | "id";
  const maxScore = 25;

  let showShareModal = $state(false);
  let showDownloadToast = $state(false);
  let barWidths = $state<number[]>([]);

  const shareUrl = $derived(
    `${$page.url.origin}/${lang}/questionnaire/result/${data.short_id}`,
  );
  const shareText = $derived(
    `${data.name}'s Spiritual Gifts assessment results. Check out their gifts!`,
  );

  function openShareModalFn() {
    showShareModal = true;
  }
  function closeShareModal() {
    showShareModal = false;
  }

  function viewGift(category: string) {
    goto(
      `/${lang}/gifts/${category.toLowerCase()}?from=result&id=${data.short_id}`,
    );
  }

  function handleGiftKeydown(e: KeyboardEvent, category: string) {
    if (e.key === "Enter") viewGift(category);
  }

  async function shareToStories() {
    try {
      const response = await fetch(`/api/og-image/${data.short_id}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.short_id}.png`;
      a.click();
      URL.revokeObjectURL(url);
      showDownloadToast = true;
      setTimeout(() => (showDownloadToast = false), 3000);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download image. Please try again.");
    }
  }

  onMount(() => {
    setTimeout(() => {
      barWidths = data.result.map((g) => (g.score / maxScore) * 100);
    }, 250);
  });

  const top3 = $derived(data.result.slice(0, 3));

  const romans = ["I", "II", "III"];
</script>

<div class="page-bg">
  <div class="content max-w-xl mx-auto px-5 py-10 pb-24">
    <!-- ── Report header ─────────────────────────────────────────── -->
    <div class="press-in mb-10">
      <div class="flex items-start justify-between gap-4 mb-2">
        <div>
          <div class="smallcaps text-amber mb-2">The Gifts</div>
          <h1 class="display text-3xl text-ink font-bold leading-tight">
            {$_("pages.result.title")}
          </h1>
          <p class="text-sm text-ink-faint mt-1">{data.name}</p>
        </div>
        <button
          onclick={openShareModalFn}
          class="share-btn smallcaps flex items-center gap-2 px-5 py-3"
          aria-label="Share results"
        >
          <Share class="w-4 h-4" />
          <span class="hidden sm:inline">{$_("pages.result.shareTitle")}</span>
        </button>
      </div>
    </div>

    <!-- ── Top Gift — celebration card in the gift's color ───────── -->
    {#if data.result[0]}
      {@const topExpl = getCategoryExplanation(
        data.result[0].category.toLowerCase(),
        lang,
      )}
      {@const gc = giftColor(data.result[0].category)}
      <div
        class="press-in press-in-d1 hero-card mb-12"
        style="background: {gc.accent};"
      >
        <div class="hero-mark">
          <GiftMark glyph={gc.glyph} color={gc.accent} />
        </div>

        <div class="smallcaps hero-eyebrow mb-3">Top Gift</div>

        <h2 class="display text-4xl sm:text-5xl text-white font-bold mb-4 leading-[1.08]">
          {topExpl?.name}
        </h2>

        <p class="text-white/85 text-base leading-relaxed mb-7 max-w-sm">
          {topExpl?.description}
        </p>

        <!-- Score -->
        <div class="flex items-center gap-4">
          <div class="flex-1 h-3 rounded-full overflow-hidden bg-white/25">
            <div
              class="score-fill h-full rounded-full bg-white"
              style="width: {barWidths[0] ?? 0}%;"
            ></div>
          </div>
          <span class="text-white font-bold text-sm tabular-nums whitespace-nowrap">
            {data.result[0].score}<span class="opacity-60 font-medium">
              / {maxScore}</span
            >
          </span>
        </div>

        <button
          onclick={() => viewGift(data.result[0].category)}
          class="learn-more smallcaps mt-7"
        >
          {$_("pages.gifts.learnMore")}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    {/if}

    <!-- ── Top 3 — tinted cards ──────────────────────────────────── -->
    {#if top3.length > 1}
      <div class="press-in press-in-d2 mb-12">
        <h3 class="display text-xl text-ink font-bold mb-4">
          {$_("pages.result.yourGifts")}
        </h3>
        <div class="grid grid-cols-3 gap-3">
          {#each top3 as gift, i (gift.category)}
            {@const expl = getCategoryExplanation(
              gift.category.toLowerCase(),
              lang,
            )}
            {@const gc = giftColor(gift.category)}
            <button
              onclick={() => viewGift(gift.category)}
              class="top-gift-card"
              style="background: {gc.pale};"
            >
              <div class="top-mark">
                <GiftMark glyph={gc.glyph} color={gc.accent} />
              </div>
              <span class="top-rank display">{romans[i]}</span>
              <span class="top-name">{expl?.name}</span>
              <span class="top-score tabular-nums">{gift.score}<span class="of">/{maxScore}</span></span>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- ── Full ranking ──────────────────────────────────────────── -->
    <div class="press-in press-in-d3 ranking-card mb-10">
      <div class="px-5 py-4 ranking-head">
        <h3 class="smallcaps text-ink-faint">
          {$_("pages.result.yourGifts")} · {$_("pages.result.title")}
        </h3>
      </div>

      {#each data.result as gift, i (gift.category)}
        {@const expl = getCategoryExplanation(
          gift.category.toLowerCase(),
          lang,
        )}
        {@const gc = giftColor(gift.category)}
        {@const isTop = i < 3}
        <div
          class="gift-row"
          onclick={() => viewGift(gift.category)}
          role="button"
          tabindex="0"
          onkeydown={(e) => handleGiftKeydown(e, gift.category)}
        >
          <!-- Rank -->
          <span class="rank-num tabular-nums" class:is-top={isTop}>
            {i + 1}
          </span>

          <!-- Color dot -->
          <span class="gift-dot" style="background: {gc.accent};"></span>

          <!-- Name -->
          <span class="gift-name" class:is-top={isTop}>
            {expl?.name || gift.category}
          </span>

          <!-- Bar -->
          <div class="gift-bar">
            <div
              class="gift-bar-fill"
              style="background: {gc.accent}; width: {barWidths[i] ?? 0}%;"
            ></div>
          </div>

          <!-- Score -->
          <span class="gift-score tabular-nums" class:is-top={isTop}>
            {gift.score}<span class="of">/{maxScore}</span>
          </span>
        </div>
      {/each}
    </div>

    <!-- ── Share notice ──────────────────────────────────────────── -->
    <div
      class="press-in press-in-d4 share-notice flex items-center justify-between gap-4 p-5"
    >
      <div>
        <div class="text-sm font-bold text-ink mb-0.5">
          {$_("pages.result.shareTitle")}
        </div>
        <div class="text-xs text-ink-faint">
          {lang === "en"
            ? "Share your gifts with friends"
            : "Bagikan karuniamu ke teman-teman"}
        </div>
      </div>
      <button
        onclick={openShareModalFn}
        class="share-btn smallcaps flex-shrink-0 flex items-center gap-2 px-5 py-3"
      >
        <Share class="w-4 h-4" />
        <span class="hidden sm:inline">{$_("pages.result.shareTitle")}</span>
      </button>
    </div>
  </div>
</div>

<!-- ── Download Toast ─────────────────────────────────────────────── -->
{#if showDownloadToast}
  <div
    in:fade={{ duration: 200 }}
    class="toast fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 text-sm font-semibold smallcaps"
  >
    ✓ {$_("pages.result.imageDownloaded")}
  </div>
{/if}

<!-- Share Modal -->
<ShareModal
  show={showShareModal}
  {shareUrl}
  {shareText}
  onClose={closeShareModal}
  onShareToStories={shareToStories}
/>

<style>
  .page-bg {
    background: var(--color-paper);
    min-height: 100vh;
  }

  /* Share button: ink pill */
  .share-btn {
    background: var(--color-ink);
    color: var(--color-paper);
    border: none;
    border-radius: 999px;
    cursor: pointer;
    font-size: 10px;
    transition: background 0.15s;
  }
  .share-btn:hover {
    background: var(--color-ink-soft);
  }

  /* Hero card */
  .hero-card {
    border-radius: 28px;
    padding: 36px 32px 32px;
    position: relative;
    overflow: hidden;
  }
  .hero-mark {
    width: 88px;
    height: 88px;
    background: rgba(255, 255, 255, 0.22);
    border-radius: 24px;
    padding: 16px;
    margin-bottom: 20px;
  }
  .hero-eyebrow {
    color: rgba(255, 255, 255, 0.85);
  }
  .score-fill {
    transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .learn-more {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.9);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: color 0.15s;
  }
  .learn-more:hover {
    color: #ffffff;
  }

  /* Top 3 cards */
  .top-gift-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    padding: 16px 14px;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .top-gift-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(27, 27, 27, 0.1);
  }
  .top-mark {
    width: 40px;
    height: 40px;
    margin-bottom: 10px;
  }
  .top-rank {
    font-size: 12px;
    font-weight: 700;
    font-style: italic;
    color: var(--color-ink-faint);
    margin-bottom: 2px;
  }
  .top-name {
    font-size: 14px;
    font-weight: 700;
    color: var(--color-ink);
    line-height: 1.25;
  }
  .top-score {
    font-size: 12px;
    font-weight: 700;
    color: var(--color-ink-soft);
    margin-top: 8px;
  }
  .of {
    font-weight: 500;
    opacity: 0.6;
  }

  /* Ranking card */
  .ranking-card {
    background: #ffffff;
    border: 1px solid var(--color-line);
    border-radius: 24px;
    overflow: hidden;
  }
  .ranking-head {
    border-bottom: 1px solid var(--color-paper-deep);
  }
  .gift-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 20px;
    border-bottom: 1px solid var(--color-paper-deep);
    cursor: pointer;
    transition: background 0.15s;
  }
  .gift-row:last-child {
    border-bottom: none;
  }
  .gift-row:hover {
    background: var(--color-paper);
  }
  .rank-num {
    width: 22px;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-ink-faint);
    flex-shrink: 0;
  }
  .rank-num.is-top {
    color: var(--color-ink);
    font-weight: 700;
  }
  .gift-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    flex-shrink: 0;
  }
  .gift-name {
    flex: 1;
    font-size: 14px;
    font-weight: 600;
    color: var(--color-ink-soft);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .gift-name.is-top {
    color: var(--color-ink);
  }
  .gift-bar {
    width: 72px;
    height: 6px;
    border-radius: 999px;
    background: var(--color-paper-deep);
    overflow: hidden;
    flex-shrink: 0;
  }
  .gift-bar-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 1s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .gift-score {
    font-size: 13px;
    font-weight: 700;
    color: var(--color-ink-soft);
    min-width: 52px;
    text-align: right;
    flex-shrink: 0;
  }
  .gift-score.is-top {
    color: var(--color-ink);
  }

  /* Share notice */
  .share-notice {
    background: var(--color-amber-pale);
    border-radius: 20px;
  }

  /* Toast */
  .toast {
    background: var(--color-ink);
    color: var(--color-paper);
    border-radius: 999px;
    transform: translateX(-50%);
  }
</style>
