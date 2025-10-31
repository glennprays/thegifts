<script lang="ts">
  import { goto } from "$app/navigation";
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
  let isLoading = false;
  const QUESTIONS_PER_PAGE = 5;
  let currentPage = 1;
  const totalPages = Math.ceil(assessmentQuestions.length / QUESTIONS_PER_PAGE);

  $: pagedQuestions = assessmentQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE,
  );

  let assessmentResults: AnswerMap = {};
  let finishedLoadFromStorage = false;
  onMount(() => {
    const savedName = localStorage.getItem(NAME_STORAGE_KEY);
    if (!savedName) {
      localStorage.removeItem(RESULTS_STORAGE_KEY);
      goto("/onboarding");
    }

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
        console.error("Could not parse saved results:", e);
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
    scrollToTop();
  };

  const handlePrev = () => {
    currentPage -= 1;
    scrollToTop();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      console.log(result);
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
<div
  class="relative w-full min-h-screen flex flex-col items-center overflow-hidden py-4 mb-10"
>
  <ProgressBar {currentPage} {totalPages} color="var(--color-accent)" />
  <Assesment questions={pagedQuestions} bind:results={assessmentResults} />
  <Controller
    {isDisabledNext}
    isDisabledPrev={currentPage === 1}
    isDisableSubmit={isDisabledNext}
    isHideSubmit={currentPage < totalPages}
    on:next={handleNext}
    on:prev={handlePrev}
    on:submit={handleSubmit}
  />
</div>
