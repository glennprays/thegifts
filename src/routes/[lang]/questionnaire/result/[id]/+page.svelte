<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { fly, fade, scale } from "svelte/transition";
  import { quintOut, cubicOut } from "svelte/easing";
  import { onMount } from "svelte";
  import Arrow from "$lib/icons/Arrow.svelte";
  import Share from "$lib/icons/Share.svelte";
  import { _ } from "svelte-i18n";
  import ShareModal from "$lib/components/ShareModal.svelte";
  import type { PageData } from "./$types";
  import { getCategoryExplanation } from "$lib/utils/category-explanation";

  let { data }: { data: PageData } = $props();

  const lang = $page.params.lang as "en" | "id";
  const maxScore = 25;

  let showShareModal = $state(false);
  let animated = $state(false);
  let showDownloadToast = $state(false);
  let barWidths = $state<number[]>([]);

  const shareUrl = $derived(
    `${$page.url.origin}/${lang}/questionnaire/result/${data.short_id}`,
  );
  const shareText = $derived(
    `${data.name}'s Spiritual Gifts assessment results — check out their gifts!`,
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
      animated = true;
    }, 80);
    // Animate bars after initial reveal
    setTimeout(() => {
      barWidths = data.result.map((g) => (g.score / maxScore) * 100);
    }, 700);
  });

  // Top 3 gifts for the podium
  const top3 = $derived(data.result.slice(0, 3));
  const rest = $derived(data.result.slice(3));

  // Medal colors
  const medals = [
    {
      bg: "from-amber-400 to-yellow-300",
      text: "text-amber-900",
      border: "border-amber-300",
      label: "1st",
    },
    {
      bg: "from-slate-300 to-gray-200",
      text: "text-slate-700",
      border: "border-slate-300",
      label: "2nd",
    },
    {
      bg: "from-orange-300 to-amber-200",
      text: "text-orange-900",
      border: "border-orange-300",
      label: "3rd",
    },
  ];
</script>

<div class="page-bg">
  <div class="content max-w-xl mx-auto px-4 py-6 pb-20">
    <!-- ── Top Nav ─────────────────────────────────────────────────── -->
    {#if animated}
      <div
        in:fly={{ y: -24, duration: 500, easing: quintOut }}
        class="flex items-center justify-between mb-8"
      >
        <div>
          <div
            class="text-xs font-medium tracking-widest text-[#8aab52] uppercase mb-1"
          >
            TheGifts
          </div>
          <h1 class="serif text-2xl text-[#1a2e05] leading-tight">
            {$_("pages.result.title")}
          </h1>
          <p class="text-sm text-[#6b8f27]/70 mt-0.5">{data.name}</p>
        </div>
        <button
          onclick={openShareModalFn}
          class="share-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium"
          style="background: linear-gradient(135deg, #4a6518, #6b8f27);"
          aria-label="Share results"
        >
          <Share class="w-4 h-4" />
          <span class="hidden sm:inline">{$_("pages.result.shareTitle")}</span>
        </button>
      </div>
    {/if}

    <!-- ── Hero — Top Gift ─────────────────────────────────────────── -->
    {#if animated && data.result[0]}
      {@const topExpl = getCategoryExplanation(
        data.result[0].category.toLowerCase(),
        lang,
      )}
      <div
        in:fly={{ y: 28, duration: 650, delay: 60, easing: quintOut }}
        class="hero-card rounded-3xl p-7 mb-6 shadow-xl"
      >
        <!-- Leaf SVG deco -->
        <svg
          class="leaf-deco"
          style="top:-10px;right:20px;width:120px;opacity:0.12"
          viewBox="0 0 120 120"
          fill="none"
        >
          <path
            d="M60 10 C80 10 110 30 110 60 C110 90 80 110 60 110 C40 110 10 90 10 60 C10 30 40 10 60 10Z"
            fill="white"
          />
          <path
            d="M60 10 L60 110 M35 25 L60 60 M85 25 L60 60 M25 55 L60 80 M95 55 L60 80"
            stroke="white"
            stroke-width="1.5"
            opacity="0.4"
          />
        </svg>

        <div class="flex items-center gap-2 mb-4">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest"
            style="background: rgba(255,255,255,0.18); color: rgba(255,255,255,0.9);"
          >
            TOP GIFT
          </span>
        </div>

        <h2 class="serif text-4xl text-white mb-3 leading-tight">
          {topExpl?.name}
        </h2>

        <p class="text-white/80 text-sm leading-relaxed mb-5 line-clamp-3">
          {topExpl?.description}
        </p>

        <!-- Score -->
        <div class="flex items-center gap-3 mb-5">
          <div
            class="flex-1 h-2 rounded-full overflow-hidden"
            style="background: rgba(255,255,255,0.2);"
          >
            <div
              class="score-bar h-full rounded-full"
              style="background: rgba(255,255,255,0.9); width: {barWidths[0] ??
                0}%;"
            ></div>
          </div>
          <span class="text-white font-semibold text-sm tabular-nums">
            {data.result[0].score}<span class="opacity-50 font-normal">
              / {maxScore}</span
            >
          </span>
        </div>

        <button
          onclick={() => viewGift(data.result[0].category)}
          class="group flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
        >
          {$_("pages.gifts.learnMore")}
          <span class="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>
    {/if}

    <!-- ── Top 3 Podium ────────────────────────────────────────────── -->
    {#if animated && top3.length > 1}
      <div
        in:fly={{ y: 24, duration: 600, delay: 150, easing: quintOut }}
        class="mb-6"
      >
        <h3 class="serif text-lg text-[#1a2e05] mb-4 px-1">
          {$_("pages.result.yourGifts")}
          <span class="text-[#8aab52] text-base font-normal not-italic">
            — top 3</span
          >
        </h3>
        <div class="grid grid-cols-3 gap-3">
          {#each top3 as gift, i}
            {@const expl = getCategoryExplanation(
              gift.category.toLowerCase(),
              lang,
            )}
            {@const m = medals[i]}
            <button
              onclick={() => viewGift(gift.category)}
              class="top-gift-card bg-white rounded-2xl p-4 text-left shadow-sm border border-[#e8f0d8] flex flex-col gap-2"
            >
              <!-- Medal badge -->
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-br {m.bg} flex items-center justify-center border {m.border} shadow-sm"
              >
                <span class="text-xs font-bold {m.text}">{m.label}</span>
              </div>
              <div>
                <div class="font-semibold text-[#1a2e05] text-sm leading-snug">
                  {expl?.name}
                </div>
              </div>
              <!-- Mini bar -->
              <div
                class="w-full h-1.5 bg-[#e8f0d8] rounded-full overflow-hidden mt-auto"
              >
                <div
                  class="score-bar h-full rounded-full"
                  style="background: linear-gradient(90deg, #4a6518, #8fb840); width: {barWidths[
                    i
                  ] ?? 0}%;"
                ></div>
              </div>
              <div class="text-xs text-[#6b8f27] font-semibold tabular-nums">
                {gift.score}/{maxScore}
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- ── Full Results List ──────────────────────────────────────── -->
    {#if animated}
      <div
        in:fly={{ y: 24, duration: 600, delay: 220, easing: quintOut }}
        class="bg-white rounded-2xl shadow-sm border border-[#e8f0d8] overflow-hidden mb-6"
      >
        <div class="px-5 py-4 border-b border-[#f0f5e8]">
          <h3
            class="text-sm font-semibold text-[#4a6518] tracking-wide uppercase"
          >
            {$_("pages.result.yourGifts")} — {$_("pages.result.title")}
          </h3>
        </div>

        {#each data.result as gift, i (gift.category)}
          {@const expl = getCategoryExplanation(
            gift.category.toLowerCase(),
            lang,
          )}
          {@const isTop = i < 3}
          <div
            in:fly={{
              x: 16,
              duration: 350,
              delay: 300 + i * 40,
              easing: quintOut,
            }}
            class="gift-row flex items-center gap-3 px-5 py-3.5 border-b border-[#f5f8ee] last:border-0 cursor-pointer"
            onclick={() => viewGift(gift.category)}
            role="button"
            tabindex="0"
            onkeydown={(e) => handleGiftKeydown(e, gift.category)}
          >
            <!-- Rank -->
            <span
              class="rank-num w-7 text-center text-base {isTop
                ? 'text-[#6b8f27]'
                : 'text-[#b8c9a0]'} font-normal select-none"
            >
              {i + 1}
            </span>

            <!-- Name -->
            <span
              class="flex-1 text-sm font-medium {isTop
                ? 'text-[#1a2e05]'
                : 'text-[#6b7c5a]'}"
            >
              {expl?.name || gift.category}
            </span>

            <!-- Bar -->
            <div class="w-20 h-1.5 bg-[#eef3e4] rounded-full overflow-hidden">
              <div
                class="score-bar h-full rounded-full"
                style="background: {isTop
                  ? 'linear-gradient(90deg,#4a6518,#8fb840)'
                  : '#c8d8a8'}; width: {barWidths[i] ?? 0}%;"
              ></div>
            </div>

            <!-- Score -->
            <span
              class="w-10 text-right text-xs font-semibold tabular-nums {isTop
                ? 'text-[#4a6518]'
                : 'text-[#9aab82]'}"
            >
              {gift.score}<span class="font-normal opacity-60">/{maxScore}</span
              >
            </span>

            <Arrow
              class="w-3.5 h-3.5 {isTop ? 'text-[#8aab52]' : 'text-[#c8d8a8]'}"
            />
          </div>
        {/each}
      </div>
    {/if}

    <!-- ── Share CTA Banner ───────────────────────────────────────── -->
    {#if animated}
      <div
        in:fly={{ y: 20, duration: 500, delay: 400, easing: quintOut }}
        class="rounded-2xl p-5 flex items-center justify-between gap-4 mb-2"
        style="background: linear-gradient(135deg, #f0f8e0, #e8f3d0); border: 1px solid #d0e8a8;"
      >
        <div>
          <div class="text-sm font-semibold text-[#1a2e05] mb-0.5">
            {$_("pages.result.shareTitle")}
          </div>
          <div class="text-xs text-[#6b8f27]/80">
            {lang === "en"
              ? "Share your gifts with friends"
              : "Bagikan karuniamu ke teman-teman"}
          </div>
        </div>
        <button
          onclick={openShareModalFn}
          class="share-btn flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium shadow-sm"
          style="background: linear-gradient(135deg, #4a6518, #6b8f27);"
        >
          <Share class="w-4 h-4" />
          {$_("pages.result.shareTitle")}
        </button>
      </div>
    {/if}
  </div>
  <!-- /content -->
</div>
<!-- /page-bg -->

<!-- ── Download Toast ─────────────────────────────────────────────── -->
{#if showDownloadToast}
  <div
    in:fly={{ y: 24, duration: 300, easing: quintOut }}
    out:fade={{ duration: 200 }}
    class="toast fixed bottom-8 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-xl text-sm font-medium"
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
  @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap");

  :global(body) {
    background-color: #f5f0e8;
  }

  .page-bg {
    background: linear-gradient(160deg, #f7f3eb 0%, #eef5e4 50%, #f0ede5 100%);
    min-height: 100vh;
    font-family: "DM Sans", sans-serif;
  }

  .serif {
    font-family: "DM Serif Display", serif;
  }

  /* Organic background texture */
  .page-bg::before {
    content: "";
    position: fixed;
    inset: 0;
    background-image: radial-gradient(
        ellipse 600px 400px at 10% 20%,
        rgba(107, 143, 39, 0.06) 0%,
        transparent 70%
      ),
      radial-gradient(
        ellipse 500px 500px at 90% 70%,
        rgba(107, 143, 39, 0.05) 0%,
        transparent 70%
      ),
      radial-gradient(
        ellipse 300px 600px at 50% 0%,
        rgba(180, 160, 100, 0.04) 0%,
        transparent 60%
      );
    pointer-events: none;
    z-index: 0;
  }

  .content {
    position: relative;
    z-index: 1;
  }

  /* Hero card shimmer */
  .hero-card {
    background: linear-gradient(
      135deg,
      #3d5a12 0%,
      #5a7c1a 40%,
      #6b8f27 75%,
      #7ea832 100%
    );
    position: relative;
    overflow: hidden;
  }
  .hero-card::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -20%;
    width: 70%;
    height: 200%;
    background: radial-gradient(
      ellipse,
      rgba(255, 255, 255, 0.12) 0%,
      transparent 60%
    );
    pointer-events: none;
  }
  .hero-card::after {
    content: "";
    position: absolute;
    bottom: -40px;
    left: -40px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    pointer-events: none;
  }

  /* Score bar animation */
  .score-bar {
    transition: width 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Gift row hover */
  .gift-row {
    transition:
      background 0.2s ease,
      transform 0.2s ease;
  }
  .gift-row:hover {
    background: rgba(107, 143, 39, 0.04);
    transform: translateX(3px);
  }

  /* Top 3 card hover */
  .top-gift-card {
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease;
  }
  .top-gift-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(74, 101, 24, 0.15);
  }

  /* Share button pulse */
  .share-btn {
    position: relative;
    overflow: hidden;
  }
  .share-btn::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0);
    transition: background 0.2s ease;
  }
  .share-btn:hover::after {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Leaf decoration */
  .leaf-deco {
    position: absolute;
    opacity: 0.08;
    pointer-events: none;
  }

  /* Rank number style */
  .rank-num {
    font-family: "DM Serif Display", serif;
    font-style: italic;
  }

  /* Divider */
  .organic-divider {
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(107, 143, 39, 0.2) 30%,
      rgba(107, 143, 39, 0.2) 70%,
      transparent 100%
    );
  }

  /* Toast */
  .toast {
    background: linear-gradient(135deg, #3d5a12, #5a7c1a);
    box-shadow: 0 8px 32px rgba(74, 101, 24, 0.3);
  }
</style>
