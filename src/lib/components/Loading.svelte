<script lang="ts">
  export let text: string = "Loading...";
</script>

<div
  class="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm overflow-hidden"
>
  <div class="flex space-x-3 mb-4">
    <div
      class="w-4 h-4 rounded-full bg-primary animate-bounce"
      style="animation-delay: 0s"
    ></div>
    <div
      class="w-4 h-4 rounded-full bg-accent animate-bounce"
      style="animation-delay: 0.2s"
    ></div>
    <div
      class="w-4 h-4 rounded-full bg-secondary animate-bounce"
      style="animation-delay: 0.4s"
    ></div>
  </div>

  <p class="text-gray-700 font-semibold tracking-wide font-graphik">
    {text}
  </p>
</div>
