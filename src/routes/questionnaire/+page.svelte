<script lang="ts">
  import Assesment from "$lib/components/Assesment.svelte";
  import Controller from "$lib/components/Controller.svelte";
  import ProgressBar from "$lib/components/ProgressBar.svelte";
  import assessmentQuestions from "$lib/questions.json";

  const QUESTIONS_PER_PAGE = 5;
  let currentPage = 1;
  const totalPages = Math.ceil(assessmentQuestions.length / QUESTIONS_PER_PAGE);

  $: pagedQuestions = assessmentQuestions.slice(
    (currentPage - 1) * QUESTIONS_PER_PAGE,
    currentPage * QUESTIONS_PER_PAGE,
  );

  let assessmentResults: ResultsMap = {};
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
    {currentPage}
    {totalPages}
    on:next={handleNext}
    on:prev={handlePrev}
  />
</div>
