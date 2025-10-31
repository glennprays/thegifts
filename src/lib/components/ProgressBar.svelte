<script lang="ts">
  import { _, isLoading } from "svelte-i18n";
  export let currentPage: number = 0;
  export let totalPages: number = 1;
  export let color: string = "var(--color-accent)";
  export let showLabel: boolean = true;

  $: progress =
    totalPages > 0 ? Math.min((currentPage / totalPages) * 100, 100) : 0;
</script>

<div class="w-full max-w-3xl px-6 mb-6">
  {#if showLabel}
    <div
      class="text-sm text-gray-600 mt-1 flex justify-between font-medium mb-2"
    >
      <span>
        {Math.round(progress)}%
      </span>
      <span>
        {$_("components.progressBar.step")}
        {currentPage}
        {$_("components.progressBar.of")}
        {totalPages}
      </span>
    </div>
  {/if}
  <div class="w-full bg-gray-300 rounded-full h-2.5 overflow-hidden">
    <div
      class="h-2.5 rounded-full transition-all duration-500 ease-in-out"
      style="width: {progress}%; background-color: {color};"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin="0"
      aria-valuemax="100"
    ></div>
  </div>
</div>
