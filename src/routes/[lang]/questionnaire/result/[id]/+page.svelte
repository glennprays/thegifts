<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Arrow from "$lib/icons/Arrow.svelte";
  import Share from "$lib/icons/Share.svelte";
  import { _ } from "svelte-i18n";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const lang = $page.params.lang;
  const maxScore = 25;

  let showAll = $state(false);
  let copySuccess = $state(false);

  // Show top 5 by default, or all if showAll is true
  const topGifts = $derived(data.result.slice(0, 5));
  const otherGifts = $derived(data.result.slice(5));
  const displayedGifts = $derived(showAll ? data.result : topGifts);

  function shareResults() {
    // Use short_id for cleaner shareable URL
    const url = `${window.location.origin}/${lang}/questionnaire/result/${data.short_id}`;
    const text = `${data.name}'s Spiritual Gifts assessment results — check out their gifts!`;
    const title = "Spiritual Gifts Assessment Results";

    if (navigator.share) {
      navigator
        .share({
          title,
          text,
          url,
        })
        .catch((err) => console.error("Share failed:", err));
    } else {
      navigator.clipboard.writeText(url);
      copySuccess = true;
      setTimeout(() => {
        copySuccess = false;
      }, 2000);
    }
  }

  function viewGift(category: string) {
    goto(`/${lang}/gifts/${category.toLowerCase()}`);
  }
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-3xl mx-auto">
    <!-- Header Card -->
    <div class="bg-white shadow-lg rounded-2xl p-6 sm:p-8 mb-8 relative">
      <!-- Share Button with Feedback -->
      <div class="absolute top-4 right-4">
        <button
          on:click={shareResults}
          class="bg-white hover:bg-gray-50 text-gray-700 p-2.5 rounded-full shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
          aria-label={$_("pages.result.shareTitle")}
        >
          <Share />
        </button>
        {#if copySuccess}
          <div class="absolute top-full right-0 mt-2 bg-green-600 text-white text-xs px-3 py-1 rounded-md shadow-lg whitespace-nowrap animate-fade-in">
            {$_("pages.result.shareCopied")}
          </div>
        {/if}
      </div>

      <!-- Title Section -->
      <div class="pr-12">
        <h1 class="text-2xl sm:text-3xl font-semibold font-graphik text-gray-900 mb-2">
          {$_("pages.result.title")}
        </h1>
        <p class="text-gray-600 text-sm sm:text-base mb-4">
          {$_("pages.result.name")}: <span class="font-semibold text-gray-900">{data.name}</span>
        </p>
        <p class="text-gray-700">{$_("pages.result.intro")}</p>
      </div>
    </div>

    <!-- Top Gifts Section -->
    {#if topGifts.length > 0}
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-3 px-1">
          {$_("pages.result.topGifts")}
        </h2>
        <div class="space-y-3">
          {#each topGifts as item, i}
            <button
              on:click={() => viewGift(item.category)}
              class="w-full group"
              aria-label={$_("pages.result.clickToLearnMore")}
            >
              <div class="bg-white p-4 sm:p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center gap-3">
                    {#if i < 3}
                      <span class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white text-sm font-bold">
                        {i + 1}
                      </span>
                    {/if}
                    <span class="font-semibold text-gray-900 text-base sm:text-lg">
                      {$_(`categories.${item.category}`)}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-gray-900 font-bold text-lg">
                      {item.score}
                      <span class="text-gray-500 font-normal text-sm">/25</span>
                    </span>
                    <Arrow />
                  </div>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    class="h-3 rounded-full transition-all duration-500 relative"
                    style="
                      width: {(item.score / maxScore) * 100}%;
                      background: linear-gradient(90deg,
                        hsl({220 - i * 10}, 70%, 55%),
                        hsl({220 - i * 10}, 70%, 45%)
                      );
                    "
                  >
                    <div
                      class="absolute inset-0 rounded-full"
                      style="
                        background: linear-gradient(180deg,
                          rgba(255, 255, 255, 0.3) 0%,
                          rgba(255, 255, 255, 0) 50%,
                          rgba(0, 0, 0, 0.1) 100%
                        );
                      "
                    ></div>
                  </div>
                </div>
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Other Gifts Section (Collapsible) -->
    {#if otherGifts.length > 0}
      <div class="mb-6">
        <div class="flex items-center justify-between mb-3 px-1">
          <h2 class="text-lg font-semibold text-gray-900">
            {$_("pages.result.otherGifts")}
          </h2>
          <button
            on:click={() => showAll = !showAll}
            class="text-primary hover:text-primary-dark font-medium text-sm flex items-center gap-1 transition"
          >
            {showAll ? $_("pages.result.showLess") : $_("pages.result.showAll")}
            <svg
              class="w-4 h-4 transition-transform duration-200"
              class:rotate-180={showAll}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        {#if showAll}
          <div class="space-y-2">
            {#each otherGifts as item, i}
              <button
                on:click={() => viewGift(item.category)}
                class="w-full group"
              >
                <div class="bg-white p-3 sm:p-4 rounded-lg hover:shadow-md transition-all duration-200 hover:bg-gray-50">
                  <div class="flex justify-between items-center text-sm mb-1.5">
                    <span class="font-medium text-gray-700">
                      {$_(`categories.${item.category}`)}
                    </span>
                    <div class="flex items-center gap-2">
                      <span class="text-gray-600 font-semibold">
                        {item.score}<span class="font-light text-xs">/25</span>
                      </span>
                      <Arrow />
                    </div>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      class="h-2 rounded-full transition-all duration-300"
                      style="
                        width: {(item.score / maxScore) * 100}%;
                        background: linear-gradient(90deg,
                          hsl({170 - i * 8}, 60%, 50%),
                          hsl({170 - i * 8}, 60%, 40%)
                        );
                      "
                    ></div>
                  </div>
                </div>
              </button>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-0.5rem);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }
</style>
