<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import {
    NAME_STORAGE_KEY,
    RESULTS_STORAGE_KEY,
  } from "$lib/constants/constants";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { fly, fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  let name = "";
  let visible = false;
  let focused = false;
  let submitting = false;

  function handleSubmit(event: Event) {
    event.preventDefault();
    if (!name.trim()) return;
    submitting = true;
    const capitalizedName = name
      .trim()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
    localStorage.setItem(NAME_STORAGE_KEY, capitalizedName);
    goto(`/${$page.params.lang}/questionnaire`);
  }

  onMount(() => {
    const savedName = localStorage.getItem(NAME_STORAGE_KEY);
    if (savedName) {
      goto(`/${$page.params.lang}/questionnaire`);
    } else {
      localStorage.removeItem(RESULTS_STORAGE_KEY);
      requestAnimationFrame(() => {
        visible = true;
      });
    }
  });
</script>

<div class="page">
  <div class="blob-mid"></div>

  <div class="relative z-10 w-full flex flex-col items-center">
    <!-- Brand mark above card -->
    <div class="reveal {visible ? 'in' : ''} mb-8 text-center">
      <div
        class="text-xs font-semibold tracking-widest uppercase text-[#8aab52] mb-1"
      >
        TheGifts
      </div>
      <p class="text-sm text-[#4a5e2a]/60">
        Understand the Purpose God Planted in You.
      </p>
    </div>

    <!-- Main card -->
    <div class="card reveal d1 {visible ? 'in' : ''}">
      <!-- Eyebrow -->
      <div class="eyebrow">Get Started</div>

      <!-- Heading -->
      <h1
        class="serif text-4xl text-[#1a2e05] leading-tight mb-3"
        style="position:relative;z-index:1;"
      >
        {$_("pages.onboarding.title")}
      </h1>

      <p
        class="text-sm text-[#4a5e2a]/65 leading-relaxed mb-8"
        style="position:relative;z-index:1;"
      >
        {$_("pages.onboarding.formTitle")}
      </p>

      <!-- Form -->
      <form
        on:submit|preventDefault={handleSubmit}
        style="position:relative;z-index:1;"
      >
        <div class="mb-5">
          <label for="name" class="input-label">
            {$_("pages.onboarding.formTitle")}
          </label>
          <div class="input-wrap">
            <input
              type="text"
              id="name"
              name="name"
              bind:value={name}
              required
              maxlength="50"
              placeholder={$_("pages.onboarding.formPlaceholder")}
              class="name-input"
              on:focus={() => {
                focused = true;
              }}
              on:blur={() => {
                focused = false;
              }}
              autocomplete="given-name"
            />
          </div>
        </div>

        <button
          type="submit"
          class="submit-btn"
          disabled={submitting || !name.trim()}
        >
          {#if submitting}
            <div class="spinner"></div>
            <span>Starting…</span>
          {:else}
            <span>{$_("pages.onboarding.formButton")}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          {/if}
        </button>
      </form>

      <div class="divider"></div>

      <!-- Trust line -->
      <div class="trust-row">
        <div class="trust-dot"></div>
        Free · No account needed · Accurate results
        <div class="trust-dot"></div>
      </div>
    </div>

    <!-- Gift tags hint -->
    <div class="gifts-hint reveal d3 {visible ? 'in' : ''}">
      Discover gifts like
      <div class="gifts-tags">
        {#each ["Faith", "Wisdom", "Leadership", "Mercy", "Teaching", "Service"] as g}
          <span class="gift-tag">{g}</span>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap");

  .page {
    font-family: "DM Sans", sans-serif;
    background: linear-gradient(160deg, #f7f3eb 0%, #eef5e4 55%, #f2efe6 100%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    padding: 24px;
  }

  /* Background blobs */
  .page::before {
    content: "";
    position: fixed;
    top: -120px;
    right: -100px;
    width: 520px;
    height: 520px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(107, 143, 39, 0.1) 0%,
      transparent 65%
    );
    pointer-events: none;
  }
  .page::after {
    content: "";
    position: fixed;
    bottom: -80px;
    left: -100px;
    width: 420px;
    height: 420px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(143, 184, 64, 0.08) 0%,
      transparent 65%
    );
    pointer-events: none;
  }

  /* Extra mid blob */
  .blob-mid {
    position: fixed;
    top: 50%;
    left: -60px;
    transform: translateY(-50%);
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(107, 143, 39, 0.05) 0%,
      transparent 65%
    );
    pointer-events: none;
  }

  .serif {
    font-family: "DM Serif Display", serif;
  }

  /* Reveal */
  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition:
      opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .reveal.in {
    opacity: 1;
    transform: translateY(0);
  }
  .d1 {
    transition-delay: 0.08s;
  }
  .d2 {
    transition-delay: 0.18s;
  }
  .d3 {
    transition-delay: 0.28s;
  }
  .d4 {
    transition-delay: 0.38s;
  }

  /* Card */
  .card {
    background: white;
    border-radius: 28px;
    border: 1.5px solid #e8f0d8;
    padding: 48px 44px 44px;
    width: 100%;
    max-width: 440px;
    position: relative;
    overflow: hidden;
    box-shadow:
      0 8px 40px rgba(74, 101, 24, 0.08),
      0 1px 0 rgba(255, 255, 255, 0.9) inset;
  }

  /* Subtle card top-right deco */
  .card::before {
    content: "";
    position: absolute;
    top: -50px;
    right: -50px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(107, 143, 39, 0.07) 0%,
      transparent 65%
    );
    pointer-events: none;
  }

  /* Eyebrow */
  .eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #8aab52;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .eyebrow::before {
    content: "";
    display: block;
    width: 20px;
    height: 1px;
    background: rgba(138, 171, 82, 0.4);
  }

  /* Input */
  .input-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #4a6518;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .input-wrap {
    position: relative;
  }

  .name-input {
    width: 100%;
    padding: 14px 18px;
    border-radius: 14px;
    border: 1.5px solid #e0ebb8;
    background: #fafef5;
    font-size: 16px;
    font-family: "DM Sans", sans-serif;
    color: #1a2e05;
    outline: none;
    transition:
      border-color 0.2s,
      box-shadow 0.2s,
      background 0.2s;
    box-shadow: 0 2px 8px rgba(107, 143, 39, 0.04);
  }
  .name-input::placeholder {
    color: #b0c880;
  }
  .name-input:focus {
    border-color: #7ea832;
    background: white;
    box-shadow:
      0 0 0 4px rgba(107, 143, 39, 0.1),
      0 2px 8px rgba(107, 143, 39, 0.06);
  }

  /* Submit button */
  .submit-btn {
    width: 100%;
    padding: 15px 24px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, #3d5a12 0%, #5a7c1a 40%, #6b8f27 100%);
    color: white;
    font-size: 15px;
    font-weight: 600;
    font-family: "DM Sans", sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 18px rgba(74, 101, 24, 0.24);
    transition:
      transform 0.2s,
      box-shadow 0.2s,
      opacity 0.2s;
  }
  .submit-btn::before {
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
  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(74, 101, 24, 0.3);
  }
  .submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }
  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Organic divider */
  .divider {
    height: 1px;
    margin: 28px 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(107, 143, 39, 0.15) 30%,
      rgba(107, 143, 39, 0.15) 70%,
      transparent
    );
  }

  /* Trust line */
  .trust-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 12px;
    color: #8aab52;
    font-weight: 500;
  }
  .trust-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #c8e090;
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
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    animation: spin 0.7s linear infinite;
  }

  /* Below-card gifts preview */
  .gifts-hint {
    margin-top: 24px;
    text-align: center;
    font-size: 12px;
    color: #8aab52;
    font-weight: 500;
  }
  .gifts-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
    margin-top: 8px;
  }
  .gift-tag {
    padding: 4px 12px;
    border-radius: 999px;
    background: rgba(107, 143, 39, 0.08);
    border: 1px solid rgba(107, 143, 39, 0.15);
    font-size: 11px;
    font-weight: 500;
    color: #4a6518;
  }
</style>
