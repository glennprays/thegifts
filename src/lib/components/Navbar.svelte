<script lang="ts">
  import logoUrl from "$lib/assets/logo.svg";
  export let logoSrc: string = logoUrl;
</script>

<nav
  class="w-full bg-white px-6 md:px-5 py-3 flex justify-between items-center sticky top-0 z-50"
>
  <div class="flex items-center gap-2">
    <img src={logoSrc} alt="TheGifts Logo" class="h-9 w-9 rounded-full" />
    <span class="text-2xl font-sans font-medium select-none"> TheGifts </span>
  </div>

  <div>
    <a
      href="/start-test"
      class="bg-primary hover:bg-secondary text-white rounded-md text-sm font-semibold px-3.5 py-1.5 transition-colors duration-200 shadow-sm"
    >
      Start Test
    </a>
  </div>
</nav>
