<script lang="ts">
  import { _ } from "svelte-i18n";
  import { browser } from "$app/environment";
  import { fade } from "svelte/transition";
  import Close from "$lib/icons/Close.svelte";
  import Link from "$lib/icons/Link.svelte";
  import Copy from "$lib/icons/Copy.svelte";
  import WhatsApp from "$lib/icons/WhatsApp.svelte";
  import Facebook from "$lib/icons/Facebook.svelte";
  import X from "$lib/icons/X.svelte";
  import Telegram from "$lib/icons/Telegram.svelte";
  import Email from "$lib/icons/Email.svelte";

  interface Props {
    show: boolean;
    shareUrl: string;
    shareText: string;
    onClose: () => void;
    onShareToStories: () => Promise<void>;
  }

  let { show, shareUrl, shareText, onClose, onShareToStories }: Props =
    $props();

  let copySuccess = $state(false);
  let copyTextSuccess = $state(false);
  let storiesLoading = $state(false);

  function copyLink() {
    if (!browser) return;
    navigator.clipboard.writeText(shareUrl);
    copySuccess = true;
    setTimeout(() => (copySuccess = false), 2000);
  }

  function copyTextAndLink() {
    if (!browser) return;
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    copyTextSuccess = true;
    setTimeout(() => (copyTextSuccess = false), 2000);
  }

  function shareToWhatsApp() {
    if (!browser) return;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`,
      "_blank",
    );
    onClose();
  }

  function shareToFacebook() {
    if (!browser) return;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
    onClose();
  }

  function shareToTwitter() {
    if (!browser) return;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
    onClose();
  }

  function shareToTelegram() {
    if (!browser) return;
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      "_blank",
    );
    onClose();
  }

  function shareViaEmail() {
    if (!browser) return;
    const subject = encodeURIComponent(
      $_("pages.result.emailSubject") || "Spiritual Gifts Assessment Results",
    );
    const body = encodeURIComponent(shareText + "\n\n" + shareUrl);
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
    if (event.key === "Escape") onClose();
  }

  function handleBackdropKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") onClose();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if show}
  <!-- Backdrop -->
  <div
    class="modal-overlay fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
    role="button"
    tabindex="-1"
    aria-label="Close modal"
    onclick={onClose}
    onkeydown={handleBackdropKeydown}
    transition:fade={{ duration: 180 }}
    style="background: rgba(27, 27, 27, 0.45);"
  >
    <!-- Sheet -->
    <div
      class="modal-sheet w-full sm:max-w-md max-h-[92vh] overflow-y-auto"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      tabindex="-1"
      in:fade={{ duration: 200 }}
      out:fade={{ duration: 140 }}
    >
      <div class="p-6">
        <!-- Drag handle (mobile) -->
        <div class="drag-handle sm:hidden"></div>

        <!-- Header -->
        <div class="flex items-start justify-between mb-6">
          <div>
            <h3
              id="share-modal-title"
              class="display text-2xl text-ink font-bold leading-tight mb-1"
            >
              {$_("pages.result.shareTitle")}
            </h3>
            <p class="text-xs text-ink-faint">
              {$_("pages.result.shareVia") ||
                "Choose how to share your results"}
            </p>
          </div>
          <button
            class="close-btn"
            onclick={onClose}
            aria-label={$_("common.close")}
          >
            <Close />
          </button>
        </div>

        <!-- URL preview strip -->
        <div class="url-preview">
          <span class="url-text">{shareUrl}</span>
        </div>

        <!-- Copy options -->
        <div class="section-label smallcaps">Quick copy</div>
        <div class="flex flex-col gap-2 mb-6">
          <button class="copy-row" onclick={copyLink}>
            <span class="row-icon"><Link /></span>
            <span class="text-sm font-semibold text-ink flex-1"
              >{$_("pages.result.copyLink")}</span
            >
            {#if copySuccess}
              <span class="success-badge">✓ {$_("pages.result.copied")}</span>
            {/if}
          </button>

          <button class="copy-row" onclick={copyTextAndLink}>
            <span class="row-icon"><Copy /></span>
            <span class="text-sm font-semibold text-ink flex-1"
              >{$_("pages.result.copyTextAndLink")}</span
            >
            {#if copyTextSuccess}
              <span class="success-badge">✓ {$_("pages.result.copied")}</span>
            {/if}
          </button>
        </div>

        <!-- Social grid -->
        <div class="section-label smallcaps">Share via</div>
        <div class="grid grid-cols-4 gap-2 mb-6">
          <button class="social-btn" onclick={shareToWhatsApp}>
            <span class="social-icon-wrap" style="background:#e8faf0; color:#25D366;"><WhatsApp /></span>
            <span class="social-name">WhatsApp</span>
          </button>
          <button class="social-btn" onclick={shareToFacebook}>
            <span class="social-icon-wrap" style="background:#eaf1ff; color:#1877F2;"><Facebook /></span>
            <span class="social-name">Facebook</span>
          </button>
          <button class="social-btn" onclick={shareToTwitter}>
            <span class="social-icon-wrap" style="background:#f0f0f0; color:#000000;"><X /></span>
            <span class="social-name">X</span>
          </button>
          <button class="social-btn" onclick={shareToTelegram}>
            <span class="social-icon-wrap" style="background:#e8f6ff; color:#2AABEE;"><Telegram /></span>
            <span class="social-name">Telegram</span>
          </button>
        </div>

        <!-- Email -->
        <button class="copy-row mb-6" onclick={shareViaEmail}>
          <span class="row-icon" style="background:var(--color-amber-pale); color:var(--color-amber);"><Email /></span>
          <span class="flex-1 text-left">
            <span class="block text-sm font-semibold text-ink">
              {$_("pages.result.shareViaEmail")}
            </span>
            <span class="block text-xs text-ink-faint mt-0.5">Send to a friend or family</span>
          </span>
        </button>

        <!-- Stories download CTA -->
        <button
          class="stories-btn smallcaps"
          onclick={handleShareToStories}
          disabled={storiesLoading}
        >
          {#if storiesLoading}
            <div class="spinner"></div>
            <span>{$_("pages.result.generating")}</span>
          {:else}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" /><path
                d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
              /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>{$_("pages.result.downloadResult")}</span>
          {/if}
        </button>
        <p class="text-xs text-ink-faint text-center mt-3 leading-relaxed">
          {$_("pages.result.storiesDownloadHint")}
        </p>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-sheet {
    background: #ffffff;
    border-top-left-radius: 28px;
    border-top-right-radius: 28px;
  }
  @media (min-width: 640px) {
    .modal-sheet {
      border-radius: 28px;
      box-shadow: 0 24px 64px rgba(27, 27, 27, 0.2);
    }
  }

  .drag-handle {
    width: 40px;
    height: 5px;
    background: var(--color-paper-deep);
    border-radius: 999px;
    margin: 0 auto 20px;
  }

  /* Copy rows */
  .copy-row {
    display: flex;
    align-items: center;
    background: var(--color-paper);
    border: 1px solid var(--color-line);
    border-radius: 16px;
    padding: 14px 16px;
    gap: 12px;
    cursor: pointer;
    width: 100%;
    text-align: left;
    transition: border-color 0.15s, background 0.15s;
  }
  .copy-row:hover {
    border-color: var(--color-ink-faint);
    background: #ffffff;
  }

  .row-icon {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border-radius: 12px;
    background: var(--color-blue-pale);
    color: var(--color-blue);
  }

  /* Social buttons */
  .social-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    padding: 12px 6px;
    border: 1px solid var(--color-line);
    border-radius: 16px;
    background: transparent;
    cursor: pointer;
    flex: 1;
    transition: border-color 0.15s;
  }
  .social-btn:hover {
    border-color: var(--color-ink-faint);
  }
  .social-icon-wrap {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .social-name {
    font-size: 10px;
    font-weight: 600;
    color: var(--color-ink-soft);
  }

  /* Section labels */
  .section-label {
    font-size: 10px;
    font-weight: 700;
    color: var(--color-ink-faint);
    margin-bottom: 10px;
  }

  /* Stories button */
  .stories-btn {
    width: 100%;
    background: var(--color-ink);
    border: none;
    border-radius: 999px;
    padding: 17px 20px;
    color: var(--color-paper);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.15s;
    font-size: 11px;
  }
  .stories-btn:hover:not(:disabled) {
    background: var(--color-ink-soft);
  }
  .stories-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  /* Success badge */
  .success-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
    color: var(--color-green);
    white-space: nowrap;
  }

  /* URL preview */
  .url-preview {
    background: var(--color-paper);
    border: 1px dashed var(--color-line);
    border-radius: 12px;
    padding: 11px 14px;
    margin-bottom: 20px;
    font-size: 12px;
    color: var(--color-ink-soft);
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .url-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Close button */
  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1.5px solid var(--color-line);
    border-radius: 999px;
    background: #ffffff;
    cursor: pointer;
    color: var(--color-ink-soft);
    transition: border-color 0.15s, color 0.15s;
    flex-shrink: 0;
  }
  .close-btn:hover {
    border-color: var(--color-ink-faint);
    color: var(--color-ink);
  }

  /* Spinner */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .spinner {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid rgba(246, 245, 244, 0.35);
    border-top-color: var(--color-paper);
    animation: spin 0.7s linear infinite;
  }
</style>
