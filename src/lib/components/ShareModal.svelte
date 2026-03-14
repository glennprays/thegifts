<script lang="ts">
  import { _ } from "svelte-i18n";
  import { browser } from "$app/environment";
  import { fly, fade, scale } from "svelte/transition";
  import { quintOut, cubicOut } from "svelte/easing";
  import Close from "$lib/icons/Close.svelte";
  import Link from "$lib/icons/Link.svelte";
  import Copy from "$lib/icons/Copy.svelte";
  import WhatsApp from "$lib/icons/WhatsApp.svelte";
  import Facebook from "$lib/icons/Facebook.svelte";
  import X from "$lib/icons/X.svelte";
  import Telegram from "$lib/icons/Telegram.svelte";
  import Email from "$lib/icons/Email.svelte";
  import Instagram from "$lib/icons/Instagram.svelte";

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

  const socials = [
    {
      label: "WhatsApp",
      fn: shareToWhatsApp,
      color: "#25D366",
      icon: "whatsapp",
    },
    {
      label: "Facebook",
      fn: shareToFacebook,
      color: "#1877F2",
      icon: "facebook",
    },
    { label: "X", fn: shareToTwitter, color: "#000000", icon: "x" },
    {
      label: "Telegram",
      fn: shareToTelegram,
      color: "#2AABEE",
      icon: "telegram",
    },
  ];
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
    transition:fade={{ duration: 200 }}
    style="background: rgba(15, 25, 5, 0.55); backdrop-filter: blur(4px);"
  >
    <!-- Sheet -->
    <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
    <div
      class="modal-sheet w-full sm:max-w-md sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      tabindex="-1"
      in:fly={{ y: 40, duration: 380, easing: quintOut }}
      out:fly={{ y: 40, duration: 260, easing: cubicOut }}
    >
      <div class="p-6">
        <!-- Drag handle (mobile) -->
        <div class="drag-handle sm:hidden"></div>

        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3
              id="share-modal-title"
              class="serif text-2xl text-[#1a2e05] leading-tight"
            >
              {$_("pages.result.shareTitle")}
            </h3>
            <p class="text-xs text-[#8aab52] mt-0.5">
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
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b8f27"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path
              d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
            /><path
              d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
            /></svg
          >
          <span class="url-text">{shareUrl}</span>
        </div>

        <!-- Copy options -->
        <div class="section-label">Quick copy</div>
        <div class="flex flex-col gap-2 mb-5">
          <button class="copy-row" onclick={copyLink}>
            <div
              style="width:36px;height:36px;border-radius:10px;background:#f0f8e0;display:flex;align-items:center;justify-content:center;flex-shrink:0;"
            >
              <Link />
            </div>
            <span class="text-sm font-medium text-[#1a2e05] flex-1"
              >{$_("pages.result.copyLink")}</span
            >
            {#if copySuccess}
              <span
                class="success-badge"
                in:scale={{ duration: 200, start: 0.8 }}
                >✓ {$_("pages.result.copied")}</span
              >
            {/if}
          </button>

          <button class="copy-row" onclick={copyTextAndLink}>
            <div
              style="width:36px;height:36px;border-radius:10px;background:#f0f8e0;display:flex;align-items:center;justify-content:center;flex-shrink:0;"
            >
              <Copy />
            </div>
            <span class="text-sm font-medium text-[#1a2e05] flex-1"
              >{$_("pages.result.copyTextAndLink")}</span
            >
            {#if copyTextSuccess}
              <span
                class="success-badge"
                in:scale={{ duration: 200, start: 0.8 }}
                >✓ {$_("pages.result.copied")}</span
              >
            {/if}
          </button>
        </div>

        <div class="organic-divider"></div>

        <!-- Social grid -->
        <div class="section-label">Share via</div>
        <div class="flex gap-2 mb-5">
          <button class="social-btn" onclick={shareToWhatsApp}>
            <div class="social-icon-wrap" style="background:#e8faf0;">
              <WhatsApp />
            </div>
            <span class="text-xs text-[#4a6518] font-medium">WhatsApp</span>
          </button>
          <button class="social-btn" onclick={shareToFacebook}>
            <div class="social-icon-wrap" style="background:#eaf1ff;">
              <Facebook />
            </div>
            <span class="text-xs text-[#4a6518] font-medium">Facebook</span>
          </button>
          <button class="social-btn" onclick={shareToTwitter}>
            <div class="social-icon-wrap" style="background:#f0f0f0;">
              <X />
            </div>
            <span class="text-xs text-[#4a6518] font-medium">X</span>
          </button>
          <button class="social-btn" onclick={shareToTelegram}>
            <div class="social-icon-wrap" style="background:#e8f6ff;">
              <Telegram />
            </div>
            <span class="text-xs text-[#4a6518] font-medium">Telegram</span>
          </button>
        </div>

        <!-- Email -->
        <button class="email-row mb-5" onclick={shareViaEmail}>
          <div
            style="width:36px;height:36px;border-radius:10px;background:#f0f8e0;display:flex;align-items:center;justify-content:center;flex-shrink:0;"
          >
            <Email />
          </div>
          <div>
            <div class="text-sm font-medium text-[#1a2e05]">
              {$_("pages.result.shareViaEmail")}
            </div>
            <div class="text-xs text-[#8aab52]">Send to a friend or family</div>
          </div>
        </button>

        <div class="organic-divider"></div>

        <!-- Stories download CTA -->
        <div class="section-label">Instagram Stories</div>
        <button
          class="stories-btn"
          onclick={handleShareToStories}
          disabled={storiesLoading}
        >
          {#if storiesLoading}
            <div class="spinner"></div>
            <span>{$_("pages.result.generating")}</span>
          {:else}
            <!-- Instagram-style icon -->
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" /><path
                d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
              /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>{$_("pages.result.downloadResult")}</span>
          {/if}
        </button>
        <p class="text-xs text-[#8aab52] text-center mt-3 leading-relaxed">
          {$_("pages.result.storiesDownloadHint")}
        </p>
      </div>
    </div>
  </div>
{/if}

<style>
  @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap");

  .modal-overlay {
    font-family: "DM Sans", sans-serif;
  }

  .serif {
    font-family: "DM Serif Display", serif;
  }

  .modal-sheet {
    background: linear-gradient(170deg, #f9f6ef 0%, #f4f9ec 100%);
    border-top-left-radius: 28px;
    border-top-right-radius: 28px;
  }

  /* Decorative top pill */
  .drag-handle {
    width: 36px;
    height: 4px;
    background: rgba(107, 143, 39, 0.25);
    border-radius: 999px;
    margin: 0 auto 20px;
  }

  /* Copy row */
  .copy-row {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 14px;
    border: 1px solid #e8f0d8;
    padding: 14px 16px;
    gap: 12px;
    transition:
      background 0.15s,
      transform 0.15s,
      box-shadow 0.15s;
    cursor: pointer;
    width: 100%;
    text-align: left;
  }
  .copy-row:hover {
    background: #f4f9ec;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(107, 143, 39, 0.08);
  }
  .copy-row:active {
    transform: translateY(0);
  }

  /* Social button */
  .social-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 8px;
    border-radius: 16px;
    border: none;
    background: white;
    border: 1px solid #e8f0d8;
    cursor: pointer;
    flex: 1;
    transition:
      transform 0.2s,
      box-shadow 0.2s,
      background 0.15s;
    font-family: "DM Sans", sans-serif;
  }
  .social-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
  .social-btn:active {
    transform: translateY(0);
  }

  .social-icon-wrap {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Stories download button */
  .stories-btn {
    width: 100%;
    background: linear-gradient(135deg, #3d5a12 0%, #5a7c1a 40%, #6b8f27 100%);
    border: none;
    border-radius: 16px;
    padding: 16px 20px;
    color: white;
    font-size: 15px;
    font-weight: 600;
    font-family: "DM Sans", sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition:
      opacity 0.2s,
      transform 0.2s,
      box-shadow 0.2s;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(74, 101, 24, 0.25);
  }
  .stories-btn::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -20%;
    width: 60%;
    height: 200%;
    background: radial-gradient(
      ellipse,
      rgba(255, 255, 255, 0.12) 0%,
      transparent 60%
    );
    pointer-events: none;
  }
  .stories-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(74, 101, 24, 0.32);
  }
  .stories-btn:active:not(:disabled) {
    transform: translateY(0);
  }
  .stories-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  /* Email row */
  .email-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 14px;
    border: none;
    background: white;
    border: 1px solid #e8f0d8;
    width: 100%;
    text-align: left;
    cursor: pointer;
    font-family: "DM Sans", sans-serif;
    transition:
      background 0.15s,
      transform 0.15s;
  }
  .email-row:hover {
    background: #f4f9ec;
    transform: translateY(-1px);
  }

  /* Section label */
  .section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #8aab52;
    margin-bottom: 10px;
  }

  /* Spinner */
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .spinner {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2.5px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    animation: spin 0.7s linear infinite;
  }

  /* Success checkmark */
  .success-badge {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
    color: #4a6518;
    background: #e8f5d0;
    padding: 2px 10px;
    border-radius: 999px;
  }

  /* URL preview */
  .url-preview {
    background: #f0f5e8;
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 16px;
    font-size: 12px;
    color: #6b8f27;
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
    border: 1px solid #d8ebb0;
  }
  .url-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Organic divider */
  .organic-divider {
    height: 1px;
    margin: 20px 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      #d8ebb0 30%,
      #d8ebb0 70%,
      transparent 100%
    );
  }

  /* Close button */
  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(107, 143, 39, 0.1);
    border: none;
    cursor: pointer;
    color: #4a6518;
    transition:
      background 0.15s,
      transform 0.15s;
    flex-shrink: 0;
  }
  .close-btn:hover {
    background: rgba(107, 143, 39, 0.18);
    transform: rotate(90deg);
  }
</style>
