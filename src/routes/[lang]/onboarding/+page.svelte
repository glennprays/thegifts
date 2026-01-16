<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    NAME_STORAGE_KEY,
    RESULTS_STORAGE_KEY,
  } from "$lib/constants/constants";
  import { onMount } from "svelte";
  import { _ } from "svelte-i18n";

  let name = "";

  function handleSubmit(event: Event) {
    event.preventDefault();
    const capitalizedName = name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
    localStorage.setItem(NAME_STORAGE_KEY, capitalizedName);
    goto("/questionnaire");
  }

  onMount(() => {
    const savedName = localStorage.getItem(NAME_STORAGE_KEY);
    if (savedName) {
      goto("/questionnaire");
    } else {
      localStorage.removeItem(RESULTS_STORAGE_KEY);
    }
  });
</script>

<div
  class="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
>
  <div class="text-center mt-[-90px]">
    <h1 class="text-4xl md:text-5xl font-graphik font-bold">
      {$_("pages.onboarding.title")}
    </h1>
    <form class="mt-8" on:submit|preventDefault={handleSubmit}>
      <div class="mb-4">
        <label
          for="name"
          class="block text-gray-700 text-sm font-semibold mb-2"
        >
          {$_("pages.onboarding.formTitle")}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          bind:value={name}
          required
          maxlength="50"
          placeholder={$_("pages.onboarding.formPlaceholder")}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        class="bg-primary hover:bg-secondary text-white rounded-md text-sm font-semibold px-4 py-2 transition-colors duration-200 shadow-sm"
      >
        {$_("pages.onboarding.formButton")}
      </button>
    </form>
  </div>
</div>
