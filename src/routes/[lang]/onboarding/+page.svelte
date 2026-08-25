<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import {
    NAME_STORAGE_KEY,
    RESULTS_STORAGE_KEY,
  } from "$lib/constants/constants";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import GiftMark from "$lib/components/illustrations/GiftMark.svelte";
  import { giftColor } from "$lib/data/gift-colors";
  import type { GlyphName } from "$lib/data/gift-colors";

  let name = "";
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
    }
  });

  const hintGifts = [
    { key: "faith", label: "Faith" },
    { key: "wisdom", label: "Wisdom" },
    { key: "leadership", label: "Leadership" },
    { key: "mercy", label: "Mercy" },
    { key: "teacher", label: "Teaching" },
    { key: "service", label: "Service" },
  ];
</script>

<div class="page">
  <div class="w-full max-w-md mx-auto flex flex-col items-center px-2">
    <!-- Little illustrated mark -->
    <div class="press-in mb-6 flex gap-2">
      {#each [{ g: 'dove', c: '#0d76cc' }, { g: 'flame', c: '#d22628' }, { g: 'crown', c: '#d97706' }] as { g, c }(g)}
        <div class="mini-mark" style="background: var(--color-paper);">
          <GiftMark glyph={g as GlyphName} color={c} />
        </div>
      {/each}
    </div>

    <!-- Heading -->
    <h1
      class="press-in press-in-d1 display text-4xl text-ink font-bold leading-tight mb-3 text-center"
    >
      {$_("pages.onboarding.title")}
    </h1>

    <!-- Form -->
    <form
      on:submit|preventDefault={handleSubmit}
      class="press-in press-in-d2 w-full mt-8"
    >
      <div class="mb-7">
        <label for="name" class="smallcaps text-ink-faint block mb-3">
          {$_("pages.onboarding.formTitle")}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          bind:value={name}
          required
          maxlength="50"
          placeholder={$_("pages.onboarding.formPlaceholder")}
          class="name-input"
          autocomplete="given-name"
        />
      </div>

      <button
        type="submit"
        class="submit-btn smallcaps"
        disabled={submitting || !name.trim()}
      >
        {#if submitting}
          <div class="spinner"></div>
          <span>Starting…</span>
        {:else}
          <span>{$_("pages.onboarding.formButton")}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        {/if}
      </button>
    </form>

    <!-- Trust line -->
    <div class="press-in press-in-d3 trust-row smallcaps mt-8">
      Free · No account needed · Accurate results
    </div>

    <!-- Gifts hint -->
    <div class="press-in press-in-d4 gifts-hint mt-12">
      <span class="text-ink-faint text-sm">Discover gifts like</span>
      <div class="hint-row mt-3">
        {#each hintGifts as h (h.key)}
          {@const gc = giftColor(h.key)}
          <span class="hint-chip" style="background: {gc.pale};">
            <span class="hint-chip-mark">
              <GiftMark glyph={gc.glyph} color={gc.accent} />
            </span>
            {h.label}
          </span>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    background: var(--color-paper);
  }

  .mini-mark {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    border: 1px solid var(--color-line);
    padding: 10px;
  }

  /* Name input — friendly rounded field */
  .name-input {
    width: 100%;
    padding: 15px 18px;
    border: 2px solid var(--color-line);
    border-radius: 16px;
    background: #ffffff;
    font-size: 17px;
    font-family: var(--font-sans);
    font-weight: 500;
    color: var(--color-ink);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .name-input::placeholder {
    color: var(--color-ink-faint);
    font-weight: 400;
  }
  .name-input:focus {
    border-color: var(--color-amber);
    box-shadow: 0 0 0 4px var(--color-amber-pale);
  }

  /* Submit */
  .submit-btn {
    width: 100%;
    padding: 17px 28px;
    border: none;
    border-radius: 999px;
    background: var(--color-ink);
    color: var(--color-paper);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    transition: background 0.15s, transform 0.15s;
    font-size: 11px;
  }
  .submit-btn:hover:not(:disabled) {
    background: var(--color-ink-soft);
    transform: translateY(-1px);
  }
  .submit-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  .spinner {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 2px solid rgba(246, 245, 244, 0.35);
    border-top-color: var(--color-paper);
    animation: spin 0.7s linear infinite;
  }

  .trust-row {
    color: var(--color-ink-faint);
    text-align: center;
  }

  .hint-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
  .hint-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 14px 6px 8px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-ink);
  }
  .hint-chip-mark {
    width: 24px;
    height: 24px;
    display: block;
  }
</style>
