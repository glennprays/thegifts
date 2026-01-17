<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { _ } from 'svelte-i18n';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const lang = $page.params.lang;
  const { category } = data;

  // Check if we came from result page
  const fromResult = $page.url.searchParams.get('from') === 'result';
  const resultId = $page.url.searchParams.get('id');

  function goBack() {
    if (fromResult && resultId) {
      // Return to result page
      goto(`/${lang}/questionnaire/result/${resultId}`);
    } else {
      // Default: go to all gifts page
      goto(`/${lang}/gifts`);
    }
  }

  function viewAllGifts() {
    goto(`/${lang}/gifts`);
  }
</script>

<svelte:head>
  <title>{category.name} - {$_('pages.gifts.title')} - TheGifts</title>
  <meta name="description" content={category.description} />
</svelte:head>

<div class="min-h-screen bg-white py-16 px-6">
  <div class="max-w-4xl mx-auto">
    <!-- Navigation Buttons: Back + View All Gifts (side by side) -->
    <div class="flex items-center gap-3 mb-8">
      <!-- Back Button (conditional text) -->
      <button
        on:click={goBack}
        class="flex items-center text-gray-600 hover:text-primary transition"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        {fromResult ? $_('pages.gifts.backToResults') : $_('pages.gifts.back')}
      </button>

      <!-- View All Gifts Button (shown when from result page, next to back button) -->
      {#if fromResult}
        <span class="text-gray-300">|</span>
        <button
          on:click={viewAllGifts}
          class="text-primary hover:text-primary-dark font-medium transition"
        >
          {$_('pages.gifts.viewAllGifts')}
        </button>
      {/if}
    </div>

    <!-- Title -->
    <h1 class="text-4xl md:text-5xl font-semibold font-graphik text-gray-900 mb-8">
      {category.name}
    </h1>

    <!-- Description Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold text-gray-900 mb-4">
        {$_('pages.gifts.sections.description')}
      </h2>
      <p class="text-lg text-gray-700 leading-relaxed">
        {category.description}
      </p>
    </section>

    <!-- Characteristics Section -->
    {#if category.characteristics.length > 0}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
          {$_('pages.gifts.sections.characteristics')}
        </h2>
        <ul class="space-y-3">
          {#each category.characteristics as characteristic}
            <li class="flex items-start">
              <svg class="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-gray-700">{characteristic}</span>
            </li>
          {/each}
        </ul>
      </section>
    {/if}

    <!-- Biblical References Section -->
    {#if category.biblical_references.length > 0}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
          {$_('pages.gifts.sections.biblical_references')}
        </h2>
        <div class="space-y-4">
          {#each category.biblical_references as reference}
            <div class="bg-gray-50 rounded-lg p-6 border-l-4 border-primary">
              <p class="font-semibold text-primary mb-2">{reference.verse}</p>
              <p class="text-gray-700 italic">{reference.text}</p>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    <!-- Practical Applications Section -->
    {#if category.practical_applications.length > 0}
      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">
          {$_('pages.gifts.sections.practical_applications')}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each category.practical_applications as application}
            <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-5">
              <p class="text-gray-800">{application}</p>
            </div>
          {/each}
        </div>
      </section>
    {/if}
  </div>
</div>
