<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Assesment from "$lib/components/Assesment.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import {
    NAME_STORAGE_KEY,
    RESULTS_STORAGE_KEY,
  } from "$lib/constants/constants";
  import assessmentQuestions from "$lib/data/questions.json";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import type { AnswerMap } from "$lib/schemas/assesment";

  let isLoading = false;
  const QUESTIONS_PER_PAGE = 5;
  let currentPage = 1;
  const totalPages = Math.ceil(assessmentQuestions.length / QUESTIONS_PER_PAGE);
  let savedName = "";

  $: pagedQuestions = assessmentQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE,
  );

  // Progress percentage for display
  $: progressPct = Math.round(((currentPage - 1) / totalPages) * 100);
  $: answeredOnPage = pagedQuestions.filter(
    (q) => !!assessmentResults[q.id],
  ).length;

  let assessmentResults: AnswerMap = {};
  let finishedLoadFromStorage = false;
  let pageKey = 0; // used to trigger transition on page change

  onMount(() => {
    const name = localStorage.getItem(NAME_STORAGE_KEY);
    if (!name) {
      localStorage.removeItem(RESULTS_STORAGE_KEY);
      goto(`/${$page.params.lang}/onboarding`);
      return;
    }
    savedName = name;

    const savedResult = localStorage.getItem(RESULTS_STORAGE_KEY);
    if (savedResult) {
      try {
        assessmentResults = JSON.parse(savedResult);
        if (assessmentResults && Object.keys(assessmentResults).length > 0) {
          const answeredIds = Object.keys(assessmentResults);
          const lastAnsweredIndex = assessmentQuestions.findIndex(
            (q) => q.id === Number(answeredIds[answeredIds.length - 1]),
          );
          if (lastAnsweredIndex >= 0) {
            currentPage =
              Math.floor(lastAnsweredIndex / QUESTIONS_PER_PAGE) + 1;
          }
        }
      } catch {
        localStorage.removeItem(RESULTS_STORAGE_KEY);
      }
    }
    finishedLoadFromStorage = true;
  });

  $: {
    if (
      typeof window !== "undefined" &&
      finishedLoadFromStorage &&
      assessmentResults
    ) {
      localStorage.setItem(
        RESULTS_STORAGE_KEY,
        JSON.stringify(assessmentResults),
      );
    }
  }

  const handleNext = () => {
    currentPage += 1;
    pageKey += 1;
    scrollToTop();
  };
  const handlePrev = () => {
    currentPage -= 1;
    pageKey += 1;
    scrollToTop();
  };
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    isLoading = true;
    isDisabledNext = true;
    const body = {
      name: localStorage.getItem(NAME_STORAGE_KEY),
      answers: assessmentResults,
    };
    try {
      const res = await fetch("/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.removeItem(NAME_STORAGE_KEY);
        localStorage.removeItem(RESULTS_STORAGE_KEY);
        goto(`/${$page.params.lang}/questionnaire/result/${result.id}`);
      }
    } catch (error) {
      console.error("Error submitting results:", error);
    } finally {
      isLoading = false;
      isDisabledNext = false;
    }
  };

  $: isDisabledNext = pagedQuestions.some((q) => !assessmentResults[q.id]);
</script>

{#if isLoading}
  <Loading />
{/if}

<div class="page">
  <!-- ── Sticky top header ───────────────────────────────── -->
  <div class="sticky-header">
    <div class="header-inner">
      <span class="page-label smallcaps">
        Question {currentPage} of {totalPages}
      </span>
      <div class="progress-track">
        <div class="progress-fill" style="width: {progressPct}%;"></div>
      </div>
      <span class="pct-label tabular-nums">{progressPct}%</span>
    </div>
  </div>

  <!-- ── Questions area ─────────────────────────────────── -->
  <div class="questions-area">
    <!-- Page intro -->
    <div class="page-intro press-in">
      <div class="intro-eyebrow smallcaps">{$_("pages.questionnaire.pageLabel", { values: { currentPage } })}</div>
      {#if savedName}
        <div class="intro-name display">{$_("pages.questionnaire.personalAssessment", { values: { name: savedName } })}</div>
      {/if}
      <div class="intro-hint">
        {$_("pages.questionnaire.answerHint")}
        {#if answeredOnPage < pagedQuestions.length}
          <span style="color:var(--color-amber);font-weight:600;">
            {$_(pagedQuestions.length - answeredOnPage === 1 ? "pages.questionnaire.questionsLeft" : "pages.questionnaire.questionsLeft_plural", { values: { count: pagedQuestions.length - answeredOnPage } })}
          </span>
        {:else}
          <span style="color:var(--color-green);font-weight:600;">{$_("pages.questionnaire.allAnswered")}</span>
        {/if}
      </div>
    </div>

    <!-- Questions -->
    {#key pageKey}
      <div class="press-in">
        <Assesment
          questions={pagedQuestions}
          bind:results={assessmentResults}
        />
      </div>
    {/key}
  </div>

  <!-- ── Sticky bottom controller ──────────────────────── -->
  <div class="sticky-controller">
    <div class="controller-inner">
      <!-- Prev -->
      <button
        class="btn-prev smallcaps"
        disabled={currentPage === 1}
        on:click={handlePrev}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        {$_("pages.questionnaire.back")}
      </button>

      <!-- Center status -->
      <div class="answer-status tabular-nums">
        {answeredOnPage}/{pagedQuestions.length}
      </div>

      <!-- Next or Submit -->
      {#if currentPage < totalPages}
        <button
          class="btn-next smallcaps"
          disabled={isDisabledNext}
          on:click={handleNext}
        >
          {$_("pages.questionnaire.continue")}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      {:else}
        <button
          class="btn-next smallcaps"
          disabled={isDisabledNext}
          on:click={handleSubmit}
        >
          {$_("pages.questionnaire.seeResults")}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .page {
    background: var(--color-paper);
    min-height: 100vh;
    position: relative;
  }

  /* Sticky header */
  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 40;
    background: var(--color-paper);
    padding: 14px 20px;
    box-shadow: 0 1px 0 var(--color-line);
  }

  .header-inner {
    max-width: 680px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  /* Progress track — rounded pill */
  .progress-track {
    flex: 1;
    height: 10px;
    border-radius: 999px;
    background: var(--color-paper-deep);
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 999px;
    background: var(--color-amber);
    transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .page-label {
    color: var(--color-ink);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .pct-label {
    font-size: 11px;
    font-weight: 700;
    color: var(--color-ink-faint);
    white-space: nowrap;
    flex-shrink: 0;
    min-width: 34px;
    text-align: right;
  }

  /* Questions area */
  .questions-area {
    position: relative;
    max-width: 680px;
    margin: 0 auto;
    padding: 32px 20px 130px;
  }

  /* Page intro */
  .page-intro {
    margin-bottom: 24px;
  }
  .intro-eyebrow {
    color: var(--color-amber);
    margin-bottom: 8px;
  }
  .intro-name {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-ink);
    line-height: 1.2;
  }
  .intro-hint {
    font-size: 13px;
    color: var(--color-ink-faint);
    margin-top: 6px;
    line-height: 1.5;
  }

  /* Sticky controller */
  .sticky-controller {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    background: var(--color-paper);
    box-shadow: 0 -1px 0 var(--color-line);
    padding: 14px 20px;
  }
  .controller-inner {
    max-width: 680px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .btn-prev {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 12px 20px;
    border: 2px solid var(--color-line);
    border-radius: 999px;
    background: transparent;
    color: var(--color-ink-soft);
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .btn-prev:hover:not(:disabled) {
    border-color: var(--color-ink-faint);
    color: var(--color-ink);
  }
  .btn-prev:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .btn-next {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 13px 28px;
    border: none;
    border-radius: 999px;
    background: var(--color-ink);
    color: var(--color-paper);
    cursor: pointer;
    transition: background 0.15s, transform 0.15s;
  }
  .btn-next:hover:not(:disabled) {
    background: var(--color-ink-soft);
    transform: translateY(-1px);
  }
  .btn-next:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  /* Answer status */
  .answer-status {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--color-ink-faint);
  }
</style>
