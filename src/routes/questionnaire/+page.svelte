<script lang="ts">
  import { goto } from "$app/navigation";
  import Assesment from "$lib/components/Assesment.svelte";
  import Controller from "$lib/components/Controller.svelte";
  import ProgressBar from "$lib/components/ProgressBar.svelte";
  import {
    NAME_STORAGE_KEY,
    RESULTS_STORAGE_KEY,
  } from "$lib/constants/constants";
  import assessmentQuestions from "$lib/questions.json";
  import { onMount } from "svelte";

  const QUESTIONS_PER_PAGE = 5;
  let currentPage = 1;
  const totalPages = Math.ceil(assessmentQuestions.length / QUESTIONS_PER_PAGE);

  $: pagedQuestions = assessmentQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE,
  );

  let assessmentResults: ResultsMap = {};
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
</script>

<div
  class="relative w-full min-h-screen flex flex-col items-center overflow-hidden py-4 mb-10"
>
  <ProgressBar {currentPage} {totalPages} color="var(--color-accent)" />
  <Assesment questions={pagedQuestions} bind:results={assessmentResults} />
  <Controller
    isDisabledNext={currentPage === totalPages}
    isDisabledPrev={currentPage === 1}
    on:next={handleNext}
    on:prev={handlePrev}
  />
</div>
