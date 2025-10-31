<script lang="ts">
  import { _ } from "svelte-i18n";
  import { createEventDispatcher } from "svelte";

  export let isDisabledNext = false;
  export let isDisabledPrev = false;
  export let isDisableSubmit = true;
  export let isHideSubmit = true;

  const dispatch = createEventDispatcher();
  const handleNext = () => dispatch("next");
  const handlePrev = () => dispatch("prev");
  const handleSubmit = () => dispatch("submit");
</script>

<div class="flex space-x-4">
  <button
    class="px-4 py-2 bg-gray-300 rounded-full disabled:opacity-50"
    on:click={handlePrev}
    disabled={isDisabledPrev}
  >
    {$_("components.controller.previous")}
  </button>

  {#if isHideSubmit}
    <button
      class="px-4 py-2 bg-primary text-white rounded-full disabled:opacity-50 hover:bg-primary/80"
      on:click={handleNext}
      disabled={isDisabledNext}
    >
      {$_("components.controller.next")}
    </button>
  {:else}
    <button
      class="px-4 py-2 bg-secondary text-white rounded-full disabled:opacity-50 hover:bg-secondary/80"
      on:click={handleSubmit}
      disabled={isDisableSubmit}
    >
      {$_("components.controller.submit")}
    </button>
  {/if}
</div>
