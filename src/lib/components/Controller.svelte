<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let isDisabledNext = false;
  export let isDisabledPrev = false;

  const dispatch = createEventDispatcher();
  const handleNext = () => dispatch("next");
  const handlePrev = () => dispatch("prev");
</script>

<div class="flex space-x-4">
  <button
    class="px-4 py-2 bg-gray-300 rounded-full disabled:opacity-50"
    on:click={handlePrev}
    disabled={isDisabledPrev}
  >
    Previous
  </button>
  <button
    class="px-4 py-2 bg-primary text-white rounded-full disabled:opacity-50 hover:bg-secondary"
    on:click={handleNext}
    disabled={isDisabledNext}
  >
    Next
  </button>
</div>
