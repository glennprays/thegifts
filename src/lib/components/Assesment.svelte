<script lang="ts">
  // Enhanced Assessment.svelte
  // Drop-in replacement — same props interface
  export let questions: { id: number; en: string; in: string }[] = [];
  export let results: AnswerMap = {};

  import { fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
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

{#each questions as q, i (q.id)}
  {@const answered = !!results[q.id]}
  <div
    class="question-card {answered ? 'answered' : ''}"
    in:fly={{ y: 14, duration: 300, delay: i * 50, easing: quintOut }}
  >
    {#if answered}
      <div class="answered-check">✓</div>
    {/if}

    <span class="q-num">{$_("components.assesment.questionPrefix", { values: { id: q.id } })}</span>
    <p class="q-text">{currentLocale === "id" ? q.in : q.en}</p>

    <div class="likert">
      {#each options as opt}
        <label class="likert-option">
          <button
            type="button"
            class="likert-btn {results[q.id] === opt.value ? 'selected' : ''}"
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
  @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap");

  .question-card {
    background: white;
    border-radius: 22px;
    border: 1.5px solid #e8f0d8;
    padding: 28px 26px 24px;
    margin-bottom: 14px;
    position: relative;
    overflow: hidden;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
    font-family: "DM Sans", sans-serif;
  }

  /* Answered state */
  .question-card.answered {
    border-color: #c0dba0;
    box-shadow: 0 4px 20px rgba(74, 101, 24, 0.07);
  }

  /* Subtle bg tint alternating */
  .question-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 22px;
    opacity: 0.25;
    pointer-events: none;
  }
  .question-card:nth-child(odd)::before {
    background: #f4f9ec;
  }
  .question-card:nth-child(even)::before {
    background: #f0f8e4;
  }

  /* Question number */
  .q-num {
    font-family: "DM Serif Display", serif;
    font-style: italic;
    font-size: 12px;
    color: rgba(107, 143, 39, 0.4);
    margin-bottom: 10px;
    display: block;
  }

  /* Question text */
  .q-text {
    font-size: 15px;
    font-weight: 500;
    color: #1a2e05;
    line-height: 1.65;
    margin-bottom: 22px;
    position: relative;
    z-index: 1;
  }

  /* Likert scale */
  .likert {
    display: flex;
    gap: 8px;
    position: relative;
    z-index: 1;
  }

  .likert-option {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }

  .likert-btn {
    width: 100%;
    aspect-ratio: 1/1;
    max-width: 52px;
    border-radius: 12px;
    border: 1.5px solid #e0ebb8;
    background: #fafef5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: #6b8f27;
    font-family: "DM Sans", sans-serif;
    cursor: pointer;
    transition: all 0.18s ease;
    position: relative;
    overflow: hidden;
  }
  .likert-btn::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: linear-gradient(135deg, #3d5a12, #6b8f27);
    opacity: 0;
    transition: opacity 0.18s;
  }
  .likert-btn span {
    position: relative;
    z-index: 1;
    transition: color 0.18s;
  }

  .likert-btn:hover {
    border-color: #8fb840;
    background: #f0f8e0;
    transform: translateY(-2px);
  }

  .likert-btn.selected {
    border-color: #4a6518;
    box-shadow: 0 4px 14px rgba(74, 101, 24, 0.22);
    transform: translateY(-2px);
  }
  .likert-btn.selected::before {
    opacity: 1;
  }
  .likert-btn.selected span {
    color: white;
  }

  .likert-label {
    font-size: 10px;
    font-weight: 500;
    color: #a0b878;
    text-align: center;
    line-height: 1.3;
    white-space: pre-line;
  }
  .likert-option:first-child .likert-label,
  .likert-option:last-child .likert-label {
    color: #8aab52;
    font-weight: 600;
  }

  /* Check indicator when answered */
  .answered-check {
    position: absolute;
    top: 16px;
    right: 18px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4a6518, #6b8f27);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 11px;
    z-index: 2;
    animation: checkPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  @keyframes checkPop {
    from {
      transform: scale(0);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
