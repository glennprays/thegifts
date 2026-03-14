<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Assesment from "$lib/components/Assesment.svelte";
  import Controller from "$lib/components/Controller.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import ProgressBar from "$lib/components/ProgressBar.svelte";
  import {
    NAME_STORAGE_KEY,
    RESULTS_STORAGE_KEY,
  } from "$lib/constants/constants";
  import assessmentQuestions from "$lib/data/questions.json";
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { _ } from "svelte-i18n";

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
      } catch (e) {
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
      <span class="page-label">
        {currentPage} / {totalPages}
      </span>
      <div class="progress-track">
        <div class="progress-fill" style="width: {progressPct}%;"></div>
      </div>
      <span class="pct-label">{progressPct}%</span>
    </div>
  </div>

  <!-- ── Questions area ─────────────────────────────────── -->
  <div class="questions-area">
    <!-- Page intro -->
    <div class="page-intro">
      <div class="intro-eyebrow">Assessment · Page {currentPage}</div>
      {#if savedName}
        <div class="intro-name">{savedName}'s Assessment</div>
      {/if}
      <div class="intro-hint">
        Answer honestly — there are no right or wrong answers.
        {#if answeredOnPage < pagedQuestions.length}
          <span style="color:#6b8f27;font-weight:500;">
            {pagedQuestions.length - answeredOnPage} question{pagedQuestions.length -
              answeredOnPage !==
            1
              ? "s"
              : ""} left on this page.
          </span>
        {:else}
          <span style="color:#4a6518;font-weight:600;"
            >✓ All answered — you can continue.</span
          >
        {/if}
      </div>
    </div>

    <!-- Questions with page transition -->
    {#key pageKey}
      <div
        in:fly={{ x: 24, duration: 340, easing: quintOut }}
        out:fly={{ x: -24, duration: 200 }}
      >
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
        class="btn-prev"
        disabled={currentPage === 1}
        on:click={handlePrev}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg
        >
        Back
      </button>

      <!-- Center status -->
      <div class="answer-status">
        <div
          class="status-dot {answeredOnPage === pagedQuestions.length
            ? 'all'
            : ''}"
        ></div>
        {answeredOnPage}/{pagedQuestions.length}
      </div>

      <!-- Next or Submit -->
      {#if currentPage < totalPages}
        <button
          class="btn-next"
          disabled={isDisabledNext}
          on:click={handleNext}
        >
          Continue
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg
          >
        </button>
      {:else}
        <button
          class="btn-submit"
          disabled={isDisabledNext}
          on:click={handleSubmit}
        >
          See Results
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg
          >
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  @import url("https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap");

  .page {
    font-family: "DM Sans", sans-serif;
    background: linear-gradient(160deg, #f7f3eb 0%, #eef5e4 55%, #f2efe6 100%);
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }
  .page::before {
    content: "";
    position: fixed;
    top: -100px;
    right: -100px;
    width: 480px;
    height: 480px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(107, 143, 39, 0.08) 0%,
      transparent 65%
    );
    pointer-events: none;
    z-index: 0;
  }
  .page::after {
    content: "";
    position: fixed;
    bottom: -80px;
    left: -80px;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(143, 184, 64, 0.07) 0%,
      transparent 65%
    );
    pointer-events: none;
    z-index: 0;
  }

  .serif {
    font-family: "DM Serif Display", serif;
  }

  /* Sticky header */
  .sticky-header {
    position: sticky;
    top: 0;
    z-index: 40;
    background: rgba(247, 243, 235, 0.92);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(107, 143, 39, 0.1);
    padding: 12px 20px;
  }

  .header-inner {
    max-width: 680px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  /* Progress track */
  .progress-track {
    flex: 1;
    height: 6px;
    border-radius: 999px;
    background: rgba(107, 143, 39, 0.12);
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #4a6518, #8fb840);
    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .page-label {
    font-size: 12px;
    font-weight: 600;
    color: #4a6518;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .pct-label {
    font-size: 11px;
    font-weight: 600;
    color: #8aab52;
    white-space: nowrap;
    flex-shrink: 0;
    min-width: 34px;
    text-align: right;
  }

  /* Questions area */
  .questions-area {
    position: relative;
    z-index: 1;
    max-width: 680px;
    margin: 0 auto;
    padding: 28px 20px 120px;
  }

  /* Page intro */
  .page-intro {
    margin-bottom: 24px;
  }
  .intro-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #8aab52;
    margin-bottom: 6px;
  }
  .intro-name {
    font-family: "DM Serif Display", serif;
    font-size: 22px;
    color: #1a2e05;
    line-height: 1.2;
  }
  .intro-hint {
    font-size: 13px;
    color: rgba(74, 94, 42, 0.6);
    margin-top: 4px;
    line-height: 1.5;
  }

  /* Sticky controller */
  .sticky-controller {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 40;
    background: rgba(247, 243, 235, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-top: 1px solid rgba(107, 143, 39, 0.1);
    padding: 14px 20px;
    box-shadow: 0 -4px 20px rgba(74, 101, 24, 0.06);
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
    gap: 6px;
    padding: 11px 20px;
    border-radius: 12px;
    border: none;
    background: rgba(107, 143, 39, 0.08);
    border: 1.5px solid rgba(107, 143, 39, 0.18);
    color: #4a6518;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    font-family: "DM Sans", sans-serif;
    transition:
      background 0.15s,
      transform 0.15s;
  }
  .btn-prev:hover:not(:disabled) {
    background: rgba(107, 143, 39, 0.14);
    transform: translateX(-2px);
  }
  .btn-prev:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .btn-next {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 12px 28px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #3d5a12, #6b8f27);
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: "DM Sans", sans-serif;
    box-shadow: 0 3px 14px rgba(74, 101, 24, 0.22);
    position: relative;
    overflow: hidden;
    transition:
      transform 0.15s,
      box-shadow 0.15s,
      opacity 0.15s;
  }
  .btn-next::before {
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
  }
  .btn-next:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(74, 101, 24, 0.28);
  }
  .btn-next:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .btn-submit {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 12px 28px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #3d5a12, #6b8f27);
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: "DM Sans", sans-serif;
    box-shadow: 0 3px 14px rgba(74, 101, 24, 0.22);
    position: relative;
    overflow: hidden;
    transition:
      transform 0.15s,
      box-shadow 0.15s,
      opacity 0.15s;
  }
  .btn-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(74, 101, 24, 0.28);
  }
  .btn-submit:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* Answer status pill */
  .answer-status {
    font-size: 12px;
    font-weight: 500;
    color: #8aab52;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #8aab52;
  }
  .status-dot.all {
    background: #4a6518;
  }
</style>
