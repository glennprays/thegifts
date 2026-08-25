<script lang="ts">
  import type { AnswerMap } from "$lib/schemas/assesment";

  export let questions: { id: number; en: string; in: string }[] = [];
  export let results: AnswerMap = {};

  import { _, locale } from "svelte-i18n";

  $: currentLocale = $locale;

  // Likert scale options with translations
  $: options = [
    { value: 1, label: $_("components.likert.stronglyDisagree"), short: "1" },
    { value: 2, label: $_("components.likert.disagree"), short: "2" },
    { value: 3, label: $_("components.likert.neutral"), short: "3" },
    { value: 4, label: $_("components.likert.agree"), short: "4" },
    { value: 5, label: $_("components.likert.stronglyAgree"), short: "5" },
  ];

  function select(questionId: number, value: number) {
    results = { ...results, [questionId]: value };
  }
</script>

{#each questions as q (q.id)}
  {@const answered = !!results[q.id]}
  <div class="question-card" class:answered>
    <div class="q-head">
      <span class="q-num smallcaps">
        {$_("components.assesment.questionPrefix", { values: { id: q.id } })}
      </span>
      {#if answered}
        <span class="answered-mark" aria-hidden="true">✓</span>
      {/if}
    </div>

    <p class="q-text">{currentLocale === "id" ? q.in : q.en}</p>

    <div class="likert" role="group" aria-label={$_("components.assesment.questionPrefix", { values: { id: q.id } })}>
      {#each options as opt (opt.value)}
        <label class="likert-option">
          <button
            type="button"
            class="likert-btn"
            class:selected={results[q.id] === opt.value}
            on:click={() => select(q.id, opt.value)}
            aria-pressed={results[q.id] === opt.value}
            aria-label={$_("components.assesment.ariaLabel", { values: { label: opt.label, value: opt.value } })}
          >
            <span>{opt.short}</span>
          </button>
          <span class="likert-label">{opt.label}</span>
        </label>
      {/each}
    </div>
  </div>
{/each}

<style>
  .question-card {
    background: #ffffff;
    border: 1px solid var(--color-line);
    border-radius: 20px;
    padding: 24px 24px 20px;
    margin-bottom: 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .question-card.answered {
    border-color: var(--color-green);
    box-shadow: 0 4px 16px rgba(36, 132, 63, 0.08);
  }

  .q-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  /* Question number */
  .q-num {
    color: var(--color-ink-faint);
    display: block;
  }

  /* Answered tick */
  .answered-mark {
    font-size: 11px;
    font-weight: 700;
    color: #ffffff;
    background: var(--color-green);
    width: 20px;
    height: 20px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  /* Question text */
  .q-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-ink);
    line-height: 1.6;
    margin-bottom: 20px;
  }

  /* Likert — rounded tick boxes */
  .likert {
    display: flex;
    gap: 8px;
  }

  .likert-option {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    cursor: pointer;
  }

  .likert-btn {
    width: 100%;
    aspect-ratio: 1 / 1;
    max-width: 52px;
    border: 2px solid var(--color-line);
    border-radius: 14px;
    background: var(--color-paper);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 700;
    font-family: var(--font-sans);
    color: var(--color-ink-soft);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .likert-btn:hover {
    border-color: var(--color-ink-faint);
    color: var(--color-ink);
    transform: translateY(-1px);
  }

  .likert-btn.selected {
    background: var(--color-ink);
    border-color: var(--color-ink);
    color: var(--color-paper);
    transform: translateY(-1px);
  }

  .likert-label {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: var(--color-ink-faint);
    text-align: center;
    line-height: 1.35;
    white-space: pre-line;
  }
  .likert-option:first-child .likert-label,
  .likert-option:last-child .likert-label {
    color: var(--color-ink-soft);
    font-weight: 700;
  }
</style>
