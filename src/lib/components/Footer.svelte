<script lang="ts">
  import { _ } from "svelte-i18n";
  import { page } from "$app/stores";
  const currentYear = new Date().getFullYear();
  $: lang = $page.params.lang || "en";
</script>

<footer class="w-full px-6 pt-16 pb-10">
  <div class="max-w-6xl mx-auto">
    <div class="flex flex-col md:flex-row justify-between gap-12 md:gap-6 mb-14">
      <!-- Brand block -->
      <div class="max-w-xs">
        <div class="flex items-center gap-2 mb-3">
          <svg viewBox="0 0 32 32" class="brand-mark" aria-hidden="true">
            <path
              d="M16 3 L20 12 L29 13 L22 19.5 L24 29 L16 24 L8 29 L10 19.5 L3 13 L12 12 Z"
              fill="#d97706"
              stroke="#f6f5f4"
              stroke-width="2.5"
              stroke-linejoin="round"
            />
          </svg>
          <h3 class="brand-name display text-paper">The&nbsp;Gifts</h3>
        </div>
        <p class="text-sm leading-relaxed text-paper/60">
          {$_("components.footer.about")}
        </p>
      </div>

      <!-- Links block -->
      <div class="flex flex-col gap-4">
        <span class="smallcaps text-paper/40">Navigate</span>
        <nav class="flex flex-col gap-3">
          <a href="/{lang}" class="footer-link">{$_("components.footer.links.home")}</a>
          <a href="/{lang}/gifts" class="footer-link">{$_("components.footer.links.gifts")}</a>
          <a href="/{lang}/onboarding" class="footer-link">{$_("components.footer.links.takeTest")}</a>
        </nav>
      </div>
    </div>

    <!-- Copyright row -->
    <div
      class="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6"
      style="border-top:1px solid rgba(246,245,244,0.15);"
    >
      <p class="text-xs text-paper/40">
        &copy; {currentYear} The Gifts. {$_("components.footer.copyright")}
      </p>
      <p class="text-xs text-paper/40">thegifts.site</p>
    </div>
  </div>
</footer>

<style>
  footer {
    background: var(--color-ink);
  }

  .brand-mark {
    width: 24px;
    height: 24px;
  }

  .brand-name {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-paper);
    line-height: 1.1;
  }

  .footer-link {
    color: rgba(246, 245, 244, 0.65);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.15s;
  }
  .footer-link:hover {
    color: var(--color-amber-pale);
  }
</style>
