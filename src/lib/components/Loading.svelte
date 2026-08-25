<script lang="ts">
  export let text: string = "";
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-paper">
  <div class="flex flex-col items-center gap-4">
    <svg viewBox="0 0 32 32" class="spin" aria-hidden="true">
      <path
        d="M16 3 L20 12 L29 13 L22 19.5 L24 29 L16 24 L8 29 L10 19.5 L3 13 L12 12 Z"
        fill="#d97706"
        stroke="#1b1b1b"
        stroke-width="2"
        stroke-linejoin="round"
      />
    </svg>
    {#if text}
      <p class="smallcaps text-ink-faint">{text}</p>
    {/if}
  </div>
</div>

<style>
  .spin {
    width: 32px;
    height: 32px;
    animation: spin 1.1s cubic-bezier(0.6, 0.1, 0.4, 0.9) infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
