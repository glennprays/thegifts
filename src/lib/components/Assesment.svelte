<script lang="ts">
  import { _ } from "svelte-i18n";
  export let questions: { id: number; en: string; in: string }[] = [];

  export let results: ResultsMap = {};
  import { locale } from "svelte-i18n";
  $: currentLocale = $locale;

  const options: RatingOption[] = [
    {
      text_en: "Strongly Disagree",
      text_id: "Sangat Tidak Setuju",
      rating: 1,
      color: "text-red-400",
      bg: "bg-red-100",
      checked: "bg-red-400",
    },
    {
      text_en: "Disagree",
      text_id: "Tidak Setuju",
      rating: 2,
      color: "text-orange-400",
      bg: "bg-orange-100",
      checked: "bg-orange-400",
    },
    {
      text_en: "Neutral",
      text_id: "Netral",
      rating: 3,
      color: "text-gray-400",
      bg: "bg-gray-100",
      checked: "bg-gray-400",
    },
    {
      text_en: "Agree",
      text_id: "Setuju",
      rating: 4,
      color: "text-green-500",
      bg: "bg-green-100",
      checked: "bg-green-500",
    },
    {
      text_en: "Strongly Agree",
      text_id: "Sangat Setuju",
      rating: 5,
      color: "text-teal-500",
      bg: "bg-teal-100",
      checked: "bg-teal-500",
    },
  ];

  function selectOption(id: number, rating: number): void {
    results = { ...results, [id]: rating };
  }
</script>

<div class="p-4 rounded-xl md:shadow-lg max-w-3xl mx-auto space-y-4 mb-8">
  <div class="p-6 pb-2 rounded-t-xl">
    <h2
      class="text-xl md:text-2xl font-semibold text-gray-800 mb-6 text-center"
    >
      {$_("components.assesment.title")}
    </h2>

    <div class="flex justify-between items-baseline text-center px-4">
      {#each options as option}
        <div class="flex flex-col items-center w-1/5">
          <div
            class="
            w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-current
            mb-1 transition-colors duration-200 {option.color} {option.bg}
          "
          >
            <div class="w-full h-full p-1.5">
              <div class="w-full h-full rounded-full opacity-80"></div>
            </div>
          </div>
          <span class="text-xs font-medium text-gray-600 mt-1"
            >{currentLocale === "id" ? option.text_id : option.text_en}</span
          >
        </div>
      {/each}
    </div>
  </div>

  <div class="space-y-4">
    {#each questions as question}
      <div class="p-5 rounded-lg shadow-md border border-gray-100">
        <h3 class="font-medium text-gray-700 mb-4">
          {currentLocale === "id" ? question.in : question.en}
        </h3>

        <div class="flex justify-between items-center text-center px-2">
          {#each options as option}
            <button
              class="w-1/5 flex justify-center items-center p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 {option.color} rounded-full"
              on:click={() => selectOption(question.id, option.rating)}
              aria-label={`Rate: ${option.text_en}`}
            >
              <div
                class="
                w-8 h-8 rounded-full border-2 border-gray-300 transition-all duration-150 ease-in-out
                flex items-center justify-center
                {results[question.id] === option.rating
                  ? option.checked + ' border-transparent'
                  : 'hover:border-gray-500'}
              "
              >
                {#if results[question.id] === option.rating}
                  <svg
                    class="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 13.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                {/if}
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
