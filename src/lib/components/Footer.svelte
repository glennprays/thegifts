<script lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";

  const currentYear = new Date().getFullYear();
  $: lang = $page.params.lang || 'en';
</script>

<footer class="w-full bg-primary text-white py-8 px-6">
  <div class="max-w-6xl mx-auto">
    <!-- Single Row Layout: About (Left) | Links (Right) -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
      <!-- About Section (Left) -->
      <div class="max-w-md">
        <h3 class="text-lg font-semibold mb-2">TheGifts</h3>
        <p class="text-gray-300 text-sm">
          {$_('components.footer.about')}
        </p>
      </div>

      <!-- Navigation Links (Right) -->
      <nav class="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <a
          href="/{lang}"
          class="text-gray-300 hover:text-white transition-colors text-sm"
        >
          {$_('components.footer.links.home')}
        </a>
        <a
          href="/{lang}/gifts"
          class="text-gray-300 hover:text-white transition-colors text-sm"
        >
          {$_('components.footer.links.gifts')}
        </a>
        <a
          href="/{lang}/onboarding"
          class="text-gray-300 hover:text-white transition-colors text-sm"
        >
          {$_('components.footer.links.takeTest')}
        </a>
      </nav>
    </div>

    <!-- Copyright (Bottom) -->
    <div class="border-t border-white/20 pt-4">
      <p class="text-gray-300 text-xs text-center">
        &copy; {currentYear} TheGifts. {$_('components.footer.copyright')}
      </p>
    </div>
  </div>
</footer>
