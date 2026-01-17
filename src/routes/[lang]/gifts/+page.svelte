<script lang="ts">
  import { getAllCategoryExplanations } from '$lib/utils/category-explanation';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { _ } from 'svelte-i18n';

  const lang = $page.params.lang as 'en' | 'id';
  const categories = getAllCategoryExplanations(lang);

  function viewCategory(categoryKey: string) {
    goto(`/${lang}/gifts/${categoryKey}`);
  }
</script>

<svelte:head>
  <title>{$_('pages.gifts.title')} - TheGifts</title>
  <meta name="description" content={$_('pages.gifts.subtitle')} />
</svelte:head>

<div class="min-h-screen bg-white py-16 px-6">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-semibold font-graphik text-gray-900 mb-4">
        {$_('pages.gifts.title')}
      </h1>
      <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
        {$_('pages.gifts.subtitle')}
      </p>
    </div>

    <!-- Category Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each categories as category}
        <button
          on:click={() => viewCategory(category.key)}
          class="group bg-gray-50 rounded-xl p-6 hover:shadow-lg hover:bg-white transition-all duration-300 hover:-translate-y-1 text-left"
        >
          <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition">
            {category.name}
          </h3>
          <p class="text-sm text-gray-600 line-clamp-3">
            {category.description}
          </p>
          <div class="mt-4 flex items-center text-primary text-sm font-medium">
            <span>{$_('pages.gifts.learnMore')}</span>
            <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>
