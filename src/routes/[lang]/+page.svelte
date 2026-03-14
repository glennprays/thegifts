<script lang="ts">
  import { NAME_STORAGE_KEY } from "$lib/constants/constants";
  import Book from "$lib/icons/Book.svelte";
  import Diversity from "$lib/icons/Diversity.svelte";
  import Restart from "$lib/icons/Restart.svelte";
  import Sprout from "$lib/icons/Sprout.svelte";
  import { RestartTest } from "$lib/utils/utils";
  import { getAllCategoryExplanations } from "$lib/utils/category-explanation";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";

  const lang = ($page.params.lang as 'en' | 'id') || 'en';
  const allCategories = getAllCategoryExplanations(lang);

  // Filter to show only 6 featured gifts on homepage
  const selectedGiftKeys = ['faith', 'healing', 'leadership', 'mercy', 'wisdom', 'service'];
  const featuredCategories = allCategories.filter(cat =>
    selectedGiftKeys.includes(cat.key)
  );

  let savedName: string | null = null;
  onMount(() => {
    savedName = localStorage.getItem(NAME_STORAGE_KEY);
  });
</script>

<div
  class="relative w-full min-h-screen flex flex-col justify-between items-center overflow-hidden"
>
  <div
    class="flex flex-col items-center justify-center text-center px-6 sm:px-10 md:px-20 lg:px-36 xl:px-52 mt-16 md:mt-24 flex-grow z-10"
  >
    <h1
      class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold font-graphik leading-tight text-gray-900"
    >
      {$_("pages.home.greeting.text")}
      <span class="text-secondary">{$_("pages.home.greeting.subject")}</span>.
    </h1>
    <p class="mt-6 text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl">
      {$_("pages.home.greeting.subtext")}
    </p>

    <button
      aria-label="Scroll to Three Pillars Section"
      on:click={() => {
        if (typeof document !== 'undefined') {
          const section = document.getElementById("three-pillars");
          section?.scrollIntoView({ behavior: "smooth" });
        }
      }}
      class="mt-10 mb-12 animate-bounce text-primary"
    >
      <svg
        class="w-8 h-8 md:w-10 md:h-10 mx-auto"
        fill="currentColor"
        viewBox="0 0 384 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m360.5 217.5-152 143.1c-4.6 5.2-10.6 7.4-16.5 7.4s-11.88-2.188-16.5-6.562l-152-143.938c-9.63-9.2-10.03-24.4-.94-34 9.13-9.7 24.38-10 33.94-.9l135.5 128.3 135.5-128.4c9.562-9.094 24.75-8.75 33.94.9375 9.06 9.6625 8.66 24.8625-.94 34.0625z"
        ></path>
      </svg>
    </button>
  </div>

  <div
    class="relative w-full h-[200px] sm:h-[260px] md:h-[300px] lg:h-[360px] overflow-hidden"
  >
    <img
      src="/images/home-mozaic.webp"
      fetchpriority="high"
      alt="Home Mosaic"
      class="absolute inset-0 w-full h-full object-cover object-center scale-110 sm:scale-125 md:scale-100"
    />
  </div>
</div>

<div
  id="three-pillars"
  class="relative w-full min-h-screen flex flex-col justify-center items-center text-gray-900 py-16 px-6"
>
  <div class="max-w-3xl text-center mb-16">
    <h2
      class="text-3xl sm:text-4xl md:text-5xl font-semibold font-graphik leading-tight mb-4"
    >
      {$_("pages.home.description.heading")}
    </h2>
    <p class="text-gray-600 text-base sm:text-lg">
      {$_("pages.home.description.subheading")}
    </p>
  </div>

  <div
    class="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-5xl w-full text-center"
  >
    <!-- Learn Card -->
    <div
      class="group flex flex-col items-center bg-white rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-100 hover:border-indigo-100"
    >
      <div
        class="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 mb-4 group-hover:from-indigo-100 group-hover:to-indigo-200 transition-all duration-300"
      >
        <Book />
      </div>
      <h3 class="text-xl font-semibold mb-2">
        {$_("pages.home.description.pillars.pillar1.title")}
      </h3>
      <p class="text-gray-600 text-sm sm:text-base">
        {$_("pages.home.description.pillars.pillar1.text")}
      </p>
    </div>

    <!-- Grow Card -->
    <div
      class="group flex flex-col items-center bg-white rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-100 hover:border-green-100"
    >
      <div
        class="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-50 to-green-100 mb-4 group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300"
      >
        <Sprout />
      </div>
      <h3 class="text-xl font-semibold mb-2">
        {$_("pages.home.description.pillars.pillar2.title")}
      </h3>
      <p class="text-gray-600 text-sm sm:text-base">
        {$_("pages.home.description.pillars.pillar2.text")}
      </p>
    </div>

    <!-- Serve Card -->
    <div
      class="group flex flex-col items-center bg-white rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-gray-100 hover:border-yellow-100"
    >
      <div
        class="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-50 to-yellow-100 mb-4 group-hover:from-yellow-100 group-hover:to-yellow-200 transition-all duration-300"
      >
        <Diversity />
      </div>
      <h3 class="text-xl font-semibold mb-2">
        {$_("pages.home.description.pillars.pillar3.title")}
      </h3>
      <p class="text-gray-600 text-sm sm:text-base">
        {$_("pages.home.description.pillars.pillar3.text")}
      </p>
    </div>
  </div>
</div>

<!-- Explore Spiritual Gifts Section -->
<div class="w-full bg-gradient-to-br from-gray-50 to-indigo-50/30 py-20 px-6">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-semibold font-graphik text-gray-900 mb-4">
        {$_('pages.home.exploreGifts.title')}
      </h2>
      <p class="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
        {$_('pages.home.exploreGifts.subtitle')}
      </p>
    </div>

    <!-- Featured 6 gift categories in responsive grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 md:gap-4 mb-10">
      {#each featuredCategories as category}
        <a
          href="/{lang}/gifts/{category.key}"
          class="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-center"
        >
          <h3 class="font-semibold text-gray-900 text-sm md:text-base group-hover:text-primary transition">
            {category.name}
          </h3>
        </a>
      {/each}
    </div>

    <!-- CTA Button to All Gifts Page -->
    <div class="text-center">
      <a
        href="/{lang}/gifts"
        class="inline-block bg-primary hover:bg-secondary text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5"
      >
        {$_('pages.home.exploreGifts.viewAllDetails')}
      </a>
    </div>
  </div>
</div>

<div
  class="w-full bg-primary text-white py-16 px-6 flex flex-col items-center text-center"
>
  {#if savedName}
    <h2 class="text-xl sm:text-2xl md:text-3xl font-graphik font-semibold mb-4">
      Hi {savedName}!
    </h2>
  {/if}
  <h2 class="text-3xl sm:text-4xl md:text-5xl font-graphik font-semibold mb-4">
    {$_("pages.home.callToAction.text")}
  </h2>
  <p class="text-lg sm:text-xl mb-8 max-w-2xl font-graphik">
    {$_("pages.home.callToAction.subtext")}
  </p>
  <div class="flex flex-col md:flex-row gap-4">
    <a
      href={savedName ? "/questionnaire" : "/onboarding"}
      class="bg-white text-primary font-graphik font-semibold px-6 py-3 rounded-md text-lg hover:bg-accent transition"
    >
      {savedName
        ? $_("pages.home.callToAction.buttons.continueTest")
        : $_("pages.home.callToAction.buttons.startTest")}
    </a>
    {#if savedName}
      <a
        href="/onboarding"
        on:click={RestartTest}
        class="text-secondary hover:text-white hover:bg-red-400 rounded-md text-sm font-semibold px-6 py-3 transition-colors duration-200 flex items-center gap-1 border border-secondary hover:border-accent"
      >
        {$_("pages.home.callToAction.buttons.restartTest")}
        <Restart />
      </a>
    {/if}
  </div>
</div>
