<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
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

  // Share URL and text
  const shareUrl = $derived(`${window.location.origin}/${lang}/questionnaire/result/${data.short_id}`);
  const shareText = $derived(`${data.name}'s Spiritual Gifts assessment results — check out their gifts!`);

  function openShareModalFn() {
    showShareModal = true;
  }
  function closeShareModal() {
    showShareModal = false;
  }
  function viewGift(category: string) {
    const resultId = data.short_id;
    goto(`/${lang}/gifts/${category.toLowerCase()}?from=result&id=${resultId}`);
  }
  function handleGiftKeydown(e: KeyboardEvent, category: string) {
    if (e.key === 'Enter') {
      viewGift(category);
    }
  }
  // Share to Instagram Stories
  async function shareToStories() {
    try {
      const response = await fetch(`/api/og-image/${data.short_id}`);
      const blob = await response.blob();
      const file = new File([blob], "my-spiritual-gifts.png", { type: "image/png" });
      // Try Web Share API with files (newer browsers)
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My Spiritual Gifts"
        });
      } else {
        // Fallback: Download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "my-spiritual-gifts.png";
        a.click();
        URL.revokeObjectURL(url);
        showDownloadToast = true;
        setTimeout(() => (showDownloadToast = false), 3000);
      }
    } catch (err) {
      console.error("Share to stories failed:", err);
      alert("Failed to share image. Please try again.");
    }
  }
  // Animate on mount
  onMount(() => {
    setTimeout(() => {
      animated = true;
    }, 100);
  });
</script>

<div class="min-h-screen bg-gray-50 py-4 px-4">
  <div class="max-w-2xl mx-auto space-y-4">
    <!-- Compact Header Card -->
    {#if animated}
      <div
        in:fly={{ y: -20, duration: 600, easing: quintOut }}
        class="bg-white rounded-xl shadow p-4"
      >
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-xl font-bold text-gray-900">
              {$_("pages.result.title")}
            </h1>
            <p class="text-sm text-gray-600">
              {data.name}
            </p>
          </div>
          <button
            onclick={openShareModalFn}
            class="flex items-center gap-2 px-3 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-colors"
            aria-label="Share results"
          >
            <Share class="w-5 h-5" />
            <span class="hidden sm:inline text-sm">{$_("pages.result.shareTitle")}</span>
          </button>
        </div>
      </div>
    {/if}

    <!-- #1 Gift Hero Card (Compact) -->
    {#if animated && data.result[0]}
      <div
        in:fly={{ y: 20, duration: 600, delay: 50, easing: quintOut }}
        class="bg-secondary rounded-xl shadow-lg p-5 text-white"
      >
        <div class="flex items-center gap-2 mb-2">
          <span class="text-sm font-medium opacity-90">#1 {$_("pages.result.topGift")}</span>
        </div>
        <h2 class="text-xl font-bold mb-2">
          {getCategoryExplanation(data.result[0].category.toLowerCase(), lang)?.name}
        </h2>
        <div class="flex items-center gap-3 mb-3">
          <div class="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              class="h-full bg-white rounded-full transition-all duration-1000"
              style="width: {(data.result[0].score / maxScore) * 100}%"
            ></div>
          </div>
          <span class="text-sm font-bold">{data.result[0].score}/{maxScore}</span>
        </div>
        <p class="text-white/90 text-sm leading-relaxed line-clamp-2">
          {getCategoryExplanation(data.result[0].category.toLowerCase(), lang)?.description}
        </p>
        <button
          onclick={() => viewGift(data.result[0].category)}
          class="mt-3 text-sm text-white/90 hover:text-white transition-colors"
        >
          {$_("pages.gifts.learnMore")} →
        </button>
      </div>
    {/if}

    <!-- All Gifts List -->
    {#if animated}
      <div
        in:fly={{ y: 20, duration: 600, delay: 100, easing: quintOut }}
        class="bg-white rounded-xl shadow overflow-hidden"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b bg-gray-50">
          <h3 class="font-semibold text-gray-700">{$_("pages.result.yourGifts")}</h3>
        </div>

        <!-- Gift Items -->
        {#each data.result as gift, i (gift.category)}
          <div
            in:fly={{ x: 20, duration: 400, delay: 200 + i * 50, easing: quintOut }}
            class="flex items-center gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer
              {i < 3 ? 'bg-secondary/5' : ''}"
            onclick={() => viewGift(gift.category)}
            role="button"
            tabindex="0"
            onkeydown={(e) => handleGiftKeydown(e, gift.category)}
          >
            <span class="w-8 text-lg font-bold {i < 3 ? 'text-secondary' : 'text-gray-400'}">
              #{i + 1}
            </span>
            <span class="flex-1 font-medium {i < 3 ? 'text-secondary' : 'text-gray-700'}">
              {getCategoryExplanation(gift.category.toLowerCase(), lang)?.name || gift.category}
            </span>
            <div class="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full {i < 3 ? 'bg-secondary' : 'bg-gray-400'} rounded-full transition-all duration-1000"
                style="width: {(gift.score / maxScore) * 100}%"
              ></div>
            </div>
            <span class="w-12 text-right text-sm font-medium text-gray-600">
              {gift.score}/{maxScore}
            </span>
            <Arrow class="w-4 h-4 text-gray-400" />
          </div>
        {/each}
      </div>
    {/if}

    <!-- Download Toast -->
    {#if showDownloadToast}
      <div
        in:fly={{ y: 20, duration: 300 }}
        out:fly={{ y: 20, duration: 300 }}
        class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        {$_("pages.result.imageDownloaded")}
      </div>
    {/if}
  </div>
</div>

<!-- Share Modal -->
<ShareModal
  show={showShareModal}
  {shareUrl}
  {shareText}
  onClose={closeShareModal}
  onShareToStories={shareToStories}
/>
