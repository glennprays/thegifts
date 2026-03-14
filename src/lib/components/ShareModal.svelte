<script lang="ts">
  import { _ } from 'svelte-i18n';
  import Close from '$lib/icons/Close.svelte';
  import Link from '$lib/icons/Link.svelte';
  import Copy from '$lib/icons/Copy.svelte';
  import WhatsApp from '$lib/icons/WhatsApp.svelte';
  import Facebook from '$lib/icons/Facebook.svelte';
  import X from '$lib/icons/X.svelte';
  import Telegram from '$lib/icons/Telegram.svelte';
  import Email from '$lib/icons/Email.svelte';
  import Instagram from '$lib/icons/Instagram.svelte';

  interface Props {
    show: boolean;
    shareUrl: string;
    shareText: string;
    onClose: () => void;
    onShareToStories: () => Promise<void>;
  }

  let { show, shareUrl, shareText, onClose, onShareToStories }: Props = $props();

  let copySuccess = $state(false);
  let copyTextSuccess = $state(false);
  let storiesLoading = $state(false);

  function copyLink() {
    navigator.clipboard.writeText(shareUrl);
    copySuccess = true;
    setTimeout(() => (copySuccess = false), 2000);
  }

  function copyTextAndLink() {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    copyTextSuccess = true;
    setTimeout(() => (copyTextSuccess = false), 2000);
  }

  function shareToWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText + '\n' + shareUrl)}`,
      '_blank'
    );
    onClose();
  }

  function shareToFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
    onClose();
  }

  function shareToTwitter() {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
    onClose();
  }

  function shareToTelegram() {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      '_blank'
    );
    onClose();
  }

  function shareViaEmail() {
    const subject = encodeURIComponent($_('pages.result.emailSubject') || 'Spiritual Gifts Assessment Results');
    const body = encodeURIComponent(shareText + '\n\n' + shareUrl);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    onClose();
  }

  async function handleShareToStories() {
    storiesLoading = true;
    try {
      await onShareToStories();
    } finally {
      storiesLoading = false;
    }
    onClose();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      onClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    onclick={onClose}
    role="dialog"
    aria-modal="true"
    aria-labelledby="share-modal-title"
    tabindex="-1"
  >
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-5 border-b">
        <h3 id="share-modal-title" class="text-xl font-semibold text-gray-900">
          {$_('pages.result.shareTitle')}
        </h3>
        <button
          onclick={onClose}
          class="text-gray-400 hover:text-gray-600 transition-colors p-1"
          aria-label={$_('common.close')}
        >
          <Close />
        </button>
      </div>

      <!-- Copy Options -->
      <div class="p-4 space-y-2 border-b">
        <button
          onclick={copyLink}
          class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition relative"
        >
          <Link />
          <span class="font-medium text-gray-900">{$_('pages.result.copyLink')}</span>
          {#if copySuccess}
            <span class="ml-auto text-green-600 text-sm font-medium">
              {$_('pages.result.copied')}
            </span>
          {/if}
        </button>
        <button
          onclick={copyTextAndLink}
          class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition relative"
        >
          <Copy />
          <span class="font-medium text-gray-900">{$_('pages.result.copyTextAndLink')}</span>
          {#if copyTextSuccess}
            <span class="ml-auto text-green-600 text-sm font-medium">
              {$_('pages.result.copied')}
            </span>
          {/if}
        </button>
      </div>

      <!-- Social Media Grid -->
      <div class="p-4 border-b">
        <p class="text-sm text-gray-500 mb-3">{$_('pages.result.shareVia')}</p>
        <div class="grid grid-cols-4 gap-3">
          <button
            onclick={shareToWhatsApp}
            class="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-50 transition"
          >
            <WhatsApp />
            <span class="text-xs text-gray-600">WhatsApp</span>
          </button>
          <button
            onclick={shareToFacebook}
            class="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-50 transition"
          >
            <Facebook />
            <span class="text-xs text-gray-600">Facebook</span>
          </button>
          <button
            onclick={shareToTwitter}
            class="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-50 transition"
          >
            <X />
            <span class="text-xs text-gray-600">X</span>
          </button>
          <button
            onclick={shareToTelegram}
            class="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-50 transition"
          >
            <Telegram />
            <span class="text-xs text-gray-600">Telegram</span>
          </button>
        </div>
      </div>

      <!-- Email -->
      <div class="p-4 border-b">
        <button
          onclick={shareViaEmail}
          class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
        >
          <Email />
          <span class="font-medium text-gray-900">{$_('pages.result.shareViaEmail')}</span>
        </button>
      </div>

      <!-- Download Result -->
      <div class="p-4">
        <button
          onclick={handleShareToStories}
          disabled={storiesLoading}
          class="w-full flex items-center justify-center gap-2 p-3 bg-secondary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          <span class="font-semibold">
            {storiesLoading ? $_('pages.result.generating') : $_('pages.result.downloadResult')}
          </span>
        </button>
        <p class="text-xs text-gray-500 text-center mt-2">
          {$_('pages.result.storiesDownloadHint')}
        </p>
      </div>
    </div>
  </div>
{/if}
